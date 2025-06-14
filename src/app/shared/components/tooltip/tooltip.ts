import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  imports: [CommonModule],
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.scss',
})
export class Tooltip {
  @Input() content: string = '';
  @Input() position: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() delay: number = 1; // Delay in seconds
  @Input() distance: number = 30; // Distance in pixels
}

// Cách sử dụng

// <div style="position: relative">
//   <app-tooltip
//     [content]="'Đổi theme'"
//     [position]="'right'"
//     [delay]="0.5"
//     [distance]="30"
//   >
//     <div>Nội dung cần mô tả</div>
//   </app-tooltip>
// </div>
