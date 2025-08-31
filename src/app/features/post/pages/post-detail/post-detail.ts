import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { EMPTY, catchError, switchMap, tap } from 'rxjs';

// Models & Services
import { PostResponse } from '../../../../core/models/post.models';
import { PostService } from '../../../../core/services/api-service/post.service';
import { avatarUrlDefault } from '../../../../core/constants/value.constant';

// Pipes & Components
import { DurationFormatPipe } from '../../../../shared/pipes/duration-format.pipe';
import { CommentComponent } from '../../../../shared/components/fxdonad-shared/comment/comment.component';

import hljs from 'highlight.js';
import { marked, Token, Tokens, TokensList } from 'marked';

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
  currentVote: 'upvote' | 'downvote' | null = null;

  // UI State
  isContentExpanded = false;
  isCommentVisible = false;
  tocItems: { text: string; level: number; anchor: string }[] = [];
  readonly avatarDefault = avatarUrlDefault;

  toc: { text: string; level: number; anchor: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private markdownService: MarkdownService
  ) {
    marked.use({
      renderer: {
        heading: ({ tokens, depth }) => {
          const text = this.extractTextFromTokens(tokens || []);
          const anchor = this.slugify(text);

          // lưu TOC
          this.toc.push({ text, level: depth, anchor });

          // trả về heading có id
          return `<h${depth} id="${anchor}">${text}</h${depth}>`;
        },
        code: ({ text, lang }) => {
          if (lang && hljs.getLanguage(lang)) {
            return `<pre><code class="hljs">${
              hljs.highlight(text, { language: lang, ignoreIllegals: true })
                .value
            }</code></pre>`;
          }
          return `<pre><code class="hljs">${
            hljs.highlightAuto(text).value
          }</code></pre>`;
        },
      },
    });
  }

  ngOnInit() {
    // Custom heading renderer thêm id để TOC scroll tới
    // 1) Custom heading: parse inline -> lấy plain text -> slugify -> set id
    // Renderer
    this.markdownService.renderer.heading = ({ tokens, depth }: any) => {
      const text = this.extractTextFromTokens(tokens || []);
      const anchor = this.slugify(text); // slug chỉ tạo từ plain text
      return `<h${depth} id="${anchor}">${text}</h${depth}>`; // vẫn render đầy đủ text (có ✅ nếu có)
    };

    // Custom highlight code
    this.markdownService.renderer.code = ({ text, lang }) => {
      if (lang && hljs.getLanguage(lang)) {
        return `<pre><code class="hljs">${
          hljs.highlight(text, { language: lang, ignoreIllegals: true }).value
        }</code></pre>`;
      }
      return `<pre><code class="hljs">${
        hljs.highlightAuto(text).value
      }</code></pre>`;
    };

    // Load post data như bạn đã viết
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

  onMarkdownReady(): void {
    const blocks = document.querySelectorAll('pre code');
    blocks.forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
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
    const el = document.getElementById(anchor);
    if (!el) return;

    const scroller = document.querySelector('.post-detail-content');
    if (scroller) {
      scroller.scrollTo({
        top: el.offsetTop,
        behavior: 'smooth',
      });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  isImage(fileUrl: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl);
  }

  isVideo(fileUrl: string): boolean {
    return /\.(mp4|webm|ogg)$/i.test(fileUrl);
  }

  generateTOC(markdown: string) {
    this.tocItems = [];
    const tokens: TokensList = marked.lexer(markdown);
    tokens.forEach((token) => {
      if (token.type === 'heading') {
        const text = this.extractTextFromTokens(token.tokens || []);
        const anchor = this.slugify(text);
        this.tocItems.push({ text, level: token.depth, anchor });
      }
    });
  }

  // Hàm xử lý token con -> string
  private extractTextFromTokens(tokens: Token[]): string {
    if (!tokens) return '';
    return tokens
      .map((t: any) => {
        if (t.type === 'text') return t.text;
        if (t.tokens) return this.extractTextFromTokens(t.tokens);
        return '';
      })
      .join('');
  }

  // Hàm chuyển đổi tiêu đề thành anchor slug
  // Giữ nguyên hàm slugify bạn đang dùng (bỏ dấu, về ASCII)
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // bỏ dấu
      .replace(/[^a-z0-9\u0100-\u024f\s-]/g, '') // giữ chữ latin mở rộng
      .trim()
      .replace(/\s+/g, '-') // khoảng trắng → -
      .replace(/-+/g, '-') // gộp ---
      .replace(/^-+|-+$/g, ''); // bỏ - đầu/cuối
  }

  // Helper: chuyển HTML -> plain text để slug luôn đúng
  private htmlToText(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  formatTime(time: string | Date): string {
    return new DurationFormatPipe().formatTime(time);
  }
  disableLink(event: Event) {
    event.preventDefault();
  }

  handleUpVote() {
    if (!this.post?.postId) return;

    this.postService.reactionPost(this.post.postId, 'upvote').subscribe({
      next: () => {
        if (!this.post) return;

        if (this.currentVote === 'upvote') {
          // 🔄 Bỏ upvote
          this.post.upvoteCount = (this.post.upvoteCount ?? 0) - 1;
          this.currentVote = null;
        } else {
          // Nếu trước đó đã downvote thì bỏ downvote trước
          if (this.currentVote === 'downvote') {
            this.post.downvoteCount = (this.post.downvoteCount ?? 0) - 1;
          }
          // ✅ Thêm upvote
          this.post.upvoteCount = (this.post.upvoteCount ?? 0) + 1;
          this.currentVote = 'upvote';
        }
      },
      error: (err) => console.error(err),
    });
  }

  handleDownVote() {
    if (!this.post?.postId) return;

    this.postService.reactionPost(this.post.postId, 'downvote').subscribe({
      next: () => {
        if (!this.post) return;

        if (this.currentVote === 'downvote') {
          // 🔄 Bỏ downvote
          this.post.downvoteCount = (this.post.downvoteCount ?? 0) - 1;
          this.currentVote = null;
        } else {
          // Nếu trước đó đã upvote thì bỏ upvote trước
          if (this.currentVote === 'upvote') {
            this.post.upvoteCount = (this.post.upvoteCount ?? 0) - 1;
          }
          // ✅ Thêm downvote
          this.post.downvoteCount = (this.post.downvoteCount ?? 0) + 1;
          this.currentVote = 'downvote';
        }
      },
      error: (err) => console.error(err),
    });
  }

  countComment() {
    if (this.post?.commentCount) {
      this.post.commentCount++;
    }
  }
}
