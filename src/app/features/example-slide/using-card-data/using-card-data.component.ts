import { Component } from '@angular/core';
import type { CardExcercise } from '../../../shared/components/fxdonad-shared/card-excercise/card-excercise.component';
import { CardExcerciseComponent } from '../../../shared/components/fxdonad-shared/card-excercise/card-excercise.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-using-card-data',
  imports: [CardExcerciseComponent, CommonModule],
  templateUrl: './using-card-data.component.html',
  styleUrl: './using-card-data.component.scss',
})
export class UsingCardDataComponent {
  newDate = new Date();

  data: CardExcercise = {
    id: 'kjdhajsdas-sdadadas-fsdgadfa',
    title: 'Thuật toán tìm kiếm nhị phân sử dụng ngôn ngữ JavaScript',
    description:
      'Bài viết về thuật toán tìm kiếm nhị phân, một thuật toán hiệu quả để tìm kiếm một phần tử trong một mảng đã sắp xếp. Có thể là một thuật toán tuyệt vời',
    uploader: {
      name: 'Nguyễn Văn A',
      avatar: 'https://via.placeholder.com/150',
    },
    uploadTime: this.newDate.toString(),
    difficulty: 'HARD',
    tags: new Set(['tag1', 'tag2', 'tag3', 'tag2', 'tag3', 'tag2', 'tag3']),
    status: 'pending',
    approval: 'pending',
    type: 'QUIZ',
  };
}
