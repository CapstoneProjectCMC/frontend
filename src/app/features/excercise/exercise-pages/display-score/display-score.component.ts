import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IExerciseResultResponse } from '../../../../core/models/exercise.model';

interface QuizResult {
  quizResult: IExerciseResultResponse;
  userAnswers: any[];
  timeTaken: number;
  totalQuestions: number;
  correctAnswers: number;
}

@Component({
  selector: 'app-display-score',
  imports: [CommonModule],
  templateUrl: './display-score.component.html',
  styleUrl: './display-score.component.scss',
})
export class DisplayScoreComponent implements OnInit {
  quizData: QuizResult | null = null;
  exerciseId: string | null = null;

  constructor(private router: Router) {
    // Lấy dữ liệu từ router state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.quizData = navigation.extras.state as QuizResult;
    }
  }

  ngOnInit() {
    // Nếu không có dữ liệu từ state, redirect về trang list
    if (!this.quizData) {
      this.router.navigate(['/exercise/exercise-layout/list']);
      return;
    }

    console.log('Quiz Result Data:', this.quizData);
  }

  /**
   * Tính điểm phần trăm
   */
  get scorePercentage(): number {
    if (!this.quizData) return 0;
    return Math.round(
      (this.quizData.correctAnswers / this.quizData.totalQuestions) * 100
    );
  }

  /**
   * Tính thời gian làm bài dạng phút:giây
   */
  get timeFormatted(): string {
    if (!this.quizData) return '0:00';

    const minutes = Math.floor(this.quizData.timeTaken / 60);
    const seconds = this.quizData.timeTaken % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Quay về trang danh sách bài tập
   */
  goBackToList() {
    this.router.navigate(['/exercise/exercise-layout/list']);
  }

  /**
   * Xem lại bài làm
   */
  reviewQuiz() {
    // Có thể implement để xem lại từng câu hỏi và đáp án
    console.log('Review quiz functionality');
  }
}
