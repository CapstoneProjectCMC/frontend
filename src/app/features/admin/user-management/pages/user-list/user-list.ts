import { Component } from '@angular/core';
import { TableComponent } from '../../../../../shared/components/my-shared/table/table.component';
import { userHeaders } from './user-table-headers';
import { formatDate } from '../../../../../shared/utils/stringProcess';
import { NgClass, NgIf } from '@angular/common';
import { sidebarData } from '../../../menu-router.data';
import { PaginationComponent } from '../../../../../shared/components/fxdonad-shared/pagination/pagination.component';
import { ProfilePopupComponent } from '../../../../../shared/components/my-shared/profile-popup/profile-popup';
import { InputComponent } from '../../../../../shared/components/fxdonad-shared/input/input';
import { ButtonComponent } from '../../../../../shared/components/my-shared/button/button.component';
import { DropdownButtonComponent } from '../../../../../shared/components/fxdonad-shared/dropdown/dropdown.component';
import { User } from '../../../../../core/models/user.models';
import { UserService } from '../../../../../core/services/api-service/user.service';
import { EnumType } from '../../../../../core/models/data-handle';
import { sendNotification } from '../../../../../shared/utils/notification';
import { clearLoading } from '../../../../../shared/store/loading-state/loading.action';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.scss'],
  imports: [
    TableComponent,
    NgIf,
    NgClass,
    PaginationComponent,
    ProfilePopupComponent,
    InputComponent,
    ButtonComponent,
    DropdownButtonComponent,
  ],
  standalone: true,
})
export class UserListComponent {
  headers = userHeaders;
  sidebarData = sidebarData;
  isCollapsed = false;
  openedUser: User | null = null;
  isClosing = false;
  username = '';
  listId = 'user-list-2024-06-09'; // hoặc số, hoặc uuid, hoặc lấy từ backend
  // Dữ liệu JSON string
  dataJson = `[
    {
      "id": 1,
      "displayName": "nguyenvana",
      "avatarUrl": "https://randomuser.me/api/portraits/men/1.jpg",
      "backgroundUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      "dob": "2020-01-01T00:00:00.000Z",
      "role": 0,
      "status": 1,
      "org": "Trường Đại học ABC",
      "links": [
        { "type": "facebook", "url": "https://facebook.com/nguyenvana" },
        { "type": "github", "url": "https://github.com/nguyenvana" }
      ],
      "followers": 120000000000000,
      "following": 80,
      "bio": "Yêu thích lập trình, thích chia sẻ kiến thức.",
      "firstname": "Nguyen",
      "lastname": "Van A",
      "education": "Đại học ABC",
      "gender": "Nam"
    },
    {
      "id": 2,
      "displayName": "tranthib",
      "avatarUrl": "https://randomuser.me/api/portraits/women/2.jpg",
      "backgroundUrl": "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
      "dob": "2020-01-01T00:00:00.000Z",
      "role": 2,
      "status": 0,
      "org": "Trường Đại học XYZ",
      "links": [],
      "followers": 200,
      "following": 150,
      "bio": "Giáo viên Toán, đam mê dạy học.",
      "firstname": "Tran",
      "lastname": "Thi B",
      "education": "Đại học XYZ",
      "gender": "Nữ"
    }
  ]`;
  role: { value: string; label: string }[] = [];
  status: { value: string; label: string }[] = [];
  selectedOptions: { [key: string]: any } = {};
  activeDropdown: string | null = null;
  ListUser: User[] = [];
  pageIndex: number = 1;
  itemsPerPage: number = 8;
  sortBy: EnumType['sort'] = 'CREATED_AT';
  asc: boolean = false;
  isLoading = false;
  isLoadingMore = false;
  hasMore = true;
  // Parse ra data cho bảng

  constructor(private userService: UserService, private store: Store) {
    // Mock data for role
    this.role = [
      { value: '1', label: 'Học sinh' },
      { value: '0', label: 'Quản trị viên' },
      { value: '2', label: 'Giá viên' },
      { value: '3', label: 'Quản trị viên tổ chức' },
      { value: '4', label: 'Phụ huynh' },
    ];

    // Mock data for status
    this.status = [
      { value: '0', label: 'Block' },
      { value: '1', label: 'Acctive' },
    ];
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.userService
      .getAllUser(this.pageIndex, this.itemsPerPage, this.sortBy, this.asc)
      .subscribe({
        next: (res) => {
          this.ListUser = res.result.data;
          if (this.ListUser.length < this.itemsPerPage) {
            this.hasMore = false;
          }
          sendNotification(
            this.store,
            'Thành công',
            'Lấy danh sách người dùng thành công',
            'success'
          );
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
  handlePageChange(page: number) {
    console.log('chuyển trang');
  }
  formatDate(time: Date) {
    return formatDate(time);
  }
  onDisplayNameClick(row: User) {
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
  // ... existing code ...
  handleImport = () => {
    console.log('Import button clicked, listId:', this.listId);
  };

  handleAdd = () => {
    console.log('Add button clicked, listId:', this.listId);
  };
  // ... existing code ...
  handleInputChange(value: string | number): void {
    this.username = value.toString();

    console.log('Input changed:', this.username);
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

  handleSwitch = (row: any) => {
    // Xử lý chuyển trạng thái khoá/mở khoá ở đây
    console.log('Switch clicked for user id:', row.id, 'status:', row.status);
  };
}
