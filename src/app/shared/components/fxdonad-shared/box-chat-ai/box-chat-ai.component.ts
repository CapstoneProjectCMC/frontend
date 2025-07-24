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

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface ChatContext {
  id: string;
  title: string;
  messages: ChatMessage[];
}

@Component({
  selector: 'app-box-chat-ai',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './box-chat-ai.component.html',
  styleUrls: ['./box-chat-ai.component.scss'],
})
export class BoxChatAiComponent
  implements OnInit, AfterViewChecked, OnChanges, OnDestroy
{
  @Input() chatContexts: ChatContext[] = [];
  @Input() currentContextId: string = '';
  @Input() isLoading: boolean = false;
  @Input() placeholder: string = 'Nhập tin nhắn...';
  @Input() aiName: string = 'AI Assistant';
  @Input() autoScroll: boolean = true;
  @Input() initialWidth: string = '30%';
  @Input() minWidth: string = '300px';
  @Input() maxWidth: string = '800px';
  @Input() position: 'left' | 'right' = 'right';

  @Output() sendMessage = new EventEmitter<{
    contextId: string;
    message: string;
  }>();
  @Output() createNewChat = new EventEmitter<void>();
  @Output() selectContext = new EventEmitter<string>();
  @Output() deleteContext = new EventEmitter<string>();
  @Output() widthChanged = new EventEmitter<string>();

  @ViewChild('chatContainer') chatContainer!: ElementRef;
  @ViewChild('chatBox') chatBoxElement!: ElementRef;
  @ViewChild('resizeHandle') resizeHandleElement!: ElementRef;

  newMessage: string = '';
  isExpanded: boolean = true;
  showContextList: boolean = false;
  shouldScrollToBottom: boolean = true;

  // Resize properties
  isResizing: boolean = false;
  currentWidth: string = '';
  startX: number = 0;
  startWidth: number = 0;

  private resizeListenerFn: (() => void) | null = null;
  private mouseMoveListenerFn: (() => void) | null = null;
  private mouseUpListenerFn: (() => void) | null = null;

  constructor(private renderer: Renderer2) {}

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

  getCurrentContext(): ChatContext | undefined {
    return this.chatContexts.find(
      (context) => context.id === this.currentContextId
    );
  }

  onSendMessage(): void {
    if (this.newMessage.trim() === '') return;

    this.sendMessage.emit({
      contextId: this.currentContextId,
      message: this.newMessage,
    });

    // Optimistically add the message to the UI
    const currentContext = this.getCurrentContext();
    if (currentContext) {
      currentContext.messages.push({
        id: Date.now().toString(),
        content: this.newMessage,
        sender: 'user',
        timestamp: new Date(),
      });
      this.shouldScrollToBottom = true;
    }

    this.newMessage = '';
  }

  onCreateNewChat(): void {
    this.createNewChatContext();
    this.createNewChat.emit();
  }

  createNewChatContext(): void {
    const newContext: ChatContext = {
      id: Date.now().toString(),
      title: 'Cuộc trò chuyện mới',
      messages: [],
    };

    this.chatContexts = [newContext, ...this.chatContexts];
    this.currentContextId = newContext.id;
    this.selectContext.emit(newContext.id);
    this.showContextList = false;
  }

  onSelectContext(contextId: string): void {
    this.currentContextId = contextId;
    this.selectContext.emit(contextId);
    this.showContextList = false;
    this.shouldScrollToBottom = true;
  }

  onDeleteContext(event: Event, contextId: string): void {
    event.stopPropagation();

    // Find the index of the context to be deleted
    const contextIndex = this.chatContexts.findIndex((c) => c.id === contextId);

    // If we're deleting the current context, select another one
    if (contextId === this.currentContextId && this.chatContexts.length > 1) {
      // Try to select the next context, or the previous one if we're deleting the last context
      const newContextIndex =
        contextIndex < this.chatContexts.length - 1
          ? contextIndex + 1
          : contextIndex - 1;
      this.currentContextId = this.chatContexts[newContextIndex].id;
      this.selectContext.emit(this.currentContextId);
    }

    // Emit the delete event
    this.deleteContext.emit(contextId);

    // If we're deleting the last context, create a new one
    if (this.chatContexts.length === 1) {
      this.createNewChatContext();
    }
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

  trackByMessageId(index: number, message: ChatMessage): string {
    return message.id;
  }

  trackByContextId(index: number, context: ChatContext): string {
    return context.id;
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSendMessage();
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
}
