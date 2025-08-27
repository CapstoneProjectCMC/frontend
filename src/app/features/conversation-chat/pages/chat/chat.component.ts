import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  AfterViewChecked,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService } from '../../../../core/services/api-service/chat-conversation.service';
import { SocketConnectionService } from '../../../../core/services/socket-service/socketConnection.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CONVERSATION_CHAT_SOCKET } from '../../../../core/services/socket-service/port-socket';
import {
  Conversation,
  Message,
} from '../../../../core/models/conversation-chat.model';
import { avatarUrlDefault } from '../../../../core/constants/value.constant';
import { CreateNewConversationComponent } from '../../modal/create-new-conversation/create-new-conversation.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [CommonModule, FormsModule, CreateNewConversationComponent],
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  // --- State Properties ---
  conversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;
  messagesMap: { [key: string]: Message[] } = {};
  currentMessages: Message[] = [];

  message: string = '';
  loading: boolean = false;
  error: string | null = null;

  pageIndex = 1;
  pageSize = 10;

  //modal
  isOpenCreateNewChat = false;

  port = `${CONVERSATION_CHAT_SOCKET}?token=${localStorage.getItem('token')}`;
  avatarUrlDefault = avatarUrlDefault;

  // --- Subscriptions ---
  private messageSubscription!: Subscription;

  // --- DOM References ---
  @ViewChild('messageContainer') private messageContainerRef!: ElementRef;
  private needsScrollToBottom: boolean = false;

  constructor(
    private chatService: ChatService,
    private socketService: SocketConnectionService,
    private cdr: ChangeDetectorRef // Để thông báo cho Angular về các thay đổi
  ) {}

  // --- Lifecycle Hooks ---
  ngOnInit(): void {
    this.fetchConversations();
    this.setupSocketListeners();
  }

  ngAfterViewChecked(): void {
    if (this.needsScrollToBottom) {
      this.scrollToBottom();
      this.needsScrollToBottom = false;
    }
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    this.socketService.disconnect(this.port);
  }

  // --- Data Fetching & Handling ---
  fetchConversations(): void {
    this.loading = true;
    this.error = null;
    this.chatService
      .getMyConversations(this.pageIndex, this.pageSize)
      .subscribe({
        next: (response) => {
          this.conversations = response.result.data || [];
          if (this.conversations.length > 0 && !this.selectedConversation) {
            this.handleConversationSelect(this.conversations[0]);
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching conversations:', err);
          this.error = 'Failed to load conversations. Please try again later.';
          this.loading = false;
        },
      });
  }

  fetchMessages(conversationId: string): void {
    if (this.messagesMap[conversationId]) {
      this.updateCurrentMessages(conversationId);
      return; // Đã có tin nhắn, không cần gọi API
    }

    this.chatService
      .getMessages(this.pageIndex, this.pageSize, conversationId)
      .subscribe({
        next: (response) => {
          const messages = response.result.data || [];
          const sortedMessages = messages.sort(
            (a: Message, b: Message) =>
              new Date(a.createdDate).getTime() -
              new Date(b.createdDate).getTime()
          );
          this.messagesMap[conversationId] = sortedMessages;
          this.updateCurrentMessages(conversationId);
        },
        error: (err) =>
          console.error(`Error fetching messages for ${conversationId}:`, err),
      });
  }

  // --- Event Handlers ---
  handleConversationSelect(conversation: Conversation): void {
    this.selectedConversation = conversation;
    // Đánh dấu đã đọc
    // conversation.unread = 0;
    this.fetchMessages(conversation.id);
  }

  handleSendMessage(): void {
    if (!this.message.trim() || !this.selectedConversation) return;

    const payload = {
      conversationId: this.selectedConversation.id,
      message: this.message,
    };

    this.chatService.createMessage(payload).subscribe({
      next: (res) => {
        // Có thể thêm logic xử lý tin nhắn tạm (pending) ở đây
      },
      error: (err) => {
        console.error('Failed to send message:', err);
        // Có thể thêm logic xử lý tin nhắn gửi thất bại (failed)
      },
    });

    this.message = '';
    this.needsScrollToBottom = true;
  }

  // --- Socket Integration ---
  private setupSocketListeners(): void {
    // Bạn cần sửa lại SocketService để có thể lấy token hoặc kết nối lại
    // Ví dụ: this.socketService.connect(token);
    // Hiện tại SocketService khởi tạo kết nối trong constructor, nên ta chỉ cần lắng nghe sự kiện

    this.socketService.connect(this.port);

    this.messageSubscription = this.socketService
      .on<string>(this.port, 'message')
      .subscribe((rawMessage: string) => {
        console.log('New message received:', rawMessage);
        try {
          const message: Message = JSON.parse(rawMessage);
          this.handleIncomingMessage(message);
        } catch (error) {
          console.error('Could not parse incoming message:', error);
        }
      });
  }

  private handleIncomingMessage(message: Message): void {
    const conversationId = message.conversationId;

    // Cập nhật danh sách tin nhắn
    const existingMessages = this.messagesMap[conversationId] || [];
    const messageExists = existingMessages.some((msg) => msg.id === message.id);

    if (!messageExists) {
      this.messagesMap[conversationId] = [...existingMessages, message].sort(
        (a, b) =>
          new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
      );
      if (this.selectedConversation?.id === conversationId) {
        this.updateCurrentMessages(conversationId);
      }
    }

    // Cập nhật danh sách hội thoại
    const convoIndex = this.conversations.findIndex(
      (c) => c.id === conversationId
    );
    if (convoIndex > -1) {
      const updatedConvo = {
        ...this.conversations[convoIndex],
        lastMessage: message.message,
        modifiedDate: message.createdDate,
        // unread:
        //   this.selectedConversation?.id === conversationId
        //     ? 0
        //     : (this.conversations[convoIndex].unread || 0) + 1,
      };
      // Đưa hội thoại vừa cập nhật lên đầu
      this.conversations.splice(convoIndex, 1);
      this.conversations.unshift(updatedConvo);
    }

    this.cdr.detectChanges(); // Báo cho Angular biết có thay đổi
  }

  // --- UI Utilities ---
  private updateCurrentMessages(conversationId: string): void {
    this.currentMessages = this.messagesMap[conversationId] || [];
    this.needsScrollToBottom = true; // Đánh dấu cần cuộn xuống
  }

  private scrollToBottom(): void {
    try {
      if (this.messageContainerRef) {
        const element = this.messageContainerRef.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.error('Could not scroll to bottom:', err);
    }
  }

  //modal handling
  openModalCreateNew() {
    this.isOpenCreateNewChat = !this.isOpenCreateNewChat;
  }

  closeModalCreateNewConversation() {
    console.log('hủy tạo chat mới');
    this.isOpenCreateNewChat = !this.isOpenCreateNewChat;
  }
  createdNewConversation() {
    console.log('đã tạo mới chat');
    this.isOpenCreateNewChat = !this.isOpenCreateNewChat;
    this.fetchConversations();
  }

  // Cần thêm các hàm xử lý popover/menu tạo chat mới
  // handleNewChatClick, handleCloseNewChat, handleSelectNewChatUser
}
