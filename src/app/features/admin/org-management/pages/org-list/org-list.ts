import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { formatDate } from '../../../../../shared/utils/stringProcess';
import { EnumType } from '../../../../../core/models/data-handle';
import { Org, OrgStatus } from '../../../../../core/models/org.model';
import { DropdownButtonComponent } from '../../../../../shared/components/fxdonad-shared/dropdown/dropdown.component';
import { InputComponent } from '../../../../../shared/components/fxdonad-shared/input/input';
import { PaginationComponent } from '../../../../../shared/components/fxdonad-shared/pagination/pagination.component';
import { ButtonComponent } from '../../../../../shared/components/my-shared/button/button.component';
import { ProfilePopupComponent } from '../../../../../shared/components/my-shared/profile-popup/profile-popup';
import { TableComponent } from '../../../../../shared/components/my-shared/table/table.component';
import { sidebarData } from '../../../menu-router.data';
import { OrgHeaders } from './org-table-headers';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-org-list',
  templateUrl: './org-list.html',
  styleUrls: ['./org-list.scss'],
  imports: [
    TableComponent,
    NgClass,
    PaginationComponent,
    InputComponent,
    ButtonComponent,
    DropdownButtonComponent,
  ],
  standalone: true,
})
export class OrgListComponent {
  headers = OrgHeaders;
  sidebarData = sidebarData;
  isCollapsed = false;
  openedOrg: Org | null = null;
  isClosing = false;
  orgname = '';
  listId = 'org-list-2024-06-09'; // hoặc số, hoặc uuid, hoặc lấy từ backend
  // Dữ liệu JSON string

  role: { value: string; label: string }[] = [];
  status: { value: string; label: string }[] = [];
  selectedOptions: { [key: string]: any } = {};
  activeDropdown: string | null = null;
  ListOrg: Org[] = [];
  pageIndex: number = 1;
  itemsPerPage: number = 8;
  sortBy: EnumType['sort'] = 'CREATED_AT';
  asc: boolean = false;
  isLoading = false;
  isLoadingMore = false;
  hasMore = true;
  // Parse ra data cho bảng
  fakeOrgs: Org[] = [
    {
      Id: uuidv4(),
      Name: 'Trường Tiểu học Minh Khai',
      Description: 'Tổ chức giáo dục cấp tiểu học tại Hà Nội',
      Address: '123 Minh Khai, Hai Bà Trưng, Hà Nội',
      Email: 'info@minhkhai.edu.vn',
      Phone: '0243 678 9999',
      LogoUrl:
        'https://th.bing.com/th/id/R.2c4f7a51e8edc4878385151b7da3ca20?rik=89pWfK1iCs%2fMjg&riu=http%3a%2f%2fwww.designlike.com%2fwp-content%2fuploads%2f2019%2f01%2flogo-1933884.png&ehk=Ud6Bg98raER11Jr5ilm0FEqUrYQUdxvN90HyWM5SAOk%3d&risl=&pid=ImgRaw&r=0',
      Status: OrgStatus.Inactive,
    },
    {
      Id: uuidv4(),
      Name: 'Trung tâm Anh ngữ Dream Sky',
      Description: 'Trung tâm ngoại ngữ chất lượng cao',
      Address: '456 Lê Lợi, Q.1, TP.HCM',
      Email: 'contact@dreamsky.vn',
      Phone: '0283 123 4567',
      Status: OrgStatus.Pending,
      LogoUrl:
        'https://th.bing.com/th/id/R.2c4f7a51e8edc4878385151b7da3ca20?rik=89pWfK1iCs%2fMjg&riu=http%3a%2f%2fwww.designlike.com%2fwp-content%2fuploads%2f2019%2f01%2flogo-1933884.png&ehk=Ud6Bg98raER11Jr5ilm0FEqUrYQUdxvN90HyWM5SAOk%3d&risl=&pid=ImgRaw&r=0',
    },
    {
      Id: uuidv4(),
      Name: 'Trung tâm Anh ngữ Dream Sky',
      Description: 'Trung tâm ngoại ngữ chất lượng cao',
      Address: '456 Lê Lợi, Q.1, TP.HCM',
      Email: 'contact@dreamsky.vn',
      Phone: '0283 123 4567',
      Status: OrgStatus.Active,
      LogoUrl:
        'https://th.bing.com/th/id/R.2c4f7a51e8edc4878385151b7da3ca20?rik=89pWfK1iCs%2fMjg&riu=http%3a%2f%2fwww.designlike.com%2fwp-content%2fuploads%2f2019%2f01%2flogo-1933884.png&ehk=Ud6Bg98raER11Jr5ilm0FEqUrYQUdxvN90HyWM5SAOk%3d&risl=&pid=ImgRaw&r=0',
    },
    {
      Id: uuidv4(),
      Name: 'Hệ thống giáo dục Sakura',
      Description: 'Hệ thống liên cấp đào tạo theo mô hình Nhật Bản',
      Address: '789 Nguyễn Văn Cừ, Long Biên, Hà Nội',
      Email: 'admin@sakura.edu.vn',
      Phone: '0243 987 6543',
      LogoUrl:
        'https://th.bing.com/th/id/R.2c4f7a51e8edc4878385151b7da3ca20?rik=89pWfK1iCs%2fMjg&riu=http%3a%2f%2fwww.designlike.com%2fwp-content%2fuploads%2f2019%2f01%2flogo-1933884.png&ehk=Ud6Bg98raER11Jr5ilm0FEqUrYQUdxvN90HyWM5SAOk%3d&risl=&pid=ImgRaw&r=0',
      Status: OrgStatus.Inactive,
    },
  ];
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

  handlePageChange(page: number) {}
  formatDate(time: Date) {
    return formatDate(time);
  }
  onDisplayNameClick(row: Org) {
    this.openedOrg = row;
    this.isClosing = false;
  }
  closeProfilePopup() {
    this.isClosing = true;
    setTimeout(() => {
      this.openedOrg = null;
      this.isClosing = false;
    }, 200); // Thời gian đúng với animation
  }
  handletest(row: any) {}
  // ... existing code ...
  handleImport = () => {};

  handleAdd = () => {};
  // ... existing code ...
  handleInputChange(value: string | number): void {
    this.orgname = value.toString();
  }

  handleSelect(dropdownKey: string, selected: any): void {
    // Reset toàn bộ các lựa chọn trước đó
    this.selectedOptions = {};

    // Lưu lại option vừa chọn
    this.selectedOptions[dropdownKey] = selected;

    // this.router.navigate(['/', dropdownKey, selected.label]);
  }

  toggleDropdown(id: string): void {
    // Nếu bạn muốn chỉ mở 1 dropdown tại một thời điểm
    this.activeDropdown = this.activeDropdown === id ? null : id;
  }

  handleSwitch = (row: any) => {
    // Xử lý chuyển trạng thái khoá/mở khoá ở đây
  };
}
