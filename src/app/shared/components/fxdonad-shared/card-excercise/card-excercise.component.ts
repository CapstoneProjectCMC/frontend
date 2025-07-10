import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TruncatePipe } from '../../../pipes/format-view.pipe';

export interface CardExcercise {
  name: string;
  description: string;
  uploader: {
    name: string;
    avatar: string;
  };
  uploadTime: Date;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  status: 'completed' | 'pending';
  approval: 'accepted' | 'pending' | 'rejected';
  type: 'code' | 'quiz';
}

@Component({
  selector: 'app-card-excercise',
  imports: [CommonModule, TruncatePipe],
  templateUrl: './card-excercise.component.html',
  styleUrl: './card-excercise.component.scss',
})
export class CardExcerciseComponent {
  @Input() data!: CardExcercise;
  @Input() isDarkMode = false;

  role: string = 'admin';
  isExpanded = false;
  isSaved = false;
  difficultyStars = [1, 2, 3];
  difficultyLevel = 1;

  ngOnInit() {
    this.setDifficultyLevel();
  }

  setDifficultyLevel() {
    switch (this.data.difficulty) {
      case 'easy':
        this.difficultyLevel = 1;
        break;
      case 'medium':
        this.difficultyLevel = 2;
        break;
      case 'hard':
        this.difficultyLevel = 3;
        break;
    }
  }

  toggleDescription() {
    this.isExpanded = !this.isExpanded;
  }

  toggleStatus() {
    this.data.status =
      this.data.status === 'completed' ? 'pending' : 'completed';
  }

  toggleSave() {
    this.isSaved = !this.isSaved;
  }

  onTagClick(tag: string) {
    console.log(`Tag clicked: ${tag}`);
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src =
      'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50';
  }

  onEdit() {
    // TODO: Thêm logic chỉnh sửa bài tập ở đây
    console.log('Edit exercise', this.data);
  }

  onDelete() {
    // TODO: Thêm logic xóa bài tập ở đây
    console.log('Delete exercise', this.data);
  }

  onApprove(status: 'accepted' | 'rejected') {
    // TODO: Thêm logic duyệt bài tập ở đây
    this.data.approval = status;
    console.log('Approval changed to', status, this.data);
  }
}
