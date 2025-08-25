import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
import { mapToResourceCardList } from '../../../../../shared/utils/mapData';
import { CommentComponent } from '../../../../../shared/components/fxdonad-shared/comment/comment.component';
import { InputComponent } from '../../../../../shared/components/fxdonad-shared/input/input';

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
})
export class ResourceDetail {
  resourceId: string | null = null;
  resource!: ResourceData;
  listResource: ResourceData[] = [];
  listResourceCard: resourceCardInfo[] = [];
  searchTerm: string = '';
  searchTermError: string | null = null;

  // ---- Fake Data ----
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
    duration: '00:09:36',
    hlsUrl:
      'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
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
      hlsUrl:
        'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    })
  );

  constructor(
    private route: ActivatedRoute,
    private resourceService: ResourceService,
    private store: Store,
    private router: Router
  ) {
    this.resourceId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.loadResource();
    this.loadOtherVideo();
  }

  private loadResource() {
    this.store.dispatch(
      setLoading({ isLoading: true, content: 'Đang tải, xin chờ...' })
    );
    if (this.resourceId) {
      this.resourceService.getResourceById(this.resourceId).subscribe({
        next: (res) => {
          this.resource = res?.result?.data || this.fakeResource;
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
          this.resource = this.fakeResource; // fallback
          this.store.dispatch(clearLoading());
        },
      });
    } else {
      this.resource = this.fakeResource;
      this.store.dispatch(clearLoading());
    }
  }

  // ---- Danh sách video khác ----
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
          const data = res?.result?.data || this.fakeOtherVideos;
          const slice = data.slice(this.offset, this.offset + this.pageSize);
          this.listResource.push(...slice);

          this.offset += this.pageSize;
          this.hasMore = this.offset < data.length;

          this.isLoadingMore = false;
          // this.listResourceCard = mapToResourceCardList(this.listResource);
          this.listResourceCard = mapToResourceCardList(this.fakeOtherVideos);
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
}
