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
  ConversationEvent,
  Message,
  MessageReadEvent,
} from '../../../../core/models/conversation-chat.model';
import { avatarUrlDefault } from '../../../../core/constants/value.constant';
import { CreateNewConversationComponent } from '../../modal/create-new-conversation/create-new-conversation.component';
import { decodeJWT } from '../../../../shared/utils/stringProcess';

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
  private messageReadSubscription!: Subscription;

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

          // ✅ logic check "seen" khi load lần đầu
          const myId = decodeJWT(localStorage.getItem('token') ?? '')?.payload
            .userId;
          const lastMsg = sortedMessages[sortedMessages.length - 1];

          if (lastMsg?.read === true && lastMsg.sender?.userId !== myId) {
            // 1. Tìm tin nhắn cuối cùng mà chính mình (myId) gửi
            let lastMyMessage: Message | undefined;
            for (let i = sortedMessages.length - 1; i >= 0; i--) {
              if (sortedMessages[i].sender?.userId === myId) {
                lastMyMessage = sortedMessages[i];
                break;
              }
            }

            // 2. Gắn avatar của người đọc vào tin nhắn cuối cùng của tôi

            //khi nào cập nhật tin nhắn của mình được Reader đọc (đặt thuộc tính read = true thì cập nhật) còn bây giờ chưa có và read là trạng thái mình đã đọc tin nhắn hay chưa
            // if (lastMyMessage) {
            //   if (!lastMyMessage.readBy) lastMyMessage.readBy = [];
            //   // giả sử API có trả về lastMsg.reader (hoặc field tương tự)
            //   if (lastMsg.reader && lastMsg.reader.userId !== myId) {
            //     const already = lastMyMessage.readBy.some(
            //       (u) => u.userId === lastMsg.reader.userId
            //     );
            //     if (!already) {
            //       lastMyMessage.readBy.push(lastMsg.reader);
            //     }
            //   }
            // }
          }

          this.messagesMap[conversationId] = sortedMessages;
          this.updateCurrentMessages(conversationId);
        },
        error: (err) =>
          console.error(`Error fetching messages for ${conversationId}:`, err),
      });
  }

  private markMessagesAsRead(conversationId: string): void {
    const conversationMessages = this.messagesMap[conversationId] || [];
    if (!conversationMessages.length) return;

    // lấy thời gian message cuối cùng
    const lastMessage = conversationMessages[conversationMessages.length - 1];
    const readAt = lastMessage.createdDate;

    const payload = {
      messageId: undefined,
      upToTime: readAt,
    };

    this.chatService.markAsRead(conversationId, payload).subscribe({
      next: () => {
        const convoIndex = this.conversations.findIndex(
          (c) => c.id === conversationId
        );
        if (convoIndex > -1) {
          this.conversations[convoIndex].unreadCount = 0;
        }
        // cập nhật trạng thái read cho local message
        this.messagesMap[conversationId] = conversationMessages.map((m) => ({
          ...m,
          read: true,
        }));
        if (this.selectedConversation?.id === conversationId) {
          this.updateCurrentMessages(conversationId);
        }
      },
      error: (err) => console.error('Failed to mark messages as read:', err),
    });
  }

  // --- Event Handlers ---
  handleConversationSelect(conversation: Conversation): void {
    this.selectedConversation = conversation;
    this.fetchMessages(conversation.id);
    this.markMessagesAsRead(conversation.id); // 👈 đánh dấu đọc khi click vào
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
    this.socketService.connect(this.port);

    this.messageSubscription = this.socketService
      .on<string>(this.port, 'message_created')
      .subscribe((raw: string) => {
        try {
          const event: ConversationEvent = JSON.parse(raw);
          this.handleIncomingEvent(event);
        } catch (error) {
          console.error('Could not parse incoming socket event:', error);
        }
      });

    this.messageSubscription = this.socketService
      .on<string>(this.port, 'message_read')
      .subscribe((raw: string) => {
        try {
          const event: MessageReadEvent = JSON.parse(raw);
          this.handleIncomingReadEvent(event);
        } catch (error) {
          console.error('Could not parse incoming socket event:', error);
        }
      });
  }

  private handleIncomingReadEvent(event: MessageReadEvent): void {
    const { conversation, data } = event;
    const conversationId = conversation.id;
    const lastReadAt = new Date(data.lastReadAt).getTime();

    const messages = this.messagesMap[conversationId];
    if (!messages) return;

    const myId = decodeJWT(localStorage.getItem('token') ?? '')?.payload.userId;
    const readerId = data.reader.userId;

    // chỉ quan tâm nếu người đọc KHÁC mình
    if (readerId === myId) return;

    // 1. Xóa dấu "seen" cũ của reader trên toàn bộ messages trong hội thoại này
    messages.forEach((msg) => {
      if (msg.readBy) {
        msg.readBy = msg.readBy.filter((u) => u.userId !== readerId);
      }
    });

    // 2. Tìm tin nhắn CUỐI CÙNG mà chính mình (myId) là sender,
    //    và đã được gửi trước hoặc bằng thời điểm lastReadAt
    let lastMyMessage: Message | undefined;
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      const msgTime = new Date(msg.createdDate).getTime();
      if (msg.sender?.userId === myId && msgTime <= lastReadAt) {
        lastMyMessage = msg;
        break;
      }
    }

    // 3. Gắn avatar của reader vào tin nhắn cuối cùng của tôi
    if (lastMyMessage) {
      if (!lastMyMessage.readBy) lastMyMessage.readBy = [];
      const already = lastMyMessage.readBy.some((u) => u.userId === readerId);
      if (!already) {
        lastMyMessage.readBy.push(data.reader);
      }
    }

    // 4. Cập nhật lại UI nếu đang mở đúng hội thoại
    if (this.selectedConversation?.id === conversationId) {
      this.updateCurrentMessages(conversationId);
      this.cdr.detectChanges();
    }
  }

  private handleIncomingEvent(event: ConversationEvent): void {
    switch (event.type) {
      case 'message_created':
        this.handleIncomingMessage(event.conversation, event.message);
        break;
      default:
        console.warn('Unhandled event type:', event.type);
    }
  }

  private handleIncomingMessage(
    conversation: ConversationEvent['conversation'],
    message: Message
  ): void {
    const conversationId = conversation.id;

    // --- cập nhật danh sách tin nhắn ---
    const existingMessages = this.messagesMap[conversationId] || [];
    const messageExists = existingMessages.some((m) => m.id === message.id);

    if (!messageExists) {
      this.messagesMap[conversationId] = [...existingMessages, message].sort(
        (a, b) =>
          new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
      );

      if (this.selectedConversation?.id === conversationId) {
        this.updateCurrentMessages(conversationId);
        this.markMessagesAsRead(conversationId); // 👈 mark read nếu đang mở
      }
    }

    // --- cập nhật danh sách hội thoại ---
    const convoIndex = this.conversations.findIndex(
      (c) => c.id === conversationId
    );
    if (convoIndex > -1) {
      const old = this.conversations[convoIndex];
      const updatedConvo: Conversation = {
        ...old,
        // lastMessage: message.message,
        modifiedDate: message.createdDate,
        unreadCount:
          this.selectedConversation?.id === conversationId
            ? 0
            : (old.unreadCount ?? 0) + 1,
      };
      this.conversations.splice(convoIndex, 1);
      this.conversations.unshift(updatedConvo);
    } else {
      // Nếu chưa có conversation trong list → thêm mới
      this.conversations.unshift({
        ...conversation,
        lastMessage: message.message,
        modifiedDate: message.createdDate,
        unreadCount: this.selectedConversation?.id === conversationId ? 0 : 1,
      } as Conversation);
    }

    this.cdr.detectChanges();
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
