import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { HeaderComponent } from '../../../shared/components/my-shared/header/header';
import { FooterComponent } from '../../../shared/components/my-shared/footer/footer';
import { MenuLayoutComponent } from '../../layout-components/menu/menu-layout.component';
import { CommonModule } from '@angular/common';
import { getNavHorizontalItems } from '../../../core/router-manager/horizontal-menu';
import { decodeJWT } from '../../../shared/utils/stringProcess';
import { SidebarItem } from '../../../core/models/data-handle';
import { BoxChatAiComponent } from '../../../shared/components/fxdonad-shared/box-chat-ai/box-chat-ai.component';
import {
  IContextThreadResponse,
  MessageInfo,
} from '../../../core/models/chatbot.model';
import { ChatbotService } from '../../../core/services/api-service/chatbot.service';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    MenuLayoutComponent,
    BoxChatAiComponent,
  ],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
})
export class AppLayoutComponent implements OnInit {
  visible = true;
  menuItems: SidebarItem[] | [] = [];
  showFooter = false;
  initialLoadDataChatbot = false; //Biến này để gán cờ gọi dữ liệu rồi mới load chatbot

  // Chat data
  chatContexts: IContextThreadResponse[] = [];
  currentContextId: string = '';
  isLoading: boolean = false;

  // Store the current chat width for persistence
  currentChatWidth: string = '30%';

  // Container dimensions
  containerWidth: number = 0;
  containerHeight: number = 0;

  constructor(private router: Router, private chatbotService: ChatbotService) {
    this.fetchListThreads();
    // Try to restore saved width from localStorage if available
    const savedWidth = localStorage.getItem('chatBoxWidth');
    if (savedWidth) {
      this.currentChatWidth = savedWidth;
    }
  }

  ngOnInit() {
    const role = decodeJWT(localStorage.getItem('token') ?? '')?.payload.scope;
    // Cập nhật visible ngay khi khởi tạo dựa trên url hiện tại
    this.menuItems = getNavHorizontalItems(role);
    const currentUrl = this.router.url;
    this.visible = currentUrl !== '/';
    this.showFooter = currentUrl === '/' || currentUrl === '';

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.visible = event.urlAfterRedirects !== '/';
        this.showFooter = event.urlAfterRedirects === '/';
      });
  }

  /////////////////////////////////////////////Phần này code cho chatboxAi /////////////////////////////

  fetchListThreads() {
    this.chatbotService.getMyThreads().subscribe({
      next: (res) => {
        this.chatContexts = res.result.map((thread) => ({
          ...thread,
          messages: [],
        }));
        if (res.result.length > 0) {
          this.currentContextId = this.chatContexts[0].id;
          this.fetchContextOfThreadById(this.currentContextId);
        }
        this.initialLoadDataChatbot = true;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  fetchContextOfThreadById(threadId: string) {
    this.chatbotService.getThreadById(threadId).subscribe({
      next: (res) => {
        const index = this.chatContexts.findIndex(
          (t) => t.id === res.result.id
        );
        if (index !== -1) {
          // Cập nhật messages cho thread này
          this.chatContexts[index] = {
            ...this.chatContexts[index],
            messages: res.result.messages, // gắn messages vào
          };
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  sendMessage(threadId: string, message: string) {
    // return luôn observable để handleSendMessage subscribe
    return this.chatbotService.sendChat(threadId, message).pipe(
      //API trả { result: string }
      map((res) => res.result)
    );
  }

  sendMessageWithFile(threadId: string, message: string, file: File) {
    return this.chatbotService.sendChatWithImage(threadId, message, file).pipe(
      //API trả { result: string }
      map((res) => res.result)
    );
  }

  handleSendMessage(event: {
    contextId: string;
    message: string;
    file?: File;
  }): void {
    this.isLoading = true;

    const handleSuccess = (response: string) => {
      const aiMessage: MessageInfo = {
        id: Date.now().toString(),
        content: response, // response từ API
        role: 'ASSISTANT',
        imageContentType: null,
        imageOriginalName: null,
        imageUrl: null,
        createdAt: new Date(),
      };

      // ✨ SỬA Ở ĐÂY: Dùng .map() để tạo ra một mảng mới
      this.chatContexts = this.chatContexts.map((context) => {
        // Nếu đây là context cần cập nhật
        if (context.id === event.contextId) {
          // Trả về một object context MỚI
          return {
            ...context, // Sao chép tất cả thuộc tính cũ
            messages: [...(context.messages || []), aiMessage], // Tạo một mảng messages MỚI chứa tin nhắn của AI
          };
        }
        // Nếu không phải, trả về context cũ không thay đổi
        return context;
      });

      this.isLoading = false;
    };

    const handleError = (err: any) => {
      console.error(err);
      this.isLoading = false;
    };

    if (event.file) {
      this.sendMessageWithFile(
        event.contextId,
        event.message,
        event.file
      ).subscribe({
        next: handleSuccess,
        error: handleError,
      });
    } else {
      this.sendMessage(event.contextId, event.message).subscribe({
        next: handleSuccess,
        error: handleError,
      });
    }
  }

  handleCreateNewChat(contextId: string): void {
    this.currentContextId = contextId;

    // 🔥 Fix: tạo context mới trong mảng cha
    const newContext: IContextThreadResponse = {
      id: contextId,
      title: 'Cuộc trò chuyện mới',
      lastMessageAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [], // để push message đầu tiên vào đây
    };

    // Thêm vào đầu danh sách
    this.chatContexts = [newContext, ...this.chatContexts];

    console.log('New chat created:', newContext);
  }

  handleSelectContext(contextId: string): void {
    this.currentContextId = contextId;
    this.fetchContextOfThreadById(contextId);
  }

  handleDeleteContext(contextId: string): void {
    this.chatContexts = this.chatContexts.filter((c) => c.id !== contextId);

    // If we deleted the current context, select another one
    if (contextId === this.currentContextId && this.chatContexts.length > 0) {
      this.currentContextId = this.chatContexts[0].id;
    }
  }
}
