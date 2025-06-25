import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface CardData {
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
}

@Component({
  selector: 'app-card-data',
  imports: [CommonModule],
  templateUrl: './card-data.component.html',
  styleUrl: './card-data.component.scss',
})
export class CardDataComponent {
  @Input() data!: CardData;
  @Input() isDarkMode = false;

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
}
