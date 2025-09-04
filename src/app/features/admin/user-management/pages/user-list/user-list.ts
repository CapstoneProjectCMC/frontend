import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { Store } from '@ngrx/store';

import { TableComponent } from '../../../../../shared/components/my-shared/table/table.component';
import { PaginationComponent } from '../../../../../shared/components/fxdonad-shared/pagination/pagination.component';
import { ProfilePopupComponent } from '../../../../../shared/components/my-shared/profile-popup/profile-popup';
import { InputComponent } from '../../../../../shared/components/fxdonad-shared/input/input';
import { ButtonComponent } from '../../../../../shared/components/my-shared/button/button.component';
import { DropdownButtonComponent } from '../../../../../shared/components/fxdonad-shared/dropdown/dropdown.component';
import { SkeletonLoadingComponent } from '../../../../../shared/components/fxdonad-shared/skeleton-loading/skeleton-loading.component';

import { userHeaders } from './user-table-headers';
import { sidebarData } from '../../../menu-router.data';
import { formatDate } from '../../../../../shared/utils/stringProcess';

import {
  SearchUserProfileResponse,
  User,
} from '../../../../../core/models/user.models';
import { EnumType } from '../../../../../core/models/data-handle';
import { UserService } from '../../../../../core/services/api-service/user.service';
import { clearLoading } from '../../../../../shared/store/loading-state/loading.action';
import { CreateUserModalComponent } from '../../modal/create-user-modal/create-user-modal.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.scss'],
  imports: [
    TableComponent,
    NgClass,
    PaginationComponent,
    ProfilePopupComponent,
    InputComponent,
    ButtonComponent,
    DropdownButtonComponent,
    SkeletonLoadingComponent,
    CreateUserModalComponent,
  ],
  standalone: true,
})
export class UserListComponent {
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  headers = userHeaders;
  sidebarData = sidebarData;
  isOpenCreateUser = false;

  // UI State
  isCollapsed = false;
  openedUser: SearchUserProfileResponse | null = null;
  isClosing = false;
  usernameSearch = '';
  activeDropdown: string | null = null;

  // Filtering
  filterRoleKey = 'role';
  filterStatusKey = 'status';
  roleSelected = '';
  statusSelected = '';
  selectedOptions: { [key: string]: any } = {};

  // Data
  listId = 'user-list-2024-06-09'; // hoặc số, hoặc uuid, hoặc lấy từ backend
  ListUser: SearchUserProfileResponse[] = [];

  //   {
  //     "id": 1,
  //     "displayName": "nguyenvana",
  //     "avatarUrl": "https://randomuser.me/api/portraits/men/1.jpg",
  //     "backgroundUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  //     "dob": "2020-01-01T00:00:00.000Z",
  //     "role": 0,
  //     "status": 1,
  //     "org": "Trường Đại học ABC",
  //     "links": [
  //       { "type": "facebook", "url": "https://facebook.com/nguyenvana" },
  //       { "type": "github", "url": "https://github.com/nguyenvana" }
  //     ],
  //     "followers": 120000000000000,
  //     "following": 80,
  //     "bio": "Yêu thích lập trình, thích chia sẻ kiến thức.",
  //     "firstname": "Nguyen",
  //     "lastname": "Van A",
  //     "education": "Đại học ABC",
  //     "gender": "Nam"
  //   },
  //   {
  //     "id": 2,
  //     "displayName": "tranthib",
  //     "avatarUrl": "https://randomuser.me/api/portraits/women/2.jpg",
  //     "backgroundUrl": "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
  //     "dob": "2020-01-01T00:00:00.000Z",
  //     "role": 2,
  //     "status": 0,
  //     "org": "Trường Đại học XYZ",
  //     "links": [],
  //     "followers": 200,
  //     "following": 150,
  //     "bio": "Giáo viên Toán, đam mê dạy học.",
  //     "firstname": "Tran",
  //     "lastname": "Thi B",
  //     "education": "Đại học XYZ",
  //     "gender": "Nữ"
  //   }
  // ]`;

  // Pagination
  pageIndex: number = 1;
  itemsPerPage: number = 8;
  sortBy: EnumType['sort'] = 'CREATED_AT';
  asc: boolean = false;
  hasMore = true;

  // Loading
  isLoading = false;
  isLoadingMore = false;

  // Filters
  role: { value: string; label: string }[] = [];
  status: { value: string; label: string }[] = [];

  constructor(private userService: UserService, private store: Store) {
    // Mock data for role
    this.role = [
      { value: 'STUDENT', label: 'Học sinh' },
      { value: 'ADMIN', label: 'Quản trị viên' },
      { value: 'TEACHER', label: 'Giáo viên' },
      { value: 'ORG_ADMIN', label: 'Quản trị viên tổ chức' },
    ];

    // Mock data for status
    this.status = [
      { value: 'false', label: 'Block' },
      { value: 'true', label: 'Acctive' },
    ];
  }

  // Lifecycle
  ngOnInit(): void {
    this.fetchDataListUser();
  }

  reloadData() {
    this.pageIndex = 1;
    this.fetchDataListUser();
  }

  // Data fetch
  fetchDataListUser() {
    this.isLoading = true;
    this.userService
      .searchUserProfile(this.pageIndex, this.itemsPerPage, {
        q: this.usernameSearch,
        roles: this.roleSelected ? this.roleSelected : null,
        active:
          this.statusSelected === 'true'
            ? true
            : this.statusSelected === 'false'
            ? false
            : null,
      })
      .subscribe({
        next: (res) => {
          this.ListUser = res.result.data;
          if (this.ListUser.length < this.itemsPerPage) {
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

  // Handlers
  handlePageChange(page: number) {
    console.log('chuyển trang');
  }

  handleImport = () => {
    console.log('Import button clicked, listId:', this.listId);
  };

  handleAdd = () => {
    this.isOpenCreateUser = !this.isOpenCreateUser;
  };

  handleInputChange(value: string | number): void {
    this.isLoading = true;
    this.pageIndex = 1;

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.usernameSearch = value.toString();

    this.debounceTimer = setTimeout(() => {
      this.fetchDataListUser();
    }, 500); // chờ 500ms sau khi dừng gõ mới gọi
  }

  handleSelect(dropdownKey: string, selected: any): void {
    // Reset toàn bộ các lựa chọn trước đó
    this.selectedOptions = {};

    // Lưu lại option vừa chọn
    this.selectedOptions[dropdownKey] = selected;

    if (dropdownKey === this.filterRoleKey) {
      this.roleSelected = this.filterData(dropdownKey);
    } else if (dropdownKey === this.filterStatusKey) {
      this.statusSelected = this.filterData(dropdownKey);
    } else {
      console.log('filter không khả dụng: ', dropdownKey);
    }

    this.fetchDataListUser();
  }

  handleSwitch = (row: any) => {
    console.log('Switch clicked for user id:', row.id, 'status:', row.status);
  };

  onDisplayNameClick(row: SearchUserProfileResponse) {
    this.openedUser = row;
    this.isClosing = false;
  }

  closeProfilePopup() {
    this.isClosing = true;
    setTimeout(() => {
      this.openedUser = null;
      this.isClosing = false;
    }, 200); // Thời gian đúng với animation
  }

  handletest(row: any) {
    console.log(row);
  }

  toggleDropdown(id: string): void {
    this.activeDropdown = this.activeDropdown === id ? null : id;
  }

  // Utils
  formatDate(time: Date) {
    return formatDate(time);
  }

  filterData(keyMap: string) {
    const values: string[] = [];

    Object.keys(this.selectedOptions)
      .filter((key) => key === keyMap)
      .forEach((key) => {
        const selected = this.selectedOptions[key];

        if (Array.isArray(selected)) {
          values.push(...selected.map((opt) => opt.value));
        } else if (selected) {
          values.push(selected.value);
        }
      });

    return values.join(', ');
  }
}
