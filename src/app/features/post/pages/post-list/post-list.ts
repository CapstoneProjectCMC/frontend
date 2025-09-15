import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InputComponent } from '../../../../shared/components/fxdonad-shared/input/input';
import { PostCardComponent } from '../../../../shared/components/my-shared/post-card/post-card';

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
import {
  openModalNotification,
  sendNotification,
} from '../../../../shared/utils/notification';
import { checkAuthenticated } from '../../../../shared/utils/authenRoleActions';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.html',
  styleUrl: './post-list.scss',
  standalone: true,
  imports: [
    InputComponent,
    PostCardComponent,
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
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  lottieOptions = {
    path: 'assets/lottie-animation/nodata.json',
    autoplay: true,
    loop: true,
  };
  posts: PostCardInfo[] = [];
  postsraw!: PostResponse[];

  authenticated = false;

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
  pendingVote: { [postId: string]: boolean } = {};
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
    // this.tag = [
    //   { value: '1', label: 'react' },
    //   { value: '0', label: 'javascript' },
    //   { value: '2', label: 'C#' },
    //   { value: '3', label: 'java' },
    //   { value: '4', label: 'python' },
    // ];
    // // Mock data for status
    // this.status = [
    //   { value: '0', label: 'Reject' },
    //   { value: '1', label: 'Accepted' },
    //   { value: '2', label: 'Pendding' },
    // ];

    this.authenticated = checkAuthenticated();
  }

  ngOnInit(): void {
    this.fetchPostList(true);
  }

  fetchPostList(isInitialLoad = false, search = false) {
    this.isLoading = true;

    if (isInitialLoad) {
      this.isLoadingInitial = true;
    } else {
      this.isLoadingNextPage = true;
    }

    this.postservice
      .searchPosts(this.pageIndex, this.size, this.postname)
      .subscribe({
        next: (res) => {
          const newPostsRaw = res.result.data;
          this.totalPages = res.result.totalPages;

          // ✅ Chỉ map phần dữ liệu mới
          const newPosts = this.mapPostdatatoPostCardInfo(newPostsRaw);
          if (isInitialLoad) {
            this.posts = []; // reset khi load mới
          }
          if (!search) {
            this.posts.push(...newPosts); // append thêm
          } else {
            this.posts = []; // reset khi load mới
            this.posts = newPosts;
          }

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

  // thêm field quản lý loading theo post

  handleUpVote(id: string) {
    if (this.pendingVote[id]) return; // chặn spam
    const post = this.posts.find((p) => p.id === id);
    if (!post) return;
    if (!this.authenticated) {
      this.openModalNeedLogin();
      return;
    }

    const prevVote = this.voteStates[id] ?? null;
    this.pendingVote[id] = true;

    // ✅ Optimistic update
    if (prevVote === 'upvote') {
      post.upvote = Math.max((post.upvote ?? 0) - 1, 0);
      this.voteStates[id] = null;
    } else {
      if (prevVote === 'downvote') {
        post.downvote = Math.max((post.downvote ?? 0) - 1, 0);
      }
      post.upvote = (post.upvote ?? 0) + 1;
      this.voteStates[id] = 'upvote';
    }

    // Gửi request
    this.postservice.reactionPost(id, 'upvote').subscribe({
      next: () => {
        this.pendingVote[id] = false; // ✅ OK, giữ state hiện tại
      },
      error: () => {
        // ❌ Rollback
        if (prevVote === 'upvote') {
          post.upvote = (post.upvote ?? 0) + 1;
        } else {
          if (prevVote === 'downvote') {
            post.downvote = (post.downvote ?? 0) + 1;
            post.upvote = Math.max((post.upvote ?? 0) - 1, 0);
          } else {
            post.upvote = Math.max((post.upvote ?? 0) - 1, 0);
          }
        }
        this.voteStates[id] = prevVote;
        this.pendingVote[id] = false;
      },
    });
  }

  handleDownVote(id: string) {
    if (this.pendingVote[id]) return;
    const post = this.posts.find((p) => p.id === id);
    if (!post) return;
    if (!this.authenticated) {
      this.openModalNeedLogin();
      return;
    }

    const prevVote = this.voteStates[id] ?? null;
    this.pendingVote[id] = true;

    // ✅ Optimistic update
    if (prevVote === 'downvote') {
      post.downvote = Math.max((post.downvote ?? 0) - 1, 0);
      this.voteStates[id] = null;
    } else {
      if (prevVote === 'upvote') {
        post.upvote = Math.max((post.upvote ?? 0) - 1, 0);
      }
      post.downvote = (post.downvote ?? 0) + 1;
      this.voteStates[id] = 'downvote';
    }

    // Gửi request
    this.postservice.reactionPost(id, 'downvote').subscribe({
      next: () => {
        this.pendingVote[id] = false;
      },
      error: () => {
        // ❌ Rollback
        if (prevVote === 'downvote') {
          post.downvote = (post.downvote ?? 0) + 1;
        } else {
          if (prevVote === 'upvote') {
            post.upvote = (post.upvote ?? 0) + 1;
            post.downvote = Math.max((post.downvote ?? 0) - 1, 0);
          } else {
            post.downvote = Math.max((post.downvote ?? 0) - 1, 0);
          }
        }
        this.voteStates[id] = prevVote;
        this.pendingVote[id] = false;
      },
    });
  }

  handleToggleSave(postId: string) {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) return;
    if (!this.authenticated) {
      this.openModalNeedLogin();
      return;
    }

    // Nếu đang lưu thì gọi unSave
    if (post.isSaved) {
      this.postservice.unSavePost(postId).subscribe({
        next: () => {
          post.isSaved = false; // ✅ cập nhật lại trạng thái
          sendNotification(
            this.store,
            'Đã hủy lưu',
            'Bạn đã hủy lưu bài viết này',
            'success'
          );
        },
        error: (err) => {
          console.error('Unsave thất bại', err);
        },
      });
    } else {
      // Nếu chưa lưu thì gọi save
      this.postservice.savePost(postId).subscribe({
        next: () => {
          post.isSaved = true;
          sendNotification(this.store, 'Đã lưu', 'Bài viết đã lưu', 'success');
        },
        error: (err) => {
          console.error('Save thất bại', err);
        },
      });
    }
  }

  handleInputChange(value: string | number): void {
    this.isLoading = true;
    this.pageIndex = 1;

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.postname = value.toString();

    this.debounceTimer = setTimeout(() => {
      this.fetchPostList(false, true);
    }, 500); // chờ 500ms sau khi dừng gõ mới gọi
  }

  // handleSelect(dropdownKey: string, selected: any): void {
  //   // Reset toàn bộ các lựa chọn trước đó
  //   this.selectedOptions = {};

  //   // Lưu lại option vừa chọn
  //   this.selectedOptions[dropdownKey] = selected;

  //   // this.router.navigate(['/', dropdownKey, selected.label]);

  //   console.log(this.selectedOptions);
  // }

  // toggleDropdown(id: string): void {
  //   // Nếu bạn muốn chỉ mở 1 dropdown tại một thời điểm
  //   this.activeDropdown = this.activeDropdown === id ? null : id;
  // }

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

  openModalNeedLogin() {
    openModalNotification(
      this.store,
      'Chưa đăng nhập',
      'Bạn cần đăng nhập để tiếp tục',
      'Đồng ý',
      'Hủy',
      () => this.router.navigate(['/auth/identity/login'])
    );
  }

  handleAdd = () => {
    this.router.navigate(['/post-features/post-create']);
  };

  goToDetail = ($event: string) => {
    if (!this.authenticated) {
      this.openModalNeedLogin();
    } else {
      this.router.navigate(['/post-features/post-details', $event]);
    }
  };
  // ...existing code...
}
