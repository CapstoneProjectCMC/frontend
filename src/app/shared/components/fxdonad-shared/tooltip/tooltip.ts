import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'app-tooltip',
  imports: [CommonModule],
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.scss',
})
export class Tooltip implements OnInit, OnDestroy {
  @Input() content: string = '';
  @Input() position: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() delay: number = 1; // Delay in seconds
  @Input() distance: number = 30; // Distance in pixels

  isVisible: boolean = true;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    // Add click event listener to document
    document.addEventListener('click', this.onClickOutside.bind(this));
  }

  ngOnDestroy() {
    // Remove click event listener when component is destroyed
    document.removeEventListener('click', this.onClickOutside.bind(this));
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    event.stopPropagation();
    this.isVisible = false;
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.isVisible = true;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.isVisible = false;
  }

  private onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isVisible = false;
    }
  }
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
