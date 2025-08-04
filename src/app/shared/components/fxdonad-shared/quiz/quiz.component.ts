import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DurationFormatPipe } from '../../../pipes/duration-format.pipe';
import {
  QuizQuestion,
  IAnswer,
  IExerciseAnswerRequest,
  QuestionPreview,
} from '../../../../core/models/exercise.model';
import { ExerciseService } from '../../../../core/services/api-service/exercise.service';
import {
  openModalNotification,
  sendNotification,
} from '../../../utils/notification';
import { Store } from '@ngrx/store';
import { getUserInfoFromLocalStorage } from '../../../utils/userInfo';
import { decodeJWT } from '../../../utils/stringProcess';
import { openNoticeModal } from '../../../store/modal-notice-state/modal-notice.actions';
import {
  clearLoading,
  setLoading,
} from '../../../store/loading-state/loading.action';
import { Router } from '@angular/router';

export interface QuizQuestionExtends extends QuestionPreview {
  done?: boolean;
}

export interface QuizAnswer {
  questionId: string;
  selectedOption: any;
  answerText: string;
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule, DurationFormatPipe],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit, OnDestroy, OnChanges {
  @Input() quizId: string = '';
  @Input() exerciseId: string = '';
  @Input() questions: Array<QuizQuestionExtends> = [];
  @Input() totalTime: number = 0;
  userId: string = '';

  currentQuestionIndex = 0;
  selectedAnswers: QuizAnswer[] = [];
  timeLeft: number = this.totalTime;
  timerId: any;

  // Biến theo dõi trạng thái
  isSubmitted = false;
  hasDataChanges = false;

  // Output để thông báo trạng thái cho parent
  @Output() quizStateChanged = new EventEmitter<{
    isSubmitted: boolean;
    hasDataChanges: boolean;
  }>();

  constructor(
    private exerciseService: ExerciseService,
    private store: Store,
    private router: Router
  ) {
    const token = localStorage.getItem('token');
    if (token) {
      this.userId = decodeJWT(token)?.payload.userId;
    }

    // Fallback: nếu vẫn không có userId, có thể hardcode để test
    if (!this.userId) {
      console.warn('No userId found, using fallback');
      // this.userId = 'your-test-user-id'; // Uncomment và thay thế bằng ID thực
    }
  }

  openModalConfirm() {
    openModalNotification(
      this.store,
      'Xác nhận nộp bài',
      'Bạn có chắc chắn hoàn thành bài thi?',
      'Đồng ý',
      'Soát lại',
      () => this.submitQuiz(),
      () => this.cancelSubmit()
    );
  }

  get selectedAnswer(): QuizAnswer | null {
    const currentQuestion = this.questions[this.currentQuestionIndex];
    if (!currentQuestion) return null;

    return (
      this.selectedAnswers.find((a) => a.questionId === currentQuestion.id) ||
      null
    );
  }

  get doneCount(): number {
    return this.questions.filter((q) => q.done).length;
  }

  get timeProgress(): number {
    return Math.max(0, Math.min(100, 100 * (this.timeLeft / this.totalTime)));
  }

  get doneProgress(): number {
    return this.questions.length
      ? (100 * this.doneCount) / this.questions.length
      : 0;
  }

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['questions'] && this.questions && this.questions.length) {
      this.selectedAnswers = [];
    }

    if (changes['totalTime'] && typeof this.totalTime === 'number') {
      this.timeLeft = this.totalTime;
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  /**
   * Emit trạng thái quiz cho parent component
   */
  private emitQuizState(): void {
    this.quizStateChanged.emit({
      isSubmitted: this.isSubmitted,
      hasDataChanges: this.hasDataChanges,
    });
  }

  /**
   * Hủy nộp bài và quay lại làm bài
   */
  cancelSubmit(): void {
    // Tìm câu hỏi đầu tiên chưa được trả lời
    const firstUnansweredIndex = this.questions.findIndex(
      (question) => !question.done
    );

    if (firstUnansweredIndex !== -1) {
      // Chuyển đến câu hỏi đầu tiên chưa trả lời
      this.currentQuestionIndex = firstUnansweredIndex;
    } else {
      // Nếu tất cả câu hỏi đã trả lời, chuyển về câu đầu tiên
      this.currentQuestionIndex = 0;
    }

    console.log('Quay lại làm bài tại câu hỏi:', this.currentQuestionIndex + 1);
  }

  startTimer(): void {
    this.clearTimer();
    this.timerId = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.clearTimer();
        this.submitQuiz();
      }
    }, 1000);
  }

  clearTimer(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  prevQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  markDone(index: number): void {
    const question = this.questions[index];
    const answer = this.selectedAnswers.find(
      (a) => a.questionId === question.id
    );
    this.questions[index].done = !!answer;
  }

  selectAnswer(questionIndex: number, selectedOption: any): void {
    const question = this.questions[questionIndex];

    // Tìm hoặc tạo answer cho câu hỏi này
    let answer = this.selectedAnswers.find((a) => a.questionId === question.id);

    if (!answer) {
      answer = {
        questionId: question.id,
        selectedOption: selectedOption,
        answerText: selectedOption.optionText,
      };
      this.selectedAnswers.push(answer);
    } else {
      answer.selectedOption = selectedOption;
      answer.answerText = selectedOption.optionText;
    }

    // Đánh dấu câu hỏi đã hoàn thành
    this.questions[questionIndex].done = true;

    // Đánh dấu có dữ liệu thay đổi
    this.hasDataChanges = true;
    this.emitQuizState();
  }

  goToQuestion(index: number): void {
    this.currentQuestionIndex = index;
  }

  submitQuiz(): void {
    this.clearTimer();

    // Chuyển đổi sang format IAnswer để gửi lên server
    const answers: IAnswer[] = this.selectedAnswers.map((answer) => ({
      questionId: answer.questionId,
      selectedOptionId: answer.selectedOption.id,
      // answerText: answer.answerText,
    }));

    const dataSendRequest: IExerciseAnswerRequest = {
      exerciseId: this.exerciseId,
      studentId: this.userId,
      answers: answers,
      timeTakenSeconds: this.totalTime - this.timeLeft,
    };

    this.store.dispatch(
      setLoading({ isLoading: true, content: 'Đang chấm điểm, xin chờ...' })
    );
    this.exerciseService.submitQuiz(this.quizId, dataSendRequest).subscribe({
      next: (res) => {
        // Đánh dấu đã nộp bài
        this.isSubmitted = true;
        this.hasDataChanges = false;
        this.emitQuizState();
        sendNotification(
          this.store,
          'Đã hoàn thành',
          'Bài thi đã được chấm điểm',
          'success'
        );
        this.store.dispatch(clearLoading());

        // Truyền dữ liệu kết quả đến trang display-score
        this.router.navigate(
          ['/exercise/exercise-layout/quiz-submission/scored', this.exerciseId],
          {
            state: {
              quizResult: res.result,
              userAnswers: this.selectedAnswers,
              timeTaken: this.totalTime - this.timeLeft,
              totalQuestions: this.questions.length,
            },
          }
        );
      },
      error: (err) => {
        console.log(err);
        this.store.dispatch(clearLoading());
        // Nếu lỗi, reset lại trạng thái nộp bài
        this.isSubmitted = false;
      },
    });
  }
}
