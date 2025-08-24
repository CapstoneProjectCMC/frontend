import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GenerateExerciseResponse } from '../../../../core/models/ai-feature.model';
import { AiGenerateService } from '../../../../core/services/api-service/ai-generate.service';
import { CommonModule } from '@angular/common';

type Step = 'selectType' | 'fillForm';
type ExerciseType = 'QUIZ' | 'CODING';

@Component({
  selector: 'app-generate-exercise-modal',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './generate-exercise.component.html',
  styleUrl: './generate-exercise.component.scss',
})
export class GenerateExerciseModalComponent {
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();
  @Output() exerciseCreated = new EventEmitter<GenerateExerciseResponse>();

  currentStep: Step = 'selectType';
  selectedType: ExerciseType | null = null;
  exerciseForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private aiGenerateService: AiGenerateService
  ) {}

  selectType(type: ExerciseType) {
    this.selectedType = type;
    this.buildForm();
    this.currentStep = 'fillForm';
  }

  goToStep1() {
    this.currentStep = 'selectType';
    this.errorMessage = ''; // Reset lỗi khi quay lại
  }

  buildForm() {
    // Các trường chung
    const commonControls = {
      title: ['', Validators.required],
      description: ['', Validators.required],
      difficulty: ['EASY', Validators.required],
      duration: [10, [Validators.required, Validators.min(1)]],
      tags: [[]],
    };

    let specificControls = {};
    if (this.selectedType === 'QUIZ') {
      specificControls = {
        numQuestions: [5, [Validators.required, Validators.min(1)]],
      };
    } else if (this.selectedType === 'CODING') {
      specificControls = {
        allowedLanguages: [['javascript', 'python'], Validators.required],
        timeLimit: [1000, Validators.required],
        memoryLimit: [256, Validators.required],
        maxSubmissions: [10, Validators.required],
        numTestCases: [5, Validators.required],
      };
    }

    this.exerciseForm = this.fb.group({
      exercisePromptIn: this.fb.group(commonControls),
      ...specificControls,
    });
  }

  updateTags(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    const tags = input
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);
    this.exerciseForm.get('exercisePromptIn.tags')?.setValue(tags);
  }

  updateAllowedLanguages(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    const langs = input
      .split(',')
      .map((l) => l.trim())
      .filter((l) => l);
    this.exerciseForm.get('allowedLanguages')?.setValue(langs);
  }

  onSubmit() {
    if (this.exerciseForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const formData = this.exerciseForm.value;

    if (this.selectedType === 'QUIZ') {
      this.aiGenerateService.generateQuizExercise(formData).subscribe({
        next: (res) => this.handleSuccess(res.result),
        error: (err) => this.handleError(err),
      });
    } else if (this.selectedType === 'CODING') {
      this.aiGenerateService.generateCodeExercise(formData).subscribe({
        next: (res) => this.handleSuccess(res.result),
        error: (err) => this.handleError(err),
      });
    }
  }

  handleSuccess(response: GenerateExerciseResponse) {
    this.isLoading = false;
    this.exerciseCreated.emit(response);
    // Có thể thêm hiệu ứng success trước khi đóng
    this.closeModal();
  }

  handleError(error: any) {
    this.isLoading = false;
    this.errorMessage = error.message || 'Đã có lỗi xảy ra, vui lòng thử lại.';
  }

  closeModal() {
    if (this.isLoading) {
      return;
    }
    this.close.emit();
    // Reset về trạng thái ban đầu cho lần mở sau
    this.isVisible = false;
    setTimeout(() => {
      this.currentStep = 'selectType';
      this.selectedType = null;
      this.isLoading = false;
      this.errorMessage = '';
    }, 300); // Trùng với thời gian transition
  }
}
