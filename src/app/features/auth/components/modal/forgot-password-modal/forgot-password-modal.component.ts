import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../../core/services/api-service/auth.service';
import { sendNotification } from '../../../../../shared/utils/notification';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-forgot-password-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './forgot-password-modal.component.html',
  styleUrls: ['./forgot-password-modal.component.scss'],
})
export class ForgotPasswordModalComponent {
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();

  step: 1 | 2 = 1;
  email = '';
  otp: number | null = null;
  newPassword = '';
  loading = false;
  errorMsg = '';
  successMsg = '';

  constructor(private authService: AuthService, private store: Store) {}

  sendOtp() {
    this.loading = true;
    this.errorMsg = '';

    this.authService.requestForgotPassword(this.email).subscribe({
      next: () => {
        this.step = 2;
        sendNotification(
          this.store,
          'Đã gửi OTP',
          'OTP đã được gửi đến email của bạn! 15 phút hiệu lực',
          'success'
        );
        this.successMsg = 'OTP đã được gửi đến email của bạn!';
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Không gửi được OTP. Vui lòng thử lại.';
        this.loading = false;
      },
    });
  }

  confirmReset() {
    this.loading = true;
    this.errorMsg = '';

    this.authService
      .confirmResetPasswordWithOtp(this.email, this.otp, this.newPassword)
      .subscribe({
        next: () => {
          this.loading = false;
          this.successMsg = 'Mật khẩu đã được đặt lại thành công!';
          sendNotification(
            this.store,
            'Thành công',
            'Mật khẩu đã được đặt lại thành công!',
            'success'
          );
        },
        error: (err) => {
          this.loading = false;
          this.errorMsg = 'OTP không hợp lệ hoặc đã hết hạn.';
        },
      });
  }

  onClose() {
    this.close.emit();
    this.resetState();
  }

  private resetState() {
    this.step = 1;
    this.email = '';
    this.otp = null;
    this.newPassword = '';
    this.errorMsg = '';
    this.successMsg = '';
  }
}
