// set-password-modal.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../../core/services/api-service/auth.service';

@Component({
  selector: 'app-set-password-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './set-password-modal.component.html',
  styleUrls: ['./set-password-modal.component.scss'],
})
export class SetPasswordModalComponent {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  password = '';
  confirmPassword = '';
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService) {}

  close() {
    this.closed.emit();
    this.resetForm();
    this.isOpen = !this.isOpen;
  }

  resetForm() {
    this.password = '';
    this.confirmPassword = '';
    this.errorMessage = '';
    this.isLoading = false;
  }

  onSubmit() {
    if (!this.password || !this.confirmPassword) {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin';
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'Mật khẩu phải có ít nhất 6 ký tự';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Mật khẩu nhập lại không khớp';
      return;
    }

    this.isLoading = true;
    this.authService.createInitialPassword(this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.close();
        // Có thể bắn event success hoặc toast ở đây
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
