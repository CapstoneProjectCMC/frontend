import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { PostCardInfo } from '../../../../core/models/post.models';
import { SanitizeHtmlPipe } from '../../../pipes/sanitizeHtml.pipe';
import { NormalizeHtmlPipe } from '../../../pipes/normalize-html.pip';
import { TruncatePipe } from '../../../pipes/format-view.pipe';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.html',
  styleUrls: ['./post-card.scss'],
  standalone: true,
  imports: [CommonModule, SanitizeHtmlPipe, NormalizeHtmlPipe, TruncatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush, // Tối ưu hiệu suất
})
export class PostCardComponent {
  @Input() post!: PostCardInfo;
  @Input() showControls: boolean = true;
  @Input() popular?: number = 0;

  // Sử dụng @Output thay vì @Input functions
  @Output() mainClick = new EventEmitter<string>();
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>(); // Đổi tên 'rejected' thành 'reject' cho nhất quán
  @Output() upvote = new EventEmitter<void>();
  @Output() downvote = new EventEmitter<void>();
  @Output() comment = new EventEmitter<void>();
  @Output() report = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  get popularityClass(): string {
    switch (this.popular) {
      case 0:
        return 'popularity--low';
      case 1:
        return 'popularity--medium';
      case 2:
        return 'popularity--high';
      default:
        return 'popularity--very-high';
    }
  }

  // Các hàm xử lý sự kiện sẽ emit giá trị ra ngoài
  // Thêm $event.stopPropagation() trong template để tránh xung đột click
  onMainClick(): void {
    this.mainClick.emit(this.post.id);
  }

  onEditClick(event: MouseEvent): void {
    event.stopPropagation();
    this.edit.emit();
  }

  onDeleteClick(event: MouseEvent): void {
    event.stopPropagation();
    this.delete.emit();
  }

  // ... (Tương tự cho các hàm còn lại: onApproveClick, onRejectClick, etc.)
  // Ví dụ:
  onUpvoteClick(event: MouseEvent): void {
    event.stopPropagation();
    this.upvote.emit();
  }

  onDownvoteClick(event: MouseEvent): void {
    event.stopPropagation();
    this.downvote.emit();
  }

  onCommentClick(event: MouseEvent): void {
    event.stopPropagation();
    this.comment.emit();
  }

  trackByFn(index: number, tag: string): string {
    return tag; // Hoặc return index nếu tag có thể trùng lặp
  }

  onSaveClick(event: MouseEvent): void {
    // Sửa từ PointerEvent thành MouseEvent
    event.stopPropagation();
    this.save.emit(); // Thêm logic emit sự kiện giống các hàm khác
  }

  // Giữ lại hàm format thời gian, nhưng có thể cân nhắc dùng DatePipe của Angular
  formatTime(time: string | Date): string {
    const date = new Date(time);
    const pad = (n: number) => (n < 10 ? '0' + n : n);
    return `${pad(date.getHours())}:${pad(date.getMinutes())} ${pad(
      date.getDate()
    )}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
  }
}
