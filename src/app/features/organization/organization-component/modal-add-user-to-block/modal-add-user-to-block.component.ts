import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject, switchMap } from 'rxjs';
import { SearchUserProfileResponse } from '../../../../core/models/user.models';
import { InfoUserNeedToAdd } from '../../../../core/models/organization.model';
import { UserService } from '../../../../core/services/api-service/user.service';
import { OrganizationService } from '../../../../core/services/api-service/organization.service';
import { sendNotification } from '../../../../shared/utils/notification';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-modal-add-user-to-block',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-add-user-to-block.component.html',
  styleUrls: ['./modal-add-user-to-block.component.scss'],
})
export class ModalAddUserToBlockComponent {
  @Input() isOpen = false;
  @Input() blockId!: string;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  searchQuery = '';
  searchChanged = new Subject<string>();

  searchResults: SearchUserProfileResponse[] = [];
  selectedUsers: InfoUserNeedToAdd[] = [];

  loading = false;
  submitting = false;

  constructor(
    private userService: UserService,
    private orgService: OrganizationService,
    private store: Store
  ) {
    this.searchChanged
      .pipe(
        debounceTime(400),
        switchMap((query) =>
          this.userService.searchUserProfile(1, 10, { q: query })
        )
      )
      .subscribe({
        next: (res) => {
          this.searchResults = res.result.data;
        },
        error: () => {
          this.searchResults = [];
        },
      });
  }

  onSearchChange(query: string) {
    this.searchChanged.next(query);
  }

  addUser(user: SearchUserProfileResponse) {
    if (this.selectedUsers.find((u) => u.userId === user.userId)) return;
    this.selectedUsers.push({
      userId: user.userId,
      role: user.roles[0],
      active: user.active.toString(),
    });
  }

  removeUser(userId: string) {
    this.selectedUsers = this.selectedUsers.filter((u) => u.userId !== userId);
  }

  submit() {
    if (!this.blockId || this.selectedUsers.length === 0) return;
    this.submitting = true;
    this.orgService
      .bulkAddToBlock(this.blockId, {
        members: this.selectedUsers,
        defaultRole: 'STUDENT',
        active: true,
      })
      .subscribe({
        next: () => {
          sendNotification(
            this.store,
            'Thành công',
            'Thành viên mới đã được thêm',
            'success'
          );
          this.saved.emit();
          this.close();
          this.submitting = false;
        },
        error: (err) => {
          this.submitting = false;
        },
      });
  }

  close() {
    this.isOpen = false;
    setTimeout(() => this.closed.emit(), 300); // delay cho transition
  }
}
