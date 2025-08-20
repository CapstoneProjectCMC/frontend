import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommentComponent } from '../../../../../shared/components/fxdonad-shared/comment/comment.component';
import { Post } from '../../../../../core/models/post.models';
import { User } from '../../../../../core/models/user.models';
import { DurationFormatPipe } from '../../../../../shared/pipes/duration-format.pipe';
import { MarkdownModule } from 'ngx-markdown';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { ButtonComponent } from '../../../../../shared/components/my-shared/button/button.component';
@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.scss',
  standalone: true,
  imports: [
    CommentComponent,
    NgIf,
    NgStyle,
    MarkdownModule,
    NgFor,
    ButtonComponent,
  ],
})
export class PostDetailComponent {
  postInfo: Post = {
    id: 'post_001',
    userId: 'user_123',
    orgId: 'org_456',
    title: 'Giới thiệu về lập trình Web',
    content: `
# 1. Mở đầu bài viết

Chào mọi người, dạo gần đây dự án của mình gặp phải vấn đề về hiệu năng trên các trang có nhiều component.

Mình muốn hỏi cộng đồng về các best practice để tối ưu một ứng dụng React.

# 2. Vấn đề cần giải quyết

Mình đã thử dùng \`React.memo\` cho một vài component nhưng chưa thấy cải thiện rõ rệt.

Liệu có cách nào để xác định "узкое место" (bottleneck) không?

Đây là một blockquote mẫu để mình hoạ styling. Thảo luận cần tập trung vào các giải pháp thực tế.

# 3. Vấn đề liên quan

Ngoài ra, mình có một đoạn code ví dụ về một list lớn, scroll rất giật:

\`\`\`js
const BigList = ({ items }) => {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
};
\`\`\`

Rất mong nhận được sự hỗ trợ từ các bạn!
`,
    tags: ['html', 'c#', 'java'],
    field: [
      'https://example.com/images/html-structure.png',
      'https://example.com/documents/css-guide.pdf',
      'https://example.com/videos/js-basics.mp4',
    ],
    metrics: {
      view: 1243,
      up: 320,
      down: 12,
      commentCount: 45,
    },
    status: 'APPROVED',
  };
  authorInfo: User = {
    userId: 'u123456',
    username: 'johndoe',
    active: true,
    email: 'johndoe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    dob: '28/03/2004', // dạng string, không phải Date object
    bio: 'Sinh viên CNTT, yêu thích coding và AI.',
    gender: true, // true = nam, false = nữ (tuỳ bạn quy ước)
    displayName: 'John D.',
    education: 3, // ví dụ: 1 = THPT, 2 = Cao đẳng, 3 = Đại học
    links: ['https://github.com/johndoe', 'https://linkedin.com/in/johndoe'],
    city: 'Hà Nội',
    avatarUrl: 'https://example.com/avatar/johndoe.png',
    backgroundUrl: 'https://example.com/bg/johndoe-cover.jpg',
    createdAt: '2025-08-18T09:30:00Z', // Instant -> Date
  };
  tocItems: { text: string; level: number; anchor: string }[] = [];
  time = new Date();
  isExpanded = false;
  postId: string | null = null;
  constructor(private route: ActivatedRoute) {
    this.postId = this.route.snapshot.paramMap.get('id');
    this.generateTOC(this.postInfo.content);
  }
  showComment = false;
  commentMaxHeight = '0px';
  commentOverflow = 'hidden';
  toggleComment() {
    const commentContainer = document.querySelector(
      '.comment-content-container'
    ) as HTMLElement;

    if (!this.showComment) {
      // Mở bình luận
      const scrollHeight = commentContainer.scrollHeight;
      this.commentMaxHeight = `${scrollHeight}px`;

      setTimeout(() => {
        this.commentOverflow = 'visible';
      }, 300); // khớp với transition
    } else {
      // Ẩn bình luận
      this.commentOverflow = 'hidden';
      this.commentMaxHeight = '0px';
    }

    this.showComment = !this.showComment;
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
  toggleExpand() {
    this.isExpanded = !this.isExpanded;
    const markdownContent = document.querySelector(
      '.markdown-body'
    ) as HTMLElement;
    const parentContainer = document.querySelector(
      '.post-detail-content'
    ) as HTMLElement;

    if (this.isExpanded) {
      const fullHeight = markdownContent.scrollHeight; // Chiều cao thực tế của nội dung
      const parentMaxHeight = parentContainer.getBoundingClientRect().height; // Chiều cao tối đa của container cha
      markdownContent.style.maxHeight = `${Math.min(
        fullHeight,
        parentMaxHeight
      )}px`; // Giới hạn max-height
    } else {
      markdownContent.style.maxHeight = '300px';
    }
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
