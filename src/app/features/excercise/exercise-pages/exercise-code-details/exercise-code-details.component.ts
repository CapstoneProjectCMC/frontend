import { Component, HostListener } from '@angular/core';
import {
  ExerciseCodeResponse,
  TestCaseResponse,
  UpdateCodingDetailRequest,
} from '../../../../core/models/code.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CodingService } from '../../../../core/services/api-service/coding.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  clearLoading,
  setLoading,
} from '../../../../shared/store/loading-state/loading.action';
import { UpdateCodeDetailsComponent } from '../../exercise-modal/update-code-details/update-code-details.component';
import {
  openModalNotification,
  sendNotification,
} from '../../../../shared/utils/notification';
import { decodeJWT } from '../../../../shared/utils/stringProcess';
import { ProfileService } from '../../../../core/services/api-service/profile.service';
import { ExerciseService } from '../../../../core/services/api-service/exercise.service';
import { UpdateExerciseComponent } from '../../exercise-modal/update-exercise/update-exercise.component';
import { ExerciseQuiz } from '../../../../core/models/exercise.model';
import { mapToExerciseQuiz } from '../../../../shared/utils/mapData';
import { avatarUrlDefault } from '../../../../core/constants/value.constant';
import { getUserRoles } from '../../../../shared/utils/userInfo';
import { activeForMyContent } from '../../../../shared/utils/authenRoleActions';
import { isAvailabelTime } from '../../../../shared/utils/availableTime';
import { PaymentService } from '../../../../core/services/api-service/payment.service';
import { v4 as uuidv4 } from 'uuid';
import { IPurChaseTransactionRequest } from '../../../../core/models/service-and-payment';

@Component({
  selector: 'app-exercise-code-details',
  imports: [
    CommonModule,
    FormsModule,
    UpdateCodeDetailsComponent,
    UpdateExerciseComponent,
  ],
  templateUrl: './exercise-code-details.component.html',
  styleUrls: ['./exercise-code-details.component.scss'],
})
export class ExerciseCodeDetailsComponent {
  exercise: ExerciseCodeResponse | null = null;

  exerciseBasic: ExerciseQuiz = {
    id: '',
    user: null,
    title: '',
    description: '',
    exerciseType: 'QUIZ',
    difficulty: 'EASY',
    orgId: '',
    active: false,
    cost: 0,
    freeForOrg: false,
    visibility: false,
    startTime: '',
    endTime: '',
    duration: 0,
    allowDiscussionId: 'chưa có',
    resourceIds: ['chưa có', 'chưa có'],
    tags: [],
    allowAiQuestion: false,
    quizDetail: {
      id: 'Mẫu 1',
      numQuestions: 0,
      totalPoints: 20,
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,
      totalElements: 0,
      questions: [],
      createdBy: '',
      createdAt: '',
      updatedBy: '',
      updatedAt: '',
      deletedBy: '',
      deletedAt: '',
    },
    createdBy: '',
    createdAt: '',
    updatedBy: '',
    updatedAt: '',
    deletedBy: '',
    deletedAt: '',
  };

  exerciseId: string = '';
  roles = getUserRoles();
  isBought = false;

  // Modal state
  isUpdateModalVisible: boolean = false;
  isOpenUpdateExercise: boolean = false;
  isDropdownOpen: boolean = false;
  authorName: string = '';
  authorRoles: string = 'Tạm ẩn';
  avatarUrl: string = '';
  avatarUrlDefault: string = avatarUrlDefault;

  //phân quyền
  isActionActive = false;
  nowDate = new Date();
  expirationDate: Date | null = null;
  availabelDate: Date | null = null;
  canStartDoing = false;

  constructor(
    private codingService: CodingService,
    private route: ActivatedRoute,
    private paymentService: PaymentService,

    private router: Router,
    private exerciseService: ExerciseService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.exerciseId = this.route.snapshot.paramMap.get('id') ?? '';

    if (this.exerciseId) {
      this.fetchCodingDetails();
    }

    // Initialize with one test case if creating new exercise
    if (!this.exerciseId) {
      this.router.navigate(['/exercise/exercise-layout/list']);
    }
  }

  payForExercise() {
    const item: IPurChaseTransactionRequest = {
      transactionId: uuidv4(),
      referenceId: uuidv4(),
      currency: 'VNĐ',
      itemId: this.exerciseId,
      itemType: this.exercise?.exerciseType,
      itemPrice: this.exercise?.cost,
      itemName: this.exercise?.title,
    };

    this.paymentService.purchaseItem(item).subscribe({
      next: (res) => {
        //todo tomorrow
        this.isBought = true;
        sendNotification(
          this.store,
          'Thanh toán thành công',
          'Bạn có thể bắt đầu làm bài tập này',
          'success'
        );
      },
      error: (err) => {
        if (err.code === 4059103) {
          this.isBought = true;
        }
        console.log(err);
      },
    });
  }

  openRequestBuyExercise() {
    if (!this.exercise) {
      console.error('Exercise chưa được tải');
      return;
    }

    Promise.resolve().then(() => {
      this.store.dispatch(
        setLoading({ isLoading: true, content: 'Xin chờ...' })
      );
    });

    this.paymentService.getMyWallet().subscribe({
      next: (res) => {
        if (res.result.balance - this.exercise!.cost < 0) {
          openModalNotification(
            this.store,
            'Số dư không đủ',
            `Số dư tài khoản của bạn là ${
              res.result.balance
            }VNĐ hiện không đủ, còn thiếu ${
              this.exercise!.cost - res.result.balance
            }VNĐ, bạn có muốn nạp thêm ?`,
            'Đồng ý',
            'Hủy',
            () => this.router.navigate(['/service-and-payment/payment'])
          );
        } else {
          openModalNotification(
            this.store,
            'Mua bài tập',
            `Bạn chắc chắn mua bài tập này? Số dư sau thanh toán: ${(
              res.result.balance - this.exercise!.cost
            ).toLocaleString()}VNĐ`,
            'Đồng ý',
            'Hủy',
            () => this.payForExercise()
          );
        }

        this.store.dispatch(clearLoading());
      },
      error: (err) => {
        this.store.dispatch(clearLoading());
      },
    });
  }

  fetchCodingDetails() {
    Promise.resolve().then(() => {
      this.store.dispatch(
        setLoading({ isLoading: true, content: 'Đang lấy dữ liệu chi tiết...' })
      );
    });

    this.codingService
      .getCodingExercise(this.exerciseId, 1, 99999, 'CREATED_AT', false)
      .subscribe({
        next: (res) => {
          this.exercise = res.result;
          this.hasNoDetails();
          this.store.dispatch(clearLoading());
          if (res.result.user) {
            this.authorName = res.result.user.displayName;
            this.authorRoles = Array.from(res.result.user.roles).join(', ');
            this.avatarUrl = res.result.user.avatarUrl ?? avatarUrlDefault;
          }
          this.isActionActive = activeForMyContent(
            res.result.user?.username ?? '',
            res.result.user?.email ?? '',
            this.roles.includes('ADMIN')
          );
          this.availabelDate = res.result.startTime
            ? new Date(res.result.startTime)
            : null;
          this.expirationDate = res.result.endTime
            ? new Date(res.result.endTime)
            : null;
          this.canStartDoing = isAvailabelTime(
            this.availabelDate,
            this.expirationDate
          );
          this.exerciseBasic = mapToExerciseQuiz(res.result);
        },
        error: (err) => {
          console.log(err);
          if (err.code === 4048310) {
            this.hasNoDetails();
          } else {
            this.router.navigate(['/exercise/exercise-layout/list']);
          }
          this.store.dispatch(clearLoading());
        },
      });
  }

  hasNoDetails() {
    if (!this.exercise) {
      this.router.navigate([
        '/exercise/exercise-layout/exercise-code-details/add-new',
        this.exerciseId,
      ]);
    }
  }

  // Lọc và trả về chỉ các test case là mẫu (sample = true)
  getSampleTestCases(): TestCaseResponse[] {
    if (
      this.exercise?.codingDetail?.testCases &&
      (!this.roles.includes('ADMIN') || !this.isActionActive)
    ) {
      return this.exercise.codingDetail.testCases.filter((tc) => tc.sample);
    } else if (this.exercise?.codingDetail?.testCases) {
      return this.exercise.codingDetail.testCases;
    }
    return [];
  }

  goBack() {
    this.router.navigate(['/exercise/exercise-layout/list']);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  openBasicEdit() {
    this.isOpenUpdateExercise = true;
    this.isDropdownOpen = false;
  }

  openDetailEdit() {
    this.isUpdateModalVisible = true;
    this.isDropdownOpen = false;
  }

  onUpdateExercise() {
    this.fetchCodingDetails();
    this.isOpenUpdateExercise = false;
  }

  openWarningModal() {
    openModalNotification(
      this.store,
      'Xác nhận xóa bài',
      `Bạn có chắc chắn Xóa bài tập "${this.exercise?.title}" này?`,
      'Xác nhận',
      'Hủy',
      () => this.confirmDeleteExercise()
    );
  }

  openAssignExercise() {
    this.router.navigate([
      '/exercise/exercise-layout/assign-exercise-code',
      this.exerciseId,
    ]);
  }

  confirmDeleteExercise() {
    if (this.exerciseId) {
      this.store.dispatch(
        setLoading({ isLoading: true, content: 'Xóa bài tập...' })
      );
      this.exerciseService.softDeleteExercise(this.exerciseId).subscribe({
        next: () => {
          this.router.navigate(['/exercise/exercise-layout/list']);
          sendNotification(
            this.store,
            'Đã xóa',
            'Đã xóa bài tập thành công',
            'success'
          );
          this.store.dispatch(clearLoading());
        },
        error: () => {
          console.log('Có lỗi khi xóa');
          this.store.dispatch(clearLoading());
        },
      });
    } else {
      sendNotification(
        this.store,
        'Lỗi xóa!',
        'Không tìm thấy dữ liệu bài tập cần xóa.',
        'error'
      );
    }
  }

  closeUpdateModal(): void {
    this.isUpdateModalVisible = false;
  }

  onSaveCodingDetails(updatedCodingDetail: UpdateCodingDetailRequest): void {
    Promise.resolve().then(() => {
      this.store.dispatch(
        setLoading({
          isLoading: true,
          content: 'Đang cập nhật dữ liệu chi tiết...',
        })
      );
    });

    // Gọi API để cập nhật coding details
    this.codingService
      .updateCodingDetails(this.exerciseId, updatedCodingDetail)
      .subscribe({
        next: (res: any) => {
          // Cập nhật lại dữ liệu local bằng cách fetch lại data
          this.fetchCodingDetails();

          this.closeUpdateModal();
          this.store.dispatch(clearLoading());

          // Hiển thị thông báo thành công
          sendNotification(
            this.store,
            'Thành công',
            'Đã cập nhật chi tiết bài tập',
            'success'
          );
        },
        error: (err: any) => {
          console.error('Error updating coding details:', err);
          this.store.dispatch(clearLoading());
        },
      });
  }

  confirmCoding() {
    this.router.navigate([
      '/exercise/exercise-layout/code-submission',
      this.exerciseId,
    ]);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.dropdown');
    if (!clickedInside) {
      this.isDropdownOpen = false;
    }
  }
}
