import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  EditOrgRequest,
  OrganizationInfo,
} from '../../../../core/models/organization.model';
import { OrganizationService } from '../../../../core/services/api-service/organization.service';
import { finalize } from 'rxjs/internal/operators/finalize';
import { FormsModule } from '@angular/forms';
import { sendNotification } from '../../../../shared/utils/notification';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-details-organization',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './details-organization.component.html',
  styleUrls: ['./details-organization.component.scss'],
})
export class DetailsOrganizationComponent implements OnInit {
  organization: OrganizationInfo | null = null;
  isLoading = true;

  isEditing = false;
  editForm: EditOrgRequest = {};

  isSaving = false;

  constructor(
    private route: ActivatedRoute,
    private organizationService: OrganizationService,
    private store: Store
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['orgId'];
      this.loadOrganization(id);
    });
  }

  private loadOrganization(id: string) {
    this.isLoading = true;
    this.organizationService.getOrgDetails(id).subscribe({
      next: (res) => {
        this.organization = res.result;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }

  getStatusLabel(status: number | string): string {
    switch (status) {
      case 'Active':
        return 'Hoạt động';
      case 1:
        return 'Tạm ngưng';
      case 2:
        return 'Chờ duyệt';
      default:
        return 'Không xác định';
    }
  }

  getStatusClass(status: number | string): string {
    switch (status) {
      case 'Active':
        return 'status-active';
      case 1:
        return 'status-inactive';
      case 2:
        return 'status-pending';
      default:
        return 'status-unknown';
    }
  }

  enableEdit() {
    if (!this.organization) return;
    this.isEditing = true;
    this.editForm = {
      description: this.organization.description ?? undefined,
      email: this.organization.email,
      phone: this.organization.phone,
      address: this.organization.address,
      status: this.organization.status,
    };
  }

  cancelEdit() {
    this.isEditing = false;
    this.editForm = {};
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.editForm.logo = file;
    }
  }

  saveEdit() {
    if (!this.organization) return;

    this.isSaving = true;
    this.organizationService
      .editOrg(this.organization.id, this.editForm)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          this.isEditing = false;
          // reload lại org info sau khi edit thành công
          Object.assign(this.organization!, this.editForm, {
            logoUrl: this.editForm.logo
              ? URL.createObjectURL(this.editForm.logo)
              : this.organization?.logoUrl,
          });

          sendNotification(
            this.store,
            'Đã cập nhật',
            'Cập nhật thông tin tổ chức thành công',
            'success'
          );
        },
        error: (err) => {
          console.error('Edit failed', err);
        },
      });
  }
}
