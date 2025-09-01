import { NgFor, NgIf, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DropdownButtonComponent } from '../../../../shared/components/fxdonad-shared/dropdown/dropdown.component';
import { InputComponent } from '../../../../shared/components/fxdonad-shared/input/input';
import { SkeletonLoadingComponent } from '../../../../shared/components/fxdonad-shared/skeleton-loading/skeleton-loading.component';
import { TrendingItem } from '../../../../shared/components/fxdonad-shared/trending/trending.component';
import { ButtonComponent } from '../../../../shared/components/my-shared/button/button.component';
import { MediaResource } from '../../../../core/models/resource.model';
import { ResourceCardComponent } from '../../../../shared/components/my-shared/resource-card/resource-card';
import { ResourceService } from '../../../../core/services/api-service/resource.service';
import { mapToResourceCardList } from '../../../../shared/utils/mapData';
import { Store } from '@ngrx/store';
import {
  clearLoading,
  setLoading,
} from '../../../../shared/store/loading-state/loading.action';
import { sendNotification } from '../../../../shared/utils/notification';
import { ResourceEditPopupComponent } from '../../modal/popup-update/resource-edit-popup.component';

@Component({
  selector: 'app-resource-list',
  templateUrl: './resource-list.html',
  styleUrl: './resource-list.scss',
  standalone: true,
  imports: [
    InputComponent,
    // DropdownButtonComponent,
    ButtonComponent,
    NgFor,
    NgIf,
    SkeletonLoadingComponent,
    ResourceCardComponent,
    ResourceEditPopupComponent,
  ],
})
export class ResourceListComponent {
  resources: MediaResource[] = [];

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
  selectedResourceId: string | null = null;

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
    this.fetchDataResource();
  }

  // ================== Fetch ==================
  fetchDataResource() {
    this.resourceService
      .getAllResourceLearning(this.itemsPerPage, this.pageIndex)
      .subscribe({
        next: (res) => {
          this.resources = res.result.data;
        },
        error(err) {
          console.log(err);
        },
      });
  }

  // ================== Delete ==================
  getDeleteHandler(resourceId: string): () => void {
    return () => this.deleteResource(resourceId);
  }

  deleteResource(resourceId: string) {
    this.store.dispatch(
      setLoading({ isLoading: true, content: 'Đang xóa, xin chờ...' })
    );

    this.resourceService.deleteResourceById(resourceId).subscribe({
      next: (res) => {
        // Xoá resource trong danh sách hiện tại (vì API chỉ trả string, không trả lại list mới)
        this.resources = this.resources.filter((r) => r.id !== resourceId);

        // Kiểm tra còn item cho phân trang không
        if (this.resources.length < this.itemsPerPage) {
          this.hasMore = false;
        }
        this.isLoading = false;
        this.store.dispatch(clearLoading());

        // Optional: Hiện thông báo xoá thành công
        sendNotification(
          this.store,
          'Đã xóa tài nguyên',
          'Thành công',
          'success'
        );
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
        this.store.dispatch(clearLoading());
        sendNotification(
          this.store,
          'Xóa tài nguyên thất bại',
          'Thất bại',
          'error'
        );
      },
    });
  }

  // ================== Edit ==================
  getEditHandler(resourceId: string): () => void {
    return () => {
      this.selectedResourceId = resourceId;
    };
  }

  handlePopupClose() {
    this.selectedResourceId = null;
  }

  handleResourceUpdated() {}

  // ================== Input & Filter ==================
  handleInputChange(value: string | number): void {
    this.resourcename = value.toString();
    console.log('Input changed:', this.resourcename);
  }

  // ================== Actions ==================
  handleAdd = () => {
    this.router.navigate(['/resource-management/resource-create']);
  };

  handlePageChange(page: number) {
    console.log('chuyển trang');
  }

  // ================== Navigation ==================
  goToDetail = (resourceId: string) => {
    console.log('Navigating to resource detail with ID:', resourceId);
    this.router.navigate(['/resource-management/resource', resourceId]);
  };
}
