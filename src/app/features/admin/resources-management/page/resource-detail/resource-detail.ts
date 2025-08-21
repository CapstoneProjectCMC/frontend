import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { VideoPlayerComponent } from '../../../../../shared/components/my-shared/video-view/video-view';

@Component({
  selector: 'app-resource-detail',
  templateUrl: './resource-detail.html',
  styleUrls: ['./resource-detail.scss'],
  imports: [CommonModule, FormsModule, VideoPlayerComponent],
})
export class ResourceDetail {
  resourceId: string | null = null;
  constructor(private route: ActivatedRoute) {
    this.resourceId = this.route.snapshot.paramMap.get('id');
  }
}
