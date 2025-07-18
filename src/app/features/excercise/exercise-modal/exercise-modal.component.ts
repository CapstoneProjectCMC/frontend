import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  CreateExerciseRequest,
  DifficultyLevel,
  ExerciseType,
} from '../../../core/models/exercise.model';

@Component({
  selector: 'app-exercise-modal',
  templateUrl: './exercise-modal.component.html',
  styleUrls: ['./exercise-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class ExerciseModalComponent {
  @Input() isOpen: boolean = false;

  @Output() submitExercise = new EventEmitter<CreateExerciseRequest>();
  @Output() cancel = new EventEmitter<void>();

  exerciseForm: FormGroup;
  difficultyLevels = Object.values(DifficultyLevel);
  exerciseTypes = Object.values(ExerciseType);

  step = 1;

  constructor(private fb: FormBuilder) {
    this.exerciseForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      difficulty: [DifficultyLevel.EASY, Validators.required],
      exerciseType: [ExerciseType.QUIZ, Validators.required],
      orgId: [''],
      cost: [0, [Validators.required, Validators.min(0)]],
      freeForOrg: [false, Validators.required],
      startTime: [''],
      endTime: [''],
      duration: [''],
      allowDiscussionId: [''],
      resourceIds: [''],
      tags: [''],
      allowAiQuestion: [false],
    });
  }

  nextStep() {
    // Validate các trường bắt buộc ở bước 1
    const controls = this.exerciseForm.controls;
    controls['title'].markAsTouched();
    controls['difficulty'].markAsTouched();
    controls['exerciseType'].markAsTouched();
    controls['cost'].markAsTouched();
    controls['freeForOrg'].markAsTouched();
    if (
      controls['title'].valid &&
      controls['difficulty'].valid &&
      controls['exerciseType'].valid &&
      controls['cost'].valid &&
      controls['freeForOrg'].valid
    ) {
      this.step = 2;
    }
  }

  prevStep() {
    this.step = 1;
  }

  onSubmit() {
    if (this.exerciseForm.valid) {
      const formValue = this.exerciseForm.value;
      // Chuyển đổi resourceIds và tags từ string sang array nếu cần
      const resourceIds = formValue.resourceIds
        ? formValue.resourceIds.split(',').map((id: string) => id.trim())
        : [];
      const tags = formValue.tags
        ? formValue.tags.split(',').map((tag: string) => tag.trim())
        : [];
      // Chuyển đổi startTime, endTime sang ISO string có Z nếu có
      const startTime = formValue.startTime
        ? new Date(formValue.startTime).toISOString()
        : undefined;
      const endTime = formValue.endTime
        ? new Date(formValue.endTime).toISOString()
        : undefined;
      const payload: CreateExerciseRequest = {
        ...formValue,
        resourceIds,
        tags,
        startTime,
        endTime,
      };
      this.submitExercise.emit(payload);
    } else {
      this.exerciseForm.markAllAsTouched();
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
