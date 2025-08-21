import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-background-effect',
  templateUrl: './background-effect.component.html',
  styleUrls: ['./background-effect.component.scss'],
})
export class BackgroundEffectComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private mouse = { x: 0, y: 0, isDown: false };
  private numParticles = 400;
  private codeChars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}[]();+-*/=><!@#$%^&*⊞'; // Thêm ⊞ (Windows),  (fa-home),  (fa-code)
  private specialChars = ['💸'];

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Tải font Font Awesome
    this.loadFontAwesome();

    // Tạo particles ban đầu
    this.createParticles();

    // Bắt đầu animation
    this.animate();
  }

  // Tải Font Awesome vào canvas
  private loadFontAwesome() {
    const font = new FontFace(
      'FontAwesome',
      'url(/assets/fonts/fa-solid-900.woff2)'
    );
    font
      .load()
      .then((loadedFont) => {
        (document.fonts as FontFaceSet).add(loadedFont);
      })
      .catch((error) => console.error('Failed to load Font Awesome:', error));
  }

  // Resize canvas khi window thay đổi
  @HostListener('window:resize')
  onResize() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Theo dõi di chuyển chuột
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
  }

  // Theo dõi click giữ (mousedown/mouseup)
  @HostListener('document:mousedown')
  onMouseDown() {
    this.mouse.isDown = true;
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.mouse.isDown = false;
  }

  // Theo dõi cuộn chuột
  @HostListener('document:wheel', ['$event'])
  onScroll(event: WheelEvent) {
    this.scrollDelta = event.deltaY * 0.1;
  }

  private scrollDelta = 0;

  // Tạo particles (ký tự)
  private createParticles() {
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++) {
      const char = this.getRandomChar();
      this.particles.push(
        new Particle(
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight,
          char,
          this.getCharColor(char), // Màu dựa trên ký tự
          Math.random() * 0.5 + 0.5
        )
      );
    }
  }

  // Animation loop
  private animate() {
    requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    this.particles.forEach((particle) => {
      particle.y += particle.speed - this.scrollDelta;

      if (particle.y > window.innerHeight) {
        particle.y = 0;
        particle.x = Math.random() * window.innerWidth;
        particle.char = this.getRandomChar();
        particle.color = this.getCharColor(particle.char);
      } else if (particle.y < 0) {
        particle.y = window.innerHeight;
        particle.x = Math.random() * window.innerWidth;
        particle.char = this.getRandomChar();
        particle.color = this.getCharColor(particle.char);
      }

      const dx = particle.x - this.mouse.x;
      const dy = particle.y - this.mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        if (this.mouse.isDown) {
          particle.x -= (dx / distance) * 2;
          particle.y -= (dy / distance) * 2;
        } else {
          particle.x += (dx / distance) * 3;
          particle.y += (dy / distance) * 3;
        }
      }

      // Vẽ particle với font phù hợp
      this.ctx.fillStyle = particle.color;
      this.ctx.font = this.specialChars.includes(particle.char)
        ? '20px FontAwesome' // Font Awesome cho icon
        : '20px monospace'; // Font mặc định cho code
      this.ctx.fillText(particle.char, particle.x, particle.y);
    });

    this.scrollDelta *= 0.9;
  }

  // Helper: Ký tự ngẫu nhiên
  private getRandomChar(): string {
    // Giảm xác suất xuất hiện ký tự đặc biệt
    const isSpecial = Math.random() < 0.1; // 10% là ký tự đặc biệt
    if (isSpecial) {
      return this.specialChars[
        Math.floor(Math.random() * this.specialChars.length)
      ];
    }
    return this.codeChars.charAt(
      Math.floor(Math.random() * this.codeChars.length)
    );
  }

  // Helper: Màu dựa trên ký tự
  private getCharColor(char: string): string {
    // if (char === '⊞') {
    //   return '#00A1D6'; // Màu xanh Windows
    // } else if (this.specialChars.includes(char)) {
    //   return '#FFFFFF'; // Màu trắng cho Font Awesome icons
    // }
    const hue = Math.random() * 360;
    return `hsl(${hue}, 100%, 50%)`; // Màu ngẫu nhiên cho ký tự thường
  }
}

// Class Particle
class Particle {
  constructor(
    public x: number,
    public y: number,
    public char: string,
    public color: string,
    public speed: number
  ) {}
}
