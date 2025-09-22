import { NgClass } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ButtonComponent } from '../../../../../shared/components/my-shared/button/button.component';
import {
  formatDate,
  formatDateToDDMMYYYY,
} from '../../../../../shared/utils/stringProcess';
import {
  DEFAULT_AVATAR,
  DEFAULT_BG,
  User,
} from '../../../../../core/models/user.models';
import { InputComponent } from '../../../../../shared/components/fxdonad-shared/input/input';
import { DropdownButtonComponent } from '../../../../../shared/components/fxdonad-shared/dropdown/dropdown.component';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../../../core/services/api-service/profile.service';
import { ProvinceService } from '../../../../../core/services/api-service/province.service';
import { sendNotification } from '../../../../../shared/utils/notification';
import {
  clearLoading,
  setLoading,
} from '../../../../../shared/store/loading-state/loading.action';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { setVariable } from '../../../../../shared/store/variable-state/variable.actions';
import { LottieComponent, provideLottieOptions } from 'ngx-lottie';
import { forkJoin } from 'rxjs';
import { TruncatePipe } from '../../../../../shared/pipes/format-view.pipe';
@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.html',
  styleUrls: ['./update-profile.scss'],
  standalone: true,
  imports: [
    DropdownButtonComponent,
    NgClass,
    InputComponent,
    FormsModule,
    ButtonComponent,
    LottieComponent,
    TruncatePipe,
  ],
  providers: [provideLottieOptions({ player: () => import('lottie-web') })],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UpdateProfileComponent {
  @Input() user!: User;
  @Input() variant: 'personal' | 'other' | 'popup' = 'popup';
  @Input() onClickEdit?: () => void;
  @Output() refresh = new EventEmitter<boolean>();

  lottieOptions = {
    path: 'assets/lottie-animation/nodata.json',
    autoplay: true,
    loop: true,
  };
  /** Các danh sách chọn */
  education: { value: number; label: string }[] = [];
  gender: { value: string; label: string }[] = [];

  /** Biến chứa dữ liệu người dùng đã chọn/nhập */
  displayName: string = '';
  firstName: string = '';
  lastName: string = '';
  selectedEducation: any = { value: 9, label: 'Khác' };
  selectedGender: any = { value: 'other', label: 'Khác' };
  dob: string = ''; // ngày sinh dạng string để bind với datetime-local
  originalDob: string = '';
  bio: string = '';
  cities: { value: string; label: string }[] = [];
  selectedCity: string = '';
  //link
  background: string = '';
  avatar: string = '';

  /** Upload ảnh */
  avatarFile: File | null = null;
  backgroundFile: File | null = null;

  /** Link mạng xã hội */
  isAddingLink = false;
  newLink = '';
  links: string[] = [];
  activeDropdown: string | null = null;
  //state
  isLoading: boolean = false;
  hasError: boolean = false;

  constructor(
    private profileService: ProfileService,
    private provinceService: ProvinceService,
    private store: Store,
    private router: Router
  ) {
    console.log('data ở đây', this.user);
    // dữ liệu dropdown mẫu
    this.education = [
      { value: 0, label: 'Không tiết lộ' },
      { value: 1, label: 'Tiểu học' },
      { value: 2, label: 'Trung học cơ sở' },
      { value: 3, label: 'Trung học phổ thông' },
      { value: 4, label: 'Trung cấp' },
      { value: 5, label: 'Cao đẳng' },
      { value: 6, label: 'Đại học' },
      { value: 7, label: 'Cao học / Thạc sĩ' },
      { value: 8, label: 'Tiến sĩ' },
      { value: 9, label: 'Khác' },
    ];

    this.gender = [
      { value: 'false', label: 'Nam' },
      { value: 'true', label: 'Nữ' },
      { value: 'other', label: 'Khác' },
    ];
  }

  ngOnInit() {
    this.isLoading = true;
    this.provinceService.getProvinces().subscribe({
      next: (data) => {
        this.cities = data.map((item) => ({
          value: item.name,
          label: item.name,
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi lấy danh sách tỉnh:', err);
        this.isLoading = false;
        console.log('lỗi', this.hasError);
      },
    });

    if (this.user) {
      this.avatar = this.user?.avatarUrl || DEFAULT_AVATAR;
      this.background = this.user?.backgroundUrl || DEFAULT_BG;
      this.displayName = this.user.displayName || '';
      this.firstName = this.user.firstName;
      this.lastName = this.user.lastName;
      this.bio = this.user.bio;
      this.originalDob = this.user.dob;
      if (this.user.dob) {
        const [day, month, year] = this.user.dob.split('/');
        this.dob = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }

      // Gán giới tính
      this.selectedGender =
        this.gender.find((g) => g.value === String(this.user.gender)) || null;
      console.log('selectedGender on init:', this.selectedGender);
      this.links = [...(this.user.links || [])];
      this.selectedCity = this.user.city || '';

      const edu = this.user.education;
      this.selectedEducation =
        this.education.find((e) => e.value === this.user.education) || null;

      console.log('selectedEducation on init:', this.selectedEducation);
    } else {
      this.hasError = true;
    }
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
    if (dropdownKey === 'city') this.selectedCity = selected.label;
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
  //kiểm tra thay đổi
  // Kiểm tra thay đổi
  hasProfileChanged(): boolean {
    if (!this.user) return false;

    const isFirstNameChanged = this.firstName !== this.user.firstName;

    const isLastNameChanged = this.lastName !== this.user.lastName;

    const isDobChanged =
      (this.originalDob ?? '').trim() !== (this.user?.dob ?? '').trim();

    const isBioChanged = (this.bio || '') !== (this.user.bio || '');

    const isGenderChanged =
      (this.selectedGender?.value === 'true') !== this.user.gender;
    console.log('selectedGender:', this.selectedGender);
    console.log('user.gender:', this.user.gender);

    const isDisplayNameChanged =
      (this.displayName || '') !== (this.user.displayName || '');

    const isEducationChanged =
      Number(this.selectedEducation?.value) !== this.user.education;

    const isLinksChanged =
      JSON.stringify(this.links) !== JSON.stringify(this.user.links || []);

    const isCityChanged = (this.selectedCity || '') !== (this.user.city || '');

    return (
      isFirstNameChanged ||
      isLastNameChanged ||
      isDobChanged ||
      isBioChanged ||
      isGenderChanged ||
      isDisplayNameChanged ||
      isEducationChanged ||
      isLinksChanged ||
      isCityChanged
    );
  }

  /** Cập nhật profile */
  updateProfile() {
    if (!this.hasProfileChanged() && !this.avatarFile && !this.backgroundFile) {
      sendNotification(this.store, 'Thông tin chưa thay đổi', '', 'error');
      return;
    }

    this.store.dispatch(
      setLoading({ isLoading: true, content: 'Đang cập nhật, xin chờ...' })
    );

    const requests = [];

    // 1. Update profile nếu có thay đổi
    if (this.hasProfileChanged()) {
      requests.push(
        this.profileService.updateProfile(
          this.firstName,
          this.lastName,
          formatDateToDDMMYYYY(this.dob),
          this.bio || '',
          this.selectedGender.value === 'false' ? false : true,
          this.displayName,
          Number(this.selectedEducation?.value ?? 0),
          this.links,
          this.selectedCity || ''
        )
      );
    }

    // 2. Update avatar nếu có file
    if (this.avatarFile) {
      requests.push(this.profileService.updateAvatar(this.avatarFile));
    }

    // 3. Update background nếu có file
    if (this.backgroundFile) {
      requests.push(this.profileService.updateBackground(this.backgroundFile));
    }

    // Nếu không có gì thì return
    if (requests.length === 0) {
      this.store.dispatch(clearLoading());
      return;
    }

    forkJoin(requests).subscribe({
      next: (results) => {
        console.log('Kết quả tất cả:', results);
        sendNotification(
          this.store,
          'Đã cập nhật thành công',
          'Thông tin profile đã được cập nhật',
          'success'
        );

        // Nếu có update avatar thì set reload cho header
        if (this.avatarFile) {
          sessionStorage.removeItem('avatar-url');
          this.store.dispatch(
            setVariable({ key: 'reloadAvatarHeader', value: true })
          );
        }
        //fetch lại thông tin user
        this.refresh.emit(true);

        setTimeout(() => {
          this.router.navigate(['/profile/personal-profile']);
          this.store.dispatch(clearLoading());
        }, 300);
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật:', err);
        sendNotification(this.store, 'Xảy ra lỗi', 'error');
        this.store.dispatch(clearLoading());
      },
    });
  }
}
