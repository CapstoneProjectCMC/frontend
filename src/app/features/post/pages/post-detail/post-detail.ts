import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { EMPTY, catchError, switchMap, tap } from 'rxjs';

// Models & Services
import { PostResponse } from '../../../../core/models/post.models';
import { PostService } from '../../../../core/services/api-service/post.service';
import { avatarUrlDefault } from '../../../../core/constants/value.constant';

// Pipes & Components
import { DurationFormatPipe } from '../../../../shared/pipes/duration-format.pipe';
import { CommentComponent } from '../../../../shared/components/fxdonad-shared/comment/comment.component';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.scss',
  standalone: true,
  imports: [CommonModule, MarkdownModule, CommentComponent],
})
export class PostDetailComponent {
  // State Management
  post: PostResponse | null = null;
  isLoading = true;
  error: string | null = null;

  // UI State
  isContentExpanded = false;
  isCommentVisible = false;
  tocItems: { text: string; level: number; anchor: string }[] = [];
  readonly avatarDefault = avatarUrlDefault;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        tap(() => {
          this.isLoading = true;
          this.post = null;
          this.error = null;
        }),
        switchMap((params) => {
          const id = params.get('id');
          if (!id) {
            this.error = 'Không tìm thấy ID bài viết.';
            this.isLoading = false;
            return EMPTY;
          }
          return this.postService.getPostDetails(id).pipe(
            catchError((err) => {
              console.error(err);
              this.error = 'Đã xảy ra lỗi khi tải bài viết. Vui lòng thử lại.';
              this.isLoading = false;
              return EMPTY;
            })
          );
        })
      )
      .subscribe((response) => {
        this.post = response.result;
        if (this.post.content) {
          this.generateTOC(this.post.content);
        }
        this.isLoading = false;
      });
  }
  // --- UI Toggles ---
  toggleContentExpand() {
    this.isContentExpanded = !this.isContentExpanded;
  }

  toggleCommentVisibility() {
    this.isCommentVisible = !this.isCommentVisible;
  }

  scrollToAnchor(anchor: string, event: Event) {
    event.preventDefault();
    document
      .getElementById(anchor)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  //hàm lấy tiêu đề từ markdown và tạo danh sách mục lục
  generateTOC(markdown: string) {
    const lines = markdown.split('\n');
    this.tocItems = lines
      .filter((line) => /^#{1,6}\s/.test(line)) // dòng có tiêu đề markdown
      .map((line) => {
        const match = line.match(/^(#{1,6})\s+(.*)/);
        if (!match) return null;
        const level = match[1].length;
        const text = match[2].trim();
        const anchor = this.slugify(text);
        return { text, level, anchor };
      })
      .filter(Boolean) as { text: string; level: number; anchor: string }[];
  }
  // Hàm chuyển đổi tiêu đề thành anchor slug
  slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-');
  }
  formatTime(time: string | Date): string {
    return new DurationFormatPipe().formatTime(time);
  }
  disableLink(event: Event) {
    event.preventDefault();
  }

  handleUpVote() {
    // Xử lý sự kiện khi người dùng nhấn nút upvote
    console.log('Upvote clicked');
  }
  handleDownVote() {
    // Xử lý sự kiện khi người dùng nhấn nút downvote
    console.log('Downvote clicked');
  }
}
