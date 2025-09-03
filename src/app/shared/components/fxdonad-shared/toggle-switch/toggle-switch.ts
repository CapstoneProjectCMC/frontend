import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { ThemeService } from '../../../../styles/theme-service/theme.service';

@Component({
  selector: 'app-toggle-switch',
  standalone: true,
  imports: [],
  templateUrl: './toggle-switch.html',
  styleUrl: './toggle-switch.scss',
})
export class ToggleSwitch implements OnInit {
  @Input() isChecked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() label: string = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  @Output() toggleChange = new EventEmitter<boolean>();

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // Khởi tạo trạng thái từ localStorage
    this.isChecked = this.themeService.getCurrentTheme() === 'dark';
  }

  onToggle(): void {
    if (!this.disabled) {
      this.toggleChange.emit(!this.isChecked);
    }
  }
}
