import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';

@Component({
  selector: 'app-interactive-animation',
  imports: [],
  templateUrl: './interactive-animation.component.html',
  styleUrl: './interactive-animation.component.scss',
})
export class InteractiveAnimationComponent {
  @ViewChild('animationCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private context!: CanvasRenderingContext2D;
  private images: HTMLImageElement[] = [];
  private totalFrames = 3; // Tổng số frame animation của bạn
  private imagePath = (frame: number) =>
    `assets/animation-frames/frame_${frame.toString().padStart(3, '0')}.jpg`;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.context = this.canvasRef.nativeElement.getContext('2d')!;
    this.preloadImages();
  }

  preloadImages() {
    for (let i = 0; i < this.totalFrames; i++) {
      const img = new Image();
      img.src = this.imagePath(i);
      img.onload = () => {
        this.images[i] = img;
        if (i === 0) {
          // Vẽ frame đầu tiên khi tải xong
          this.drawFrame(0);
        }
      };
    }
  }

  drawFrame(frameIndex: number) {
    const img = this.images[frameIndex];
    if (!img) return;

    const canvas = this.canvasRef.nativeElement;
    // Set canvas resolution to match its display size for crispness
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    this.context.clearRect(0, 0, canvas.width, canvas.height);
    this.context.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

  @HostListener('window:scroll', [])
  onScroll() {
    const containerRect = this.el.nativeElement.getBoundingClientRect();
    const containerHeight = this.el.nativeElement.clientHeight;

    // Chỉ tính toán khi section này trong tầm nhìn
    if (containerRect.top > window.innerHeight || containerRect.bottom < 0) {
      return;
    }

    // Tính toán tiến trình cuộn bên trong container (từ 0 đến 1)
    // 0 = bắt đầu cuộn vào container, 1 = đã cuộn hết container
    const scrollProgress =
      -containerRect.top / (containerHeight - window.innerHeight);
    const clampedProgress = Math.max(0, Math.min(1, scrollProgress));

    // Map tiến trình cuộn tới frame tương ứng
    const frameIndex = Math.floor(clampedProgress * (this.totalFrames - 1));

    // Dùng requestAnimationFrame để tối ưu việc vẽ lại
    requestAnimationFrame(() => this.drawFrame(frameIndex));

    // Hiệu ứng phụ: làm mờ chữ khi cuộn qua
    const overlayText = this.el.nativeElement.querySelector(
      '.overlay-text'
    ) as HTMLElement;
    if (overlayText) {
      overlayText.style.opacity = (1 - clampedProgress * 2).toString();
    }
  }
}
