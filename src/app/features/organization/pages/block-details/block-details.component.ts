import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { ScrollEndDirective } from '../../../../shared/directives/scroll-end.directive';
import { OrganizationService } from '../../../../core/services/api-service/organization.service';
import {
  BlockResponse,
  MemberResponse,
} from '../../../../core/models/organization.model';
import { ModalAddUserToBlockComponent } from '../../organization-component/modal-add-user-to-block/modal-add-user-to-block.component';
import { avatarUrlDefault } from '../../../../core/constants/value.constant';
import { openModalNotification } from '../../../../shared/utils/notification';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-block-details',
  standalone: true,
  imports: [ScrollEndDirective, ModalAddUserToBlockComponent],
  templateUrl: './block-details.component.html',
  styleUrls: ['./block-details.component.scss'],
})
export class BlockDetailsComponent implements OnInit {
  blockId!: string;
  block!: BlockResponse;
  avatarDefault = avatarUrlDefault;

  members: MemberResponse[] = [];
  page = 1;
  size = 15;
  totalPages = 1;
  isLoading = false;
  isAddUserOpen = false;

  constructor(
    private route: ActivatedRoute,
    private orgService: OrganizationService,
    private store: Store
  ) {
    this.route.paramMap.subscribe((params) => {
      this.blockId = params.get('blockId') || '';
    });
  }

  ngOnInit(): void {
    if (this.blockId) {
      this.loadBlockDetails();
    }
  }

  loadBlockDetails(loadMore = false) {
    if (this.isLoading || (loadMore && this.page > this.totalPages)) return;

    this.isLoading = true;
    this.orgService
      .getBlockDetails(this.blockId, {
        membersPage: this.page,
        membersSize: this.size,
        activeOnly: true,
      })
      .subscribe({
        next: (res) => {
          this.block = res.result;
          this.totalPages = this.block.members.totalPages;

          if (loadMore) {
            this.members = [...this.members, ...this.block.members.data];
          } else {
            this.members = this.block.members.data;
          }

          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  reloadMembers() {
    this.loadBlockDetails();
  }

  onScrollEnd() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadBlockDetails(true);
    }
  }

  openModalConfirmDelete(memberId: string) {
    openModalNotification(
      this.store,
      'Xác nhận xóa',
      'Bạn có chắc chắn xóa thành viên này?',
      'Đồng ý',
      'Hủy',
      () => this.removeMember(memberId)
    );
  }

  removeMember(memberId: string) {
    this.orgService.removeMemberFromBlock(this.blockId, memberId).subscribe({
      next: () => {
        this.members = this.members.filter((a) => a.user.userId !== memberId);
      },
      error(err) {
        console.log(err);
      },
    });
  }

  openModalAdd() {
    this.isAddUserOpen = !this.isAddUserOpen;
  }
}
