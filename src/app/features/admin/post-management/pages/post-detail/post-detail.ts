import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommentComponent } from '../../../../../shared/components/fxdonad-shared/comment/comment.component';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.scss',
  standalone: true,
  imports: [CommentComponent],
})
export class PostDetailComponent {
  postId: string | null = null;
  constructor(private route: ActivatedRoute) {
    this.postId = this.route.snapshot.paramMap.get('id');
  }
}
