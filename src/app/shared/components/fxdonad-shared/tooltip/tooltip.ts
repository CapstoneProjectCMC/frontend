
import {
  Component,
  Input,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-tooltip',
  imports: [],
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.scss',
  animations: [
    trigger('tooltipAnimation', [
      state(
        'void',
        style({
          opacity: 0,
          visibility: 'hidden',
          scale: 0.8,
        })
      ),
      state(
        '*',
        style({
          opacity: 1,
          visibility: 'visible',
          scale: 1,
        })
      ),
      transition(
        'void => *',
        [
          style({ opacity: 0, scale: 0.8 }),
          animate(
            '{{delay}}s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            style({ opacity: 1, scale: 1 })
          ),
        ],
        { params: { delay: 0 } }
      ),
      transition('* => void', [
        animate('150ms cubic-bezier(0.68, -0.55, 0.265, 1.55)'),
      ]),
    ]),
  ],
})
export class Tooltip implements OnInit, OnDestroy {
  @Input() content: string = '';
  @Input() position: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() delay: number = 1; // Delay in seconds
  @Input() distance: number = 30; // Distance in pixels

  isVisible: boolean = false;

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
/*
  <div style="position: relative">
    <app-tooltip
      [content]="'Đổi theme'"
      [position]="'right'"
      [delay]="0.5"
      [distance]="30"
    >
      <div>Nội dung cần mô tả</div>
    </app-tooltip>
  </div>
*/
