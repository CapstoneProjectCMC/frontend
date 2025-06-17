import { Component, SimpleChanges } from '@angular/core';
import { NotificationTestComponent } from '../../../../shared/components/fxdonad-shared/notification-test/notification-test';
import { Tooltip } from '../../../../shared/components/fxdonad-shared/tooltip/tooltip';
import { CodeEditorComponent } from '../../../../shared/components/fxdonad-shared/code-editor/code-editor.component';

import { CommonModule } from '@angular/common';
import { InputComponent } from '../../../../shared/components/fxdonad-shared/input/input';
import { InteractiveButtonComponent } from '../../../../shared/components/fxdonad-shared/button/button.component';
import { DropdownButtonComponent } from '../../../../shared/components/fxdonad-shared/dropdown/dropdown.component';
import { Router } from '@angular/router';
import { TextEditor } from '../../../../shared/components/fxdonad-shared/text-editor/text-editor';

@Component({
  selector: 'app-statistics',
  imports: [
    CommonModule,
    NotificationTestComponent,
    CodeEditorComponent,
    InputComponent,
    InteractiveButtonComponent,
    DropdownButtonComponent,
    TextEditor,
  ],
  templateUrl: './statistics.html',
  styleUrl: './statistics.scss',
})
export class Statistics {
  value = '';
  username = '';
  follow = false;
  usernameError: string | null = null;
  genres: { value: string; label: string }[] = [];
  years: { value: string; label: string }[] = [];
  schedules: { value: string; label: string }[] = [];

  selectedOptions: { [key: string]: any } = {};
  activeDropdown: string | null = null;

  // Icon path - using relative path from assets
  searchIcon = '/icon-assets/search-icon.svg';

  constructor(private router: Router) {
    // Mock data for genres
    this.genres = [
      { value: 'action', label: 'Hành động' },
      { value: 'comedy', label: 'Hài hước' },
      { value: 'drama', label: 'Tâm lý' },
      { value: 'romance', label: 'Lãng mạn' },
      { value: 'horror', label: 'Kinh dị' },
      { value: 'sci-fi', label: 'Khoa học viễn tưởng' },
      { value: 'fantasy', label: 'Fantasy' },
      { value: 'slice-of-life', label: 'Đời thường' },
    ];

    // Mock data for years
    this.years = [
      { value: '2024', label: '2024' },
      { value: '2023', label: '2023' },
      { value: '2022', label: '2022' },
      { value: '2021', label: '2021' },
      { value: '2020', label: '2020' },
      { value: '2019', label: '2019' },
      { value: '2018', label: '2018' },
      { value: '2017', label: '2017' },
    ];

    // Mock data for schedules
    this.schedules = [
      { value: 'monday', label: 'Thứ 2' },
      { value: 'tuesday', label: 'Thứ 3' },
      { value: 'wednesday', label: 'Thứ 4' },
      { value: 'thursday', label: 'Thứ 5' },
      { value: 'friday', label: 'Thứ 6' },
      { value: 'saturday', label: 'Thứ 7' },
      { value: 'sunday', label: 'Chủ nhật' },
    ];
  }

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

  onClick() {
    console.log('Clicked');
    this.follow = !this.follow;
  }

  onSubmitCode() {
    console.log('Gửi bài');
  }
}
