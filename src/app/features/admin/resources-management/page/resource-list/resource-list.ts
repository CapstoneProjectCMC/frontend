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
  resources: resourceCardInfo[] = [
    {
      id: '1',
      avatarAuthor: 'https://i.pravatar.cc/100?img=1',
      authorId: 'u001',
      authorName: 'Fxdonad',
      fileResource: new File([''], 'intro-video.mp4', { type: 'video/mp4' }),
      progress: 1,
      title: 'Video giới thiệu CodeCampus',
      time: new Date('2025-06-24'),
      description: 'Video mở đầu giới thiệu nền tảng CodeCampus.',
      tags: ['document', 'tutorial', 'video'],
      status: 'accepted',
      public: true,
    },
    {
      id: '2',
      avatarAuthor: 'https://i.pravatar.cc/100?img=2',
      authorId: 'u002',
      authorName: 'Nguyễn Văn A',
      fileResource: new File([''], 'hdsd-pdf.pdf', { type: 'application/pdf' }),
      progress: 3,
      title: 'Tài liệu hướng dẫn bật PDF thumbnail',
      time: new Date('2025-06-25'),
      description:
        'Hướng dẫn bật chế độ hiển thị thumbnail cho file PDF trên Windows.',
      tags: ['PDF', 'document', 'guide'],
      status: 'accepted',
      public: true,
    },
    {
      id: '3',
      avatarAuthor: 'https://i.pravatar.cc/100?img=3',
      authorId: 'u003',
      authorName: 'Lê Thị B',
      fileResource: new File([''], 'bao-cao.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      }),
      progress: 4,
      title: 'Báo cáo kết quả học tập',
      time: new Date('2025-07-01'),
      description: 'Báo cáo Word tổng kết điểm và tiến độ học tập.',
      tags: ['Word', 'document', 'report'],
      status: 'accepted',
      public: true,
    },
    {
      id: '4',
      avatarAuthor: 'https://i.pravatar.cc/100?img=4',
      authorId: 'u004',
      authorName: 'Trần Văn C',
      fileResource: new File([''], 'poster.png', { type: 'image/png' }),
      progress: 3,
      title: 'Poster quảng bá sự kiện',
      time: new Date('2025-07-05'),
      description: 'Poster PNG dùng để giới thiệu sự kiện Code Hackathon.',
      tags: ['image', 'event', 'poster'],
      status: 'accepted',
      public: true,
    },
  ];
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
  constructor(private router: Router) {
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
