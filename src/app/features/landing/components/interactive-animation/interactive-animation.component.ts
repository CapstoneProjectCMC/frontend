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
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const globalProgress = Math.max(0, Math.min(1, scrollTop / docHeight));

    // --- Laptop (di chuyển chậm + scale nhanh) ---
    const laptop = this.el.nativeElement.querySelector(
      '.parallax-laptop'
    ) as HTMLElement;
    if (laptop) {
      laptop.style.transform = `translateY(${
        -globalProgress * 30
      }px)   /* chậm hơn */
                          translateX(${-globalProgress * 40}px)   /* chậm hơn */
                          scale(${
                            1 + globalProgress * 0.5
                          })      /* vẫn phóng to nhanh */
                          rotate(${globalProgress * -20}deg)`;
    }

    // --- Kính lúp ---
    const kinhlup = this.el.nativeElement.querySelector(
      '.parallax-kinhlup'
    ) as HTMLElement;
    if (kinhlup) {
      kinhlup.style.transform = `translateY(${-globalProgress * 120}px)
                             translateX(${-globalProgress * 180}px)
                             scale(${1 + globalProgress * 0.25})
                              rotate(${globalProgress * 720}deg)`;
    }

    // --- Thảm ---
    const tham = this.el.nativeElement.querySelector(
      '.parallax-tham'
    ) as HTMLElement;
    if (tham) {
      tham.style.transform = `translateY(${-globalProgress * 80}px)
                          translateX(${-globalProgress * 220}px)
                          scale(${1 + globalProgress * 0.2})
                           rotate(${globalProgress * -520}deg)`;
    }

    // --- Vở (dịch trái nhanh hơn) ---
    const vo = this.el.nativeElement.querySelector(
      '.parallax-vo'
    ) as HTMLElement;
    if (vo) {
      vo.style.transform = `translateY(${-globalProgress * 90}px)
                        translateX(${
                          -globalProgress * 280
                        }px)  /* tăng mạnh hơn */
                        scale(${1 + globalProgress * 0.25}) 
                        rotate(${globalProgress * 720}deg)`;
    }

    // --- Ví (dịch trái nhanh hơn) ---
    const vi = this.el.nativeElement.querySelector(
      '.parallax-vi'
    ) as HTMLElement;
    if (vi) {
      vi.style.transform = `translateY(${-globalProgress * 70}px)
                        translateX(${
                          -globalProgress * 200
                        }px)  /* tăng mạnh hơn */
                        scale(${1 + globalProgress * 0.2})
                        rotate(${globalProgress * 720}deg)`;
    }

    // --- Earth (quay + scale mạnh hơn) ---
    const earth = this.el.nativeElement.querySelector(
      '.parallax-earth'
    ) as HTMLElement;
    if (earth) {
      earth.style.transform = `translate(-50%, -50%)
                         rotate(${globalProgress * 720}deg)
                         scale(${1 + globalProgress * 1})`;
    }

    // --- Rocket ---
    const rocket = this.el.nativeElement.querySelector(
      '.parallax-rocket'
    ) as HTMLElement;
    if (rocket) {
      rocket.style.transform = `translate(calc(-50% - ${
        globalProgress * 250
      }px),
                                      calc(-50% - ${globalProgress * 200}px))
                            translateX(${-globalProgress * 200}px)
                            rotate(${globalProgress * 25}deg)`;
    }

    // --- Robot ---
    const robot = this.el.nativeElement.querySelector(
      '.parallax-robot'
    ) as HTMLElement;
    if (robot) {
      robot.style.transform = `translate(calc(-50% - ${globalProgress * 220}px),
                                      calc(-50% - ${globalProgress * 150}px))
                            translateX(${-globalProgress * 150}px)
                            rotate(${-globalProgress * 25}deg)`;
    }

    // --- Overlay text ---
    const containerRect = this.el.nativeElement.getBoundingClientRect();
    const containerHeight = this.el.nativeElement.clientHeight;

    if (!(containerRect.top > window.innerHeight || containerRect.bottom < 0)) {
      const scrollProgress =
        -containerRect.top / (containerHeight - window.innerHeight);
      const clamped = Math.max(0, Math.min(1, scrollProgress));

      const overlayText = this.el.nativeElement.querySelector(
        '.overlay-text'
      ) as HTMLElement;
      if (overlayText) {
        overlayText.style.opacity = (1 - clamped * 2).toString();
        overlayText.style.transform = `translateY(${clamped * 100}px)`;
      }
    }
  }
}
