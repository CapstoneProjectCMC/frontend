import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';


@Component({
  selector: 'app-add-new-option',
  templateUrl: './add-new-option.component.html',
  styleUrls: ['./add-new-option.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
})
export class AddNewOptionComponent {
  @Input() isOpen: boolean = false;
  @Output() submitOption = new EventEmitter<{
    optionText: string;
    correct: boolean;
    order: string;
  }>();
  @Output() cancel = new EventEmitter<void>();

  optionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.optionForm = this.fb.group({
      optionText: ['', Validators.required],
      correct: [false, Validators.required],
      order: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.optionForm.valid) {
      this.submitOption.emit(this.optionForm.value);
    } else {
      this.optionForm.markAllAsTouched();
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
