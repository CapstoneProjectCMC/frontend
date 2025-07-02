import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { slides } from '../../../../core/constants/value.constant';
import { sendNotification } from '../../../../shared/utils/notification';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../../core/services/api-service/auth.service';
import { Router } from '@angular/router';
import { ICreateUserRequest } from '../../../../core/models/data-handle';
import { LoadingOverlayComponent } from '../../../../shared/components/fxdonad-shared/loading-overlay/loading-overlay.component';
import { DropdownButtonComponent } from '../../../../shared/components/fxdonad-shared/dropdown/dropdown.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingOverlayComponent],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  slides = slides;
  currentSlide = 0;
  showPassword = false;
  isLoading = false;
  repassword = '';
  linkInputValue = '';

  // ✅ Biến để xử lý label nổi (focus state)
  focused: { [key: string]: boolean } = {};

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

  educationOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `lớp ${i + 1}`,
  }));

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
    const { username, email, password } = this.formData;
    if (!username || !email || !password) {
      sendNotification(
        this.store,
        'Thiếu dữ liệu',
        'Vui lòng nhập các trường bắt buộc',
        'warning'
      );
      return;
    }

    this.isLoading = true;
    this.authService.register(this.formData).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.code === 20000) {
          sendNotification(
            this.store,
            'Thành công',
            'Tài khoản đã được tạo!',
            'success'
          );
          this.router.navigate(['/auth/identity/login']);
        } else {
          sendNotification(
            this.store,
            'Thất bại',
            'Có lỗi xảy ra khi tạo tài khoản',
            'error'
          );
        }
      },
      error: (err) => {
        this.isLoading = false;
        sendNotification(
          this.store,
          'Lỗi',
          err.error.message || 'Đăng ký thất bại',
          'error'
        );
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
}
