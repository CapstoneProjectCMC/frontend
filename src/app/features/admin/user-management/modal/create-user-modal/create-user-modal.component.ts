import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { OrganizationResponse } from '../../../../../core/models/organization.model';
import { UserService } from '../../../../../core/services/api-service/user.service';
import { OrganizationService } from '../../../../../core/services/api-service/organization.service';
import { CreateAccoutByAdmin } from '../../../../../core/models/user.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-user-modal',
  templateUrl: './create-user-modal.component.html',
  styleUrls: ['./create-user-modal.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class CreateUserModalComponent implements OnInit, OnDestroy {
  // --- Inputs & Outputs ---
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() userCreated = new EventEmitter<void>();

  // --- State Management ---
  currentStep = 1;
  isSubmitting = false;

  // --- Organization Search ---
  organizationSearch$ = new Subject<string>();
  isSearchingOrgs = false;
  searchedOrganizations: OrganizationResponse[] = [];
  selectedOrganizationName: string | null = null;
  showOrgDropdown = false;

  educationOptions = [
    { value: 0, label: 'Không tiết lộ' },
    { value: 1, label: 'Tiểu học' }, // Lớp 1 - 5
    { value: 2, label: 'Trung học cơ sở' }, // Lớp 6 - 9
    { value: 3, label: 'Trung học phổ thông' }, // Lớp 10 - 12
    { value: 4, label: 'Trung cấp' },
    { value: 5, label: 'Cao đẳng' },
    { value: 6, label: 'Đại học' },
    { value: 7, label: 'Cao học / Thạc sĩ' },
    { value: 8, label: 'Tiến sĩ' },
    { value: 9, label: 'Khác' },
  ];

  // --- Forms ---
  createUserForm: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private userService: UserService, // Inject API service
    private orgService: OrganizationService
  ) {
    this.createUserForm = this.fb.group({
      // Step 1
      role: ['STUDENT', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      displayName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      dob: ['', Validators.required],
      gender: [true, Validators.required],

      // Step 2
      bio: [''],
      education: [0],
      links: [''],
      city: [''],
      organizationId: [''],
      organizationMemberRole: ['STUDENT', Validators.required],
    });
  }

  ngOnInit(): void {
    this.handleOrganizationSearch();
  }

  handleOrganizationSearch(): void {
    this.organizationSearch$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((query) => {
          if (!query || query.length < 2) {
            this.searchedOrganizations = [];
            this.showOrgDropdown = false;
            return [];
          }
          this.isSearchingOrgs = true;
          this.showOrgDropdown = true;
          // Gọi API tìm kiếm
          return this.orgService.searchOrgsFilter(1, 10, { q: query });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((response) => {
        this.isSearchingOrgs = false;
        this.searchedOrganizations = response.result.data; // Giả sử API trả về cấu trúc này
      });
  }

  onOrgSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.organizationSearch$.next(query);
  }

  selectOrganization(org: OrganizationResponse): void {
    this.selectedOrganizationName = org.name;
    this.createUserForm.get('organizationId')?.setValue(org.id);
    this.showOrgDropdown = false;
    this.searchedOrganizations = [];
  }

  // --- Step Navigation ---
  nextStep(): void {
    if (this.currentStep === 1) {
      // Logic validate các trường của step 1 nếu cần
      this.currentStep = 2;
    }
  }

  prevStep(): void {
    if (this.currentStep === 2) {
      this.currentStep = 1;
    }
  }

  // --- Actions ---
  closeModal(): void {
    // this.resetForm();
    this.close.emit();
  }

  onSubmit(): void {
    if (this.createUserForm.invalid) {
      this.createUserForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formValue = this.createUserForm.value;

    // Tách role (chỉ để gọi API)
    const role: 'ADMIN' | 'STUDENT' | 'TEACHER' = formValue.role;

    if (formValue.dob && !formValue.dob.endsWith('T00:00:00Z')) {
      formValue.dob = formValue.dob + 'T00:00:00Z';
    }

    // Đảm bảo đúng kiểu CreateAccoutByAdmin
    const data: CreateAccoutByAdmin = {
      username: formValue.username,
      email: formValue.email,
      password: formValue.password,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      dob: formValue.dob,
      bio: formValue.bio,
      gender: formValue.gender === true || formValue.gender === 'true',
      displayName: formValue.displayName,
      education: Number(formValue.education) || 0,
      links: formValue.links.split(','),
      city: formValue.city,
      organizationId: formValue.organizationId,
      organizationMemberRole: formValue.organizationMemberRole,
    };

    this.userService
      .createAccountUser(role, data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('User created successfully!');
          this.isSubmitting = false;
          this.userCreated.emit();
          this.closeModal();
        },
        error: (err) => {
          console.error('Failed to create user:', err);
          this.isSubmitting = false;
        },
      });
  }

  resetForm(): void {
    this.createUserForm.reset({
      ...this.createUserForm.value, // giữ lại role
      gender: false,
      organizationMemberRole: this.createUserForm.value.role || 'STUDENT',
    });
    this.currentStep = 1;
    this.isSubmitting = false;
    this.selectedOrganizationName = null;
    this.searchedOrganizations = [];
    this.showOrgDropdown = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Helper để truy cập controls trong template
  get f() {
    return this.createUserForm.controls;
  }
}
