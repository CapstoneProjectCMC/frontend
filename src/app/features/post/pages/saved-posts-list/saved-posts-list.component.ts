import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SavedPostResponse } from '../../../../core/models/post.models';
import { ScrollEndDirective } from '../../../../shared/directives/scroll-end.directive';
import { PostService } from '../../../../core/services/api-service/post.service';
import { lottieOptions2 } from '../../../../core/constants/value.constant';
import { LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'app-saved-posts',
  standalone: true,
  imports: [CommonModule, ScrollEndDirective, LottieComponent],
  templateUrl: './saved-posts-list.component.html',
  styleUrls: ['./saved-posts-list.component.scss'],
})
export class SavedPostsListComponent implements OnInit {
  savedPosts: SavedPostResponse[] = [];
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  loading = false;

  lottieOptions = lottieOptions2;

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    this.loadSavedPosts();
  }

  loadSavedPosts(): void {
    if (this.loading || (this.totalPages && this.currentPage > this.totalPages))
      return;

    this.loading = true;
    this.postService.getSavedPosts(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.savedPosts = [...this.savedPosts, ...res.result.data];
        this.totalPages = res.result.totalPages;
        this.currentPage++;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  navigateToDetails(postId: string) {
    this.router.navigate([`/post-features/post-details/${postId}`]);
  }

  onScrollEnd() {
    this.loadSavedPosts();
  }
}
