import { Component } from '@angular/core';
import { DropdownButtonComponent } from '../../../shared/components/fxdonad-shared/dropdown/dropdown.component';

@Component({
  selector: 'app-using-dropdown',
  imports: [DropdownButtonComponent],
  templateUrl: './using-dropdown.component.html',
  styleUrl: './using-dropdown.component.scss',
})
export class UsingDropdownComponent {
  genres: { value: string; label: string }[] = [];
  years: { value: string; label: string }[] = [];
  schedules: { value: string; label: string }[] = [];

  selectedOptions: { [key: string]: any } = {};
  activeDropdown: string | null = null;

  constructor() {
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
}
