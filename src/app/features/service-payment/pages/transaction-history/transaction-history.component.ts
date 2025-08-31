import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { switchMap, map, startWith, catchError } from 'rxjs/operators';
import {
  ApiResponse,
  IPaginationResponse,
} from '../../../../core/models/api-response';
import { TransactionHistoryResponse } from '../../../../core/models/service-and-payment';
import { PaymentService } from '../../../../core/services/api-service/payment.service';
import { CommonModule } from '@angular/common';
import { avatarUrlDefault } from '../../../../core/constants/value.constant';
import { PaginationComponent } from '../../../../shared/components/fxdonad-shared/pagination/pagination.component';

interface TransactionState {
  response?: ApiResponse<IPaginationResponse<TransactionHistoryResponse[]>>;
  isLoading: boolean;
  error?: string;
}

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss'],
  imports: [CommonModule, PaginationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionHistoryComponent implements OnInit {
  pageIndex = 1;
  pageSize = 10;
  avatarDefault = avatarUrlDefault;

  // Subject để quản lý việc thay đổi trang
  private pageSubject = new BehaviorSubject<number>(this.pageIndex);
  page$ = this.pageSubject.asObservable();

  // Stream chính chứa state của component
  state$!: Observable<TransactionState>;

  constructor(private transactionService: PaymentService) {}

  ngOnInit(): void {
    this.state$ = this.page$.pipe(
      switchMap((page) =>
        this.transactionService.getTransactionHistory(page, this.pageSize).pipe(
          map((response) => ({ response, isLoading: false })),
          catchError((err) =>
            of({
              isLoading: false,
              error: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
            })
          ),
          startWith({ isLoading: true })
        )
      )
    );
  }

  /**
   * Cập nhật trang hiện tại và trigger stream để gọi lại API.
   * @param page Số trang muốn chuyển đến.
   */
  goToPage(page: number): void {
    // SỬA LẠI: Đồng bộ pageIndex với trang mới trước khi phát sự kiện
    this.pageIndex = page;
    this.pageSubject.next(this.pageIndex);
  }

  /**
   * Ánh xạ trạng thái giao dịch sang class CSS tương ứng để hiển thị tag màu.
   * @param status Trạng thái từ API (e.g., 'SUCCESS', 'PENDING', 'FAILED').
   * @returns Tên class CSS.
   */
  mapStatusToClass(status: string): string {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
        return 'status--success';
      case 'PENDING':
        return 'status--pending';
      case 'FAILED':
        return 'status--failed';
      default:
        return 'status--default';
    }
  }

  /**
   * Xử lý sự kiện thay đổi trang từ component pagination.
   * @param newPage Trang mới được component con trả về.
   */
  handlePageChange(newPage: number): void {
    // SỬA LẠI: Gọi hàm goToPage để xử lý logic thay đổi trang
    this.goToPage(newPage);
  }

  /**
   * Ánh xạ loại giao dịch sang text tiếng Việt.
   * @param type Loại giao dịch từ API (e.g., 'DEPOSIT', 'WITHDRAWAL').
   * @returns Text tiếng Việt.
   */
  mapTypeToText(type: string): string {
    switch (type.toUpperCase()) {
      case 'TOPUP':
        return 'Nạp tiền';
      case 'PURCHASE':
        return 'Mua sản phẩm';
      case 'TRANSFER':
        return 'Chuyển khoản';
      default:
        return 'Khác';
    }
  }
}
