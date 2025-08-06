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
import { sendNotification } from '../../../../shared/utils/notification';
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

@Component({
  selector: 'app-exercise-details',
  imports: [
    CommonModule,
    BreadcrumbComponent,
    AddNewQuestionComponent,
    AddNewOptionComponent,
    UpdateExerciseComponent,
    UpdateQuestionOptionComponent,
  ],
  templateUrl: './exercise-details.component.html',
  styleUrl: './exercise-details.component.scss',
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

  // Dropdown state: index of question with open dropdown, or null
  openDropdownIndex: number | null = null;
  opentDeleteConfirm: number | null = null;

  exercise: ExerciseQuiz = {
    id: '',
    userId: '',
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

  difficultyStars = [1, 2, 3];
  difficultyLevel = 1;

  constructor(
    private route: ActivatedRoute,
    private exerciseService: ExerciseService,
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

  fetchingData(id: string) {
    this.exerciseService
      .getExerciseDetails(1, 99999, 'CREATED_AT', false, id)
      .subscribe({
        next: (res) => {
          if (res && res.result) {
            this.exercise = res.result;
            this.setDifficultyLevel();
            console.log(this.exercise.tags);
          }
        },
        error: (err) => {
          // Xử lý lỗi nếu cần
          console.error('Lỗi lấy chi tiết bài tập:', err);
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

  openAddNewQuestion() {
    this.isOpenAddNewQuestion = true;
  }

  openUpdateExercise() {
    this.isOpenUpdateExercise = true;
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

  getOptionLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (
      !target.closest('.edit-icon-btn') &&
      !target.closest('.edit-dropdown')
    ) {
      this.closeDropdown();
    }
  }
}
