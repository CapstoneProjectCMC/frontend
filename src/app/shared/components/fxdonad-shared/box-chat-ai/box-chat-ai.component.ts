import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnChanges,
  SimpleChanges,
  HostListener,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IContextThreadResponse,
  MessageInfo,
  ThreadInfoResponse,
} from '../../../../core/models/chatbot.model';
import { TruncatePipe } from '../../../pipes/format-view.pipe';
import { ChatbotService } from '../../../../core/services/api-service/chatbot.service';
import { MarkdownModule } from 'ngx-markdown';

export type fileUrlIndex = {
  messageId: string;
  fileUrl: String;
  fileName: string;
};

@Component({
  selector: 'app-box-chat-ai',
  standalone: true,
  imports: [CommonModule, FormsModule, TruncatePipe, MarkdownModule],
  templateUrl: './box-chat-ai.component.html',
  styleUrls: ['./box-chat-ai.component.scss'],
})
export class BoxChatAiComponent
  implements OnInit, AfterViewChecked, OnChanges, OnDestroy
{
  @Input() chatContexts: IContextThreadResponse[] = [];
  @Input() currentContextId: string = '';
  @Input() isLoading: boolean = false;
  @Input() placeholder: string = 'Nhập tin nhắn...';
  @Input() fileUrl: fileUrlIndex | {} = {};
  @Input() aiName: string = 'AI Assistant';
  @Input() autoScroll: boolean = true;
  @Input() initialWidth: string = '30%';
  @Input() minWidth: string = '300px';
  @Input() maxWidth: string = '800px';
  @Input() position: 'left' | 'right' = 'right';

  @Output() sendMessage = new EventEmitter<{
    contextId: string;
    message: string;
    file?: File;
  }>();
  @Output() createNewChat = new EventEmitter<void>();
  @Output() selectContext = new EventEmitter<string>();
  @Output() deleteContext = new EventEmitter<string>();
  @Output() widthChanged = new EventEmitter<string>();

  @ViewChild('chatContainer') chatContainer!: ElementRef;
  @ViewChild('chatBox') chatBoxElement!: ElementRef;
  @ViewChild('resizeHandle') resizeHandleElement!: ElementRef;
  @ViewChild('contextListRef') contextListRef!: ElementRef;
  @ViewChild('contextButtonRef') contextButtonRef!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('titleInput') titleInput!: ElementRef;

  newMessage: string = '';
  newContext: ThreadInfoResponse | null = null;
  file: File | null = null;
  isExpanded: boolean = true;
  showContextList: boolean = false;
  shouldScrollToBottom: boolean = true;
  isCreatingNewThread: boolean = false;

  // Resize properties
  isResizing: boolean = false;
  currentWidth: string = '';
  startX: number = 0;
  startWidth: number = 0;

  // ADD THESE PROPERTIES
  isEditingTitle: boolean = false;
  editingTitleText: string = '';

  private resizeListenerFn: (() => void) | null = null;
  private mouseMoveListenerFn: (() => void) | null = null;
  private mouseUpListenerFn: (() => void) | null = null;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private chatbotService: ChatbotService
  ) {}

  ngOnInit(): void {
    // Initialize with default context if none exists
    if (this.chatContexts.length === 0) {
      this.createNewChatContext();
    } else if (!this.currentContextId && this.chatContexts.length > 0) {
      // Select the first context if none is selected
      this.currentContextId = this.chatContexts[0].id;
    }

    // Set initial width
    this.currentWidth = this.initialWidth;
  }

  ngAfterViewInit(): void {
    // Set up resize handle
    this.setupResizeHandle();
  }

  ngOnDestroy(): void {
    // Clean up event listeners
    this.removeGlobalEventListeners();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // If chatContexts or currentContextId changes, we should scroll to bottom
    if (
      (changes['chatContexts'] || changes['currentContextId']) &&
      this.autoScroll
    ) {
      this.shouldScrollToBottom = true;
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom && this.autoScroll) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  getCurrentContext(): IContextThreadResponse | undefined {
    return this.chatContexts.find(
      (context) => context.id === this.currentContextId
    );
  }

  onSendMessage(): void {
    if (this.newMessage.trim() === '' && !this.file) return;

    this.sendMessage.emit({
      contextId: this.currentContextId,
      message: this.newMessage,
      file: this.file as File,
    });

    // Optimistically add the message to the UI
    const currentContext = this.getCurrentContext();
    if (currentContext) {
      currentContext.messages?.push({
        id: Date.now().toString(),
        content: this.newMessage,
        role: 'USER',
        imageContentType: this.file ? this.file.type : null,
        imageOriginalName: this.file ? this.file.name : null,
        imageUrl: this.file ? URL.createObjectURL(this.file) : null,
        createdAt: new Date(),
      });
      this.shouldScrollToBottom = true;
    }

    this.newMessage = '';
    this.file = null;
  }

  onCreateNewChat(): void {
    this.createNewChatContext();
    this.createNewChat.emit();
  }

  createNewChatContext(): void {
    this.isCreatingNewThread = true;
    this.chatbotService.createNewThread('Cuộc trò chuyện mới').subscribe({
      next: (res) => {
        this.newContext = res.result;
        if (this.newContext) {
          const data: IContextThreadResponse = {
            ...this.newContext,
            messages: null,
          };

          this.chatContexts = [data, ...this.chatContexts];
          this.currentContextId = this.newContext.id;
          this.selectContext.emit(this.newContext.id);
          this.showContextList = false;
          this.isCreatingNewThread = true;
        }
      },
      error: (err) => {
        this.isCreatingNewThread = true;
        console.log(err);
      },
    });

    // const newContext: IContextThreadResponse = {
    //   id: Date.now().toString(),
    //   title: 'Cuộc trò chuyện mới',
    //   lastMessageAt: new Date().toString(),
    //   createdAt: new Date().toString(),
    //   updatedAt: new Date().toString(),
    //   messages: [],
    // };
  }

  startEditingTitle(): void {
    const currentContext = this.getCurrentContext();
    if (currentContext) {
      this.isEditingTitle = true;
      this.editingTitleText = currentContext.title;
      // Focus the input element after the view updates
      setTimeout(() => {
        this.titleInput.nativeElement.focus();
        this.titleInput.nativeElement.select(); // Select text for easy replacement
      }, 0);
    }
  }

  saveTitle(): void {
    if (!this.isEditingTitle) return;

    const currentContext = this.getCurrentContext();
    const newTitle = this.editingTitleText.trim();

    if (currentContext && newTitle && newTitle !== currentContext.title) {
      this.chatbotService
        .renameThread(currentContext.id, this.editingTitleText)
        .subscribe({
          next: () => {
            currentContext.title = newTitle;
          },
          error: (err) => console.error('Failed to update title:', err),
        });

      currentContext.title = newTitle;
    }

    this.isEditingTitle = false;
  }

  cancelEditTitle(): void {
    this.isEditingTitle = false;
  }

  onSelectContext(contextId: string): void {
    this.currentContextId = contextId;
    this.selectContext.emit(contextId);
    this.shouldScrollToBottom = true;
  }

  onDeleteContext(event: Event, contextId: string): void {
    event.stopPropagation();

    const contextIndex = this.chatContexts.findIndex((c) => c.id === contextId);
    if (contextIndex === -1) return; // không tìm thấy

    this.chatbotService.deleteThread(contextId).subscribe({
      next: () => {
        // Xoá khỏi local state
        this.chatContexts.splice(contextIndex, 1);

        // Nếu xoá context hiện tại → chọn context khác
        if (
          contextId === this.currentContextId &&
          this.chatContexts.length > 0
        ) {
          const newContextIndex =
            contextIndex < this.chatContexts.length
              ? contextIndex // chọn context kế tiếp (vị trí cũ)
              : contextIndex - 1; // nếu xoá cuối cùng thì chọn context trước đó

          this.currentContextId = this.chatContexts[newContextIndex].id;
          this.selectContext.emit(this.currentContextId);
        }

        // Emit delete event ra ngoài
        this.deleteContext.emit(contextId);

        // Nếu xoá hết context → tạo mới
        if (this.chatContexts.length === 0) {
          this.createNewChatContext();
        }
      },
      error: (err) => {
        console.error('Delete context failed:', err);
        // Optionally: hiển thị toast thông báo lỗi
      },
    });
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {
      // When expanding, we should scroll to bottom after the view is updated
      setTimeout(() => {
        this.shouldScrollToBottom = true;
      }, 100);
    }
  }

  toggleContextList(): void {
    this.showContextList = !this.showContextList;
  }

  getMessageTime(timestamp: Date): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  trackByMessageId(index: number, message: MessageInfo): string {
    return message.id;
  }

  trackByContextId(index: number, context: IContextThreadResponse): string {
    return context.id;
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSendMessage();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.file = input.files[0];
    }
  }

  removeAttachment(): void {
    this.file = null;
    this.fileInput.nativeElement.value = '';
  }

  handlePaste(event: ClipboardEvent): void {
    const items = event.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            this.file = new File([blob], 'pasted-image.png', {
              type: blob.type,
            });
          }
          event.preventDefault();
          break;
        }
      }
    }
  }

  // Resize functionality
  setupResizeHandle(): void {
    const resizeHandle = this.resizeHandleElement.nativeElement;

    this.resizeListenerFn = this.renderer.listen(
      resizeHandle,
      'mousedown',
      (e: MouseEvent) => {
        this.startResize(e);
      }
    );

    this.renderer.setStyle(resizeHandle, 'cursor', 'ew-resize');
  }

  startResize(e: MouseEvent): void {
    e.preventDefault();
    this.isResizing = true;
    this.startX = e.clientX;
    this.startWidth = this.chatBoxElement.nativeElement.offsetWidth;

    // Add global event listeners
    this.mouseMoveListenerFn = this.renderer.listen(
      'document',
      'mousemove',
      (event: MouseEvent) => {
        this.onResizeMove(event);
      }
    );

    this.mouseUpListenerFn = this.renderer.listen('document', 'mouseup', () => {
      this.stopResize();
    });

    // Add resizing class to body for cursor styling
    this.renderer.addClass(document.body, 'resizing');
  }

  onResizeMove(e: MouseEvent): void {
    if (!this.isResizing) return;

    const deltaX = e.clientX - this.startX;
    // Invert the delta if the chat is on the right side
    const adjustedDeltaX = this.position === 'right' ? -deltaX : deltaX;
    let newWidth = this.startWidth + adjustedDeltaX;

    // Convert min and max width to pixels for comparison
    const tempDiv = document.createElement('div');
    tempDiv.style.width = this.minWidth;
    document.body.appendChild(tempDiv);
    const minWidthPx = tempDiv.offsetWidth;

    tempDiv.style.width = this.maxWidth;
    const maxWidthPx = tempDiv.offsetWidth;
    document.body.removeChild(tempDiv);

    // Apply constraints
    if (newWidth < minWidthPx) newWidth = minWidthPx;
    if (newWidth > maxWidthPx) newWidth = maxWidthPx;

    // Update width
    this.renderer.setStyle(
      this.chatBoxElement.nativeElement,
      'width',
      `${newWidth}px`
    );
    this.currentWidth = `${newWidth}px`;

    // Emit width change event
    this.widthChanged.emit(this.currentWidth);
  }

  stopResize(): void {
    this.isResizing = false;
    this.removeGlobalEventListeners();

    // Remove resizing class from body
    this.renderer.removeClass(document.body, 'resizing');
  }

  removeGlobalEventListeners(): void {
    if (this.mouseMoveListenerFn) {
      this.mouseMoveListenerFn();
      this.mouseMoveListenerFn = null;
    }

    if (this.mouseUpListenerFn) {
      this.mouseUpListenerFn();
      this.mouseUpListenerFn = null;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;

    const clickedInsideContextList =
      this.contextListRef?.nativeElement.contains(clickedElement);
    const clickedContextButton =
      this.contextButtonRef?.nativeElement.contains(clickedElement);

    if (!clickedInsideContextList && !clickedContextButton) {
      this.showContextList = false;
    }
  }
}
