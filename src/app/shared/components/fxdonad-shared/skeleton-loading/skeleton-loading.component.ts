import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-loading.component.html',
  styleUrls: ['./skeleton-loading.component.scss'],
})
export class SkeletonLoadingComponent {
  @Input() type: 'card' | 'list' | 'post' = 'card';
  @Input() count: number = 1;
}
