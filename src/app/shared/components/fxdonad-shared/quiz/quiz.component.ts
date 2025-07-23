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
import { QuizQuestion } from '../../../../core/models/exercise.model';

export interface QuizQuestionExtends extends QuizQuestion {
  done?: boolean;
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
  @Input() totalTime: number = 1800;

  currentQuestionIndex = 0;
  selectedAnswers: string[] = [];
  timeLeft: number = this.totalTime;
  timerId: any;

  get selectedAnswer(): string {
    return this.selectedAnswers[this.currentQuestionIndex] || '';
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
      this.selectedAnswers = Array(this.questions.length).fill('');
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
    const answer = this.selectedAnswers[index];
    this.questions[index].done = !!answer;
  }

  submitQuiz(): void {
    this.clearTimer();
    console.log('User answers:', this.selectedAnswers);
  }
}
