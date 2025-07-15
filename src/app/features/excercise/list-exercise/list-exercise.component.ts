import { Component, OnInit } from '@angular/core';
import { MainSidebarComponent } from '../../../shared/components/fxdonad-shared/main-sidebar/main-sidebar.component';
import { sidebarExercises } from '../../../core/constants/menu-router.data';
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
import { InputComponent } from '../../../shared/components/fxdonad-shared/input/input';
import { DropdownButtonComponent } from '../../../shared/components/fxdonad-shared/dropdown/dropdown.component';
import { EnumType } from '../../../core/models/data-handle';

@Component({
  selector: 'app-list-exercise',
  imports: [
    CommonModule,
    MainSidebarComponent,
    BreadcrumbComponent,
    CardExcerciseComponent,
    InputComponent,
    DropdownButtonComponent,
  ],
  templateUrl: './list-exercise.component.html',
  styleUrl: './list-exercise.component.scss',
})
export class ListExerciseComponent implements OnInit {
  isSidebarCollapsed = false;
  sidebarData = sidebarExercises;
  listExercise: CardExcercise[] = [];

  pageIndex: number = 1;
  itemsPerPage: number = 8;
  sortBy: EnumType['sort'] = 'CREATED_AT';
  asc: boolean = false;

  isLoadingMore = false;
  hasMore = true;

  genres: { value: string; label: string }[] = [];
  selectedOptions: { [key: string]: any } = {};
  activeDropdown: string | null = null;

  username: string | number = '';
  usernameError: string | null = '';

  constructor(private store: Store, private exerciseService: ExerciseService) {
    this.genres = [
      { value: 'action', label: 'Hành động' },
      { value: 'comedy', label: 'Hài hước' },
      { value: 'drama', label: 'Tâm lý' },
      { value: 'romance', label: 'Lãng mạn' },
      { value: 'horror', label: 'Kinh dị' },
      { value: 'sci-fi', label: 'Khoa học viễn tưởng' },
      { value: 'fantasy', label: 'Fantasy' },
      { value: 'slice-of-life', label: 'Đời thường' },
    ];
  }

  private mapExerciseResToCardDataUI(data: ExerciseItem[]): CardExcercise[] {
    return data.map((info) => mapExerciseResToCardUI(info));
  }

  ngOnInit(): void {
    //promise để tránh gọi quá sớm bị angular báo lỗi
    Promise.resolve().then(() => {
      this.store.dispatch(
        setLoading({ isLoading: true, content: 'Đang tải dữ liệu, xin chờ...' })
      );
    });

    this.exerciseService
      .getAllExercise(this.pageIndex, this.itemsPerPage, this.sortBy, this.asc)
      .subscribe({
        next: (res) => {
          const data = this.mapExerciseResToCardDataUI(res.result.data);
          this.listExercise = data;
          if (data.length < this.itemsPerPage) {
            this.hasMore = false;
          }
          sendNotification(this.store, 'Thành công', res.message, 'success');
          this.store.dispatch(clearLoading());
        },
        error: (err) => {
          console.log(err);
          this.store.dispatch(clearLoading());
        },
      });
  }

  loadNextPage() {
    if (this.isLoadingMore || !this.hasMore) return;
    this.isLoadingMore = true;
    this.pageIndex += 1;
    this.exerciseService
      .getAllExercise(this.pageIndex, this.itemsPerPage, this.sortBy, this.asc)
      .subscribe({
        next: (res) => {
          const newData = this.mapExerciseResToCardDataUI(res.result.data);
          if (newData.length < this.itemsPerPage) {
            this.hasMore = false;
          }
          this.listExercise = [...this.listExercise, ...newData];
          this.isLoadingMore = false;
        },
        error: (err) => {
          console.log(err);
          this.isLoadingMore = false;
        },
      });
  }

  onListScroll(event: Event) {
    const target = event.target as HTMLElement;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10) {
      this.loadNextPage();
    }
  }

  handleSelect(dropdownKey: string, selected: any): void {
    // Reset toàn bộ các lựa chọn trước đó
    this.selectedOptions = {};

    // Lưu lại option vừa chọn
    this.selectedOptions[dropdownKey] = selected;

    // this.router.navigate(['/', dropdownKey, selected.label]);

    console.log(this.selectedOptions);
  }

  toggleDropdown(id: string): void {
    // Nếu bạn muốn chỉ mở 1 dropdown tại một thời điểm
    this.activeDropdown = this.activeDropdown === id ? null : id;
  }

  handleInputChange($event: string | number) {
    console.log($event);
  }
}
