import { Component } from '@angular/core';
import { QuizComponent } from '../../../shared/components/fxdonad-shared/quiz/quiz.component';

@Component({
  selector: 'app-using-quiz',
  imports: [QuizComponent],
  templateUrl: './using-quiz.component.html',
  styleUrls: ['./using-quiz.component.scss'],
})
export class UsingQuizComponent {
  questions = [
    {
      text: 'Câu hỏi H là gì?',
      options: ['A. Đáp án 1', 'B. Đáp án 2', 'C. Đáp án 3', 'D. Đáp án 4'],
      answer: '',
      done: false,
    },
    {
      text: 'Câu hỏi E là gì?',
      options: ['A. Đáp án 1', 'B. Đáp án 2', 'C. Đáp án 3', 'D. Đáp án 4'],
      answer: 'C. Đáp án 3',
      done: true,
    },
    {
      text: 'Câu hỏi J là gì?',
      options: ['A. Đáp án 1', 'B. Đáp án 2', 'C. Đáp án 3', 'D. Đáp án 4'],
    },
    {
      text: 'Câu hỏi R là gì?',
      options: ['A. Đáp án 1', 'B. Đáp án 2', 'C. Đáp án 3', 'D. Đáp án 4'],
    },
    {
      text: 'Câu hỏi M là gì?',
      options: ['A. Đáp án 1', 'B. Đáp án 2', 'C. Đáp án 3', 'D. Đáp án 4'],
    },
  ];

  times = 60;
}
