import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseService } from '../../../../core/services/api-service/exercise.service';
import { ScrollEndDirective } from '../../../../shared/directives/scroll-end.directive';
import { ExerciseSave } from '../../../../core/models/exercise.model';
import { LottieComponent } from 'ngx-lottie';
import { lottieOptions2 } from '../../../../core/constants/value.constant';
import { animate, style, transition, trigger } from '@angular/animations';
import { SkeletonLoadingComponent } from '../../../../shared/components/fxdonad-shared/skeleton-loading/skeleton-loading.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-saved-exercises',
  standalone: true,
  imports: [
    CommonModule,
    ScrollEndDirective,
    LottieComponent,
    SkeletonLoadingComponent,
  ],
  templateUrl: './saved-exercises.component.html',
  styleUrls: ['./saved-exercises.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ opacity: 0, transform: 'translateY(-10px)' })
        ),
      ]),
    ]),
  ],
})
export class SavedExercisesComponent implements OnInit {
  exercises: ExerciseSave[] = [];
  page = 1;
  size = 10;
  totalPages = 1;
  isLoading = false;
  lottieOptions = lottieOptions2;

  constructor(
    private exerciseService: ExerciseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadExercises();
  }

  loadExercises(): void {
    if (this.isLoading || (this.totalPages && this.page > this.totalPages))
      return;

    this.isLoading = true;
    this.exerciseService.getSavedExercises(this.page, this.size).subscribe({
      next: (res) => {
        const data = res.result;
        this.exercises.push(...data.data);
        this.totalPages = data.totalPages;
        this.page++;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  onUnsave(exercise: ExerciseSave, event: MouseEvent): void {
    event.stopPropagation();
    this.exerciseService
      .unSaveExercise(exercise.exercise.exerciseId)
      .subscribe({
        next: () => {
          this.exercises = this.exercises.filter(
            (e) => e.exercise.exerciseId !== exercise.exercise.exerciseId
          );
        },
      });
  }

  goToExercise(id: string, type: 'CODING' | 'QUIZ') {
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
