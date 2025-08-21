import {
  Directive,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appAntiCheat]',
})
export class AntiCheatDirective implements OnInit, OnDestroy {
  @Output() tabChanged = new EventEmitter<void>();
  @Output() windowBlur = new EventEmitter<void>();
  @Output() devToolsOpened = new EventEmitter<void>();
  @Output() fullscreenEntered = new EventEmitter<void>();
  @Output() fullscreenExited = new EventEmitter<void>();
  @Output() notAllowRightClick = new EventEmitter<void>();
  @Output() notAllowReloadPage = new EventEmitter<void>();

  private intervalId: any;
  private baselineDiff: number = 0;
  ngOnInit() {
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('blur', this.handleBlur);
    document.addEventListener('fullscreenchange', this.handleFullscreenChange);

    // Kiểm tra DevTools mỗi 1s
    this.baselineDiff = window.outerHeight - window.innerHeight;
    this.intervalId = setInterval(this.checkDevTools, 1000);
  }

  ngOnDestroy() {
    document.removeEventListener(
      'visibilitychange',
      this.handleVisibilityChange
    );
    window.removeEventListener('blur', this.handleBlur);
    document.removeEventListener(
      'fullscreenchange',
      this.handleFullscreenChange
    );
    clearInterval(this.intervalId);
  }

  private handleVisibilityChange = () => {
    if (document.hidden) {
      this.tabChanged.emit();
    }
  };

  private handleBlur = () => {
    this.windowBlur.emit();
  };

  private checkDevTools = () => {
    const diff = window.outerHeight - window.innerHeight;
    if (diff > this.baselineDiff + 350) {
      // lệch quá nhiều mới coi là mở DevTools
      this.devToolsOpened.emit();
    }
  };

  private handleFullscreenChange = () => {
    if (document.fullscreenElement) {
      this.fullscreenEntered.emit();
    } else {
      this.fullscreenExited.emit();
    }
  };

  // Lắng nghe phím F12, Ctrl+Shift+I
  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (
      event.key === 'F12' ||
      (event.ctrlKey &&
        event.shiftKey &&
        (event.key === 'I' || event.key === 'C' || event.key === 'J'))
    ) {
      event.preventDefault();
      this.devToolsOpened.emit();
    }

    if (
      event.key === 'F5' ||
      ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'r')
    ) {
      event.preventDefault();
      this.notAllowReloadPage.emit();
    }
  }

  @HostListener('document:contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault(); // chặn mở menu Inspect
    this.notAllowRightClick.emit();
  }
}

/* các option: 

<div appAntiCheat
     (tabChanged)="onTabChanged()"
     (windowBlur)="onWindowBlur()" //khi tab không được focus thì kích hoạt
     (devToolsOpened)="onDevToolsOpened()"
     (fullscreenEntered)="onFullscreenEntered()"
     (fullscreenExited)="onFullscreenExited()"
     (notAllowRightClick)="notAllowRightClick()"
     (notAllowReloadPage)="notAllowReloadPage()"
>
</div>

*/
