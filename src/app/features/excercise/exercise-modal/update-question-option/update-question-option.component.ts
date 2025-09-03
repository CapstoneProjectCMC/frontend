import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';

import { Store } from '@ngrx/store';
import { ExerciseService } from '../../../../core/services/api-service/exercise.service';
import { sendNotification } from '../../../../shared/utils/notification';
import { Tooltip } from '../../../../shared/components/fxdonad-shared/tooltip/tooltip';
import {
  QuizOptionWithQuestionRequest,
  QuizQuestionWithOptionRequest,
  QuizQuestion,
} from '../../../../core/models/exercise.model';

@Component({
  selector: 'app-update-question-option',
  templateUrl: './update-question-option.component.html',
  styleUrls: ['./update-question-option.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
})
export class UpdateQuestionOptionComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() exerciseId: string = '';
  @Input() question!: QuizQuestion;

  @Output() updateSuccess = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  step = 1;
  questionForm!: FormGroup;
  originalQuestion: any = null;
  originalOptions: any[] = [];
  isSubmitting = false;
  errorMessage = '';
  noCorrectOptionError: boolean = false;
  emptyOptionError: boolean = false;

  questionTypes = [
    { value: 'SINGLE_CHOICE', label: 'Một đáp án' },
    { value: 'MULTI_CHOICE', label: 'Nhiều đáp án' },
    { value: 'FILL_BLANK', label: 'Điền chỗ trống' },
  ];

  constructor(
    private fb: FormBuilder,
    private exerciseService: ExerciseService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['question'] && this.question) {
      this.initForm();
    }
  }

  private initForm(): void {
    this.originalQuestion = {
      text: this.question.text,
      type: this.question.type,
      points: this.question.points,
      orderInQuiz: this.question.orderInQuiz,
    };

    this.originalOptions = this.question.options.map((option) => ({
      id: option.id,
      optionText: option.optionText,
      correct: option.correct,
      order: option.order,
    }));

    this.questionForm = this.fb.group({
      text: [this.question.text, Validators.required],
      questionType: [this.question.type, Validators.required],
      points: [this.question.points, [Validators.required, Validators.min(1)]],
      orderInQuiz: [
        this.question.orderInQuiz,
        [Validators.required, Validators.min(1)],
      ],
      options: this.fb.array([]),
    });

    const optionsArray = this.questionForm.get('options') as FormArray;
    this.question.options.forEach((option) => {
      optionsArray.push(
        this.fb.group({
          id: [option.id],
          optionText: [option.optionText, Validators.required],
          correct: [option.correct],
          order: [option.order, Validators.required],
          delete: [false],
        })
      );
    });
  }

  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  nextStep(): void {
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

  prevStep(): void {
    this.step = 1;
  }

  timeout() {
    setTimeout(() => {
      this.noCorrectOptionError = false;
      this.emptyOptionError = false;
    }, 3000);
  }

  onSubmit(): void {
    if (this.questionForm.invalid) return;

    // Kiểm tra có đáp án nào rỗng nội dung không (không tính đáp án bị xóa)
    const hasEmptyOption = this.options.controls.some((ctrl) => {
      if (ctrl.get('delete')?.value) return false;
      const text = ctrl.get('optionText')?.value;
      return !text || text.trim() === '';
    });
    if (hasEmptyOption) {
      this.emptyOptionError = true;
      this.timeout();
      return;
    } else {
      this.emptyOptionError = false;
    }

    // Kiểm tra có ít nhất 1 đáp án đúng (không tính đáp án bị xóa)
    const hasCorrect = this.options.controls.some((ctrl) => {
      if (ctrl.get('delete')?.value) return false;
      return ctrl.get('correct')?.value;
    });
    if (!hasCorrect) {
      this.noCorrectOptionError = true;
      this.timeout();
      return;
    } else {
      this.noCorrectOptionError = false;
    }

    this.isSubmitting = true;
    const formValue = this.questionForm.value;

    const dataRequest: QuizQuestionWithOptionRequest = {
      text: formValue.text,
      questionType: formValue.questionType,
      points: formValue.points,
      orderInQuiz: formValue.orderInQuiz,
      options: formValue.options.map((opt: any) => ({
        id: opt.id,
        optionText: opt.optionText,
        correct: opt.correct,
        order: opt.order,
        delete: opt.delete || false,
      })),
    };

    if (this.question?.id) {
      this.exerciseService
        .updateQuestionAndOption(this.exerciseId, this.question.id, dataRequest)
        .subscribe({
          next: () => {
            this.isSubmitting = false;
            sendNotification(
              this.store,
              'Đã cập nhật',
              'Cập nhật thành công',
              'success'
            );
            this.updateSuccess.emit();
          },
          error: (err) => {
            this.isSubmitting = false;
            this.errorMessage = 'Đã xảy ra lỗi khi cập nhật';
          },
        });
    }
  }

  markOptionAsDeleted(index: number): void {
    const option = this.options.at(index);
    if (option) {
      option.get('delete')?.setValue(true);
      option.get('optionText')?.disable();
      option.get('correct')?.disable();
      option.get('order')?.disable();
    }
  }

  onCorrectChange(index: number) {
    if (this.questionForm.get('questionType')?.value === 'SINGLE_CHOICE') {
      this.options.controls.forEach((ctrl, i) => {
        ctrl.get('correct')?.setValue(i === index);
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}
