import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ExerciseQuiz,
  QuizDetailCreateStupid,
  QuizQuestionCreate,
} from '../../../../core/models/exercise.model';
import { BreadcrumbComponent } from '../../../../shared/components/my-shared/breadcum/breadcrumb/breadcrumb.component';
import { ActivatedRoute } from '@angular/router';
import { ExerciseService } from '../../../../core/services/api-service/exercise.service';
import { AddNewQuestionComponent } from '../../exercise-modal/add-new-question/add-new-question.component';
import { sendNotification } from '../../../../shared/utils/notification';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-exercise-details',
  imports: [CommonModule, BreadcrumbComponent, AddNewQuestionComponent],
  templateUrl: './exercise-details.component.html',
  styleUrl: './exercise-details.component.scss',
})
export class ExerciseDetailsComponent implements OnInit {
  isOpenAddNewQuestion = false;
  exerciseId: string | null = '';

  exercise: ExerciseQuiz = {
    id: '',
    userId: '',
    title: '',
    description: '',
    exerciseType: 'QUIZ',
    difficulty: 'EASY',
    orgId: '',
    active: false,
    cost: 0,
    freeForOrg: false,
    startTime: '',
    endTime: '',
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
      questions: [],
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
    private exerciseService: ExerciseService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.exerciseId = this.route.snapshot.paramMap.get('id');
    if (this.exerciseId) {
      // page, size, sort, asc có thể lấy mặc định hoặc từ query param nếu cần
      this.fetchingData(this.exerciseId);
    }
  }

  fetchingData(id: string) {
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

  openAddNewQuestion() {
    this.isOpenAddNewQuestion = true;
  }

  cancelAddNew() {
    this.isOpenAddNewQuestion = false;
  }

  onSubmitQuestion(data: QuizQuestionCreate) {
    if (this.exercise.quizDetail === null) {
      this.exerciseService
        .inititalAddQuestionStupid(this.exercise.id, data)
        .subscribe({
          next: (res) => {
            sendNotification(this.store, 'Thành công', res.message, 'success');
            if (this.exerciseId) {
              // page, size, sort, asc có thể lấy mặc định hoặc từ query param nếu cần
              this.fetchingData(this.exerciseId);
            }
            this.isOpenAddNewQuestion = false;
          },
          error: (err) => {
            console.log(err);
          },
        });
    } else {
      this.exerciseService
        .addQuestionIntoExercise(this.exercise.id, data)
        .subscribe({
          next: (res) => {
            sendNotification(this.store, 'Thành công', res.message, 'success');
            if (this.exerciseId) {
              // page, size, sort, asc có thể lấy mặc định hoặc từ query param nếu cần
              this.fetchingData(this.exerciseId);
            }
            this.isOpenAddNewQuestion = false;
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  getOptionLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }
}
