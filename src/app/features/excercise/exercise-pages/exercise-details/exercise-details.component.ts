import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ExerciseQuiz,
  OptionCreate,
  QuizQuestion,
  QuizQuestionCreate,
} from '../../../../core/models/exercise.model';
import { BreadcrumbComponent } from '../../../../shared/components/my-shared/breadcum/breadcrumb/breadcrumb.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ExerciseService } from '../../../../core/services/api-service/exercise.service';
import { AddNewQuestionComponent } from '../../exercise-modal/add-new-question/add-new-question.component';
import {
  openModalNotification,
  sendNotification,
} from '../../../../shared/utils/notification';
import { Store } from '@ngrx/store';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { HostListener } from '@angular/core';
import { AddNewOptionComponent } from '../../exercise-modal/add-new-option/add-new-option.component';
import { UpdateExerciseComponent } from '../../exercise-modal/update-exercise/update-exercise.component';
import { UpdateQuestionOptionComponent } from '../../exercise-modal/update-question-option/update-question-option.component';
import {
  clearLoading,
  setLoading,
} from '../../../../shared/store/loading-state/loading.action';
import { Tooltip } from '../../../../shared/components/fxdonad-shared/tooltip/tooltip';
import { avatarUrlDefault } from '../../../../core/constants/value.constant';
import { getUserRoles } from '../../../../shared/utils/userInfo';
import { activeForMyContent } from '../../../../shared/utils/authenRoleActions';
import { isAvailabelTime } from '../../../../shared/utils/availableTime';
import { PaymentService } from '../../../../core/services/api-service/payment.service';
import { IPurChaseTransactionRequest } from '../../../../core/models/service-and-payment';
import { v4 as uuidv4 } from 'uuid';
import { FormatViewPipe } from '../../../../shared/pipes/format-view.pipe';

@Component({
  selector: 'app-exercise-details',
  imports: [
    CommonModule,
    BreadcrumbComponent,
    AddNewQuestionComponent,
    AddNewOptionComponent,
    UpdateExerciseComponent,
    UpdateQuestionOptionComponent,
    Tooltip,
    FormatViewPipe,
  ],
  templateUrl: './exercise-details.component.html',
  styleUrls: ['./exercise-details.component.scss'],
  animations: [
    trigger('dropdownAnimation', [
      state('void', style({ opacity: 0, transform: 'scaleY(0.95)' })),
      state('*', style({ opacity: 1, transform: 'scaleY(1)' })),
      transition('void <=> *', animate('150ms cubic-bezier(0.4,0,0.2,1)')),
    ]),
  ],
})
export class ExerciseDetailsComponent implements OnInit {
  isOpenAddNewQuestion = false;
  isOpenAddNewOption: boolean = false;
  isOpenUpdateExercise: boolean = false;
  isUpdateQuestion: boolean = false;
  resetLoadingFlag = false;
  isBought = false;

  initialSelectedQuestion: QuizQuestion = {
    id: '',
    text: '',
    points: 1,
    type: '',
    orderInQuiz: 1,
    options: [
      {
        id: '',
        optionText: '',
        correct: false,
        order: '',
        createdBy: '',
        createdAt: '',
        updatedBy: '',
        updatedAt: '',
        deletedBy: '',
        deletedAt: '',
      },
    ],
    createdBy: '',
    createdAt: '',
    updatedBy: '',
    updatedAt: '',
    deletedBy: '',
    deletedAt: '',
  };

  exerciseId: string | null = '';
  quizDetailsId: string = '';
  selectedQuestion: QuizQuestion = this.initialSelectedQuestion;

  authorName: string = '';
  avatarUrl: string = '';
  avatarUrlDefault: string = avatarUrlDefault;

  // Dropdown state: index of question with open dropdown, or null
  openDropdownIndex: number | null = null;
  opentDeleteConfirm: number | null = null;

  exercise: ExerciseQuiz = {
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
    purchased: false,
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

  difficultyStars = [1, 2, 3];
  difficultyLevel = 1;

  roles = getUserRoles();
  isActionActive = false;
  nowDate = new Date();
  expirationDate: Date | null = null;
  availabelDate: Date | null = null;
  canStartDoing = false;

  isMainDropdownOpen: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private exerciseService: ExerciseService,
    private paymentService: PaymentService,
    private store: Store,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.exerciseId = this.route.snapshot.paramMap.get('id');
    if (this.exerciseId) {
      // page, size, sort, asc có thể lấy mặc định hoặc từ query param nếu cần
      this.fetchingData(this.exerciseId);
    }
  }

  payForExercise() {
    const item: IPurChaseTransactionRequest = {
      transactionId: uuidv4(),
      referenceId: uuidv4(),
      currency: 'VNĐ',
      itemId: this.exerciseId,
      itemType: 'EXERCISE',
      itemPrice: this.exercise.cost,
      itemName: this.exercise.title,
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

  fetchingData(id: string) {
    this.exerciseService
      .getExerciseDetails(1, 99999, 'CREATED_AT', false, id)
      .subscribe({
        next: (res) => {
          if (res && res.result) {
            this.exercise = res.result;
            if (res.result.user) {
              this.authorName = res.result.user.displayName;
              this.avatarUrl = res.result.user.avatarUrl;
              this.isBought = res.result.purchased;
              this.availabelDate = res.result.startTime
                ? new Date(res.result.startTime)
                : null;
              this.expirationDate = res.result.endTime
                ? new Date(res.result.endTime)
                : null;
            }
            this.setDifficultyLevel();
            this.isActionActive = activeForMyContent(
              res.result.user?.username ?? '',
              res.result.user?.email ?? '',
              this.roles.includes('ADMIN')
            );
            this.canStartDoing = isAvailabelTime(
              this.availabelDate,
              this.expirationDate
            );
          }
        },
        error: (err) => {
          // Xử lý lỗi nếu cần
          if (err.code === 4048312) {
            this.initialQuizDetails();
          }
          console.error('Lỗi lấy chi tiết bài tập:', err);
        },
      });
  }

  initialQuizDetails() {
    this.exerciseService
      .inititalAddQuestionStupid(this.exerciseId ?? '')
      .subscribe({
        next: () => {
          if (this.exerciseId) {
            this.fetchingData(this.exerciseId);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  setDifficultyLevel() {
    switch (this.exercise.difficulty) {
      case 'EASY':
        this.difficultyLevel = 1;
        break;
      case 'MEDIUM':
        this.difficultyLevel = 2;
        break;
      case 'HARD':
        this.difficultyLevel = 3;
        break;
    }
  }

  // Hàm mới để mở/đóng dropdown chính
  toggleMainDropdown() {
    this.isMainDropdownOpen = !this.isMainDropdownOpen;
  }

  // Đổi tên hàm cũ cho rõ ràng hơn
  toggleQuestionDropdown(index: number) {
    if (this.openDropdownIndex === index) {
      this.openDropdownIndex = null;
    } else {
      this.openDropdownIndex = index;
    }
  }

  openRequestBuyExercise() {
    Promise.resolve().then(() => {
      this.store.dispatch(
        setLoading({ isLoading: true, content: 'Xin chờ...' })
      );
    });
    this.paymentService.getMyWallet().subscribe({
      next: (res) => {
        if (res.result.balance - this.exercise.cost < 0) {
          openModalNotification(
            this.store,
            'Số dư không đủ',
            `Số dư tài khoản của bạn là ${
              res.result.balance
            }VNĐ hiện không đủ, còn thiếu ${
              this.exercise.cost - res.result.balance
            }VNĐ, bạn có muốn nạp thêm ?`,
            'Đồng ý',
            'hủy',
            () => this.router.navigate(['/service-and-payment/payment'])
          );
        } else {
          openModalNotification(
            this.store,
            'Mua bài tập',
            `Bạn chắc chắn mua bài tập này? 
          Số dư sau thanh toán: ${(
            res.result.balance - this.exercise.cost
          ).toLocaleString()}VNĐ`,
            'Đồng ý',
            'hủy',
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

  // Đổi tên hàm cũ cho rõ ràng hơn
  closeQuestionDropdown() {
    this.openDropdownIndex = null;
  }

  openAddNewQuestion() {
    this.isOpenAddNewQuestion = true;
  }

  openUpdateExercise() {
    this.isOpenUpdateExercise = true;
  }

  openConfirmDelete() {
    openModalNotification(
      this.store,
      'Xóa bài tập',
      `Bạn chắc chắn muốn xóa bài tập "${this.exercise.title}" này`,
      'Xác nhận',
      'Hủy',
      () => this.confirmDeleteExercise()
    );
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

  onEditQuestion(index: number, QuizQuestion: QuizQuestion | undefined) {
    // TODO: Implement edit question logic
    this.isUpdateQuestion = true;
    if (QuizQuestion) {
      this.selectedQuestion = QuizQuestion;
    } else {
      sendNotification(this.store, 'Opps!', 'Không lấy được dữ liệu', 'error');
    }
    this.closeDropdown();
  }

  onAddOption(index: number, quizDetailId?: string) {
    // TODO: Implement add option logic
    // quizDetailId có thể được sử dụng ở đây nếu cần
    this.quizDetailsId = quizDetailId ?? '';
    this.isOpenAddNewOption = true;
    this.closeDropdown();
  }

  cancelAddNew() {
    this.isOpenAddNewQuestion = false;
  }

  cancelAddNewOption() {
    this.isOpenAddNewOption = false;
  }

  cancelUpdateExercise() {
    this.isOpenUpdateExercise = false;
  }

  closeUpdateModal(): void {
    this.isUpdateQuestion = false;
    this.selectedQuestion = this.initialSelectedQuestion;
  }

  loadingHandler() {
    this.resetLoadingFlag = true;
    setTimeout(() => (this.resetLoadingFlag = false), 100);
  }

  onSubmitQuestion(data: QuizQuestionCreate) {
    if (this.exercise.quizDetail === null) {
      this.exerciseService
        .inititalAddQuestionStupid(this.exercise.id, data)
        .subscribe({
          next: (res) => {
            sendNotification(this.store, 'Thành công', res.message, 'success');
            if (this.exerciseId) {
              // page, size, sort, asc có thể lấy mặc định hoặc từ query param nếu cần
              this.fetchingData(this.exerciseId);
            }
            this.isOpenAddNewQuestion = false;
            this.loadingHandler();
          },
          error: (err) => {
            console.log(err);
            this.loadingHandler();
          },
        });
    } else {
      this.exerciseService
        .addQuestionIntoExercise(this.exercise.id, data)
        .subscribe({
          next: (res) => {
            sendNotification(this.store, 'Thành công', res.message, 'success');
            if (this.exerciseId) {
              // page, size, sort, asc có thể lấy mặc định hoặc từ query param nếu cần
              this.fetchingData(this.exerciseId);
            }
            this.isOpenAddNewQuestion = false;
            this.loadingHandler();
          },
          error: (err) => {
            console.log(err);
            this.loadingHandler();
          },
        });
    }
  }

  onSubmitOption(data: OptionCreate) {
    this.exerciseService
      .addOptionsIntoQuestion(this.quizDetailsId, data)
      .subscribe({
        next: (res) => {
          if (res.code === 20000) {
            if (this.exerciseId) {
              // page, size, sort, asc có thể lấy mặc định hoặc từ query param nếu cần
              this.fetchingData(this.exerciseId);
            }
            sendNotification(this.store, 'Thành công', res.message, 'success');
            this.isOpenAddNewOption = false;
          }
        },
        error: (err) => {
          this.isOpenAddNewOption = false;
          console.log(err);
        },
      });
  }

  onUpdateExercise() {
    this.fetchingData(this.exercise.id);
    this.isOpenUpdateExercise = false;
  }

  onUpdateQuestionSuccess(): void {
    this.closeUpdateModal();
    if (this.exerciseId) {
      this.fetchingData(this.exerciseId);
    } // Reload data after update
  }

  onDeleteQuestion(exerciseId: string, questionId: string) {
    this.exerciseService.deleteQuestion(exerciseId, questionId).subscribe({
      next: () => {
        sendNotification(
          this.store,
          'Đã xóa',
          'Xóa thành công câu hỏi',
          'success'
        );

        this.fetchingData(exerciseId);
      },
    });
  }

  cancelDelete() {
    this.opentDeleteConfirm = null;
  }

  doingQuiz() {
    // Lưu thông tin truy cập vào session storage
    if (this.exerciseId) {
      sessionStorage.setItem('quiz-access-' + this.exerciseId, 'true');
    }

    this.router.navigate(
      ['/exercise/exercise-layout/quiz-submission', this.exerciseId],
      { replaceUrl: true }
    );
  }

  openAssignExercise() {
    this.router.navigate([
      '/exercise/exercise-layout/assign-exercise-quiz',
      this.exerciseId,
    ]);
  }

  goBack() {
    this.location.back();
  }

  // Dropdown logic
  toggleDropdown(index: number) {
    if (this.openDropdownIndex === index) {
      this.openDropdownIndex = null;
    } else {
      this.openDropdownIndex = index;
      this.opentDeleteConfirm = null;
    }
  }

  toggleConfirmDelete(index: number) {
    if (this.opentDeleteConfirm === index) {
      this.opentDeleteConfirm = null;
    } else {
      this.opentDeleteConfirm = index;
      this.openDropdownIndex = null;
    }
  }

  closeDropdown() {
    this.openDropdownIndex = null;
    this.opentDeleteConfirm = null;
  }

  get hasQuestions(): boolean {
    return (this.exercise.quizDetail?.questions?.length ?? 0) > 0;
  }

  getOptionLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }

  // Hàm để đóng dropdown khi click ra ngoài
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Đóng dropdown của câu hỏi nếu click ra ngoài
    if (
      !target.closest('.edit-icon-btn') &&
      !target.closest('.edit-dropdown')
    ) {
      this.closeQuestionDropdown();
    }

    // Đóng dropdown chính nếu click ra ngoài
    if (
      !target.closest('.edit-dropdown-toggle') &&
      !target.closest('.edit-dropdown')
    ) {
      this.isMainDropdownOpen = false;
    }
  }
}
