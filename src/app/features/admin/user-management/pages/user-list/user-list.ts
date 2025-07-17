import { Component } from '@angular/core';
import { BreadcrumbComponent } from '../../../../../shared/components/my-shared/breadcum/breadcrumb/breadcrumb.component';
import { TableComponent } from '../../../../../shared/components/my-shared/table/table.component';
import { userHeaders } from './user-table-headers';
import {
  formatDate,
  formatDateToDDMMYYYY,
} from '../../../../../shared/utils/stringProcess';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { TableFormatViewPipe } from '../../../../../shared/pipes/table-formatview';
import { MainSidebarComponent } from '../../../../../shared/components/fxdonad-shared/main-sidebar/main-sidebar.component';
import { sidebarData } from '../../../menu-router.data';
import { PaginationComponent } from '../../../../../shared/components/fxdonad-shared/pagination/pagination.component';
import { ProfilePopupComponent } from '../../../../../shared/components/my-shared/profile-popup/profile-popup';
import { UserInfor } from '../../../../../shared/components/my-shared/profile-popup/profile-popup';
import { InputComponent } from '../../../../../shared/components/fxdonad-shared/input/input';
import { InteractiveButtonComponent } from '../../../../../shared/components/fxdonad-shared/button/button.component';
import { ButtonComponent } from '../../../../../shared/components/my-shared/button/button.component';
import { DropdownButtonComponent } from '../../../../../shared/components/fxdonad-shared/dropdown/dropdown.component';

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
  openedUser: UserInfor | null = null;
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
  // Parse ra data cho bảng
  data = JSON.parse(this.dataJson).map((u: any) => ({
    ...u,
    dob: new Date(u.dob),
  }));
  constructor() {
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

  handlePageChange(page: number) {
    console.log('chuyển trang');
  }
  formatDate(time: Date) {
    return formatDate(time);
  }
  onDisplayNameClick(row: UserInfor) {
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

    // // Validate input
    // if (!this.username) {
    //   this.usernameError = 'Không được để trống';
    // } else if (this.username.length < 3) {
    //   this.usernameError = 'Tối thiểu 3 ký tự';
    // } else {
    //   this.usernameError = null;
    // }

    // Emit changes if needed
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
