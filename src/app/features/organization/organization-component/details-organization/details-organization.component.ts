import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrganizationInfo } from '../../../../core/models/organization.model';

@Component({
  selector: 'app-details-organization',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details-organization.component.html',
  styleUrls: ['./details-organization.component.scss'],
})
export class DetailsOrganizationComponent implements OnInit {
  organization: OrganizationInfo | null = null;
  isLoading = true;

  // Dữ liệu mẫu cho demo
  private mockOrganizations: { [key: string]: OrganizationInfo } = {
    '1': {
      id: '1',
      name: 'Fxdonad Academy',
      description: 'Tổ chức đào tạo CNTT hàng đầu Việt Nam',
      address: '123 Nguyễn Trãi, Hà Nội',
      email: 'contact@fxdonad.edu.vn',
      phone: '0123 456 789',
      logo: null,
      logoUrl: '/logo-light.svg',
      status: 0,
    },
    '2': {
      id: '2',
      name: 'Code Learners Group',
      description: 'Cộng đồng học lập trình trực tuyến',
      address: '12 Lê Lợi, Đà Nẵng',
      email: 'hello@clg.vn',
      phone: '0987 654 321',
      logo: null,
      logoUrl: null,
      status: 2,
    },
    '3': {
      id: '3',
      name: 'STEM Highschool',
      description: 'Câu lạc bộ STEM và Robotics',
      address: '45 Pasteur, TP.HCM',
      email: 'stem@school.vn',
      phone: '0909 111 222',
      logo: null,
      logoUrl: '/logo-light.svg',
      status: 1,
    },
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.loadOrganization(id);
    });
  }

  private loadOrganization(id: string) {
    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      this.organization = this.mockOrganizations[id] || null;
      this.isLoading = false;
    }, 500);
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case 0:
        return 'Hoạt động';
      case 1:
        return 'Tạm ngưng';
      case 2:
        return 'Chờ duyệt';
      default:
        return 'Không xác định';
    }
  }

  getStatusClass(status: number): string {
    switch (status) {
      case 0:
        return 'status-active';
      case 1:
        return 'status-inactive';
      case 2:
        return 'status-pending';
      default:
        return 'status-unknown';
    }
  }
}
