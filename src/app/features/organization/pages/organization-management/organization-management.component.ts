import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import { OrganizationService } from '../../../../core/services/api-service/organization.service';
import {
  CreateOrgRequest,
  FilterOrgs,
  ImportMemberResponse, // Import model FilterOrgs
  OrganizationResponse,
} from '../../../../core/models/organization.model';
import { PaginationComponent } from '../../../../shared/components/fxdonad-shared/pagination/pagination.component';
import {
  lottieOptions2,
  lottieOptionsLoading1,
} from '../../../../core/constants/value.constant';
import { LottieComponent } from 'ngx-lottie';
import { OrganizationCreateModalComponent } from '../../organization-component/organization-create-modal/organization-create-modal.component';
import { Router } from '@angular/router';
import { sendNotification } from '../../../../shared/utils/notification';
import { Store } from '@ngrx/store';
import {
  clearLoading,
  setLoading,
} from '../../../../shared/store/loading-state/loading.action';
import { decodeJWT } from '../../../../shared/utils/stringProcess';
import { AuthService } from '../../../../core/services/api-service/auth.service';
import { getUserId } from '../../../../shared/utils/userInfo';

@Component({
  selector: 'app-organization-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationComponent,
    LottieComponent,
    OrganizationCreateModalComponent,
  ],
  templateUrl: './organization-management.component.html',
  styleUrls: ['./organization-management.component.scss'],
})
export class OrganizationManagementComponent implements OnInit, OnDestroy {
  orgs: OrganizationResponse[] = [];
  loading = false;
  showCreateModal = false;
  showDeleteConfirm = false;
  selectedOrgId: string | null = null;

  lottieOptions = lottieOptions2;
  lottieOptionsLoading = lottieOptionsLoading1;
  myOrgId = '';
  ownerOrgId = '';
  myId = '';

  // Pagination state
  page = 1;
  size = 6; // Tăng size để hiển thị nhiều card hơn
  totalData = 0;

  // Search and Filter state
  searchControl = new FormControl('');
  onlyMyOrgControl = new FormControl(false);
  private destroy$ = new Subject<void>();

  createForm!: FormGroup;
  importResult: ImportMemberResponse | null = null;

  constructor(
    private orgService: OrganizationService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit() {
    this.myOrgId = decodeJWT(localStorage.getItem('token')).payload.org_id;
    this.myId = getUserId();

    this.initCreateForm();
    this.loadOrgs();
    this.listenToSearchChanges();
    this.listenToOnlyMyOrgChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initCreateForm() {
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

  private listenToOnlyMyOrgChanges() {
    this.onlyMyOrgControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.page = 1; // reset về page 1 khi filter thay đổi
        this.loadOrgs();
      });
  }

  // Lắng nghe sự kiện nhập liệu vào ô search
  private listenToSearchChanges() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500), // Chờ 500ms sau khi người dùng ngừng gõ
        distinctUntilChanged(), // Chỉ gọi API nếu giá trị thay đổi
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.page = 1; // Reset về trang 1 mỗi khi tìm kiếm
        this.loadOrgs();
      });
  }

  refreshTokenAfterCreatedOrg() {
    const token = localStorage.getItem('token') ?? '';

    this.authService.refreshToken(token).subscribe({
      next: (res) => {
        localStorage.setItem('refreshToken', res.result.refreshToken);
        localStorage.setItem('token', res.result.accessToken);
      },
    });
  }

  loadOrgs() {
    this.loading = true;
    const searchTerm = this.searchControl.value || '';
    const onlyMyOrg = this.onlyMyOrgControl.value;

    const filters: FilterOrgs = {
      q: searchTerm,
      status: 'Active',
      includeBlocks: true,
      blocksPage: 1,
      blocksSize: 5,
      includeUnassigned: true,
    };

    this.orgService.searchOrgsFilter(this.page, this.size, filters).subscribe({
      next: (res) => {
        let orgs = res.result.data;

        // nếu bật filter thì chỉ giữ lại org có id = myOrgId
        if (onlyMyOrg) {
          if (this.myOrgId) {
            orgs = orgs.filter((o) => o.id === this.myOrgId);
          } else {
            // Không có myOrgId mà vẫn tick filter → danh sách rỗng
            orgs = [];
          }
        }

        this.orgs = orgs;
        this.totalData = orgs.length; // tổng data thay đổi theo filter
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  // Cập nhật hàm loadNextPage
  loadNextPage(newPage: number) {
    this.page = newPage;
    this.loadOrgs();
  }

  // Nút tải file mẫu
  downloadTemplate() {
    const link = document.createElement('a');
    link.href = '/csv/identity_users_import_template.xlsx';
    link.download = 'identity_users_import_template.xlsx';
    link.click();
  }

  // Khi chọn file import
  onImportExcel(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    Promise.resolve().then(() => {
      this.store.dispatch(
        setLoading({ isLoading: true, content: 'Xin chờ, đang xử lý...' })
      );
    });

    this.orgService.importMemberExcel(file).subscribe({
      next: (res) => {
        this.importResult = res.result;
        sendNotification(
          this.store,
          'Import thành công',
          `Import hoàn tất:\nTổng: <b>${res.result.total}</b> \nTạo mới: <b>${res.result.created}</b> \nBỏ qua: <b>${res.result.skipped}</b>\nLỗi: <b>${res.result.errors.length}</b>`,
          'success'
        );

        this.store.dispatch(clearLoading());
      },
      error: (err) => {
        alert('Import thất bại!');
        console.error(err);
        this.store.dispatch(clearLoading());
      },
    });

    // Reset input để chọn lại cùng 1 file lần sau
    (event.target as HTMLInputElement).value = '';
  }

  // --- Các hàm modal ---
  openCreateModal() {
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.createForm.reset({ status: 'Active' });
  }

  submitCreate(req: CreateOrgRequest) {
    Promise.resolve().then(() => {
      this.store.dispatch(
        setLoading({ isLoading: true, content: 'Đang tạo, xin chờ...' })
      );
    });
    this.orgService.createOrg(req).subscribe({
      next: () => {
        this.refreshTokenAfterCreatedOrg();
        setTimeout(() => {
          this.store.dispatch(clearLoading());
          this.loadOrgs();
        }, 1000);
      },
      error: () => {
        this.store.dispatch(clearLoading());
      },
    });
  }

  confirmDelete(orgId: string) {
    this.selectedOrgId = orgId;
    this.showDeleteConfirm = true;
  }

  deleteOrg() {
    if (!this.selectedOrgId) return;
    this.orgService.deleteOrg(this.selectedOrgId).subscribe({
      next: () => {
        this.showDeleteConfirm = false;
        this.selectedOrgId = null;
        this.loadOrgs();
      },
    });
  }

  onLogoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.createForm.patchValue({ logo: file });
    }
  }

  goToOrganization(id: string) {
    this.router.navigate([`/organization/in-org/${id}/org-details`]);
  }

  // Helper function để tính tổng thành viên
  getTotalMembers(org: OrganizationResponse): number {
    if (!org.blocks?.data) return 0;
    return org.blocks.data.reduce(
      (total, block) => total + block.members.totalElements,
      0
    );
  }
}
