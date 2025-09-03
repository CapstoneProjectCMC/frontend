
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.scss'],
  imports: [],
})
export class LoadingOverlayComponent {
  @Input() visible = false;
  @Input() message = 'Đang tải dữ liệu...';
}
