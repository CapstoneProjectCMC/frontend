import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../../../../core/services/api-service/auth.service';
import { sendNotification } from '../../../../../shared/utils/notification';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  @Input() isVisibleModal: boolean = false;
  @Output() onCloseModal = new EventEmitter<boolean>();

  constructor(private authService: AuthService, private store: Store) {}

  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  oldPasswordError = '';
  confirmPasswordError = '';
  isOldPasswordVisible = false;
  isNewPasswordVisible = false;
  isConfirmPasswordVisible = false;

  hasLength = false;
  hasUppercase = false;
  hasLowercase = false;
  hasNumber = false;
  hasSpecialChar = false;
  passwordStrength = 0;
  isLoading = false;

  onClose(): void {
    console.log('Modal closed');
    this.onCloseModal.emit(false);
    this.isVisibleModal = !this.isVisibleModal;
    // In một ứng dụng thực, bạn sẽ sử dụng một sự kiện hoặc service để đóng modal.
  }

  togglePasswordVisibility(input: 'old' | 'new' | 'confirm'): void {
    if (input === 'old') {
      this.isOldPasswordVisible = !this.isOldPasswordVisible;
    } else if (input === 'new') {
      this.isNewPasswordVisible = !this.isNewPasswordVisible;
    } else if (input === 'confirm') {
      this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
    }
  }

  checkPasswordStrength(): void {
    const newPass = this.newPassword;
    this.hasLength = newPass.length >= 8;
    this.hasUppercase = /[A-Z]/.test(newPass);
    this.hasLowercase = /[a-z]/.test(newPass);
    this.hasNumber = /[0-9]/.test(newPass);
    this.hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPass);

    let validCount = 0;
    if (this.hasLength) validCount++;
    if (this.hasUppercase) validCount++;
    if (this.hasLowercase) validCount++;
    if (this.hasNumber) validCount++;
    if (this.hasSpecialChar) validCount++;

    this.passwordStrength = (validCount / 5) * 100;
  }

  getStrengthClass(): string {
    if (this.passwordStrength < 40) return 'weak';
    if (this.passwordStrength < 80) return 'medium';
    return 'strong';
  }

  isFormValid(): boolean {
    const isNewPasswordValid =
      this.hasLength &&
      this.hasUppercase &&
      this.hasLowercase &&
      this.hasNumber &&
      this.hasSpecialChar;

    const isConfirmPasswordValid =
      this.newPassword === this.confirmPassword &&
      this.confirmPassword.length > 0;

    return (
      this.oldPassword.length > 0 &&
      isNewPasswordValid &&
      isConfirmPasswordValid
    );
  }

  onChangePassword(): void {
    this.oldPasswordError = '';
    this.confirmPasswordError = '';

    if (!this.oldPassword) {
      this.oldPasswordError = 'Mật khẩu cũ không được để trống.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.confirmPasswordError = 'Mật khẩu mới không khớp.';
      return;
    }

    this.isLoading = true;

    // Simulate API call
    this.authService
      .changePassword(this.oldPassword, this.newPassword)
      .subscribe({
        next: () => {
          this.isLoading = false;
          sendNotification(
            this.store,
            'Đổi mật khẩu thành công',
            'Mật khẩu của bạn đã thay đổi',
            'success'
          );
          this.isVisibleModal = false;
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);
        },
      });
  }
}
