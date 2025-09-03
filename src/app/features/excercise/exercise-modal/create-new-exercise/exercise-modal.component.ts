import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  FormControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  CreateExerciseRequest,
  DifficultyLevel,
  ExerciseType,
} from '../../../../core/models/exercise.model';
import {
  FilterOrgs,
  OrganizationResponse,
} from '../../../../core/models/organization.model';
import { OrganizationService } from '../../../../core/services/api-service/organization.service';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { of } from 'rxjs/internal/observable/of';
import { TruncatePipe } from '../../../../shared/pipes/format-view.pipe';

@Component({
  selector: 'app-exercise-modal',
  templateUrl: './exercise-modal.component.html',
  styleUrls: ['./exercise-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TruncatePipe],
})
export class ExerciseModalComponent {
  @Input() isOpen: boolean = false;

  @Output() submitExercise = new EventEmitter<CreateExerciseRequest>();
  @Output() cancel = new EventEmitter<void>();

  orgSearchControl = new FormControl('');
  exerciseForm: FormGroup;
  difficultyLevels = Object.values(DifficultyLevel);
  exerciseTypes = Object.values(ExerciseType);
  loading = false;

  orgs: OrganizationResponse[] = [];

  step = 1;
  totalData = 0;
  page = 1;
  size = 10;

  constructor(
    private fb: FormBuilder,
    private orgService: OrganizationService
  ) {
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
      visibility: [false, Validators.required],
    });
  }

  ngOnInit() {
    // Lắng nghe search input
    this.orgSearchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((term) => {
          if (!term || term.trim() === '') {
            return of({ result: { data: [], totalElements: 0 } });
          }
          const filters: FilterOrgs = {
            q: term,
            status: 'Active',
            includeBlocks: true,
            blocksPage: 1,
            blocksSize: 5,
            includeUnassigned: true,
          };
          return this.orgService.searchOrgsFilter(
            this.page,
            this.size,
            filters
          );
        })
      )
      .subscribe((res) => {
        this.orgs = res.result.data;
        this.totalData = res.result.totalElements;
      });
  }

  selectOrg(org: OrganizationResponse) {
    this.exerciseForm.patchValue({ orgId: org.id });
    this.orgs = []; // đóng dropdown
    this.orgSearchControl.setValue(org.name, { emitEvent: false }); // hiển thị tên
  }

  clearOrg() {
    this.exerciseForm.patchValue({ orgId: '' });
    this.orgSearchControl.setValue('');
  }

  getOrgName(id: string): string {
    const org = this.orgs.find((o) => o.id === id);
    return org ? org.name : id;
  }
  nextStep() {
    // Validate các trường bắt buộc ở bước 1
    const controls = this.exerciseForm.controls;
    controls['title'].markAsTouched();
    controls['difficulty'].markAsTouched();
    controls['exerciseType'].markAsTouched();
    controls['cost'].markAsTouched();
    controls['visibility'].markAsTouched();
    controls['freeForOrg'].markAsTouched();
    if (
      controls['title'].valid &&
      controls['difficulty'].valid &&
      controls['exerciseType'].valid &&
      controls['cost'].valid &&
      controls['visibility'].valid &&
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
