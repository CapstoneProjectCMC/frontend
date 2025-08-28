import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InputComponent } from '../../../../shared/components/fxdonad-shared/input/input';
import { DropdownButtonComponent } from '../../../../shared/components/fxdonad-shared/dropdown/dropdown.component';
import { PostCardComponent } from '../../../../shared/components/my-shared/post-card/post-card';
import { NgFor, NgIf } from '@angular/common';
import {
  PostCardInfo,
  PostResponse,
} from '../../../../core/models/post.models';
import { PopularPostComponent } from '../../../admin/post-management/component/popular-post/popular-post';
import { SkeletonLoadingComponent } from '../../../../shared/components/fxdonad-shared/skeleton-loading/skeleton-loading.component';
import { Router } from '@angular/router';
import {
  TrendingComponent,
  TrendingItem,
} from '../../../../shared/components/fxdonad-shared/trending/trending.component';
import { PostService } from '../../../../core/services/api-service/post.service';
import { Store } from '@ngrx/store';
import { mapPostdatatoPostCardInfo } from '../../../../shared/utils/mapData';
import { LottieComponent, provideLottieOptions } from 'ngx-lottie';
import { ScrollEndDirective } from '../../../../shared/directives/scroll-end.directive';
import { BtnType1Component } from '../../../../shared/components/fxdonad-shared/ui-verser-io/btn-type1/btn-type1.component';
import { openModalNotification } from '../../../../shared/utils/notification';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.html',
  styleUrl: './post-list.scss',
  standalone: true,
  imports: [
    InputComponent,
    DropdownButtonComponent,
    PostCardComponent,
    NgFor,
    NgIf,
    PopularPostComponent,
    SkeletonLoadingComponent,
    TrendingComponent,
    LottieComponent,
    ScrollEndDirective,
    BtnType1Component,
  ],
  providers: [provideLottieOptions({ player: () => import('lottie-web') })],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PostListComponent {
  lottieOptions = {
    path: 'assets/lottie-animation/nodata.json',
    autoplay: true,
    loop: true,
  };
  posts: PostCardInfo[] = [];
  postsraw!: PostResponse[];

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
  postname = '';
  tag: { value: string; label: string }[] = [];
  status: { value: string; label: string }[] = [];
  selectedOptions: { [key: string]: any } = {};
  activeDropdown: string | null = null;
  pageIndex = 1;
  size = 10;
  totalPages = 1;
  isLoadingInitial = true;
  isLoadingNextPage = false;
  // Quản lý trạng thái vote cho từng bài post
  voteStates: { [postId: string]: 'upvote' | 'downvote' | null } = {};

  constructor(
    private router: Router,
    private postservice: PostService,
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
    this.fetchPostList(true);
  }

  fetchPostList(isInitialLoad = false) {
    this.isLoading = true;

    if (isInitialLoad) {
      this.isLoadingInitial = true;
    } else {
      this.isLoadingNextPage = true;
    }

    this.postservice.getVisiblePosts(this.pageIndex, this.size).subscribe({
      next: (res) => {
        const newPostsRaw = res.result.data;
        this.totalPages = res.result.totalPages;

        // ✅ Chỉ map phần dữ liệu mới
        const newPosts = this.mapPostdatatoPostCardInfo(newPostsRaw);
        if (isInitialLoad) {
          this.posts = []; // reset khi load mới
        }
        this.posts.push(...newPosts); // append thêm

        if (isInitialLoad) {
          this.isLoadingInitial = false;
        } else {
          this.isLoadingNextPage = false;
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
    // Chỉ tải trang tiếp theo nếu không phải là trang cuối và không đang tải
    if (this.pageIndex < this.totalPages && !this.isLoadingNextPage) {
      this.pageIndex++;
      this.fetchPostList();
    }
  }

  trackByPostId(index: number, item: PostCardInfo): string {
    return item.id; // hoặc postId/uuid gì đó unique
  }

  private mapPostdatatoPostCardInfo(data: PostResponse[]): PostCardInfo[] {
    return data.map((info) => mapPostdatatoPostCardInfo(info));
  }

  //sai logic -- khi nào sửa lại sau
  handleUpVote(id: string) {
    this.postservice.reactionPost(id, 'upvote').subscribe({
      next: () => {
        const post = this.posts.find((p) => p.id === id);
        if (!post) return;

        const currentVote = this.voteStates[id] ?? null;

        if (currentVote === 'upvote') {
          // 🔄 Bỏ upvote
          post.upvote = (post.upvote ?? 0) - 1;
          this.voteStates[id] = null;
        } else {
          // Nếu trước đó đã downvote thì bỏ downvote
          if (currentVote === 'downvote') {
            post.downvote = (post.downvote ?? 0) - 1;
          }
          // ✅ Thêm upvote
          post.upvote = (post.upvote ?? 0) + 1;
          this.voteStates[id] = 'upvote';
        }
      },
      error: (err) => console.error(err),
    });
  }

  handleDownVote(id: string) {
    this.postservice.reactionPost(id, 'downvote').subscribe({
      next: () => {
        const post = this.posts.find((p) => p.id === id);
        if (!post) return;

        const currentVote = this.voteStates[id] ?? null;

        if (currentVote === 'downvote') {
          // 🔄 Bỏ downvote
          post.downvote = (post.downvote ?? 0) - 1;
          this.voteStates[id] = null;
        } else {
          // Nếu trước đó đã upvote thì bỏ upvote
          if (currentVote === 'upvote') {
            post.upvote = (post.upvote ?? 0) - 1;
          }
          // ✅ Thêm downvote
          post.downvote = (post.downvote ?? 0) + 1;
          this.voteStates[id] = 'downvote';
        }
      },
      error: (err) => console.error(err),
    });
  }

  handleInputChange(value: string | number): void {
    this.postname = value.toString();

    console.log('Input changed:', this.postname);
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

  deletePost(id: string) {
    this.postservice.deletePost(id).subscribe({
      next: () => {
        this.posts = this.posts.filter((a) => a.id !== id);
      },
      error(err) {
        console.log(err);
      },
    });
  }

  openModalDelete(id: string) {
    openModalNotification(
      this.store,
      'Xác nhận xóa',
      'Bạn có chắc chắn xóa bài viết này?',
      'Đồng ý',
      'Hủy',
      () => this.deletePost(id)
    );
  }

  handleAdd = () => {
    this.router.navigate(['/post-features/post-create']);
  };

  goToDetail = ($event: string) => {
    console.log('Navigating to post detail with ID:', $event);
    this.router.navigate(['/post-features/post-details', $event]);
  };
  // ...existing code...
}
