import { Component, SimpleChanges } from '@angular/core';
import { NotificationTestComponent } from '../../../../shared/components/fxdonad-shared/notification-test/notification-test';
import { Tooltip } from '../../../../shared/components/fxdonad-shared/tooltip/tooltip';
import { CodeEditorComponent } from '../../../../shared/components/fxdonad-shared/code-editor/code-editor.component';

import { CommonModule } from '@angular/common';
import { InputComponent } from '../../../../shared/components/fxdonad-shared/input/input';
import { InteractiveButtonComponent } from '../../../../shared/components/fxdonad-shared/button/button.component';
import { DropdownButtonComponent } from '../../../../shared/components/fxdonad-shared/dropdown/dropdown.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-statistics',
  imports: [
    CommonModule,
    NotificationTestComponent,
    CodeEditorComponent,
    InputComponent,
    InteractiveButtonComponent,
    DropdownButtonComponent,
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

  constructor(private router: Router) {}

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

    this.router.navigate(['/quick-search', dropdownKey, selected.label]);

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
