import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import {
  SearchingUser,
  SearchUserProfileResponse,
} from '../../../../core/models/user.models';
import { ChatService } from '../../../../core/services/api-service/chat-conversation.service';
import { UserService } from '../../../../core/services/api-service/user.service';
import { avatarUrlDefault } from '../../../../core/constants/value.constant';
import {
  decodeJWT,
  truncateString,
} from '../../../../shared/utils/stringProcess';

@Component({
  selector: 'app-create-new-conversation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-new-conversation.component.html',
  styleUrl: './create-new-conversation.component.scss',
})
export class CreateNewConversationComponent implements OnInit, OnDestroy {
  @Input() isModalVisible = false;
  @Output() modalClosed = new EventEmitter<void>();
  @Output() chatCreated = new EventEmitter<any>();

  @ViewChild('searchInput') searchInput!: ElementRef;

  isLoading = false;
  query = '';
  searchResults: SearchUserProfileResponse[] = [];
  selectedParticipants: SearchUserProfileResponse[] = [];
  groupName = '';
  avatarUrlDefault = avatarUrlDefault;
  fileAvatarGroup: File | null = null;
  fileAvatarPreview: string | null = null;
  fileAvatarName: string | null = null;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private chatService: ChatService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Debounce cho tìm kiếm để tránh gọi API liên tục
    this.searchSubject
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((query) => {
        if (query.trim()) {
          this.searchUsers(query.trim());
        } else {
          this.searchResults = [];
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(): void {
    this.searchSubject.next(this.query);
  }

  searchUsers(q: string): void {
    this.isLoading = true;
    const searchParams: SearchingUser = { q };

    this.userService
      .searchUserProfile(1, 10, searchParams)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          // Lọc bỏ user hiện tại nếu cần
          const currentUserProfile = decodeJWT(
            localStorage.getItem('token') ?? ''
          )?.payload.userId; // thay bằng id của user hiện tại
          this.searchResults = res.result.data.filter(
            (user) => user.userId !== currentUserProfile
          );
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Search user failed', err);
          this.isLoading = false;
        },
      });
  }

  addParticipant(user: SearchUserProfileResponse): void {
    if (!this.isSelected(user)) {
      this.selectedParticipants.push(user);
    }
    // Xóa user khỏi searchResults sau khi chọn để UI gọn gàng hơn
    this.searchResults = this.searchResults.filter(
      (u) => u.userId !== user.userId
    );
  }

  removeParticipant(user: SearchUserProfileResponse): void {
    this.selectedParticipants = this.selectedParticipants.filter(
      (p) => p.userId !== user.userId
    );
  }

  isSelected(user: SearchUserProfileResponse): boolean {
    return this.selectedParticipants.some((p) => p.userId === user.userId);
  }

  isGroupChat(): boolean {
    // Bao gồm cả người dùng hiện tại
    return this.selectedParticipants.length >= 2;
  }

  isCreateButtonDisabled(): boolean {
    if (this.selectedParticipants.length === 0) {
      return true;
    }
    if (this.isGroupChat() && !this.groupName.trim()) {
      return true;
    }
    return false;
  }

  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileAvatarGroup = input.files[0];
      this.fileAvatarName = truncateString(this.fileAvatarGroup.name, 10);

      // Tạo preview URL
      const reader = new FileReader();
      reader.onload = () => {
        this.fileAvatarPreview = reader.result as string;
      };
      reader.readAsDataURL(this.fileAvatarGroup);
    }
  }

  createChat(): void {
    if (this.isCreateButtonDisabled()) {
      return;
    }

    const currentUserId = decodeJWT(localStorage.getItem('token') ?? '')
      ?.payload.userId;
    const participantIds = this.selectedParticipants.map((p) => p.userId);

    // luôn thêm user hiện tại
    const allParticipants = [currentUserId, ...participantIds];

    if (!this.isGroupChat()) {
      // 🟢 Tạo chat 1-1
      this.chatService
        .createConversation(allParticipants)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.chatCreated.emit(res.result);
            this.closeModal();
          },
          error: (err) => {
            console.error('Create conversation failed', err);
          },
        });
    } else {
      // 🟢 Tạo chat nhóm

      this.chatService
        .createGroupConversation(
          this.groupName,
          null,
          allParticipants,
          this.fileAvatarGroup
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.chatCreated.emit(res.result);
            this.closeModal();
          },
          error: (err) => {
            console.error('Create group conversation failed', err);
          },
        });
    }
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.modalClosed.emit();
    // Reset trạng thái
    this.query = '';
    this.searchResults = [];
    this.selectedParticipants = [];
    this.groupName = '';
  }
}
