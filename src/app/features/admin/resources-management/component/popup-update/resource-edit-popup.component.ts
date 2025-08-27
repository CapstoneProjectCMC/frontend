import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResourceService } from '../../../../../core/services/api-service/resource.service';
import {
  ResourceData,
  Tag,
  FileCategory,
} from '../../../../../core/models/resource.model';
import { sendNotification } from '../../../../../shared/utils/notification';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { clearLoading } from '../../../../../shared/store/loading-state/loading.action';
import { decodeJWT } from '../../../../../shared/utils/stringProcess';
@Component({
  selector: 'app-resource-edit-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resource-edit-popup.component.html',
  styleUrls: ['./resource-edit-popup.component.scss'],
})
export class ResourceEditPopupComponent {
  @Input() resourceId!: string;
  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  resource?: ResourceData;
  isLoading = false;
  errorMessage = '';
  selectedFile?: File;

  tagsInput: string = '';

  constructor(
    private router: Router,
    private resourceService: ResourceService,
    private store: Store
  ) {}

  ngOnInit() {
    if (this.resourceId) {
      this.loadResource(this.resourceId);
    }
  }

  loadResource(id: string) {
    this.isLoading = true;
    this.resourceService.getResourceById(id).subscribe({
      next: (res) => {
        this.resource = res.result as ResourceData;
        this.tagInput =
          this.resource?.tags?.map((t) => t.name).join(', ') || '';
        this.tags = this.resource?.tags?.map((t) => t.name) || [];

        // xác định chế độ hiển thị từ orgId
        this.visibility =
          this.resource?.orgId && this.resource.orgId.trim() !== ''
            ? 'community'
            : 'organization';

        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Không thể tải dữ liệu';
        this.isLoading = false;
      },
    });
  }
  visibility: 'community' | 'organization' = 'organization';

  /////tag
  tagInput: string = ''; // người dùng nhập tag thô
  tags: string[] = []; // danh sách tag dạng string

  handleTagInputChange(value: string | number): void {
    this.tagInput = value.toString();
    this.tags = this.tagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0); // loại bỏ tag rỗng

    console.log('Danh sách tag:', this.tags);
  }

  // handler chọn file mới
  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFile = file;

      // phân loại file
      const fileType = file.type;
      if (
        fileType.includes('pdf') ||
        fileType.includes('msword') ||
        fileType.includes('officedocument.wordprocessingml') ||
        fileType.includes('presentation') ||
        fileType.includes('text')
      ) {
        this.resource!.isTextbook = true;
        this.resource!.isLectureVideo = false;
      } else if (fileType.startsWith('video/')) {
        this.resource!.isLectureVideo = true;
        this.resource!.isTextbook = false;
      } else {
        // reset nếu không match
        this.resource!.isLectureVideo = false;
        this.resource!.isTextbook = false;
      }
    }
  }

  saveChanges() {
    const token = localStorage.getItem('token') ?? '';
    const org_id = decodeJWT(token)?.payload?.org_id ?? null;

    if (!this.resource) return;

    this.resource.orgId = this.visibility === 'community' ? '' : org_id;

    this.isLoading = true;

    this.resourceService
      .editResource(
        this.resource.id,
        this.resource.fileName,
        this.resource.isActive,
        this.selectedFile, // nếu có chọn file thì gửi kèm
        this.resource.category,
        this.resource.description,
        this.tags, // 👈 chỉ gửi string[]
        this.resource.isLectureVideo,
        this.resource.isTextbook,
        // this.resource.orgId,
        this.resource.thumbnailUrl
      )
      .subscribe({
        next: () => {
          this.store.dispatch(clearLoading());
          sendNotification(
            this.store,
            'Đã sửa tài nguyên',
            'Thành công',
            'success'
          );
          this.updated.emit();
          this.close.emit();
        },
        error: (err) => {
          console.error(err);
          sendNotification(
            this.store,
            'Sửa tài nguyên thất bại',
            'Thất bại',
            'error'
          );
          this.store.dispatch(clearLoading());
        },
      });
  }
}
