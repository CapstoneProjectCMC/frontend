import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-skeleton-loading',
  standalone: true,
  imports: [],
  templateUrl: './skeleton-loading.component.html',
  styleUrls: ['./skeleton-loading.component.scss'],
})
export class SkeletonLoadingComponent {
  @Input() type: 'card' | 'list' | 'post' = 'card';
  @Input() count: number = 1;
}
