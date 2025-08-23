import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MySubmissionsHistoryResponse } from '../../../../core/models/exercise.model';
import { ExerciseService } from '../../../../core/services/api-service/exercise.service';
import { Router } from '@angular/router';
import { DurationFormatPipe } from '../../../../shared/pipes/duration-format.pipe';

@Component({
  selector: 'app-submisstion-history',
  imports: [CommonModule, DurationFormatPipe],
  templateUrl: './submisstion-history.component.html',
  styleUrl: './submisstion-history.component.scss',
})
export class SubmisstionHistoryComponent {
  submissions: MySubmissionsHistoryResponse[] | [] = [];

  constructor(
    private exerciseService: ExerciseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchQuizSubmitted();
  }

  fetchQuizSubmitted() {
    this.exerciseService.getMySubmissionsHistory().subscribe({
      next: (res) => {
        this.submissions = res.result;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  goToQuizDetails(id: string, type: 'CODING' | 'QUIZ') {
    if (type === 'QUIZ') {
      this.router.navigate(['/exercise/exercise-layout/exercise-details/', id]);
    } else {
      this.router.navigate([
        '/exercise/exercise-layout/exercise-code-details/',
        id,
      ]);
    }
  }
}
