import { Component } from '@angular/core';
import type { CardData } from '../../../shared/components/fxdonad-shared/card-data/card-data.component';
import { CardDataComponent } from '../../../shared/components/fxdonad-shared/card-data/card-data.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-using-card-data',
  imports: [CardDataComponent, CommonModule],
  templateUrl: './using-card-data.component.html',
  styleUrl: './using-card-data.component.scss',
})
export class UsingCardDataComponent {
  data: CardData = {
    name: 'Thuật toán tìm kiếm nhị phân',
    description:
      'Bài viết về thuật toán tìm kiếm nhị phân, một thuật toán hiệu quả để tìm kiếm một phần tử trong một mảng đã sắp xếp.',
    uploader: {
      name: 'Nguyễn Văn A',
      avatar: 'https://via.placeholder.com/150',
    },
    uploadTime: new Date(),
    difficulty: 'easy',
    tags: ['tag1', 'tag2', 'tag3'],
    status: 'pending',
  };
}
