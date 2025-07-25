import { formatDistanceToNow, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale'; // Tiếng Việt
import { CookieService } from 'ngx-cookie-service';
import { sendNotification } from '../../../utils/notification';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { buildImageUrl } from '../../../utils/BuildUrlFile';
import { ICommentFilmResponse } from '../../../../core/models/comment.models';
import { mockComments } from '../../../../core/fake-data/comment.data';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  @Input() animeId: string = '';
  comments: ICommentFilmResponse[] = [];
  userAvatar: string = ''; // Avatar user hiện tại
  avatarDefault = 'assets/avatar-default.png';
  role: string = '';

  newComment: string = ''; // Nội dung bình luận mới
  replyMap: { [key: string]: string } = {}; // Nội dung phản hồi cho từng comment
  showReplies: { [key: string]: boolean } = {}; // Trạng thái hiển thị phản hồi
  currentPage = 0;
  pageSize = 10;
  totalPages = 9999;
  isLoading = false;
  authenticated = false;

  constructor(private cookiesService: CookieService, private store: Store) {
    this.userAvatar = this.cookiesService.get('avatarUrl');
    this.role = this.cookiesService.get('role');
    console.log('Trạng thái:', this.authenticated);
  }

  ngOnInit(): void {
    // this.fetchComments(this.animeId, this.currentPage, this.pageSize);
    this.comments = mockComments;
  }

  get totalCommentsCount(): number {
    return this.comments.reduce(
      (total, comment) => total + 1 + (comment.replies?.length || 0),
      0
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['animeId'] && !changes['animeId'].firstChange) {
      // Khi animeId thay đổi, reset trang và gọi fetch comment mới
      this.currentPage = 0;
      this.comments = []; // reset danh sách comment (nếu cần)
      this.fetchComments(this.animeId, this.currentPage, this.pageSize);
    }
  }

  buildImgAvatarUrl(url: string, size: 'small' | 'tiny' | 'original'): string {
    if (!url || url.trim() === '' || url === 'null') {
      return this.avatarDefault;
    }
    return buildImageUrl(url, size);
  }

  isLastComment(commentId: string): boolean {
    const lastComment = this.comments[this.comments.length - 1]; // Lấy comment cuối cùng trong danh sách
    return lastComment?.id === commentId;
  }

  isLastReply(comment: ICommentFilmResponse, replyId: string): boolean {
    if (!comment.replies || comment.replies.length === 0) return false;
    const lastReply = comment.replies[comment.replies.length - 1]; // Lấy phản hồi cuối cùng
    return lastReply?.id === replyId;
  }

  // Hàm tính "X giờ trước"
  getTimeAgo(timestamp: string): string {
    return formatDistanceToNow(parseISO(timestamp), {
      addSuffix: true,
      locale: vi,
    });
  }

  // Gửi bình luận mới
  sendComment(yourSelfCommentId: string) {
    // if (!this.newComment.trim()) return;
    //call api

    //if success comment
    const newComment: ICommentFilmResponse = {
      id: yourSelfCommentId, // Sử dụng Date.now() làm id
      parentId: null, // 0 hoặc id của comment cha nếu đây là reply
      content: this.newComment, // Nội dung comment
      isDeactivated: false, // Mặc định comment chưa bị xoá
      createdAt: new Date().toISOString(), // Thời gian tạo comment
      updatedAt: new Date().toISOString(), // Thời gian cập nhật comment (ban đầu giống createdAt)
      user: {
        id: 'currentUserId',
        username: 'Bạn',
        email: this.cookiesService.get('email'),
        role: this.cookiesService.get('role'),
        avatarUrl: this.userAvatar,
        backgroundUrl: '/assets/bg-default.png',
      },
      replies: [], // Mảng chứa các reply, hiện tại để trống
    };
    this.comments = [newComment, ...this.comments];
    this.newComment = '';
  }

  // Gửi phản hồi cho một bình luận
  sendReply(commentId: string) {
    // if (!this.replyMap[commentId]?.trim()) return;

    //call api

    //if success comment

    const comment = this.comments.find((c) => c.id === commentId);
    if (comment) {
      comment.replies = comment.replies || [];
      comment.replies.push({
        id: Date.now().toString(),
        parentId: commentId,
        content: this.replyMap[commentId], // Sửa chỗ này
        isDeactivated: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: {
          id: 'currentUserId',
          username: 'Bạn',
          email: this.cookiesService.get('email'),
          role: this.cookiesService.get('role'),
          avatarUrl: this.userAvatar,
          backgroundUrl: '/assets/bg-default.png',
        },
      });
      this.replyMap[commentId] = ''; // Reset nội dung reply input
    }
  }

  submitComment() {
    if (!this.newComment.trim()) return;

    const data = {
      animeId: this.animeId,
      content: this.newComment,
    };
    // this.commentsService.createComment(data).subscribe({
    //   next: (res) => {
    //     console.log(res.result);
    //     this.sendComment(res.result.id);
    //   },
    //   error: (err) => {
    //     console.log(err);
    //     sendNotification(
    //       this.store,
    //       'Bình luận lỗi',
    //       typeof err === 'string' ? err : 'Không thể gửi bình luận',
    //       'error'
    //     );
    //   },
    // });
  }

  submitReplyComment(commentId: string) {
    if (!this.replyMap[commentId]?.trim()) return;

    const comment = this.comments.find((c) => c.id === commentId);
    if (comment) {
      const data = {
        animeId: this.animeId,
        parentId: commentId,
        content: this.replyMap[commentId], // DÙNG replyMap[commentId] thay vì comment.content
      };
      // this.commentsService.replyComment(data).subscribe({
      //   next: (res) => {
      //     console.log(res.result);
      //     this.sendReply(commentId);
      //   },
      //   error: (err) => {
      //     console.log(err);
      //     sendNotification(
      //       this.store,
      //       'Bình luận lỗi',
      //       typeof err === 'string' ? err : 'Không thể gửi bình luận',
      //       'error'
      //     );
      //   },
      // });
    } else {
      sendNotification(
        this.store,
        'Lỗi!',
        'Bình luận chính gặp lỗi, thử lại sau!',
        'error'
      );
    }
  }

  fetchComments(movieId: string | null, page: number, size: number) {
    if (this.role === 'ROLE_ADMIN') {
      if (movieId) {
        // this.commentsService.getAllRootComments(movieId, page, size).subscribe({
        //   next: (res) => {
        //     const newComments = res.result.content.map((c) => ({
        //       ...c,
        //       replies: c.replies ?? [],
        //     }));
        //     // NỐI thêm (spread) vào this.comments cũ
        //     this.comments = [...this.comments, ...newComments];
        //     // Cập nhật totalPages (nếu server trả về)
        //     this.totalPages = res.result.totalPages;
        //     this.isLoading = false; // Mở khoá để lần sau có thể load tiếp
        //   },
        //   error: (err) => {
        //     console.log(err);
        //     this.isLoading = false; // Dù lỗi cũng phải mở khoá
        //   },
        // });
      } else {
        console.log('Lỗi lấy comment phim');
      }
    } else {
      if (movieId) {
        // this.commentsService
        //   .getActiveRootComments(movieId, page, size)
        //   .subscribe({
        //     next: (res) => {
        //       const newComments = res.result.content.map((c) => ({
        //         ...c,
        //         replies: c.replies ?? [],
        //       }));
        //       // NỐI thêm (spread) vào this.comments cũ
        //       this.comments = [...this.comments, ...newComments];
        //       // Cập nhật totalPages (nếu server trả về)
        //       this.totalPages = res.result.totalPages;
        //       this.isLoading = false; // Mở khoá để lần sau có thể load tiếp
        //     },
        //     error: (err) => {
        //       console.log(err);
        //       this.isLoading = false; // Dù lỗi cũng phải mở khoá
        //     },
        //   });
      }
    }
  }

  onScroll(event: Event) {
    if (this.isLoading) return;

    const element = event.target as HTMLElement;
    const atBottom =
      element.scrollHeight - element.scrollTop <= element.clientHeight + 1;

    if (atBottom && this.currentPage < this.totalPages - 1) {
      this.isLoading = true; // Chặn gọi tiếp
      this.loadMore();
    }
  }

  loadMore() {
    this.currentPage++;
    this.fetchComments(this.animeId, this.currentPage, this.pageSize);
  }

  // Toggle hiển thị phản hồi
  toggleReplies(commentId: string) {
    this.showReplies[commentId] = !this.showReplies[commentId];
  }
}
