import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonComponent } from '../../../../../shared/components/my-shared/button/button.component';
import { formatDate } from '../../../../../shared/utils/stringProcess';
import { User } from '../../../../../core/models/user.models';
import { InputComponent } from '../../../../../shared/components/fxdonad-shared/input/input';
import { DropdownButtonComponent } from '../../../../../shared/components/fxdonad-shared/dropdown/dropdown.component';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../../../core/services/api-service/profile.service';
import { ProvinceService } from '../../../../../core/services/api-service/province.service';
import { Observable } from 'rxjs';
import { sendNotification } from '../../../../../shared/utils/notification';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.html',
  styleUrls: ['./update-profile.scss'],
  standalone: true,
  imports: [
    NgFor,
    DropdownButtonComponent,
    NgClass,
    InputComponent,
    FormsModule,
    ButtonComponent,
    NgIf,
  ],
})
export class UpdateProfileComponent {
  @Input() user!: User;
  @Input() variant: 'personal' | 'other' | 'popup' = 'popup';
  @Input() onClickEdit?: () => void;

  /** Các danh sách chọn */
  education: { value: string; label: string }[] = [];
  gender: { value: string; label: string }[] = [];

  /** Biến chứa dữ liệu người dùng đã chọn/nhập */
  displayName: string = '';
  firstName: string = '';
  lastName: string = '';
  selectedEducation: any = null;
  selectedGender: any = null;
  dob: string = ''; // ngày sinh dạng string để bind với datetime-local
  bio: string = '';
  cities: { value: string; label: string }[] = [];
  selectedCity: string = '';

  /** Upload ảnh */
  avatarFile: File | null = null;
  backgroundFile: File | null = null;

  /** Link mạng xã hội */
  isAddingLink = false;
  newLink = '';
  links: string[] = [];
  activeDropdown: string | null = null;

  constructor(
    private profileService: ProfileService,
    private provinceService: ProvinceService
  ) {
    // dữ liệu dropdown mẫu
    this.education = [
      { value: '1', label: 'lớp 1' },
      { value: '2', label: 'lớp 2' },
      { value: '3', label: 'lớp 3' },
      { value: '4', label: 'lớp 4' },
      { value: '5', label: 'lớp 5' },
      { value: '6', label: 'lớp 6' },
      { value: '7', label: 'lớp 7' },
      { value: '8', label: 'lớp 8' },
      { value: '9', label: 'lớp 9' },
      { value: '10', label: 'lớp 10' },
      { value: '11', label: 'lớp 11' },
      { value: '12', label: 'lớp 12' },
      { value: '13', label: 'Đại học' },
      { value: '14', label: 'Cao đẳng' },
      { value: '15', label: 'Khác' },
    ];

    this.gender = [
      { value: 'true', label: 'Nam' },
      { value: 'false', label: 'Nữ' },
    ];
  }

  ngOnInit() {
    if (this.user) {
      this.displayName = this.user.displayName || '';
      this.links = [...(this.user.links || [])];
      this.selectedCity = this.user.city || '';
    }

    // gọi API lấy danh sách tỉnh
    this.provinceService.getProvinces().subscribe((data) => {
      this.cities = data.map((item) => ({
        value: item.name, // Hoặc dùng item.code nếu BE yêu cầu
        label: item.name,
      }));
    });
  }

  formatDate(time: Date) {
    return formatDate(time);
  }

  handleInputChange(field: string, value: string | number) {
    if (field === 'displayName') this.displayName = value.toString();
    if (field === 'firstName') this.firstName = value.toString();
    if (field === 'lastName') this.lastName = value.toString();
    if (field === 'bio') this.bio = value.toString();
  }

  handleSelect(dropdownKey: 'education' | 'gender' | 'city', selected: any) {
    if (dropdownKey === 'education') this.selectedEducation = selected;
    if (dropdownKey === 'gender') this.selectedGender = selected;
    if (dropdownKey === 'city') this.selectedCity = selected;
  }

  toggleDropdown(id: string): void {
    this.activeDropdown = this.activeDropdown === id ? null : id;
  }

  /** Link xử lý */
  addLink(): void {
    const trimmed = this.newLink.trim();
    if (trimmed) {
      this.links.push(trimmed);
    }
    this.newLink = '';
    this.isAddingLink = false;
  }

  removeLink(index: number): void {
    if (index >= 0 && index < this.links.length) {
      this.links.splice(index, 1);
    }
  }

  /** Upload ảnh */
  uploadBackground() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        this.backgroundFile = file;
        this.user.backgroundUrl = URL.createObjectURL(file);
      }
    };
    input.click();
  }

  uploadAvatar() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        this.avatarFile = file;
        this.user.avatarUrl = URL.createObjectURL(file);
      }
    };
    input.click();
  }

  // private handleImageUpload(
  //   event: any,
  //   uploadApi: (file: File) => Observable<any>,
  //   successCallback: () => void
  // ) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     uploadApi(file).subscribe({
  //       next: () => {
  //         sendNotification(
  //           this.store,
  //           'Thành công',
  //           'Tải ảnh lên thành công',
  //           'success'
  //         );
  //         successCallback();
  //       },
  //       error: (err) => {
  //         console.error('Lỗi upload:', err);
  //       },
  //     });
  //   }
  // }

  // // Upload ảnh đại diện
  // uploadAvatar(event: any) {
  //   this.handleImageUpload(
  //     event,
  //     (file) => this.authService.uploadAvatar(file),
  //     // () => this.loadAvatar()
  //     () => window.location.reload()
  //   );
  // }

  /** Cập nhật profile */
  updateProfile() {
    // // Update thông tin cơ bản
    // this.profileService
    //   .updateProfile(
    //     this.firstName,
    //     this.lastName,
    //     new Date(this.dob), // dob phải dạng Date
    //     this.bio || '',
    //     this.selectedGender === 'true',
    //     this.displayName,
    //     Number(this.selectedEducation.value),
    //     this.links,
    //     this.selectedCity || ''
    //   )
    //   .subscribe({
    //     next: (res) => {
    //       console.log('Cập nhật thông tin thành công:', res);
    //     },
    //     error: (err) => {
    //       console.error('Lỗi cập nhật thông tin:', err);
    //     },
    //   });

    // Update avatar nếu có file
    if (this.avatarFile) {
      this.profileService.updateAvatar(this.avatarFile).subscribe({
        next: (res) => console.log('Cập nhật avatar thành công:', res),
        error: (err) => console.error('Lỗi cập nhật avatar:', err),
      });
    }

    // Update background nếu có file
    if (this.backgroundFile) {
      this.profileService.updateBackground(this.backgroundFile).subscribe({
        next: (res) => console.log('Cập nhật background thành công:', res),
        error: (err) => console.error('Lỗi cập nhật background:', err),
      });
    }
  }
}
