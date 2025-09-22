import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
  OnChanges,
  OnInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import Hls from 'hls.js';
import { debounceTime, Subject } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  standalone: true,
  selector: 'app-video-player',
  templateUrl: './video-view.html',
  styleUrls: ['./video-view.scss'],
  imports: [FormsModule],
})
export class VideoPlayerComponent
  implements AfterViewInit, OnChanges, OnInit, OnDestroy
{
  @ViewChild('videoElement') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('qualitySelector')
  qualitySelectorRef!: ElementRef<HTMLSelectElement>;
  @Input() videoSrc: string = '';
  @Input() historyId: string = '';
  @Input() episodeId: string = '';
  @Input() statusEpisode: string = '';
  @Output() currentTimeUpdated = new EventEmitter<number>();

  hls!: Hls;
  isPlaying = false;
  qualityLevels: {
    index: number;
    label: string;
    bandwidth?: number;
    url: string;
  }[] = [];
  playbackSpeeds = [
    { value: 0.5, label: '0.5x' },
    { value: 1.0, label: '1x' },
    { value: 1.5, label: '1.5x' },
    { value: 2.0, label: '2x' },
  ];
  volume: number = 1;
  showVolumeSlider: boolean = false;
  showControlsPopup: boolean = false;
  controlsVisible: boolean = false;
  isMobileView: boolean = false;
  progress: number = 0;
  hideTimeout: any = null;
  hideControlsTimeout: any = null;

  private hasCountedView: boolean = false;
  private currentTimeSubject = new Subject<number>();

  constructor(private store: Store) {}

  ngOnInit() {
    this.currentTimeSubject.pipe(debounceTime(250)).subscribe((currentTime) => {
      this.currentTimeUpdated.emit(currentTime);
    });
    this.checkScreenSize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['videoSrc'] && !changes['videoSrc'].firstChange) {
      const newUrl = changes['videoSrc'].currentValue;
      if (this.videoRef) {
        this.reloadSource(newUrl);
      }
    }
  }

  ngAfterViewInit() {
    const video = this.videoRef.nativeElement;
    const videoContainer = video.closest('.video-container');
    const overlay = document.querySelector(
      '.overlay-player-episode'
    ) as HTMLElement;
    this.loadM3U8(this.videoSrc);
    this.isPlaying = false;
    overlay.classList.add('paused');

    if (Hls.isSupported()) {
      this.hls = new Hls();
      this.hls.loadSource(this.videoSrc);
      this.hls.attachMedia(video);

      this.hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        this.qualityLevels = [
          { index: -1, label: 'Tự động', url: this.videoSrc },
          ...data.levels.map((level, i) => ({
            index: i,
            label: `${level.height}p`,
            bandwidth: level.bitrate,
            url: this.videoSrc,
          })),
        ];
      });
    } else {
      video.src = this.videoSrc;
    }

    video.addEventListener('timeupdate', () => this.updateProgress());
    video.addEventListener('loadedmetadata', () => this.updateTotalTime());
    video.controls = false;

    document.addEventListener('fullscreenchange', () => {
      if (document.fullscreenElement === videoContainer) {
        video.controls = false;
      } else {
        video.controls = false;
      }
    });
    this.reloadSource(this.videoSrc);
  }

  ngOnDestroy(): void {
    if (this.hls) {
      this.hls.destroy();
    }
    const video = this.videoRef?.nativeElement;
    if (video) {
      video.pause();
      video.src = '';
    }
    clearTimeout(this.hideControlsTimeout);
    clearTimeout(this.hideTimeout);
  }

  @HostListener('window:resize')
  checkScreenSize() {
    this.isMobileView = window.innerWidth <= 768;
  }

  private reloadSource(url: string): void {
    if (this.hls) {
      this.hls.destroy();
    }
    const video = this.videoRef.nativeElement;
    video.pause();
    video.src = '';

    if (Hls.isSupported()) {
      this.hls = new Hls();
      this.hls.loadSource(url);
      this.hls.attachMedia(video);

      this.hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        this.qualityLevels = [
          { index: -1, label: 'Tự động', url },
          ...data.levels.map((level, i) => ({
            index: i,
            label: `${level.height}p`,
            bandwidth: level.bitrate,
            url,
          })),
        ];
      });
    } else {
      video.src = url;
    }

    this.isPlaying = false;
    this.progress = 0;
  }

  public stopVideo(): void {
    if (this.hls) {
      this.hls.stopLoad();
      this.hls.destroy();
    }
    const video = this.videoRef?.nativeElement;
    if (video) {
      video.pause();
      video.src = '';
    }
    this.isPlaying = false;
  }

  async loadM3U8(url: string) {
    try {
      const response = await fetch(url);
      const data = await response.text();
      this.parseM3U8(data);
    } catch (error) {
      console.error('Lỗi tải file M3U8:', error);
    }
  }

  parseM3U8(data: string) {
    const lines = data.split('\n');
    this.qualityLevels = [{ index: -1, label: 'Tự động', url: this.videoSrc }];

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('#EXT-X-STREAM-INF')) {
        const resolutionMatch = lines[i].match(/RESOLUTION=(\d+x\d+)/);
        const bandwidthMatch = lines[i].match(/BANDWIDTH=(\d+)/);
        const url = lines[i + 1]?.trim();

        if (resolutionMatch && url) {
          this.qualityLevels.push({
            index: this.qualityLevels.length - 1,
            label: resolutionMatch[1],
            bandwidth: bandwidthMatch
              ? parseInt(bandwidthMatch[1], 10)
              : undefined,
            url: new URL(url, this.videoSrc).href,
          });
        }
      }
    }
  }

  changeQuality(event: Event) {
    const selectedIndex = parseInt(
      (event.target as HTMLSelectElement).value,
      10
    );
    if (
      this.hls &&
      selectedIndex >= 0 &&
      selectedIndex < this.qualityLevels.length
    ) {
      this.hls.currentLevel = selectedIndex;
    } else {
      this.hls.currentLevel = -1;
    }
  }

  onMouseMove(event: MouseEvent) {
    this.showControls();
    this.hideControls();
  }

  showControls() {
    clearTimeout(this.hideControlsTimeout);
    this.controlsVisible = true;
  }

  hideControls() {
    this.hideControlsTimeout = setTimeout(() => {
      if (!this.showControlsPopup) {
        this.controlsVisible = false;
      }
    }, 3000);
  }

  toggleControlsPopup() {
    this.showControlsPopup = !this.showControlsPopup;
    if (this.showControlsPopup) {
      this.showControls();
    } else {
      this.hideControls();
    }
  }

  updateProgress() {
    const video = this.videoRef.nativeElement;
    if (video.duration) {
      this.progress = (video.currentTime / video.duration) * 100;
      this.currentTimeSubject.next(Math.floor(video.currentTime));
    }
  }

  updateTotalTime() {
    const video = this.videoRef.nativeElement;
    // Total time calculation logic (not displayed in UI)
  }

  togglePlay() {
    const video = this.videoRef.nativeElement;
    const overlay = document.querySelector(
      '.overlay-player-episode'
    ) as HTMLElement;

    if (this.isPlaying) {
      video.pause();
      this.isPlaying = false;
      overlay.classList.add('paused');
    } else {
      video
        .play()
        .then(() => {
          this.isPlaying = true;
          overlay.classList.remove('paused');
        })
        .catch((error) => {
          console.warn('Play request interrupted:', error);
        });
    }
  }

  changePlaybackSpeed(event: Event) {
    const video = this.videoRef.nativeElement;
    const selectedSpeed = parseFloat((event.target as HTMLSelectElement).value);
    video.playbackRate = selectedSpeed;
  }

  seekVideo(event: Event) {
    const video = this.videoRef.nativeElement;
    const progressBar = event.target as HTMLInputElement;

    if (
      !isNaN(video.duration) &&
      isFinite(video.duration) &&
      video.duration > 0
    ) {
      video.currentTime =
        (video.duration * parseFloat(progressBar.value)) / 100;
    } else {
      console.warn('Invalid video duration:', video.duration);
    }
  }

  seekForward() {
    const video = this.videoRef.nativeElement;
    if (!isNaN(video.duration) && isFinite(video.duration)) {
      video.currentTime = Math.min(video.currentTime + 90, video.duration);
    } else {
      console.warn(
        'Không thể tua nhanh vì video chưa tải xong hoặc không hợp lệ.'
      );
    }
  }

  seekBackward() {
    const video = this.videoRef.nativeElement;
    if (!isNaN(video.duration) && isFinite(video.duration)) {
      video.currentTime = Math.max(video.currentTime - 90, 0);
    } else {
      console.warn(
        'Không thể tua lùi vì video chưa tải xong hoặc không hợp lệ.'
      );
    }
  }

  toggleFullscreen() {
    const video = this.videoRef.nativeElement;
    if (!document.fullscreenElement) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if ((video as any).webkitRequestFullscreen) {
        (video as any).webkitRequestFullscreen();
      } else if ((video as any).msRequestFullscreen) {
        (video as any).msRequestFullscreen();
      }
      video.classList.add('fullscreen-mode');
      video.controls = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      video.classList.remove('fullscreen-mode');
      video.controls = true;
    }
  }

  setVolume() {
    const video = this.videoRef.nativeElement;
    video.volume = this.volume;
  }

  hideVolumeSliderWithDelay() {
    this.hideTimeout = setTimeout(() => {
      this.showVolumeSlider = false;
    }, 300);
  }

  cancelHideVolumeSlider() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }
}
