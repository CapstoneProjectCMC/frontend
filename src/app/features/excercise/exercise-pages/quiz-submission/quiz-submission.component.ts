import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { QuizComponent } from '../../../../shared/components/fxdonad-shared/quiz/quiz.component';
import { QuestionPreview } from '../../../../core/models/exercise.model';
import { ExerciseService } from '../../../../core/services/api-service/exercise.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';

import { ModalNoticeService } from '../../../../shared/store/modal-notice-state/modal-notice.service';
import { lottieOptionsLoading1 } from '../../../../core/constants/value.constant';
import { LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'app-quiz-submission',
  standalone: true,
  imports: [QuizComponent, LottieComponent],
  templateUrl: './quiz-submission.component.html',
  styleUrl: './quiz-submission.component.scss',
})
export class QuizSubmissionComponent implements OnInit, OnDestroy {
  lottieOptions = lottieOptionsLoading1;

  exerciseId: string | null = '';
  quizId: string = '';
  times = 0;
  quizStarted = true;
  allowChatbot = false;
  questions: Array<QuestionPreview> = [];
  startDoing = false;

  // Trạng thái quiz từ child component
  isQuizSubmitted = false;
  hasQuizDataChanges = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private exerciseService: ExerciseService,
    private modalNoticeService: ModalNoticeService
  ) {}

  canDeactivate(): Observable<boolean> {
    if (!this.quizStarted) return of(true);
    if (this.hasQuizDataChanges) {
      return this.modalNoticeService.confirm(
        'Xác nhận thoát',
        'Bạn có chắc muốn thoát? Dữ liệu sẽ mất.',
        'Đồng ý',
        'Hủy'
      );
    } else {
      return of(true);
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent): void {
    // Chỉ hiện cảnh báo khi: có dữ liệu thay đổi VÀ chưa nộp bài
    if (this.quizStarted && this.hasQuizDataChanges && !this.isQuizSubmitted) {
      event.preventDefault();
      event.returnValue = 'Bạn có chắc muốn thoát? Dữ liệu sẽ mất.';
    }
  }

  ngOnInit() {
    this.exerciseId = this.route.snapshot.paramMap.get('id');

    // Kiểm tra xem có phải truy cập trực tiếp không
    if (!this.exerciseId || !this.isValidAccess()) {
      this.router.navigate(['/exercise/exercise-layout/list']);
      return;
    }

    if (this.exerciseId) {
      this.exerciseService
        .getExerciseDetails(1, 99999, 'CREATED_AT', false, this.exerciseId)
        .subscribe({
          next: (res) => {
            this.quizId = res.result.quizDetail?.id || '';
            this.times = res.result.duration;
            this.allowChatbot = res.result.allowAiQuestion;
            this.fetchQuiz();
          },
          error: (err) => {
            console.error('Error loading exercise:', err);
            this.router.navigate(['/exercise/exercise-layout/list']);
          },
        });
    }
  }

  fetchQuiz() {
    this.exerciseService.loadQuiz(this.quizId).subscribe({
      next: (res) => {
        this.questions = res.result.questions;
        this.startDoing = true;
      },
      error: (err) => {
        console.error('Error loading quiz:', err);
      },
    });
  }

  /**
   * Kiểm tra xem có phải truy cập hợp lệ không
   */
  private isValidAccess(): boolean {
    // Kiểm tra referrer hoặc session storage để đảm bảo USER đến từ trang exercise details
    const referrer = document.referrer;
    const hasValidReferrer =
      referrer.includes('/exercise-details') ||
      referrer.includes('/exercise-layout');

    // Hoặc kiểm tra session storage nếu có lưu thông tin truy cập
    const hasValidSession = sessionStorage.getItem(
      'quiz-access-' + this.exerciseId
    );

    return hasValidReferrer || !!hasValidSession;
  }

  ngOnDestroy() {
    // Xóa session storage khi rời khỏi quiz
    if (this.exerciseId) {
      sessionStorage.removeItem('quiz-access-' + this.exerciseId);
    }
  }

  /**
   * Nhận trạng thái từ QuizComponent
   */
  onQuizStateChanged(state: {
    isSubmitted: boolean;
    hasDataChanges: boolean;
  }): void {
    this.isQuizSubmitted = state.isSubmitted;
    this.hasQuizDataChanges = state.hasDataChanges;
  }
}
