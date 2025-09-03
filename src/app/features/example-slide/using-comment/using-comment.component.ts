import { Component } from '@angular/core';
import { CommentComponent } from '../../../shared/components/fxdonad-shared/comment/comment.component';


@Component({
  selector: 'app-using-comment',
  imports: [CommentComponent],
  templateUrl: './using-comment.component.html',
  styleUrl: './using-comment.component.scss',
})
export class UsingCommentComponent {}
