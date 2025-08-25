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
  fakeResourceCardList: resourceCardInfo[] = [
    {
      id: '1',
      avatarAuthor: 'https://i.pravatar.cc/150?img=1',
      thumnailurl: 'https://picsum.photos/seed/video1/400/225',
      authorId: 'author-1',
      authorName: 'Nguyễn Văn A',
      progress: 20,
      title: 'Giới thiệu Angular cơ bản',
      time: new Date('2025-08-01T10:00:00'),
      duration: '10:32',
      description: 'Khoá học Angular dành cho người mới bắt đầu.',
      tags: [
        { id: 't1', name: 'Angular' },
        { id: 't2', name: 'Frontend' },
      ],
      status: 'accepted',
      public: true,
    },
    {
      id: '2',
      avatarAuthor: 'https://i.pravatar.cc/150?img=2',
      thumnailurl: 'https://picsum.photos/seed/video2/400/225',
      authorId: 'author-2',
      authorName: 'Trần Thị B',
      progress: 45,
      title: 'React Hooks chi tiết',
      time: new Date('2025-08-02T14:30:00'),
      duration: '15:20',
      description: 'Tìm hiểu useState, useEffect và custom hooks.',
      tags: [
        { id: 't3', name: 'React' },
        { id: 't4', name: 'JavaScript' },
      ],
      status: 'pending',
      public: false,
    },
    {
      id: '3',
      avatarAuthor: 'https://i.pravatar.cc/150?img=3',
      thumnailurl: 'https://picsum.photos/seed/video3/400/225',
      authorId: 'author-3',
      authorName: 'Lê Văn C',
      progress: 75,
      title: 'Node.js cơ bản',
      time: new Date('2025-08-03T09:15:00'),
      duration: '08:45',
      description: 'Hướng dẫn tạo server với Node.js và Express.',
      tags: [
        { id: 't5', name: 'Node.js' },
        { id: 't6', name: 'Backend' },
      ],
      status: 'accepted',
      public: true,
    },
    {
      id: '4',
      avatarAuthor: 'https://i.pravatar.cc/150?img=4',
      thumnailurl: 'https://picsum.photos/seed/video4/400/225',
      authorId: 'author-4',
      authorName: 'Phạm Thị D',
      progress: 10,
      title: 'TypeScript nâng cao',
      time: new Date('2025-08-04T18:00:00'),
      duration: '20:00',
      description: 'Generics, Decorators, và kiểu nâng cao.',
      tags: [{ id: 't7', name: 'TypeScript' }],
      status: 'accepted',
      public: true,
    },
    {
      id: '5',
      avatarAuthor: 'https://i.pravatar.cc/150?img=5',
      thumnailurl: 'https://picsum.photos/seed/video5/400/225',
      authorId: 'author-5',
      authorName: 'Đỗ Văn E',
      progress: 100,
      title: 'CSS Flexbox & Grid',
      time: new Date('2025-08-05T11:45:00'),
      duration: '12:10',
      description: 'Thiết kế responsive layout hiện đại.',
      tags: [
        { id: 't8', name: 'CSS' },
        { id: 't9', name: 'UI' },
      ],
      status: 'accepted',
      public: true,
    },
    {
      id: '6',
      avatarAuthor: 'https://i.pravatar.cc/150?img=6',
      thumnailurl: 'https://picsum.photos/seed/video6/400/225',
      authorId: 'author-6',
      authorName: 'Ngô Thị F',
      progress: 60,
      title: 'Python cho người mới',
      time: new Date('2025-08-06T08:20:00'),
      duration: '09:55',
      description: 'Lập trình cơ bản với Python 3.',
      tags: [
        { id: 't10', name: 'Python' },
        { id: 't11', name: 'Beginner' },
      ],
      status: 'accepted',
      public: true,
    },
    {
      id: '7',
      avatarAuthor: 'https://i.pravatar.cc/150?img=7',
      thumnailurl: 'https://picsum.photos/seed/video7/400/225',
      authorId: 'author-7',
      authorName: 'Hoàng Văn G',
      progress: 30,
      title: 'Nhập môn Machine Learning',
      time: new Date('2025-08-07T13:00:00'),
      duration: '25:40',
      description: 'Các khái niệm cơ bản của học máy.',
      tags: [
        { id: 't12', name: 'AI' },
        { id: 't13', name: 'ML' },
      ],
      status: 'pending',
      public: false,
    },
    {
      id: '8',
      avatarAuthor: 'https://i.pravatar.cc/150?img=8',
      thumnailurl: 'https://picsum.photos/seed/video8/400/225',
      authorId: 'author-8',
      authorName: 'Vũ Thị H',
      progress: 5,
      title: 'Thiết kế Database',
      time: new Date('2025-08-08T16:10:00'),
      duration: '14:25',
      description: 'Mô hình ERD và thiết kế quan hệ.',
      tags: [{ id: 't14', name: 'Database' }],
      status: 'accepted',
      public: true,
    },
    {
      id: '9',
      avatarAuthor: 'https://i.pravatar.cc/150?img=9',
      thumnailurl: 'https://picsum.photos/seed/video9/400/225',
      authorId: 'author-9',
      authorName: 'Phan Văn I',
      progress: 80,
      title: 'Git & GitHub cơ bản',
      time: new Date('2025-08-09T19:45:00'),
      duration: '18:50',
      description: 'Quản lý phiên bản với Git và GitHub.',
      tags: [
        { id: 't15', name: 'Git' },
        { id: 't16', name: 'DevOps' },
      ],
      status: 'accepted',
      public: true,
    },
    {
      id: '10',
      avatarAuthor: 'https://i.pravatar.cc/150?img=10',
      thumnailurl: 'https://picsum.photos/seed/video10/400/225',
      authorId: 'author-10',
      authorName: 'Nguyễn Thị K',
      progress: 50,
      title: 'UI/UX Design Principles',
      time: new Date('2025-08-10T07:30:00'),
      duration: '22:15',
      description: 'Nguyên tắc cơ bản để thiết kế trải nghiệm tốt hơn.',
      tags: [{ id: 't17', name: 'UI/UX' }],
      status: 'accepted',
      public: true,
    },
  ];
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
