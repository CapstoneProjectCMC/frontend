import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollEndDirective } from '../../../../shared/directives/scroll-end.directive';
import {
  BlockResponse,
  ParamGetAllBlockOfOrg,
} from '../../../../core/models/organization.model';
import { OrganizationService } from '../../../../core/services/api-service/organization.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  openModalNotification,
  sendNotification,
} from '../../../../shared/utils/notification';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-org-blocks',
  imports: [CommonModule, FormsModule, ScrollEndDirective],
  templateUrl: './org-blocks.component.html',
  styleUrls: ['./org-blocks.component.scss'],
})
export class OrgBlocksComponent implements OnInit {
  orgId!: string;
  blocks: BlockResponse[] = [];

  page = 1;
  size = 10;
  totalPages = 1;
  isLoading = false;

  newBlock = { name: '', code: '', description: '' };
  editingBlock: BlockResponse | null = null;

  showModal = false;
  showUpdateModal = false;

  constructor(
    private orgService: OrganizationService,
    private route: ActivatedRoute,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      this.orgId = params.get('orgId') || '';
      if (this.orgId) {
        this.loadBlocks();
      }
    });
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.newBlock = { name: '', code: '', description: '' };
  }

  // mở modal update block
  openUpdateModal(block: BlockResponse, event: MouseEvent) {
    event.stopPropagation();
    this.editingBlock = { ...block }; // clone để tránh binding trực tiếp
    this.showUpdateModal = true;
  }

  closeUpdateModal() {
    this.showUpdateModal = false;
    this.editingBlock = null;
  }

  loadBlocks(loadMore = false) {
    if (this.isLoading || (loadMore && this.page > this.totalPages)) return;
    const params: ParamGetAllBlockOfOrg = {
      blocksPage: this.page,
      blocksSize: this.size,
      membersPage: 1,
      membersSize: 99999,
      activeOnlyMembers: true,
    };
    this.isLoading = true;
    this.orgService.getAllBlockOfOrg(this.orgId, params).subscribe({
      next: (res) => {
        const result = res.result;
        this.totalPages = result.totalPages;
        this.blocks = loadMore ? [...this.blocks, ...result.data] : result.data;
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  onScrollEnd() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadBlocks(true);
    }
  }

  createBlock() {
    if (!this.newBlock.name || !this.newBlock.code) return;
    this.orgService.createBlockInOrg(this.orgId, this.newBlock).subscribe({
      next: () => {
        sendNotification(
          this.store,
          'Hoàn tất',
          `Đã tạo khối ${this.newBlock.name}`,
          'success'
        );
        this.page = 1;
        this.loadBlocks(); // refresh
        this.closeModal();
      },
    });
  }

  // update block
  saveUpdateBlock() {
    if (!this.editingBlock) return;

    const { id, name, code, description } = this.editingBlock;
    this.orgService.updateBlock(id, { name, code, description }).subscribe({
      next: () => {
        sendNotification(
          this.store,
          'Hoàn tất',
          `Đã cập nhật khối ${name}`,
          'success'
        );
        this.page = 1;
        this.loadBlocks();
        this.closeUpdateModal();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  deleteBlock(deleteId: string) {
    this.orgService.deleteBlock(deleteId).subscribe({
      next: () => {
        this.blocks = this.blocks.filter((a) => a.id !== deleteId);
        sendNotification(
          this.store,
          'Đã xóa',
          'Đã xóa khối khỏi nhóm!',
          'success'
        );
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  openModalDelete(id: string, event: MouseEvent) {
    event.stopPropagation();
    openModalNotification(
      this.store,
      'Xác nhận xóa',
      'Bạn có chắc chắn xóa khối này?',
      'Đồng ý',
      'hủy',
      () => this.deleteBlock(id)
    );
  }

  goToBlock(id: string) {
    this.router.navigate(['']);
  }
}
