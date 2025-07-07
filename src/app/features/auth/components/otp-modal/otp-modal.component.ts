import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faTimes, faRedo, faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-otp-modal',
  imports: [FontAwesomeModule, FormsModule, CommonModule],
  templateUrl: './otp-modal.component.html',
  styleUrls: ['./otp-modal.component.scss'],
})
export class OtpModalComponent {
  @Input() email: string = '';
  @Input() show: boolean = false;
  @Input() loading: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() resend = new EventEmitter<void>();
  @Output() verify = new EventEmitter<string>();
  @Output() emailChange = new EventEmitter<string>();

  otpCode: string = '';

  constructor(library: FaIconLibrary) {
    library.addIcons(faTimes, faRedo, faCheck);
  }

  onClose() {
    this.close.emit();
  }

  onResend() {
    this.resend.emit();
  }

  onVerify() {
    this.verify.emit(this.otpCode);
  }

  onBackdropClick(event: MouseEvent) {
    // Nếu click vào chính backdrop (không phải modal)
    if (
      (event.target as HTMLElement).classList.contains('otp-modal-backdrop') &&
      !this.loading
    ) {
      this.onClose();
    }
  }
}
