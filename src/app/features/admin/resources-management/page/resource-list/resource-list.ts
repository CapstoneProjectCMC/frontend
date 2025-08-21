import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DropdownButtonComponent } from '../../../../../shared/components/fxdonad-shared/dropdown/dropdown.component';
import { InputComponent } from '../../../../../shared/components/fxdonad-shared/input/input';
import { SkeletonLoadingComponent } from '../../../../../shared/components/fxdonad-shared/skeleton-loading/skeleton-loading.component';
import { TrendingItem } from '../../../../../shared/components/fxdonad-shared/trending/trending.component';
import { ButtonComponent } from '../../../../../shared/components/my-shared/button/button.component';
import { resourceCardInfo } from '../../../../../core/models/resource.model';
import { ResourceCardComponent } from '../../../../../shared/components/my-shared/resource-card/resource-card';
import { ResourceService } from '../../../../../core/services/api-service/resource.service';
import { mapToResourceCardList } from '../../../../../shared/utils/mapData';
import { Store } from '@ngrx/store';
import { clearLoading } from '../../../../../shared/store/loading-state/loading.action';

@Component({
  selector: 'app-resource-list',
  templateUrl: './resource-list.html',
  styleUrl: './resource-list.scss',
  standalone: true,
  imports: [
    InputComponent,
    DropdownButtonComponent,
    ButtonComponent,
    NgFor,
    NgIf,
    SkeletonLoadingComponent,
    ResourceCardComponent,
  ],
})
export class ResourceListComponent {
  resources: resourceCardInfo[] = [];
  // fakeTags: TagInfo[] = [
  //   { name: 'React', level: 4, count: 49348 },
  //   { name: 'Vue', level: 3, count: 75 },
  //   { name: 'NodeJS', level: 2, count: 60 },
  //   { name: 'TypeScript', level: 1, count: 45 },
  //   { name: 'C#', level: 2, count: 60 },
  //   { name: 'Java', level: 1, count: 45 },
  //   { name: 'Python', level: 2, count: 60 },
  //   { name: 'C', level: 1, count: 45 },
  // ];
  trendingData: TrendingItem[] = [
    { name: 'Angular', views: 15000 },
    { name: 'React', views: 12000 },
    { name: 'Vue', views: 8000 },
    { name: 'TypeScript', views: 5000 },
    { name: 'JavaScript', views: 20000 },
  ];
  isLoading = false;
  isLoadingMore = false;
  hasMore = true;
  resourcename = '';
  tag: { value: string; label: string }[] = [];
  status: { value: string; label: string }[] = [];
  selectedOptions: { [key: string]: any } = {};
  activeDropdown: string | null = null;
  pageIndex: number = 1;
  itemsPerPage: number = 8;
  constructor(
    private router: Router,
    private resourceService: ResourceService,
    private store: Store
  ) {
    this.tag = [
      { value: '1', label: 'react' },
      { value: '0', label: 'javascript' },
      { value: '2', label: 'C#' },
      { value: '3', label: 'java' },
      { value: '4', label: 'python' },
    ];
    // Mock data for status
    this.status = [
      { value: '0', label: 'Reject' },
      { value: '1', label: 'Accepted' },
      { value: '2', label: 'Pendding' },
    ];
  }
  ngOnInit(): void {
    this.isLoading = true;
    this.resourceService
      .getResource(this.pageIndex, this.itemsPerPage)
      .subscribe({
        next: (res) => {
          this.resources = mapToResourceCardList(res.result.data);
          if (this.resources.length < this.itemsPerPage) {
            this.hasMore = false;
          }
          this.isLoading = false;
          this.store.dispatch(clearLoading());
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
          this.store.dispatch(clearLoading());
        },
      });
  }
  handleInputChange(value: string | number): void {
    this.resourcename = value.toString();

    console.log('Input changed:', this.resourcename);
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
  handleAdd = () => {
    this.router.navigate(['/resource-management/resource-create']);
  };
  handlePageChange(page: number) {
    console.log('chuyển trang');
  }

  goToDetail = (resourceId: string) => {
    console.log('Navigating to resource detail with ID:', resourceId);
    this.router.navigate(['/resource-management/resource', resourceId]);
  };
}
