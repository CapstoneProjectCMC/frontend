import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  QuizQuestionCreate,
  QuizOptionCreate,
} from '../../../../core/models/exercise.model';
import { Tooltip } from '../../../../shared/components/fxdonad-shared/tooltip/tooltip';

@Component({
  selector: 'app-add-new-question',
  templateUrl: './add-new-question.component.html',
  styleUrls: ['./add-new-question.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Tooltip],
})
export class AddNewQuestionComponent {
  @Input() isOpen: boolean = false;
  @Output() submitQuestion = new EventEmitter<QuizQuestionCreate>();
  @Output() cancel = new EventEmitter<void>();

  step = 1;
  questionForm: FormGroup;
  questionTypes = [
    { value: 'SINGLE_CHOICE', label: 'Một đáp án' },
    { value: 'MULTI_CHOICE', label: 'Nhiều đáp án' },
    { value: 'FILL_BLANK', label: 'Điền chỗ trống' },
  ];

  constructor(private fb: FormBuilder) {
    this.questionForm = this.fb.group({
      text: ['', Validators.required],
      questionType: ['SINGLE_CHOICE', Validators.required],
      points: [1, [Validators.required, Validators.min(1)]],
      orderInQuiz: [1, [Validators.required, Validators.min(1)]],
      options: this.fb.array([]),
    });
    // Khởi tạo 2 option mặc định
    this.addOption();
    this.addOption();
  }

  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  addOption() {
    this.options.push(
      this.fb.group({
        optionText: [''], // Không có Validators.required
        correct: [false],
        order: [String.fromCharCode(65 + this.options.length)], // A, B, C, ...
      })
    );
  }

  removeOption(index: number) {
    if (this.options.length > 2) {
      this.options.removeAt(index);
      // Cập nhật lại order cho các option còn lại
      this.options.controls.forEach((ctrl, i) => {
        ctrl.get('order')?.setValue(String.fromCharCode(65 + i));
      });
    }
  }

  nextStep() {
    const controls = this.questionForm.controls;
    controls['text'].markAsTouched();
    controls['questionType'].markAsTouched();
    controls['points'].markAsTouched();
    controls['orderInQuiz'].markAsTouched();
    if (
      controls['text'].valid &&
      controls['questionType'].valid &&
      controls['points'].valid &&
      controls['orderInQuiz'].valid
    ) {
      this.step = 2;
    }
  }

  prevStep() {
    this.step = 1;
  }

  onSubmit() {
    if (this.questionForm.valid && this.options.length >= 2) {
      const value = this.questionForm.value;
      // Lọc bỏ option không có nội dung
      const filteredOptions = value.options.filter(
        (opt: any) => !!opt.optionText && opt.optionText.trim() !== ''
      );
      const question: QuizQuestionCreate = {
        text: value.text,
        questionType: value.questionType,
        points: value.points,
        orderInQuiz: value.orderInQuiz,
        options: filteredOptions.map((opt: any) => ({
          optionText: opt.optionText,
          correct: !!opt.correct,
          order: opt.order,
        })),
      };
      this.submitQuestion.emit(question);
    } else {
      this.questionForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}
