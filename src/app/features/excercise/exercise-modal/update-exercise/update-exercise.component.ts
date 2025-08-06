import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  DifficultyLevel,
  ExerciseQuiz,
  PatchUpdateExerciseRequest,
} from '../../../../core/models/exercise.model';
import { ExerciseService } from '../../../../core/services/api-service/exercise.service';
import { Store } from '@ngrx/store';
import { sendNotification } from '../../../../shared/utils/notification';

@Component({
  selector: 'app-update-exercise',
  templateUrl: './update-exercise.component.html',
  styleUrls: ['./update-exercise.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class UpdateExerciseComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() exercise!: ExerciseQuiz;

  @Output() updateSuccess = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  exerciseForm!: FormGroup;
  difficultyLevels = Object.values(DifficultyLevel);
  step = 1;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private exerciseService: ExerciseService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(): void {
    if (this.exercise && this.exerciseForm) {
      this.updateFormValues();
    }
  }

  private initForm(): void {
    this.exerciseForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      difficulty: [DifficultyLevel.EASY, Validators.required],
      cost: [0, [Validators.required, Validators.min(0)]],
      freeForOrg: [false, Validators.required],
      startTime: [''],
      endTime: [''],
      duration: [0],
      allowDiscussionId: [''],
      resourceIds: [''],
      tags: [''],
      allowAiQuestion: [false],
      visibility: [false, Validators.required],
    });

    if (this.exercise) {
      this.updateFormValues();
    }
  }

  private updateFormValues(): void {
    // Format dates for datetime-local input
    const startTime = this.exercise.startTime
      ? new Date(this.exercise.startTime).toISOString().slice(0, 16)
      : '';
    const endTime = this.exercise.endTime
      ? new Date(this.exercise.endTime).toISOString().slice(0, 16)
      : '';

    // Format resourceIds and tags for display
    const resourceIds = this.exercise.resourceIds
      ? this.exercise.resourceIds.join(', ')
      : '';
    const tags = this.exercise.tags ? this.exercise.tags.join(', ') : '';

    this.exerciseForm.patchValue({
      title: this.exercise.title,
      description: this.exercise.description,
      difficulty: this.exercise.difficulty,
      cost: this.exercise.cost,
      freeForOrg: this.exercise.freeForOrg,
      visibility: this.exercise.visibility,
      startTime: startTime,
      endTime: endTime,
      duration: this.exercise.duration,
      allowDiscussionId: this.exercise.allowDiscussionId,
      resourceIds: resourceIds,
      tags: tags,
      allowAiQuestion: this.exercise.allowAiQuestion,
    });
  }

  nextStep(): void {
    // Validate các trường bắt buộc ở bước 1
    const controls = this.exerciseForm.controls;
    controls['title'].markAsTouched();
    controls['difficulty'].markAsTouched();
    controls['cost'].markAsTouched();
    controls['freeForOrg'].markAsTouched();
    controls['visibility'].markAsTouched();

    if (
      controls['title'].valid &&
      controls['difficulty'].valid &&
      controls['cost'].valid &&
      controls['visibility'].valid &&
      controls['freeForOrg'].valid
    ) {
      this.step = 2;
    }
  }

  prevStep(): void {
    this.step = 1;
  }

  onSubmit(): void {
    if (this.exerciseForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const formValue = this.exerciseForm.value;

      // Chuyển đổi resourceIds và tags từ string sang array
      const resourceIds = formValue.resourceIds
        ? formValue.resourceIds.split(',').map((id: string) => id.trim())
        : [];

      const tags = formValue.tags
        ? formValue.tags.split(',').map((tag: string) => tag.trim())
        : [];

      // Chuyển đổi startTime, endTime sang ISO string
      const startTime = formValue.startTime
        ? new Date(formValue.startTime).toISOString()
        : '';

      const endTime = formValue.endTime
        ? new Date(formValue.endTime).toISOString()
        : '';

      const payload: PatchUpdateExerciseRequest = {
        ...formValue,
        resourceIds,
        tags,
        startTime,
        endTime,
      };

      this.exerciseService.updateExercise(this.exercise.id, payload).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          sendNotification(this.store, 'Thành công', res.message, 'success');
          this.updateSuccess.emit();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage =
            error.message || 'Có lỗi xảy ra khi cập nhật bài tập';
          console.error('Update exercise error:', error);
        },
      });
    } else {
      this.exerciseForm.markAllAsTouched();
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
