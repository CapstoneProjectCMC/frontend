import { Component, Input, Output, EventEmitter } from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.html',
  styleUrls: ['./input.scss'],
  standalone: true,
  imports: [FormsModule],
})
export class InputComponent {
  @Input() type: 'text' | 'password' | 'number' = 'text';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() minLength: number | null = null;
  @Input() maxLength: number | null = null;
  @Input() min: number | null = null;
  @Input() max: number | null = null;
  @Input() value: string | number = '';
  @Input() icon: string | null = null;
  @Input() isSvg = false;
  @Input() variant: 'primary' | 'secondary' | 'other' = 'primary';

  /** Nhận từ component cha */
  @Input() errorMessage: string | null = null;

  @Output() valueChange = new EventEmitter<string | number>();
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();
  @Output() enterPress = new EventEmitter<void>();

  inputId = `dynamic-input-${Math.random().toString(36).substr(2, 9)}`;
  errorId = `error-${this.inputId}`;

  get hasError(): boolean {
    return !!this.errorMessage;
  }

  onInputChange(value: string | number) {
    this.value = value;
    this.valueChange.emit(value);
  }

  handleFocus() {
    this.focus.emit();
  }

  handleBlur() {
    this.blur.emit();
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.enterPress.emit();
    }
  }
}
