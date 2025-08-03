import {
  Component,
  Input,
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
} from '../../../../core/models/exercise.model';
import { ExerciseService } from '../../../../core/services/api-service/exercise.service';
import { sendNotification } from '../../../utils/notification';
import { Store } from '@ngrx/store';
import { getUserInfoFromLocalStorage } from '../../../utils/userInfo';
import { decodeJWT } from '../../../utils/stringProcess';

export interface QuizQuestionExtends extends QuizQuestion {
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
  @Input() questions: Array<QuizQuestionExtends> = [];
  @Input() quizId: string = '';
  @Input() exerciseId: string = '';
  @Input() totalTime: number = 0;

  userId: string = '';

  currentQuestionIndex = 0;
  selectedAnswers: QuizAnswer[] = [];
  timeLeft: number = this.totalTime;
  timerId: any;

  constructor(private exerciseService: ExerciseService, private store: Store) {
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
  }

  goToQuestion(index: number): void {
    this.currentQuestionIndex = index;
  }

  submitQuiz(): void {
    this.clearTimer();
    console.log('User answers:', this.selectedAnswers);

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

    console.log('Formatted answers for submission:', answers);
    this.exerciseService.submitQuiz(this.quizId, dataSendRequest).subscribe({
      next: (res) => {
        sendNotification(
          this.store,
          'Đã hoàn thành',
          'Bài thi đã được chấm điểm',
          'success'
        );
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
