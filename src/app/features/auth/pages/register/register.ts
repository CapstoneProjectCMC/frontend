import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { slides } from '../../../../core/constants/value.constant';
import { sendNotification } from '../../../../shared/utils/notification';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../../core/services/api-service/auth.service';
import { Router } from '@angular/router';
import { ICreateUserRequest } from '../../../../core/models/data-handle';
import { LoadingOverlayComponent } from '../../../../shared/components/fxdonad-shared/loading-overlay/loading-overlay.component';
import { DropdownButtonComponent } from '../../../../shared/components/fxdonad-shared/dropdown/dropdown.component';
import { OtpModalComponent } from '../../components/modal/otp-modal/otp-modal.component';
import { CommonModule } from '@angular/common';
import { truncateString } from '../../../../shared/utils/stringProcess';
import {
  validateRegisterData,
  validateOtp,
} from '../../validation/register-validation';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoadingOverlayComponent,
    OtpModalComponent,
    DropdownButtonComponent,
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class Register {
  slides = slides;
  currentSlide = 0;
  showPassword = false;
  isLoading = false;
  resendingOTP = false;
  repassword = '';
  linkInputValue = '';
  openOTP = false;
  formData: ICreateUserRequest = {
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dob: '',
    bio: '',
    displayName: '',
    education: 0,
    links: [],
    city: '',
  };
  focused: { [key: string]: boolean } = {};

  educationOptions = [
    { value: 0, label: 'Không tiết lộ' },
    { value: 1, label: 'Tiểu học' }, // Lớp 1 - 5
    { value: 2, label: 'Trung học cơ sở' }, // Lớp 6 - 9
    { value: 3, label: 'Trung học phổ thông' }, // Lớp 10 - 12
    { value: 4, label: 'Trung cấp' },
    { value: 5, label: 'Cao đẳng' },
    { value: 6, label: 'Đại học' },
    { value: 7, label: 'Cao học / Thạc sĩ' },
    { value: 8, label: 'Tiến sĩ' },
    { value: 9, label: 'Khác' },
  ];

  constructor(
    private store: Store,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Tự động chuyển slide mỗi 4s
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 4000);
  }

  backToLogin() {
    this.router.navigate(['/auth/identity/login']);
  }

  onRegister() {
    const error = validateRegisterData(
      this.formData.username,
      this.formData.email,
      this.formData.password,
      this.repassword
    );
    if (error) {
      sendNotification(this.store, 'Cảnh báo!', error, 'warning');
      return;
    }

    // Xử lý dob về đúng định dạng
    if (this.formData.dob && !this.formData.dob.endsWith('T00:00:00Z')) {
      this.formData.dob = this.formData.dob + 'T00:00:00Z';
    }

    this.isLoading = true;
    this.authService.register(this.formData).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.code === 20000) {
          sendNotification(
            this.store,
            'Thành công',
            'Tài khoản đã được tạo, nhập OTP trong vòng 5 phút để kích hoạt!',
            'success'
          );
          this.openOTP = true;
        }
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }

  addLink(event: any, linkInput: HTMLInputElement) {
    event.preventDefault();
    const link = this.linkInputValue.trim();
    if (link) {
      this.formData.links = [...(this.formData.links || []), link];
      linkInput.value = '';
    }
    this.linkInputValue = '';
  }

  removeLink(index: number) {
    this.formData.links?.splice(index, 1);
  }

  // Xử lý sự kiện OTP Modal
  onOtpResend() {
    if (!this.formData.email || !this.formData.email.includes('@')) {
      sendNotification(
        this.store,
        'Cảnh báo!',
        'Email không được để trống hoặc thiếu @',
        'warning'
      );
      return;
    }

    this.resendingOTP = true;
    this.authService.sendOtp(this.formData.email).subscribe({
      next: (res) => {
        if (res.code === 20000) {
          sendNotification(
            this.store,
            'OTP',
            'Đã gửi lại mã OTP đến email của bạn!',
            'info'
          );
        }
        this.resendingOTP = false;
      },
      error: () => {
        this.resendingOTP = false;
      },
    });
  }

  onOtpClose() {
    this.openOTP = !this.openOTP;
  }

  onOtpVerify(otpCode: string) {
    const error = validateOtp(this.formData.email, otpCode);
    if (error) {
      return sendNotification(this.store, 'Cảnh báo', error, 'warning');
    }
    this.resendingOTP = true;
    this.authService.verifyOtp(this.formData.email, otpCode).subscribe({
      next: (res) => {
        if (res.code === 20000) {
          sendNotification(
            this.store,
            'OTP',
            `Tài khoản đã xác thực OTP thành công`,
            'success'
          );
          this.router.navigate(['auth/identity/login']);
          this.resendingOTP = false;
        }
      },
      error: (err) => {
        this.resendingOTP = false;
      },
    });
  }

  truncateString(string: string) {
    return truncateString(string, 16);
  }
}
