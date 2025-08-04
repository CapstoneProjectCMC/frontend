import { Component } from '@angular/core';
import {
  QuizComponent,
  QuizQuestionExtends,
} from '../../../shared/components/fxdonad-shared/quiz/quiz.component';
import { ExerciseService } from '../../../core/services/api-service/exercise.service';
import { QuizQuestion } from '../../../core/models/exercise.model';

@Component({
  selector: 'app-using-quiz',
  imports: [QuizComponent],
  templateUrl: './using-quiz.component.html',
  styleUrls: ['./using-quiz.component.scss'],
})
export class UsingQuizComponent {
  questions: Array<QuizQuestionExtends> = [];

  times = 60;

  constructor(private exerciseService: ExerciseService) {}

  ngOnInit() {
    this.exerciseService
      .getExerciseDetails(
        1,
        10,
        'CREATED_AT',
        false,
        'a78b4179-be9c-4934-847e-912c9cde5615'
      )
      .subscribe({
        next: (res) => {
          // Map dữ liệu từ QuizQuestion sang QuizQuestionExtends
          this.questions = this.mapQuizQuestions(
            res.result.quizDetail?.questions ?? []
          );
        },
      });
  }

  /**
   * Map dữ liệu từ QuizQuestion sang QuizQuestionExtends
   * @param quizQuestions - Mảng QuizQuestion từ API
   * @returns Mảng QuizQuestionExtends cho component quiz
   */
  private mapQuizQuestions(
    quizQuestions: QuizQuestion[]
  ): QuizQuestionExtends[] {
    return quizQuestions.map((question, index) => ({
      id: question.id,
      text: question.text,
      questiontype: this.mapQuestionType(question.type),
      points: question.points,
      orderinquiz: question.orderInQuiz,
      options: question.options.map((option) => ({
        id: option.id,
        optiontext: option.optionText,
        order: option.order,
      })),
      done: false, // Mặc định chưa làm
    }));
  }

  /**
   * Map question type từ API sang format mà component quiz cần
   * @param type - Question type từ API
   * @returns Question type cho component quiz
   */
  private mapQuestionType(
    type: string
  ): 'SINGLE_CHOICE' | 'MULTI_CHOICE' | 'FILL_BLANK' {
    switch (type?.toUpperCase()) {
      case 'SINGLE_CHOICE':
        return 'SINGLE_CHOICE';
      case 'MULTIPLE_CHOICE':
      case 'MULTI_CHOICE':
        return 'MULTI_CHOICE';
      case 'FILL_BLANK':
        return 'FILL_BLANK';
      default:
        return 'SINGLE_CHOICE'; // Default fallback
    }
  }
}
