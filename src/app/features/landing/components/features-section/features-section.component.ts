import { Component, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-features-section',
  templateUrl: './features-section.component.html',
  styleUrls: ['./features-section.component.scss'],
})
export class FeaturesSectionComponent {
  constructor(private el: ElementRef<HTMLElement>) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Tính toán tiến trình từ 0 (khi top của section chạm đáy màn hình)
    // đến 1 (khi đáy của section chạm đỉnh màn hình)
    const scrollProgress =
      (viewportHeight - rect.top) / (viewportHeight + rect.height);

    // Giới hạn giá trị trong khoảng [0, 1] để tránh các giá trị âm/dương vô hạn
    const clampedProgress = Math.max(0, Math.min(1, scrollProgress));

    // Gán giá trị tiến trình vào biến CSS trên chính component này
    // để SCSS có thể sử dụng
    this.el.nativeElement.style.setProperty(
      '--scroll-progress',
      clampedProgress.toString()
    );
  }
}
