import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InputComponent } from '../../../../shared/components/fxdonad-shared/input/input';
import { SkeletonLoadingComponent } from '../../../../shared/components/fxdonad-shared/skeleton-loading/skeleton-loading.component';
import { TrendingItem } from '../../../../shared/components/fxdonad-shared/trending/trending.component';
import { ButtonComponent } from '../../../../shared/components/my-shared/button/button.component';
import { MediaResource } from '../../../../core/models/resource.model';
import { ResourceCardComponent } from '../../../../shared/components/my-shared/resource-card/resource-card';
import { ResourceService } from '../../../../core/services/api-service/resource.service';
import { Store } from '@ngrx/store';
import {
  clearLoading,
  setLoading,
} from '../../../../shared/store/loading-state/loading.action';
import { sendNotification } from '../../../../shared/utils/notification';
import { ResourceEditPopupComponent } from '../../modal/popup-update/resource-edit-popup.component';
import { ScrollEndDirective } from '../../../../shared/directives/scroll-end.directive';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-resource-list',
  templateUrl: './resource-list.html',
  styleUrl: './resource-list.scss',
  standalone: true,
  imports: [
    InputComponent,
    ButtonComponent,
    SkeletonLoadingComponent,
    ResourceCardComponent,
    ResourceEditPopupComponent,
    ScrollEndDirective,
  ],
})
export class ResourceListComponent {
  resources: MediaResource[] = [];
  filteredResources: MediaResource[] = []; // danh sách sau khi search

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
  itemsPerPage: number = 6;
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

    this.status = [
      { value: '0', label: 'Reject' },
      { value: '1', label: 'Accepted' },
      { value: '2', label: 'Pendding' },
    ];
  }

  ngOnInit(): void {
    this.pageIndex = 1;
    this.fetchDataResource();
  }

  // ================== Fetch All==================
  // fetchDataResource(append: boolean = false) {
  //   this.isLoadingMore = append;
  //   this.isLoading = !append;

  //   this.resourceService
  //     .getAllResourceLearning(this.itemsPerPage, this.pageIndex)
  //     .subscribe({
  //       next: (res) => {
  //         const newData = res.result.data;
  //         const { currentPage, totalPages } = res.result;

  //         this.resources = append ? [...this.resources, ...newData] : newData;
  //         this.filteredResources = [...this.resources]; // gán mặc định cho search

  //         this.hasMore = currentPage < totalPages;

  //         this.isLoading = false;
  //         this.isLoadingMore = false;
  //       },
  //       error: (err) => {
  //         console.error(err);
  //         this.isLoading = false;
  //         this.isLoadingMore = false;
  //       },
  //     });
  // }

  // ================== Fetch ==================
  fetchDataResource(append: boolean = false) {
    this.isLoadingMore = append;
    this.isLoading = !append;

    forkJoin([
      this.resourceService.getVideoResources(),
      this.resourceService.getDocumentResources(),
    ])
      .pipe(
        map(([videosRes, docsRes]) => {
          const videos = videosRes.result ?? [];
          const docs = docsRes.result ?? [];
          return [...videos, ...docs]; // gộp
        })
      )
      .subscribe({
        next: (allResources) => {
          // Nếu append thì cộng dồn, ngược lại reset
          this.resources = append
            ? [...this.resources, ...allResources]
            : allResources;

          // tự phân trang tại FE
          const start = (this.pageIndex - 1) * this.itemsPerPage;
          const end = this.pageIndex * this.itemsPerPage;

          this.filteredResources = this.resources.slice(0, end); // hiển thị từ đầu tới trang hiện tại

          // check còn data nữa không
          this.hasMore = end < this.resources.length;

          this.isLoading = false;
          this.isLoadingMore = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
          this.isLoadingMore = false;
        },
      });
  }

  // ================== Load Next Page Server==================
  // loadNextPage() {
  //   if (this.isLoadingMore || !this.hasMore) return;

  //   this.pageIndex++;
  //   this.fetchDataResource(true);
  // }

  // ================== Load Next Page Client==================
  loadNextPage() {
    if (this.isLoadingMore || !this.hasMore) return;

    this.pageIndex++;
    const end = this.pageIndex * this.itemsPerPage;

    this.filteredResources = this.resources.slice(0, end);
    this.hasMore = end < this.resources.length;
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
      next: () => {
        this.resources = this.resources.filter((r) => r.id !== resourceId);
        this.filteredResources = this.filteredResources.filter(
          (r) => r.id !== resourceId
        );

        if (this.resources.length < this.itemsPerPage) {
          this.hasMore = false;
        }
        this.isLoading = false;
        this.store.dispatch(clearLoading());

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
    this.resourcename = value.toString().trim().toLowerCase();
    if (!this.resourcename) {
      this.filteredResources = [...this.resources];
      return;
    }

    this.filteredResources = this.resources.filter((r) =>
      r.fileName?.toLowerCase().includes(this.resourcename)
    );
  }

  // ================== Actions ==================
  handleAdd = () => {
    this.router.navigate(['/resource-learning/resource-create']);
  };

  handlePageChange(page: number) {}

  // ================== Navigation ==================
  goToDetail = (resourceId: string) => {
    this.router.navigate(['/resource-learning/resource', resourceId]);
  };
}
