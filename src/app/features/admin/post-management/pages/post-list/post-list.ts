import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InputComponent } from '../../../../../shared/components/fxdonad-shared/input/input';
import { DropdownButtonComponent } from '../../../../../shared/components/fxdonad-shared/dropdown/dropdown.component';
import { ButtonComponent } from '../../../../../shared/components/my-shared/button/button.component';
import { PostCardComponent } from '../../../../../shared/components/my-shared/post-card/post-card';
import { NgFor, NgIf } from '@angular/common';
import {
  PostCardInfo,
  postData,
  PostResponse,
} from '../../../../../core/models/post.models';
import { PaginationComponent } from '../../../../../shared/components/fxdonad-shared/pagination/pagination.component';
import {
  PopularContentComponent,
  TagInfo,
} from '../../component/popular-content/popular-content';
import { PopularPostComponent } from '../../component/popular-post/popular-post';
import { SkeletonLoadingComponent } from '../../../../../shared/components/fxdonad-shared/skeleton-loading/skeleton-loading.component';
import { Router } from '@angular/router';
import {
  TrendingComponent,
  TrendingItem,
} from '../../../../../shared/components/fxdonad-shared/trending/trending.component';
import { PostService } from '../../../../../core/services/api-service/post.service';
import { Store } from '@ngrx/store';
import { clearLoading } from '../../../../../shared/store/loading-state/loading.action';
import { mapPostdatatoPostCardInfo } from '../../../../../shared/utils/mapData';
import { LottieComponent, provideLottieOptions } from 'ngx-lottie';
import { ScrollEndDirective } from '../../../../../shared/directives/scroll-end.directive';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.html',
  styleUrl: './post-list.scss',
  standalone: true,
  imports: [
    InputComponent,
    DropdownButtonComponent,
    ButtonComponent,
    PostCardComponent,
    NgFor,
    NgIf,
    PopularPostComponent,
    SkeletonLoadingComponent,
    TrendingComponent,
    LottieComponent,
    ScrollEndDirective,
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
  posts: PostCardInfo[] = [
    // {
    //   id: '1',
    //   avatar: 'https://example.com/avatar1.png',
    //   author: 'John Doe',
    //   title: 'Introduction to React',
    //   time: '2025-07-20T10:00:00',
    //   description:
    //     'A beginner’s guide dddddddddddddđto React and its core concepts.',
    //   tags: ['react', 'javascript'],
    //   comment: 15,
    //   upvote: 25,
    //   downvote: 2,
    //   status: 'Accepted',
    //   public: true,
    // },
    // {
    //   id: '2',
    //   avatar: 'https://example.com/avatar2.png',
    //   author: 'Jane Smith',
    //   title: 'Advanced JavaScript Patterns',
    //   time: '2025-07-19T14:30:00',
    //   description: 'Exploring advanced JavaScript design patterns.',
    //   tags: ['javascript', 'design-patterns'],
    //   comment: 8,
    //   upvote: 30,
    //   downvote: 1,
    //   status: 'Pending',
    //   public: true,
    // },
    // {
    //   id: '3',
    //   avatar: 'https://example.com/avatar3.png',
    //   author: 'Alice Johnson',
    //   title: 'C# for Beginners',
    //   time: '2025-07-18T09:15:00',
    //   description: 'Learn the basics of C# programming.',
    //   tags: ['C#', 'programming'],
    //   comment: 12,
    //   upvote: 18,
    //   downvote: 3,
    //   status: 'Accepted',
    //   public: false,
    // },
    // {
    //   id: '4',
    //   avatar: 'https://example.com/avatar4.png',
    //   author: 'Bob Wilson',
    //   title: 'Java Concurrency',
    //   time: '2025-07-17T16:45:00',
    //   description: 'Understanding concurrency in Java.',
    //   tags: ['java', 'concurrency'],
    //   comment: 20,
    //   upvote: 40,
    //   downvote: 5,
    //   status: 'Rejected',
    //   public: true,
    // },
    // {
    //   id: '5',
    //   avatar: 'https://example.com/avatar5.png',
    //   author: 'Emma Davis',
    //   title: 'Python Data Analysis',
    //   time: '2025-07-16T11:20:00',
    //   description: 'Using Python for data analysis with Pandas.',
    //   tags: ['python', 'data-analysis'],
    //   comment: 25,
    //   upvote: 35,
    //   downvote: 0,
    //   status: 'Accepted',
    //   public: true,
    // },
    // {
    //   id: '6',
    //   avatar: 'https://example.com/avatar6.png',
    //   author: 'Michael Brown',
    //   title: 'React Hooks Tutorial',
    //   time: '2025-07-15T08:00:00',
    //   description: 'Mastering React Hooks for state management.',
    //   tags: ['react', 'hooks'],
    //   comment: 10,
    //   upvote: 22,
    //   downvote: 4,
    //   status: 'Pending',
    //   public: false,
    // },
    // {
    //   id: '7',
    //   avatar: 'https://example.com/avatar7.png',
    //   author: 'Sarah Taylor',
    //   title: 'Java Spring Boot',
    //   time: '2025-07-14T13:10:00',
    //   description: 'Building REST APIs with Spring Boot.',
    //   tags: ['java', 'spring-boot'],
    //   comment: 18,
    //   upvote: 28,
    //   downvote: 2,
    //   status: 'Accepted',
    //   public: true,
    // },
    // {
    //   id: '8',
    //   avatar: 'https://example.com/avatar8.png',
    //   author: 'David Lee',
    //   title: 'JavaScript ES6 Features',
    //   time: '2025-07-13T17:50:00',
    //   description: 'Exploring new features in ES6.',
    //   tags: ['javascript', 'es6'],
    //   comment: 14,
    //   upvote: 19,
    //   downvote: 1,
    //   status: 'Accepted',
    //   public: true,
    // },
    // {
    //   id: '9',
    //   avatar: 'https://example.com/avatar9.png',
    //   author: 'Laura Martinez',
    //   title: 'C# ASP.NET Core',
    //   time: '2025-07-12T12:30:00',
    //   description: 'Creating web apps with ASP.NET Core.',
    //   tags: ['C#', 'asp-net'],
    //   comment: 22,
    //   upvote: 33,
    //   downvote: 3,
    //   status: 'Pending',
    //   public: false,
    // },
    // {
    //   id: '10',
    //   avatar: 'https://example.com/avatar10.png',
    //   author: 'Chris Evans',
    //   title: 'Python Flask Tutorial',
    //   time: '2025-07-11T15:00:00',
    //   description: 'Building web apps with Flask.',
    //   tags: ['python', 'flask'],
    //   comment: 16,
    //   upvote: 27,
    //   downvote: 2,
    //   status: 'Accepted',
    //   public: true,
    // },
  ];
  postsraw!: PostResponse[];
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
  postname = '';
  tag: { value: string; label: string }[] = [];
  status: { value: string; label: string }[] = [];
  selectedOptions: { [key: string]: any } = {};
  activeDropdown: string | null = null;
  pageIndex: number;
  itemsPerPage: number;
  constructor(
    private router: Router,
    private postservice: PostService,
    private store: Store
  ) {
    this.pageIndex = 1;
    this.itemsPerPage = 10;
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
    this.fetchPostList();
  }

  fetchPostList() {
    this.postservice.getPosts(this.pageIndex, this.itemsPerPage).subscribe({
      next: (res) => {
        this.postsraw = res.result.data;
        if (this.postsraw.length < this.itemsPerPage) {
          this.hasMore = false;
        }
        this.isLoading = false;
        this.store.dispatch(clearLoading());
        this.posts = this.postsraw.map((p) => mapPostdatatoPostCardInfo(p));
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
        this.store.dispatch(clearLoading());
      },
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
  handleAdd = () => {
    this.router.navigate(['/post-management/post-create']);
  };
  handlePageChange(page: number) {
    console.log('chuyển trang');
  }

  goToDetail = (postId: string) => {
    console.log('Navigating to post detail with ID:', postId);
    this.router.navigate(['/post-management/post', postId]);
  };
  // ...existing code...
}
