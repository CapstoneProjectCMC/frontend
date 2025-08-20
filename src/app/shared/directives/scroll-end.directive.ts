import {
  Directive,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[appScrollEnd]',
  standalone: true,
})
export class ScrollEndDirective {
  @Output() appScrollEnd = new EventEmitter<void>();

  constructor(private el: ElementRef) {}

  @HostListener('scroll', ['$event'])
  onScroll(event: Event): void {
    const element = event.target as HTMLElement;
    // Kiểm tra nếu người dùng đã cuộn đến gần cuối (ví dụ: còn 1px)
    if (element.scrollHeight - element.scrollTop <= element.clientHeight + 1) {
      this.appScrollEnd.emit();
    }
  }
}
