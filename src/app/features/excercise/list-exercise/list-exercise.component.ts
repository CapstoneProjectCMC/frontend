import { Component, OnInit } from '@angular/core';
import { MainSidebarComponent } from '../../../shared/components/fxdonad-shared/main-sidebar/main-sidebar.component';
import { sidebarData } from '../../../core/constants/menu-router.data';
import { BreadcrumbComponent } from '../../../shared/components/my-shared/breadcum/breadcrumb/breadcrumb.component';
import {
  CardExcercise,
  CardExcerciseComponent,
} from '../../../shared/components/fxdonad-shared/card-excercise/card-excercise.component';
import { CommonModule } from '@angular/common';
import { ExerciseService } from '../../../core/services/api-service/exercise.service';
import { ExerciseItem } from '../../../core/models/exercise.model';
import { sendNotification } from '../../../shared/utils/notification';
import { Store } from '@ngrx/store';
import { mapExerciseResToCardUI } from '../../../shared/utils/mapData';
import {
  clearLoading,
  setLoading,
} from '../../../shared/store/loading-state/loading.action';

@Component({
  selector: 'app-list-exercise',
  imports: [
    CommonModule,
    MainSidebarComponent,
    BreadcrumbComponent,
    CardExcerciseComponent,
  ],
  templateUrl: './list-exercise.component.html',
  styleUrl: './list-exercise.component.scss',
})
export class ListExerciseComponent implements OnInit {
  isSidebarCollapsed = false;
  sidebarData = sidebarData;
  listExercise: CardExcercise[] = [];

  constructor(private store: Store, private exerciseService: ExerciseService) {}

  private mapExerciseResToCardDataUI(data: ExerciseItem[]): CardExcercise[] {
    return data.map((info) => mapExerciseResToCardUI(info));
  }

  ngOnInit(): void {
    this.store.dispatch(
      setLoading({ isLoading: true, content: 'Đang xử lý...' })
    );
    this.exerciseService.getAllExercise(1, 10, 'CREATED_AT', false).subscribe({
      next: (res) => {
        this.listExercise = this.mapExerciseResToCardDataUI(res.result.data);

        sendNotification(this.store, 'Thành công', res.message, 'success');
        this.store.dispatch(clearLoading());
      },
      error: (err) => {
        console.log(err);
        this.store.dispatch(clearLoading());
      },
    });
  }
}
