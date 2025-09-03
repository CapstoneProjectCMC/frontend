import { Component, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '../../../../shared/components/my-shared/breadcum/breadcrumb/breadcrumb.component';
import {
  CardExcercise,
  CardExcerciseComponent,
} from '../../../../shared/components/fxdonad-shared/card-excercise/card-excercise.component';

import { ExerciseService } from '../../../../core/services/api-service/exercise.service';
import {
  CreateExerciseRequest,
  ExerciseItem,
} from '../../../../core/models/exercise.model';
import { Store } from '@ngrx/store';
import { mapExerciseResToCardUI } from '../../../../shared/utils/mapData';
import { InputComponent } from '../../../../shared/components/fxdonad-shared/input/input';
import { DropdownButtonComponent } from '../../../../shared/components/fxdonad-shared/dropdown/dropdown.component';
import { SkeletonLoadingComponent } from '../../../../shared/components/fxdonad-shared/skeleton-loading/skeleton-loading.component';
import { ExerciseModalComponent } from '../../exercise-modal/create-new-exercise/exercise-modal.component';
import { sendNotification } from '../../../../shared/utils/notification';
import {
  clearLoading,
  setLoading,
} from '../../../../shared/store/loading-state/loading.action';
import { ScrollEndDirective } from '../../../../shared/directives/scroll-end.directive';
import { BtnType1Component } from '../../../../shared/components/fxdonad-shared/ui-verser-io/btn-type1/btn-type1.component';
import { GenerateExerciseModalComponent } from '../../exercise-modal/generate-exercise/generate-exercise.component';
import { LottieComponent } from 'ngx-lottie';
import {
  lottieOptions,
  tagsData,
} from '../../../../core/constants/value.constant';
import { activeForAdminAndTeacher } from '../../../../shared/utils/authenRoleActions';

@Component({
  selector: 'app-list-exercise',
  imports: [
    CardExcerciseComponent,
    InputComponent,
    DropdownButtonComponent,
    SkeletonLoadingComponent,
    ExerciseModalComponent,
    ScrollEndDirective,
    BtnType1Component,
    GenerateExerciseModalComponent,
    LottieComponent
],
  templateUrl: './list-exercise.component.html',
  styleUrl: './list-exercise.component.scss',
})
export class ListExerciseComponent implements OnInit {
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  lottieOptions = lottieOptions;

  pageIndex: number = 1;
  itemsPerPage: number = 16;

  isLoading = false;
  isLoadingMore = false;
  hasMore = true;
  showModalCreate = false;
  showModalGenerate = false;
  isSidebarCollapsed = false;

  filterTagsKey = 'tags';
  filterDifficultyKey = 'do-kho';

  tagsSelected: string = '';
  difficultySelected: number | null = null;
  searchData: string | number = '';

  selectedOptions: { [key: string]: any } = {};
  activeDropdown: string | null = null;
  errorSearch = '';

  listExercise: CardExcercise[] = [];
  tags: { value: string; label: string }[] = [];
  difficultyLevel: { value: string; label: string }[] = [];

  isActionActive = activeForAdminAndTeacher();

  constructor(private store: Store, private exerciseService: ExerciseService) {
    this.tags = tagsData;
    this.difficultyLevel = [
      { value: '0', label: 'Dễ' },
      { value: '1', label: 'Trung bình' },
      { value: '2', label: 'Khó' },
    ];
  }

  private mapExerciseResToCardDataUI(data: ExerciseItem[]): CardExcercise[] {
    return data.map((info) => mapExerciseResToCardUI(info));
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.isLoading = true;
    this.hasMore = true;
    this.exerciseService
      .searchExercise(
        this.pageIndex,
        this.itemsPerPage,
        this.tagsSelected,
        this.difficultySelected,
        this.searchData.toString()
      )
      .subscribe({
        next: (res) => {
          const data = this.mapExerciseResToCardDataUI(res.result.data);
          this.listExercise = data;
          if (res.result.currentPage >= res.result.totalPages) {
            this.hasMore = false;
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }

  loadNextPage() {
    if (this.isLoadingMore || !this.hasMore) return;
    this.isLoadingMore = true;
    this.pageIndex += 1;
    this.exerciseService
      .searchExercise(
        this.pageIndex,
        this.itemsPerPage,
        this.tagsSelected,
        this.difficultySelected,
        this.searchData.toString()
      )
      .subscribe({
        next: (res) => {
          const newData = this.mapExerciseResToCardDataUI(res.result.data);
          if (res.result.currentPage >= res.result.totalPages) {
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
    // "tag1, tag2, ..."
  }

  handleSelect(dropdownKey: string, selected: any): void {
    // Reset toàn bộ các lựa chọn trước đó tránh thừa query
    this.selectedOptions = {};

    this.pageIndex = 1;

    // Lưu lại option vừa chọn
    this.selectedOptions[dropdownKey] = selected;

    if (dropdownKey === this.filterTagsKey) {
      this.tagsSelected = this.filterData(dropdownKey);
    } else if (dropdownKey === this.filterDifficultyKey) {
      this.difficultySelected = this.filterData(dropdownKey)
        ? Number(this.filterData(dropdownKey))
        : null;
    } else {
      console.log('filter không khả dụng: ', dropdownKey);
    }

    this.fetchData();

    // this.router.navigate(['/', dropdownKey, selected.label]);
  }

  toggleDropdown(id: string): void {
    // Nếu bạn muốn chỉ mở 1 dropdown tại một thời điểm
    this.activeDropdown = this.activeDropdown === id ? null : id;
  }

  toggleOpenModalCreate() {
    this.showModalCreate = !this.showModalCreate;
  }

  toggleOpenModalGenerate() {
    this.showModalGenerate = !this.showModalGenerate;
  }

  exerciseCreated() {
    this.pageIndex = 1;
    this.fetchData();
  }

  onClose() {
    this.showModalGenerate = false;
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
        this.pageIndex = 1;
        this.searchData = '';
        setTimeout(() => {
          this.fetchData();
        }, 2000);
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
    this.isLoading = true;
    this.pageIndex = 1;

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    // Nếu có / và ? thì lọc bỏ ký tự / và ?
    // if (/[\/\?]/.test($event.toString())) {
    //   this.searchData = $event.toString().replace(/[\/\?]/g, '');
    //   this.errorSearch = 'Hãy loại bỏ ký tự "?" và "/" nếu có';
    //   setTimeout(() => {
    //     this.errorSearch = '';
    //   }, 3000);
    // } else {
    //   this.searchData = $event;
    // }
    this.searchData = $event;

    this.debounceTimer = setTimeout(() => {
      this.fetchData();
    }, 500); // chờ 500ms sau khi dừng gõ mới gọi
  }
}
