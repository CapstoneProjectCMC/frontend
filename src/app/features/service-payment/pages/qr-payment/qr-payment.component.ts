import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, interval, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { PaymentService } from '../../../../core/services/api-service/payment.service';
import {
  openModalNotification,
  sendNotification,
} from '../../../../shared/utils/notification';
import { FormatViewPipe } from '../../../../shared/pipes/format-view.pipe';
import {
  IDepositGPData,
  TopUpTransactionRequest,
} from '../../../../core/models/service-and-payment';
import {
  generateUniqueHash,
  convertToGP,
  formatTime,
  numberToVietnameseWords,
} from '../../validate/qr-payment.utils';
import { decodeJWT } from '../../../../shared/utils/stringProcess';
import { ModalNoticeService } from '../../../../shared/store/modal-notice-state/modal-notice.service';

@Component({
  selector: 'app-qr-payment',
  standalone: true,
  imports: [CommonModule, FormatViewPipe],
  templateUrl: './qr-payment.component.html',
  styleUrls: ['./qr-payment.component.scss'],
})
export class QrPaymentComponent implements OnInit, OnDestroy {
  amount: number | null = null; // Số tiền VNĐ người dùng nhập
  maxAmount: number = 20000000;
  qrTimeOut: boolean = true;
  qrUrl: string = 'service-payment-assets/image-coming-soon-placeholder.png'; // URL QR code
  qrUrlPlaceHolder: string =
    'service-payment-assets/image-coming-soon-placeholder.png';
  transactionSuccess: boolean = false;
  error: string = '';
  loading: boolean = false;
  countdown: number = 120; // Thời gian đếm ngược ban đầu
  resetCountDown: number = 120;
  userId: string = '';
  paymentHash: string = ''; // Mã hash duy nhất cho mỗi lần thanh toán
  matchedTransaction: any = null; // Lưu giao dịch phù hợp khi thanh toán thành công
  currentGp: number = 0;

  // Thông tin sẵn có để generate QR
  private bankId: string = 'MBBank';
  private accountNo: string = '0346567085';
  private template: string = '7brqL9G';
  private accountName: string = 'TO QUANG DUC';

  // Subscription để lặp (RxJS interval)
  private transactionCheckSubscription?: Subscription;
  private countdownInterval?: Subscription;

  public convertToGP = convertToGP;
  public formatTime = formatTime;
  amountInWords: string = '';

  constructor(
    private paymentService: PaymentService,
    private store: Store,
    private modalNoticeService: ModalNoticeService
  ) {}

  canDeactivate(): Observable<boolean> {
    if (!this.amount) return of(true);

    return this.modalNoticeService.confirm(
      'Xác nhận thoát',
      'Bạn có chắc chắn thoát giao dịch? Tiến trình có thể gây lỗi',
      'Đồng ý',
      'Hủy'
    );
  }

  ngOnInit(): void {
    this.userId = decodeJWT(
      localStorage.getItem('token') ?? ''
    )?.payload.userId;
    // Khởi tạo thời gian đếm ngược
    this.countdown = this.resetCountDown;
    this.fetchCurrentMoney();
  }

  ngOnDestroy(): void {
    this.transactionCheckSubscription?.unsubscribe();
    this.countdownInterval?.unsubscribe();
  }

  fetchCurrentMoney() {
    this.paymentService.getMyWallet().subscribe({
      next: (res) => {
        this.currentGp = res.result.balance;
      },
      error(err) {
        console.log(err);
      },
    });
  }

  paymentFailed() {
    //QR timeout = false có nghĩa là người dùng đã xác nhận thanh toán, dừng timeout QR
    if (!this.qrTimeOut) {
      openModalNotification(
        this.store,
        'Thanh toán thất bại ❌',
        'Không tìm thấy giao dịch của bạn. Vui lòng thử tạo giao dịch mới.',
        'Xác nhận',
        'Hủy'
      );
    } else {
      openModalNotification(
        this.store,
        'Hết hạn mã QR ⌛',
        'Hãy tạo QR mới và xác nhận "Tôi đã thanh toán" khi đã chuyển khoản!',
        'Xác nhận',
        'Hủy'
      );
    }
  }

  // Hàm chuyển số sang chữ tiếng Việt
  private numberToVietnameseWords(num: number | null): string {
    let number = 0;
    if (!num) return '';

    if (num <= this.maxAmount) {
      number = num;
    }
    if (num > this.maxAmount) {
      number = this.maxAmount;
    }
    return numberToVietnameseWords(number);
  }

  // Khi người dùng nhập số tiền thanh toán
  onAmountChange(event: any): void {
    const value = parseInt(event.target.value, 10);

    const maxAmount = this.maxAmount; //20 triệu

    // Nếu giá trị nhập vượt quá maxAmount, thông báo và gán lại maxAmount
    if (value > maxAmount) {
      sendNotification(
        this.store,
        'Giá trị không hợp lệ!',
        `Hạn mức chuyển khoản ${maxAmount.toLocaleString()} VNĐ.`,
        'warning'
      );
      this.amount = maxAmount;
      event.target.value = maxAmount; // cập nhật lại giá trị hiển thị
    } else {
      this.amount = value;
    }

    this.amountInWords =
      !isNaN(value) && value > 0 ? this.numberToVietnameseWords(value) : '';

    if (!this.userId) {
      sendNotification(
        this.store,
        'Có lỗi xảy ra!',
        'Lỗi xác thực thông tin tài khoản thanh toán. Hãy tải lại trang.',
        'error'
      );
      return;
    }

    // Kiểm tra số tiền hợp lệ (bội số của 1000)
    if (this.amount > 1999 && this.amount % 1000 === 0) {
      // Tạo mã hash mới cho lần thanh toán này
      this.paymentHash = generateUniqueHash();
      // Dùng paymentHash làm thông tin nhận diện trong URL QR
      this.qrUrl = `https://img.vietqr.io/image/${this.bankId}-${this.accountNo}-${this.template}.png?amount=${this.amount}&addInfo=${this.paymentHash}&accountName=${this.accountName}`;
      // Reset lại countdown và thông tin giao dịch
      this.startCountdown();
      this.countdown = this.resetCountDown;
      this.matchedTransaction = null;
    } else {
      this.qrUrl = this.qrUrlPlaceHolder;
    }
  }

  // Khi nhấn nút Xác nhận
  handlePaymentStart(): void {
    this.qrTimeOut = false;
    const minAmount = 2000;
    // Nếu giá trị nhập vượt quá maxAmount, thông báo và gán lại maxAmount
    if (!this.amount || this.amount < minAmount) {
      sendNotification(
        this.store,
        'Giá trị không hợp lệ!',
        `Số tiền thanh toán ít nhất là ${minAmount.toLocaleString()} VNĐ.`,
        'warning'
      );
      return;
    }

    if (this.amount <= 0) {
      sendNotification(
        this.store,
        'Yêu cầu nhập mệnh giá!',
        'Vui lòng nhập số tiền muốn thanh toán để tiếp tục',
        'warning'
      );
      return;
    }

    if (this.amount % 1000 !== 0) {
      sendNotification(
        this.store,
        'Mệnh giá không hợp lệ!',
        'Vui lòng nhập số tiền là bội số của 1000',
        'warning'
      );
      return;
    }

    // Reset lại trạng thái và các thông số trước khi gọi API
    this.countdown = this.resetCountDown;
    this.transactionSuccess = false;
    this.loading = true;
    this.error = '';
    this.matchedTransaction = null;
    // // Tạo mã hash mới (nếu chưa tạo từ onAmountChange)
    if (!this.paymentHash) {
      // sessionStorage.setItem('qr', this.generateUniqueHash())
      this.paymentHash = generateUniqueHash();

      // Cập nhật URL QR với paymentHash mới
      this.qrUrl = `https://img.vietqr.io/image/${this.bankId}-${this.accountNo}-${this.template}.png?amount=${this.amount}&addInfo=${this.paymentHash}&accountName=${this.accountName}`;
    }

    // Bắt đầu kiểm tra giao dịch và countdown
    this.startCheckingTransactionStatus();
  }

  // Kích hoạt kiểm tra giao dịch định kỳ mỗi 5 giây
  startCheckingTransactionStatus(): void {
    this.transactionCheckSubscription?.unsubscribe();
    // Kiểm tra ngay lập tức
    this.checkTransactionStatus();
    // Sau đó cứ mỗi 5 giây kiểm tra lại nếu chưa thành công và còn thời gian
    this.transactionCheckSubscription = interval(5000).subscribe(() => {
      if (!this.transactionSuccess && this.countdown > 0) {
        this.checkTransactionStatus();
      }
    });
  }

  // Bắt đầu countdown
  startCountdown(): void {
    this.countdownInterval?.unsubscribe();
    this.countdownInterval = interval(1000).subscribe(() => {
      if (this.countdown > 0 && !this.transactionSuccess) {
        this.countdown--;
      }
      if (this.countdown === 0) {
        this.handleTimeout();
      }
    });
  }

  // Gọi API kiểm tra giao dịch
  checkTransactionStatus(): void {
    console.log(this.paymentHash);
    this.paymentService.checkTransactionStatus().subscribe({
      next: (res) => {
        const transactions = res.data || [];
        const matched = transactions.find(
          (transaction) =>
            transaction['Giá trị'] === this.amount &&
            transaction['Mô tả']?.toLowerCase().includes(this.paymentHash)
        );

        if (matched) {
          this.transactionSuccess = true;
          this.matchedTransaction = matched;
          this.transactionCheckSubscription?.unsubscribe();
          this.countdownInterval?.unsubscribe();
          this.loading = false;

          // Tạo đối tượng data sau khi đã có giao dịch phù hợp
          const data: TopUpTransactionRequest = {
            amount: Number(this.amount),
            currency: 'VNĐ',
            transactionId: matched['Mã GD'].toString(),
            referenceId: matched['Mã tham chiếu'],
          };
          this.depositMoney(data);

          this.qrUrl = this.qrUrlPlaceHolder;
        }
        // Không đặt this.loading = false ở đây để giữ hiệu ứng loading khi countdown đang chạy
      },
      error: () => {
        this.paymentFailed();
        this.loading = false;
        this.transactionCheckSubscription?.unsubscribe();
        this.countdownInterval?.unsubscribe();
      },
    });
  }

  depositMoney(data: TopUpTransactionRequest) {
    this.paymentService.requestTopUp(data).subscribe({
      next: (res) => {
        //Thực hiện call API nạp tiền vào tài khoản tại đây
        this.currentGp = res.result.balanceAfter;
        sendNotification(
          this.store,
          'Đã thanh toán',
          'Thanh toán thành công',
          'success'
        );
      },
      error(err) {
        console.log(err);
      },
    });
  }

  // Khi hết thời gian thanh toán
  handleTimeout(): void {
    this.paymentFailed();
    this.qrUrl = this.qrUrlPlaceHolder;
    this.amount = null;
    this.loading = false;
    this.transactionCheckSubscription?.unsubscribe();
    this.countdownInterval?.unsubscribe();
    this.amountInWords = '';
  }
}
