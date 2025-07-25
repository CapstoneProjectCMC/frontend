import { NgClass, NgFor, NgIf } from '@angular/common';
import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { formatDate } from '../../../utils/stringProcess';

export interface PostCardInfo {
  id: string;
  avatar: string;
  author: string;
  title: string;
  time: Date;
  description: string;
  tags: string[];
  comment: number;
  upvote: number;
  downvote: number;
  status: string;
  public: boolean;
}

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.html',
  styleUrls: ['./post-card.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgClass, NgStyle],
})
export class PostCardComponent {
  @Input() post!: PostCardInfo;
  @Input() showControls: boolean = true;
  @Input() onEdit?: () => void;
  @Input() onDelete?: () => void;
  @Input() onApprove?: () => void;
  @Input() onRejected?: () => void;
  @Input() onSummary?: () => void;
  @Input() onUpvote?: () => void;
  @Input() onDownvote?: () => void;
  @Input() onComment?: () => void;
  @Input() onReport?: () => void;
  @Input() onSave?: () => void;
  @Input() onMain?: (postId: string) => void;

  @Input() popular?: number = 0;
  handleMain() {
    this.onMain && this.onMain(this.post?.['id']);
  }
  handleEdit() {
    this.onEdit && this.onEdit();
  }

  handleDelete() {
    this.onDelete && this.onDelete();
  }

  handleApprove() {
    this.onApprove && this.onApprove();
  }

  handleSummary() {
    this.onSummary && this.onSummary();
  }
  handleRejected() {
    this.onRejected && this.onRejected();
  }
  handleUpvote() {
    this.onUpvote && this.onUpvote();
  }
  handleDownvote() {
    this.onDownvote && this.onDownvote();
  }
  handleComment() {
    this.onComment && this.onComment();
  }
  handleReport() {
    this.onReport && this.onReport();
  }
  handleSave() {
    this.onSave && this.onSave();
  }
  formatDate(time: Date) {
    return formatDate(time);
  }

  formatTime(time: string | Date): string {
    const date = new Date(time);
    const pad = (n: number) => (n < 10 ? '0' + n : n);
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  }
}
