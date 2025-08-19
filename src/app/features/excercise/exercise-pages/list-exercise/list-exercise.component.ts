import { Component, OnInit } from '@angular/core';
import { sidebarExercises } from '../../../../core/constants/menu-router.data';
import { BreadcrumbComponent } from '../../../../shared/components/my-shared/breadcum/breadcrumb/breadcrumb.component';
import {
  CardExcercise,
  CardExcerciseComponent,
} from '../../../../shared/components/fxdonad-shared/card-excercise/card-excercise.component';
import { CommonModule } from '@angular/common';
import { ExerciseService } from '../../../../core/services/api-service/exercise.service';
import {
  CreateExerciseRequest,
  ExerciseItem,
} from '../../../../core/models/exercise.model';
import { Store } from '@ngrx/store';
import {
  mapCreateExerciseToCardUI,
  mapExerciseResToCardUI,
} from '../../../../shared/utils/mapData';
import { InputComponent } from '../../../../shared/components/fxdonad-shared/input/input';
import { DropdownButtonComponent } from '../../../../shared/components/fxdonad-shared/dropdown/dropdown.component';
import { EnumType } from '../../../../core/models/data-handle';
import { SkeletonLoadingComponent } from '../../../../shared/components/fxdonad-shared/skeleton-loading/skeleton-loading.component';
import { Router } from '@angular/router';
import { ExerciseModalComponent } from '../../exercise-modal/create-new-exercise/exercise-modal.component';
import { sendNotification } from '../../../../shared/utils/notification';
import {
  clearLoading,
  setLoading,
} from '../../../../shared/store/loading-state/loading.action';

@Component({
  selector: 'app-list-exercise',
  imports: [
    CommonModule,
    BreadcrumbComponent,
    CardExcerciseComponent,
    InputComponent,
    DropdownButtonComponent,
    SkeletonLoadingComponent,
    ExerciseModalComponent, // thêm vào imports
  ],
  templateUrl: './list-exercise.component.html',
  styleUrl: './list-exercise.component.scss',
})
export class ListExerciseComponent implements OnInit {
  isSidebarCollapsed = false;
  sidebarData = sidebarExercises;
  listExercise: CardExcercise[] = [];

  pageIndex: number = 1;
  itemsPerPage: number = 16;
  sortBy: EnumType['sort'] = 'CREATED_AT';
  asc: boolean = false;

  isLoading = false;
  isLoadingMore = false;
  hasMore = true;

  tags: { value: string; label: string }[] = [];
  difficultyLevel: { value: string; label: string }[] = [];
  selectedOptions: { [key: string]: any } = {};
  activeDropdown: string | null = null;

  username: string | number = '';
  usernameError: string | null = '';

  showModalCreate = false;

  constructor(
    private store: Store,
    private exerciseService: ExerciseService,
    private router: Router
  ) {
    this.tags = [
      { value: 'action', label: 'Hành động' },
      { value: 'comedy', label: 'Hài hước' },
      { value: 'drama', label: 'Tâm lý' },
      { value: 'romance', label: 'Lãng mạn' },
      { value: 'horror', label: 'Kinh dị' },
      { value: 'sci-fi', label: 'Khoa học viễn tưởng' },
      { value: 'fantasy', label: 'Fantasy' },
      { value: 'slice-of-life', label: 'Đời thường' },
    ];
    this.difficultyLevel = [
      { value: '0', label: 'Dễ' },
      { value: '1', label: 'Trung bình' },
      { value: '2', label: 'Khó' },
    ];
  }

  private mapExerciseResToCardDataUI(data: ExerciseItem[]): CardExcercise[] {
    return data.map((info) => mapExerciseResToCardUI(info));
  }

  private mapCreateExerciseToCardDataUI(
    data: CreateExerciseRequest
  ): CardExcercise {
    return mapCreateExerciseToCardUI(data);
  }

  ngOnInit(): void {
    //promise để tránh gọi quá sớm bị angular báo lỗi
    // Promise.resolve().then(() => {
    //   this.store.dispatch(
    //     setLoading({ isLoading: true, content: 'Đang tải dữ liệu, xin chờ...' })
    //   );
    // });
    this.fetchData();
  }

  fetchData() {
    this.isLoading = true;
    this.exerciseService
      .getAllExercise(this.pageIndex, this.itemsPerPage, this.sortBy, this.asc)
      .subscribe({
        next: (res) => {
          const data = this.mapExerciseResToCardDataUI(res.result.data);
          this.listExercise = data;
          if (data.length < this.itemsPerPage) {
            this.hasMore = false;
          }
          this.isLoading = false;
          // this.store.dispatch(clearLoading());
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
          // this.store.dispatch(clearLoading());
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

  filterData(keyMap: string) {
    const values: string[] = [];

    Object.keys(this.selectedOptions)
      .filter((key) => key === keyMap)
      .forEach((key) => {
        const selected = this.selectedOptions[key];

        if (Array.isArray(selected)) {
          // multiSelect => mảng
          values.push(...selected.map((opt) => opt.value));
        } else if (selected) {
          // singleSelect => 1 object
          values.push(selected.value);
        }
      });

    return values.join(', ');
    // 👉 "action, comedy, ..." thay vì "tags"
  }

  handleSelect(dropdownKey: string, selected: any): void {
    // Reset toàn bộ các lựa chọn trước đó
    this.selectedOptions = {};

    // Lưu lại option vừa chọn
    this.selectedOptions[dropdownKey] = selected;

    console.log(dropdownKey, this.filterData(dropdownKey));

    // this.router.navigate(['/', dropdownKey, selected.label]);
  }

  toggleDropdown(id: string): void {
    // Nếu bạn muốn chỉ mở 1 dropdown tại một thời điểm
    this.activeDropdown = this.activeDropdown === id ? null : id;
  }

  toggleOpenModalCreate() {
    this.showModalCreate = !this.showModalCreate;
  }

  onModalCreateSubmit(data: CreateExerciseRequest) {
    // TODO: Gọi API tạo mới exercise ở đây

    Promise.resolve().then(() => {
      this.store.dispatch(
        setLoading({
          isLoading: true,
          content: 'Đang thêm mới bài tập, xin chờ...',
        })
      );
    });

    this.exerciseService.createExercise(data).subscribe({
      next: (res) => {
        // Assuming res contains the created exercise with all required fields
        const newExercise = this.mapCreateExerciseToCardDataUI(data);
        this.fetchData();
        this.showModalCreate = false;
        sendNotification(this.store, 'Thành công', res.message, 'success');
        this.store.dispatch(clearLoading());
      },
      error: (err) => {
        console.error('Failed to create exercise:', err);
        this.showModalCreate = false;
        this.store.dispatch(clearLoading());
      },
    });
  }

  onModalCreateCancel() {
    this.showModalCreate = false;
  }

  handleInputChange($event: string | number) {
    console.log($event);
  }
}
