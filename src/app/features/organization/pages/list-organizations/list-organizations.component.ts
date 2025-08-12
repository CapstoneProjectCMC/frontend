import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationInfo } from '../../../../core/models/organization.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-organizations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-organizations.component.html',
  styleUrls: ['./list-organizations.component.scss'],
})
export class ListOrganizationsComponent {
  organizations: Array<OrganizationInfo> = [
    {
      id: '1',
      name: 'Fxdonad Academy',
      description: 'Tổ chức đào tạo CNTT',
      address: '123 Nguyễn Trãi, Hà Nội',
      email: 'contact@fxdonad.edu.vn',
      phone: '0123 456 789',
      logo: null,
      logoUrl: '/logo-light.svg',
      status: 0,
    },
    {
      id: '2',
      name: 'Code Learners Group',
      description: null,
      address: '12 Lê Lợi, Đà Nẵng',
      email: 'hello@clg.vn',
      phone: '0987 654 321',
      logo: null,
      logoUrl: null,
      status: 2,
    },
    {
      id: '3',
      name: 'STEM Highschool',
      description: 'Câu lạc bộ STEM',
      address: '45 Pasteur, TP.HCM',
      email: 'stem@school.vn',
      phone: '0909 111 222',
      logo: null,
      logoUrl: '/logo-light.svg',
      status: 1,
    },
    {
      id: '3',
      name: 'STEM Highschool',
      description: 'Câu lạc bộ STEM',
      address: '45 Pasteur, TP.HCM',
      email: 'stem@school.vn',
      phone: '0909 111 222',
      logo: null,
      logoUrl: '/logo-light.svg',
      status: 1,
    },
    {
      id: '3',
      name: 'STEM Highschool',
      description: 'Câu lạc bộ STEM',
      address: '45 Pasteur, TP.HCM',
      email: 'stem@school.vn',
      phone: '0909 111 222',
      logo: null,
      logoUrl: '/logo-light.svg',
      status: 1,
    },
    {
      id: '3',
      name: 'STEM Highschool',
      description: 'Câu lạc bộ STEM',
      address: '45 Pasteur, TP.HCM',
      email: 'stem@school.vn',
      phone: '0909 111 222',
      logo: null,
      logoUrl: '/logo-light.svg',
      status: 1,
    },
    {
      id: '3',
      name: 'STEM Highschool',
      description: 'Câu lạc bộ STEM',
      address: '45 Pasteur, TP.HCM',
      email: 'stem@school.vn',
      phone: '0909 111 222',
      logo: null,
      logoUrl: '/logo-light.svg',
      status: 1,
    },
    {
      id: '3',
      name: 'STEM Highschool',
      description: 'Câu lạc bộ STEM',
      address: '45 Pasteur, TP.HCM',
      email: 'stem@school.vn',
      phone: '0909 111 222',
      logo: null,
      logoUrl: '/logo-light.svg',
      status: 1,
    },
    {
      id: '3',
      name: 'STEM Highschool',
      description: 'Câu lạc bộ STEM',
      address: '45 Pasteur, TP.HCM',
      email: 'stem@school.vn',
      phone: '0909 111 222',
      logo: null,
      logoUrl: '/logo-light.svg',
      status: 1,
    },
    {
      id: '3',
      name: 'STEM Highschool',
      description: 'Câu lạc bộ STEM',
      address: '45 Pasteur, TP.HCM',
      email: 'stem@school.vn',
      phone: '0909 111 222',
      logo: null,
      logoUrl: '/logo-light.svg',
      status: 1,
    },
    {
      id: '3',
      name: 'STEM Highschool',
      description: 'Câu lạc bộ STEM',
      address: '45 Pasteur, TP.HCM',
      email: 'stem@school.vn',
      phone: '0909 111 222',
      logo: null,
      logoUrl: '/logo-light.svg',
      status: 1,
    },
    {
      id: '3',
      name: 'STEM Highschool',
      description: 'Câu lạc bộ STEM',
      address: '45 Pasteur, TP.HCM',
      email: 'stem@school.vn',
      phone: '0909 111 222',
      logo: null,
      logoUrl: '/logo-light.svg',
      status: 1,
    },
  ];

  constructor(private router: Router) {}

  onClick(id: string) {
    this.router.navigate(['/organization/details', id]);
  }

  mapStatusToLabel(status: number): string {
    switch (status) {
      case 0:
        return 'Active';
      case 1:
        return 'Inactive';
      case 2:
        return 'Pending';
      default:
        return 'Unknown';
    }
  }
}
