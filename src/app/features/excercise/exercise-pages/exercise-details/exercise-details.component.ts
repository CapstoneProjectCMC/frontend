import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ExerciseQuiz } from '../../../../core/models/exercise.model';
import { BreadcrumbComponent } from '../../../../shared/components/my-shared/breadcum/breadcrumb/breadcrumb.component';
import { ActivatedRoute } from '@angular/router';
import { ExerciseService } from '../../../../core/services/api-service/exercise.service';

@Component({
  selector: 'app-exercise-details',
  imports: [CommonModule, BreadcrumbComponent],
  templateUrl: './exercise-details.component.html',
  styleUrl: './exercise-details.component.scss',
})
export class ExerciseDetailsComponent implements OnInit {
  exercise: ExerciseQuiz = {
    id: 'Không có',
    userId: 'Không có',
    title: 'Chưa có nội dung',
    description: 'Chưa có nội dung',
    exerciseType: 'QUIZ',
    difficulty: 'EASY',
    orgId: '',
    active: false,
    cost: 0,
    freeForOrg: false,
    startTime: '2024-06-01T00:00:00Z',
    endTime: '2024-06-10T23:59:00Z',
    duration: 0,
    allowDiscussionId: 'chưa có',
    resourceIds: ['chưa có', 'chưa có'],
    tags: [],
    allowAiQuestion: false,
    quizDetail: {
      id: 'Mẫu 1',
      numQuestions: 0,
      totalPoints: 20,
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,
      totalElements: 0,
      questions: [
        {
          id: 'q1',
          text: 'Ví dụ 1',
          points: 10,
          type: 'SINGLE_CHOICE',
          orderInQuiz: 1,
          options: [
            {
              id: 'o1',
              optionText: '3',
              correct: false,
              order: 'A',
              createdBy: '',
              createdAt: '',
              updatedBy: '',
              updatedAt: '',
              deletedBy: '',
              deletedAt: '',
            },
            {
              id: 'o2',
              optionText: '4',
              correct: true,
              order: 'B',
              createdBy: '',
              createdAt: '',
              updatedBy: '',
              updatedAt: '',
              deletedBy: '',
              deletedAt: '',
            },
            {
              id: 'o3',
              optionText: '5',
              correct: false,
              order: 'C',
              createdBy: '',
              createdAt: '',
              updatedBy: '',
              updatedAt: '',
              deletedBy: '',
              deletedAt: '',
            },
            {
              id: 'o4',
              optionText: '6',
              correct: false,
              order: 'D',
              createdBy: '',
              createdAt: '',
              updatedBy: '',
              updatedAt: '',
              deletedBy: '',
              deletedAt: '',
            },
          ],
          createdBy: '',
          createdAt: '',
          updatedBy: '',
          updatedAt: '',
          deletedBy: '',
          deletedAt: '',
        },
        {
          id: 'q2',
          text: 'Ví dụ 2',
          points: 10,
          type: 'SINGLE_CHOICE',
          orderInQuiz: 2,
          options: [
            {
              id: 'o1',
              optionText: 'Lựa chọn 1',
              correct: true,
              order: 'A',
              createdBy: '',
              createdAt: '',
              updatedBy: '',
              updatedAt: '',
              deletedBy: '',
              deletedAt: '',
            },
            {
              id: 'o2',
              optionText: 'Lựa chọn 2',
              correct: false,
              order: 'B',
              createdBy: '',
              createdAt: '',
              updatedBy: '',
              updatedAt: '',
              deletedBy: '',
              deletedAt: '',
            },
            {
              id: 'o3',
              optionText: 'Lựa chọn 3',
              correct: false,
              order: 'C',
              createdBy: '',
              createdAt: '',
              updatedBy: '',
              updatedAt: '',
              deletedBy: '',
              deletedAt: '',
            },
            {
              id: 'o4',
              optionText: 'Lựa chọn 4',
              correct: false,
              order: 'D',
              createdBy: '',
              createdAt: '',
              updatedBy: '',
              updatedAt: '',
              deletedBy: '',
              deletedAt: '',
            },
          ],
          createdBy: '',
          createdAt: '',
          updatedBy: '',
          updatedAt: '',
          deletedBy: '',
          deletedAt: '',
        },
        {
          id: 'q2',
          text: 'Ví dụ FILL_BLANK ____',
          points: 10,
          type: 'FILL_BLANK',
          orderInQuiz: 2,
          options: [],
          createdBy: '',
          createdAt: '',
          updatedBy: '',
          updatedAt: '',
          deletedBy: '',
          deletedAt: '',
        },
        {
          id: 'q2',
          text: 'Biến trong lập trình là gì?',
          points: 10,
          type: 'MULTI_CHOICE',
          orderInQuiz: 2,
          options: [
            {
              id: 'o1',
              optionText: 'Hàm',
              correct: false,
              order: 'A',
              createdBy: '',
              createdAt: '',
              updatedBy: '',
              updatedAt: '',
              deletedBy: '',
              deletedAt: '',
            },
            {
              id: 'o2',
              optionText: 'Giá trị lưu trữ',
              correct: true,
              order: 'B',
              createdBy: '',
              createdAt: '',
              updatedBy: '',
              updatedAt: '',
              deletedBy: '',
              deletedAt: '',
            },
            {
              id: 'o3',
              optionText: 'Câu lệnh',
              correct: false,
              order: 'C',
              createdBy: '',
              createdAt: '',
              updatedBy: '',
              updatedAt: '',
              deletedBy: '',
              deletedAt: '',
            },
            {
              id: 'o4',
              optionText: 'Vòng lặp',
              correct: false,
              order: 'D',
              createdBy: '',
              createdAt: '',
              updatedBy: '',
              updatedAt: '',
              deletedBy: '',
              deletedAt: '',
            },
          ],
          createdBy: '',
          createdAt: '',
          updatedBy: '',
          updatedAt: '',
          deletedBy: '',
          deletedAt: '',
        },
      ],
      createdBy: '',
      createdAt: '',
      updatedBy: '',
      updatedAt: '',
      deletedBy: '',
      deletedAt: '',
    },
    createdBy: '',
    createdAt: '',
    updatedBy: '',
    updatedAt: '',
    deletedBy: '',
    deletedAt: '',
  };
  difficultyStars = [1, 2, 3];
  difficultyLevel = 1;

  constructor(
    private route: ActivatedRoute,
    private exerciseService: ExerciseService
  ) {}

  setDifficultyLevel() {
    switch (this.exercise.difficulty) {
      case 'EASY':
        this.difficultyLevel = 1;
        break;
      case 'MEDIUM':
        this.difficultyLevel = 2;
        break;
      case 'HARD':
        this.difficultyLevel = 3;
        break;
    }
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // page, size, sort, asc có thể lấy mặc định hoặc từ query param nếu cần
      this.exerciseService
        .getExerciseDetails(1, 10, 'CREATED_AT', false, id)
        .subscribe({
          next: (res) => {
            if (res && res.result) {
              this.exercise = res.result;
              this.setDifficultyLevel();
              console.log(this.exercise.tags);
            }
          },
          error: (err) => {
            // Xử lý lỗi nếu cần
            console.error('Lỗi lấy chi tiết bài tập:', err);
          },
        });
    }
  }

  getOptionLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }
}
