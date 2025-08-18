import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MyQuizHistoryResponse } from '../../../../core/models/exercise.model';
import { ExerciseService } from '../../../../core/services/api-service/exercise.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-history',
  imports: [CommonModule],
  templateUrl: './quiz-history.component.html',
  styleUrl: './quiz-history.component.scss',
})
export class QuizHistoryComponent {
  submissions: MyQuizHistoryResponse[] | [] = [];

  constructor(
    private exerciseService: ExerciseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchQuizSubmitted();
  }

  fetchQuizSubmitted() {
    this.exerciseService.getMyQuizHistory().subscribe({
      next: (res) => {
        this.submissions = res.result;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  goToQuizDetails(id: string) {
    this.router.navigate(['/exercise/exercise-layout/exercise-details/', id]);
  }
}
