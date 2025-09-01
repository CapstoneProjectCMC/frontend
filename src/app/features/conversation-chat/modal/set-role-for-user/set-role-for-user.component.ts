import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Participant } from '../../../../core/models/conversation-chat.model';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive'; // 👉 import directive

@Component({
  selector: 'app-set-role-for-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ClickOutsideDirective], // 👉 thêm directive
  templateUrl: './set-role-for-user.component.html',
  styleUrls: ['./set-role-for-user.component.scss'],
})
export class SetRoleForUserComponent {
  @Input() isModalVisible = false;
  @Input() members: Participant[] | [] = [];
  @Input() groupId!: string;

  @Output() modalClosed = new EventEmitter<void>();
  @Output() roleUpdated = new EventEmitter<{
    userId: string;
    role: 'ADMIN' | 'MEMBER' | 'OWNER';
  }>();

  selectedUserId: string | null = null;
  selectedRole: 'ADMIN' | 'MEMBER' | 'OWNER' | null = null;

  isOpen = false;

  roleIcons: Record<string, string> = {
    OWNER: 'fa-crown',
    ADMIN: 'fa-user-shield',
    MEMBER: 'fa-user-tie',
  };

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  selectRole(role: 'ADMIN' | 'MEMBER' | 'OWNER') {
    this.selectedRole = role;
    this.isOpen = false;
  }

  close() {
    this.modalClosed.emit();
    this.selectedUserId = null;
    this.selectedRole = null;
    this.isOpen = false;
  }

  confirm() {
    if (this.selectedUserId && this.selectedRole) {
      this.roleUpdated.emit({
        userId: this.selectedUserId,
        role: this.selectedRole,
      });
      this.close();
    }
  }
}
