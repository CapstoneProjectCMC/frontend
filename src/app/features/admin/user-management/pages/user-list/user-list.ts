import { Component } from '@angular/core';
import { BreadcrumbComponent } from '../../../../../shared/components/my-shared/breadcum/breadcrumb/breadcrumb.component';
import { TableComponent } from '../../../../../shared/components/my-shared/table/table.component';
import { userHeaders } from './user-table-headers';
import { formatDateToDDMMYYYY } from '../../../../../shared/utils/stringProcess';
import { NgFor, NgIf } from '@angular/common';
import { TableFormatViewPipe } from '../../../../../shared/pipes/table-formatview';
import { MainSidebarComponent } from '../../../../../shared/components/fxdonad-shared/main-sidebar/main-sidebar.component';
import { sidebarData } from '../../../menu-router.data';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.scss'],
  imports: [
    BreadcrumbComponent,
    TableComponent,
    NgIf,
    NgFor,
    TableFormatViewPipe,
    MainSidebarComponent,
  ],
  standalone: true,
})
export class UserListComponent {
  headers = userHeaders;
  sidebarData = sidebarData;
  isCollapsed = false;
  data = [
    {
      displayName: 'nguyenvana',
      avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
      dob: new Date(), // timestamp kiểu Instant
      role: 0,
      status: 1,
      org: 'Trường Đại học ABC',
      links: [
        { type: 'facebook', url: 'https://facebook.com/nguyenvana' },
        { type: 'github', url: 'https://github.com/nguyenvana' },
      ],
    },
    {
      displayName: 'tranthib',
      avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
      dob: new Date(),
      role: 2,
      status: 0,
      org: 'Trường Đại học XYZ',
      links: [{ type: 'facebook', url: 'https://facebook.com/tranthib' }],
    },
  ];
}
