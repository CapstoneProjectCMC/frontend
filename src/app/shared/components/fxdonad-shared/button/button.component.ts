import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-interactive-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class InteractiveButtonComponent {
  @Input() buttonText: string = '';
  @Input() buttonType: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() buttonSize: 'small' | 'medium' | 'large' = 'medium';
  @Input() isDisabled: boolean = false;
  @Input() iconName?: any;
  @Input() isLoading: boolean = false;
  @Input() tooltipText?: string;

  @Output() buttonClick = new EventEmitter<any>();
  @Output() buttonHover = new EventEmitter<boolean>();
  @Output() buttonFocus = new EventEmitter<boolean>();

  onButtonClick(event: any): void {
    if (!this.isDisabled && !this.isLoading) {
      this.buttonClick.emit(event);
    }
  }

  onHover(isHovered: boolean): void {
    if (!this.isDisabled) {
      this.buttonHover.emit(isHovered);
    }
  }

  onFocus(isFocused: boolean): void {
    if (!this.isDisabled) {
      this.buttonFocus.emit(isFocused);
    }
  }
}
