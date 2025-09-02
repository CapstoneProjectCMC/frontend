// organization-create-modal.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { CreateOrgRequest } from '../../../../core/models/organization.model';

@Component({
  selector: 'app-organization-create-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './organization-create-modal.component.html',
  styleUrls: ['./organization-create-modal.component.scss'],
})
export class OrganizationCreateModalComponent {
  @Input() visible = false;
  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<CreateOrgRequest>();

  createForm: FormGroup;
  // ... các thuộc tính khác
  logoPreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder) {
    this.createForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      status: ['Active', [Validators.required]],
      logo: [null as File | null],
    });
  }

  close() {
    this.closed.emit();
    this.logoPreview = null;
    this.createForm.reset({ status: 'Active' });
  }

  onLogoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Cập nhật file vào form
      this.createForm.patchValue({ logo: file });

      // Tạo preview
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  submit() {
    if (this.createForm.invalid) return;
    const formValue = this.createForm.value;
    const req: CreateOrgRequest = {
      name: formValue.name!,
      description: formValue.description || '',
      email: formValue.email!,
      phone: formValue.phone!,
      address: formValue.address!,
      status: formValue.status!,
      logo: formValue.logo as File,
    };
    this.submitted.emit(req);
    this.close();
  }
}
