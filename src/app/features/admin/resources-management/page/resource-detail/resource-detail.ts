import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoPlayerComponent } from '../../../../../shared/components/my-shared/video-view/video-view';
import {
  resourceCardInfo,
  ResourceData,
  FileCategory,
  Tag,
} from '../../../../../core/models/resource.model';
import { ResourceService } from '../../../../../core/services/api-service/resource.service';
import {
  clearLoading,
  setLoading,
} from '../../../../../shared/store/loading-state/loading.action';
import { Store } from '@ngrx/store';
import { sendNotification } from '../../../../../shared/utils/notification';
import { ResourceCardComponent } from '../../../../../shared/components/my-shared/resource-card/resource-card';
import { SkeletonLoadingComponent } from '../../../../../shared/components/fxdonad-shared/skeleton-loading/skeleton-loading.component';
import { CommentComponent } from '../../../../../shared/components/fxdonad-shared/comment/comment.component';
import { InputComponent } from '../../../../../shared/components/fxdonad-shared/input/input';
import { mapToResourceCardList } from '../../../../../shared/utils/mapData';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
    CommentComponent,
    InputComponent,
  ],
  standalone: true,
})
export class ResourceDetail implements OnInit {
  resourceId: string | null = null;
  resource!: ResourceData;
  listResource: ResourceData[] = [];
  listResourceCard: resourceCardInfo[] = [];
  searchTerm: string = '';
  searchTermError: string | null = null;
  isDocument: boolean = false;

  // Danh sách định dạng tài liệu hỗ trợ
  private supportedDocumentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'text/plain',
  ];

  private fakeResource: ResourceData = {
    id: 'fake-1',
    fileName: 'Hướng dẫn cấu hình Router cho Angular đơn giản nhất',
    fileType: 'video/mp4',
    size: 123456,
    url: 'https://example.com/video.mp4',
    checksum: '123abc',
    category: FileCategory.Video,
    isActive: true,
    description:
      'Video hướng dẫn cơ bản về Angular Router, từ cách tạo route, khai báo RouterModule, và sử dụng routerLink.',
    thumbnailUrl: 'https://i.ytimg.com/vi/2OHbjep_WjQ/maxresdefault.jpg',
    transcodingStatus: 'success',
    associatedResourceIds: [],
    tags: [
      { id: '1', name: 'Angular' },
      { id: '2', name: 'Tutorial' },
    ],
    isLectureVideo: true,
    isTextbook: false,
    viewCount: 1244,
    rating: 4.5,
    orgId: 'org-123',
    createdAt: '2025-08-26T12:13:50.83Z',
    duration: '00:09:36',
    hlsUrl:
      'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
  };

  private fakeDocument: ResourceData = {
    id: 'fake-doc-1',
    fileName: 'Tài liệu Angular Router.pdf',
    fileType: 'application/pdf',
    size: 543210,
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    checksum: '456def',
    category: FileCategory.RegularFile,
    isActive: true,
    description:
      'Tài liệu chi tiết về cách cấu hình và sử dụng Angular Router.',
    thumbnailUrl: 'https://picsum.photos/seed/doc1/400/225',
    transcodingStatus: 'failed',
    associatedResourceIds: [],
    tags: [
      { id: '1', name: 'Angular' },
      { id: '3', name: 'Document' },
    ],
    isLectureVideo: false,
    isTextbook: true,
    viewCount: 500,
    rating: 4.0,
    orgId: 'org-123',
    createdAt: '2025-08-26T12:13:50.83Z',
    duration: '',
    hlsUrl: '',
  };

  private fakeWordDoc: ResourceData = {
    id: 'fake-doc-2',
    fileName: 'Tài liệu Word.docx',
    fileType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 654321,
    url: 'https://file-examples.com/wp-content/uploads/2017/02/file-sample_100kB.doc',
    checksum: '789ghi',
    category: FileCategory.RegularFile,
    isActive: true,
    description: 'Tài liệu Word mẫu.',
    thumbnailUrl: 'https://picsum.photos/seed/doc2/400/225',
    transcodingStatus: 'failed',
    associatedResourceIds: [],
    tags: [{ id: '4', name: 'Word' }],
    isLectureVideo: false,
    isTextbook: true,
    viewCount: 300,
    rating: 4.2,
    orgId: 'org-123',
    createdAt: '2025-08-26T12:13:50.83Z',
    duration: '',
    hlsUrl: '',
  };

  private fakeOtherVideos: ResourceData[] = Array.from({ length: 12 }).map(
    (_, i) => ({
      id: `fake-${i + 2}`,
      fileName: `Nội dung ${i + 1}`,
      fileType: 'video/mp4',
      size: 9999,
      url: 'https://example.com/video.mp4',
      checksum: 'xxx',
      category: FileCategory.Video,
      isActive: true,
      description: `Mô tả video số ${i + 1}`,
      thumbnailUrl: 'https://picsum.photos/seed/video1/400/225',
      transcodingStatus: 'success',
      associatedResourceIds: [],
      tags: [{ id: 't1', name: 'Tag demo' }],
      isLectureVideo: false,
      isTextbook: false,
      viewCount: 100 * (i + 1),
      rating: 4,
      orgId: 'org-fake',
      duration: '00:05:20',
      createdAt: '2025-08-26T12:13:50.83Z',
      hlsUrl:
        'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    })
  );

  constructor(
    private route: ActivatedRoute,
    private resourceService: ResourceService,
    private store: Store,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.resourceId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.loadResource();
    this.loadOtherVideo();
    // Cấu hình worker cho ng2-pdf-viewer
    if (
      typeof window !== 'undefined' &&
      typeof (<any>window).pdfWorkerSrc === 'undefined'
    ) {
      (<any>window).pdfWorkerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    }
  }
  safeUrl!: SafeResourceUrl;
  private setSafeUrl(url: string) {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private loadResource() {
    this.store.dispatch(
      setLoading({ isLoading: true, content: 'Đang tải, xin chờ...' })
    );
    if (this.resourceId) {
      this.resourceService.getResourceById(this.resourceId).subscribe({
        next: (res) => {
          this.resource = res?.result || this.fakeResource;
          this.isDocument = this.supportedDocumentTypes.includes(
            this.resource.fileType
          );
          if (this.resource.url) {
            this.setSafeUrl(this.resource.url); // sanitize URL
          }
          console.log(
            'Resource:',
            this.resource,
            'isDocument:',
            this.isDocument,
            'fileType:',
            this.resource.fileType
          );
          this.store.dispatch(clearLoading());
        },
        error: (err) => {
          console.log(err);
          sendNotification(
            this.store,
            'Lỗi lấy tài nguyên, dùng fake data',
            err.message,
            'error'
          );
          this.resource =
            this.resourceId === 'fake-doc-1'
              ? this.fakeDocument
              : this.resourceId === 'fake-doc-2'
              ? this.fakeWordDoc
              : this.fakeResource;
          this.isDocument = this.supportedDocumentTypes.includes(
            this.resource.fileType
          );
          if (this.resource.url) {
            this.setSafeUrl(this.resource.url); // sanitize URL
          }

          console.log(
            'Resource:',
            this.resource,
            'isDocument:',
            this.isDocument,
            'fileType:',
            this.resource.fileType
          );
          this.store.dispatch(clearLoading());
        },
      });
    } else {
      this.resource = this.fakeResource;
      this.isDocument = this.supportedDocumentTypes.includes(
        this.resource.fileType
      );
      console.log(
        'Resource:',
        this.resource,
        'isDocument:',
        this.isDocument,
        'fileType:',
        this.resource.fileType
      );
      this.store.dispatch(clearLoading());
    }
  }

  isLoading = false;
  isLoadingMore = false;
  hasMore = true;
  private offset = 0;
  private pageSize = 5;

  loadOtherVideo() {
    if (this.hasMore && !this.isLoadingMore) {
      this.isLoadingMore = true;
      this.resourceService.getVideoResources().subscribe({
        next: (res) => {
          const data = res?.result || this.fakeOtherVideos;
          const slice = data.slice(this.offset, this.offset + this.pageSize);
          this.listResource.push(...slice);
          this.offset += this.pageSize;
          this.hasMore = this.offset < data.length;
          this.isLoadingMore = false;
          this.listResourceCard = mapToResourceCardList(this.listResource);
        },
        error: (err) => {
          console.log(err);
          sendNotification(
            this.store,
            'Lỗi lấy danh sách video, dùng fake data',
            err.message,
            'error'
          );
          const data = this.fakeOtherVideos;
          const slice = data.slice(this.offset, this.offset + this.pageSize);
          this.listResource.push(...slice);
          this.offset += this.pageSize;
          this.hasMore = this.offset < data.length;
          this.isLoadingMore = false;
          this.listResourceCard = mapToResourceCardList(this.listResource);
        },
      });
    }
  }

  goToDetail = (resourceId: string) => {
    this.router.navigate(['/resource-management/resource', resourceId]);
  };

  handleInputChange(value: string | number): void {
    this.searchTerm = value.toString();
    console.log('Input changed:', this.searchTerm);
  }

  downloadDocument() {
    if (this.isDocument && this.resource.url) {
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
