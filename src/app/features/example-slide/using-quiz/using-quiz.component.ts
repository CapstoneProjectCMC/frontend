import { Component } from '@angular/core';
import { QuizComponent } from '../../../shared/components/fxdonad-shared/quiz/quiz.component';
import { ExerciseService } from '../../../core/services/api-service/exercise.service';
import { QuizQuestion } from '../../../core/models/exercise.model';

@Component({
  selector: 'app-using-quiz',
  imports: [QuizComponent],
  templateUrl: './using-quiz.component.html',
  styleUrls: ['./using-quiz.component.scss'],
})
export class UsingQuizComponent {
  questions: Array<QuizQuestion> = [
    // {
    //   text: 'Câu hỏi H là gì?',
    //   options: ['A. Đáp án 1', 'B. Đáp án 2', 'C. Đáp án 3', 'D. Đáp án 4'],
    //   answer: '',
    //   done: false,
    // },
    // {
    //   text: 'Câu hỏi E là gì?',
    //   options: ['A. Đáp án 1', 'B. Đáp án 2', 'C. Đáp án 3', 'D. Đáp án 4'],
    //   answer: 'C. Đáp án 3',
    //   done: true,
    // },
    // {
    //   text: 'Câu hỏi J là gì?',
    //   options: ['A. Đáp án 1', 'B. Đáp án 2', 'C. Đáp án 3', 'D. Đáp án 4'],
    // },
    // {
    //   text: 'Câu hỏi R là gì?',
    //   options: ['A. Đáp án 1', 'B. Đáp án 2', 'C. Đáp án 3', 'D. Đáp án 4'],
    // },
    // {
    //   text: 'Câu hỏi M là gì?',
    //   options: ['A. Đáp án 1', 'B. Đáp án 2', 'C. Đáp án 3', 'D. Đáp án 4'],
    // },
  ];

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
          this.questions = res.result.quizDetail?.questions ?? [];
        },
      });
  }
}
