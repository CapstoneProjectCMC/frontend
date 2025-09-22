import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';

import { VideoPlayerComponent } from '../../../../shared/components/my-shared/video-view/video-view';
import { ResourceCardComponent } from '../../../../shared/components/my-shared/resource-card/resource-card';
import { SkeletonLoadingComponent } from '../../../../shared/components/fxdonad-shared/skeleton-loading/skeleton-loading.component';
import { InputComponent } from '../../../../shared/components/fxdonad-shared/input/input';

import { MediaResource } from '../../../../core/models/resource.model';
import { ResourceService } from '../../../../core/services/api-service/resource.service';
import {
  clearLoading,
  setLoading,
} from '../../../../shared/store/loading-state/loading.action';
import { sendNotification } from '../../../../shared/utils/notification';
import { MarkdownModule } from 'ngx-markdown';
import { DEFAULT_AVATAR } from '../../../../core/models/user.models';

@Component({
  selector: 'app-resource-detail',
  templateUrl: './resource-detail.html',
  styleUrls: ['./resource-detail.scss'],
  imports: [
    CommonModule,
    FormsModule,
    VideoPlayerComponent,
    ResourceCardComponent,
    SkeletonLoadingComponent,
    InputComponent,
    MarkdownModule,
  ],
  standalone: true,
})
export class ResourceDetail implements OnInit {
  avatarDefault = DEFAULT_AVATAR;
  [x: string]: any;
  resourceId: string | null = null;
  resource!: MediaResource;

  listResource: MediaResource[] = [];
  searchTerm: string = '';
  searchTermError: string | null = null;
  avatarAuthor = '';
  authorName = 'Ẩn danh';

  isDocument: boolean = false;
  isImage: boolean = false;
  safeUrl!: SafeResourceUrl;
  tags: string[] = [];

  // trạng thái phân trang
  isLoading = false;
  isLoadingMore = false;
  hasMore = true;
  private currentPage = 1;
  private pageSize = 5;

  // định dạng document hỗ trợ
  private supportedDocumentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'text/plain',
  ];

  constructor(
    private route: ActivatedRoute,
    private resourceService: ResourceService,
    private store: Store,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {
    this.resourceId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.loadResource();
    this.loadOtherResource();

    if (
      typeof window !== 'undefined' &&
      typeof (<any>window).pdfWorkerSrc === 'undefined'
    ) {
      (<any>window).pdfWorkerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    }
  }

  private setSafeUrl(url: string) {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private loadResource() {
    if (!this.resourceId) return;

    Promise.resolve().then(() => {
      this.store.dispatch(
        setLoading({ isLoading: true, content: 'Đang tải, xin chờ...' })
      );
    });

    this.resourceService.getResourceById(this.resourceId).subscribe({
      next: (res) => {
        this.resource = res.result;
        this.avatarAuthor = res.result.userProfile.avatarUrl;
        this.authorName = res.result.userProfile.displayName;
        this.isDocument = this.supportedDocumentTypes.includes(
          this.resource.fileType
        );
        this.isImage = this.resource.fileType.startsWith('image/');
        this.tags = JSON.parse(res.result.tags[0].name);
        if (this.resource.url) {
          this.setSafeUrl(this.resource.url);
        }
        this.store.dispatch(clearLoading());
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        sendNotification(
          this.store,
          'Lỗi lấy tài nguyên',
          err.message,
          'error'
        );
        this.store.dispatch(clearLoading());
      },
    });
  }

  loadOtherResource() {
    if (this.isLoadingMore || !this.hasMore) return;

    this.isLoadingMore = true;

    this.resourceService
      .getAllResourceLearning(this.pageSize, this.currentPage)
      .subscribe({
        next: (res) => {
          const pagination = res.result;
          this.listResource.push(...pagination.data);
          this.hasMore = pagination.hasNextPage;
          this.currentPage++;
          this.isLoadingMore = false;
        },
        error: (err) => {
          console.error(err);
          sendNotification(
            this.store,
            'Lỗi lấy danh sách video',
            err.message,
            'error'
          );
          this.isLoadingMore = false;
        },
      });
  }

  goToDetail = (resourceId: string) => {
    this.router.navigate(['/resource-management/resource', resourceId]);
    this.resourceId = resourceId;
    this.loadResource();
  };

  handleInputChange(value: string | number): void {
    this.searchTerm = value.toString();
  }

  downloadDocument() {
    if (this.isDocument && this.resource?.url) {
      window.open(this.resource.url, '_blank');
    }
  }

  onPdfError(error: any) {
    console.error('PDF Error:', error);
    sendNotification(
      this.store,
      'Lỗi tải tài liệu PDF',
      error.message,
      'error'
    );
  }

  onIframeError(event: Event) {
    console.error('Iframe Error:', event);
    sendNotification(
      this.store,
      'Lỗi tải tài liệu',
      'Không thể hiển thị tài liệu. Vui lòng tải xuống.',
      'error'
    );
  }
}
