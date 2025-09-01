import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaResource } from '../../../../core/models/resource.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-resource-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resource-card.html',
  styleUrls: ['./resource-card.scss'],
})
export class ResourceCardComponent implements OnChanges {
  @Input() showControls = false;
  @Input() resource!: MediaResource;

  @Output() main = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  safeUrl!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['resource'] && this.resource?.url) {
      this.setSafeUrl(this.resource.url);
    }
  }

  private setSafeUrl(url: string) {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onCardClick() {
    this.main.emit(this.resource.id);
  }

  onEditClick(event: Event) {
    event.stopPropagation();
    this.edit.emit(this.resource.id);
  }

  onDeleteClick(event: Event) {
    event.stopPropagation();
    this.delete.emit(this.resource.id);
  }

  isFileType(type: string): boolean {
    if (!this.resource?.fileType) return false;
    switch (type) {
      case 'video':
        return this.resource.fileType.startsWith('video');
      case 'image':
        return this.resource.fileType.startsWith('image');
      case 'document':
        return (
          this.resource.fileType.includes('pdf') ||
          this.resource.fileType.includes('word') ||
          this.resource.fileType.includes('application')
        );
      default:
        return false;
    }
  }

  isSpecificDocumentType(): boolean {
    const specificTypes = [
      'application/pdf',
      'application/vnd.ms-word',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    return specificTypes.includes(this.resource?.fileType ?? '');
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes < 10 ? '0' + minutes : minutes}:${
      remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds
    }`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
