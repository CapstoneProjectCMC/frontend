import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { QuizComponent } from '../../../../shared/components/fxdonad-shared/quiz/quiz.component';
import { QuestionPreview } from '../../../../core/models/exercise.model';
import { ExerciseService } from '../../../../core/services/api-service/exercise.service';
import { BoxChatAiComponent } from '../../../../shared/components/fxdonad-shared/box-chat-ai/box-chat-ai.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { CommonModule } from '@angular/common';
import { ChatbotService } from '../../../../core/services/api-service/chatbot.service';
import {
  IContextThreadResponse,
  MessageInfo,
} from '../../../../core/models/chatbot.model';
import { map } from 'rxjs/internal/operators/map';
import { ModalNoticeService } from '../../../../shared/store/modal-notice-state/modal-notice.service';

@Component({
  selector: 'app-quiz-submission',
  standalone: true,
  imports: [CommonModule, QuizComponent, BoxChatAiComponent],
  templateUrl: './quiz-submission.component.html',
  styleUrl: './quiz-submission.component.scss',
})
export class QuizSubmissionComponent implements OnInit, OnDestroy {
  exerciseId: string | null = '';
  quizId: string = '';
  times = 0;
  quizStarted = true;
  allowChatbot = false;
  questions: Array<QuestionPreview> = [];
  startDoing = false;

  // Trạng thái quiz từ child component
  isQuizSubmitted = false;
  hasQuizDataChanges = false;

  // Chat data
  chatContexts: IContextThreadResponse[] = [];
  currentContextId: string = '';
  isLoading: boolean = false;

  // Store the current chat width for persistence
  currentChatWidth: string = '30%';

  // Container dimensions
  containerWidth: number = 0;
  containerHeight: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private exerciseService: ExerciseService,
    private chatbotService: ChatbotService,
    private modalNoticeService: ModalNoticeService
  ) {
    // Initialize fake chat data
    this.fetchListThreads();
  }

  canDeactivate(): Observable<boolean> {
    if (!this.quizStarted) return of(true);
    if (this.hasQuizDataChanges) {
      return this.modalNoticeService.confirm(
        'Xác nhận thoát',
        'Bạn có chắc muốn thoát? Dữ liệu sẽ mất.',
        'Đồng ý',
        'Hủy'
      );
    } else {
      return of(true);
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent): void {
    // Chỉ hiện cảnh báo khi: có dữ liệu thay đổi VÀ chưa nộp bài
    if (this.quizStarted && this.hasQuizDataChanges && !this.isQuizSubmitted) {
      event.preventDefault();
      event.returnValue = 'Bạn có chắc muốn thoát? Dữ liệu sẽ mất.';
    }
  }

  ngOnInit() {
    this.exerciseId = this.route.snapshot.paramMap.get('id');

    // Kiểm tra xem có phải truy cập trực tiếp không
    if (!this.exerciseId || !this.isValidAccess()) {
      this.router.navigate(['/exercise/exercise-layout/list']);
      return;
    }

    if (this.exerciseId) {
      this.exerciseService
        .getExerciseDetails(1, 99999, 'CREATED_AT', false, this.exerciseId)
        .subscribe({
          next: (res) => {
            this.quizId = res.result.quizDetail?.id || '';
            this.times = res.result.duration;
            this.allowChatbot = res.result.allowAiQuestion;
            this.fetchQuiz();
          },
          error: (err) => {
            console.error('Error loading exercise:', err);
            this.router.navigate(['/exercise/exercise-layout/list']);
          },
        });

      // Try to restore saved width from localStorage if available
      const savedWidth = localStorage.getItem('chatBoxWidth');
      if (savedWidth) {
        this.currentChatWidth = savedWidth;
      }
    }
  }

  fetchQuiz() {
    this.exerciseService.loadQuiz(this.quizId).subscribe({
      next: (res) => {
        this.questions = res.result.questions;
        this.startDoing = true;
      },
      error: (err) => {
        console.error('Error loading quiz:', err);
      },
    });
  }

  /**
   * Kiểm tra xem có phải truy cập hợp lệ không
   */
  private isValidAccess(): boolean {
    // Kiểm tra referrer hoặc session storage để đảm bảo USER đến từ trang exercise details
    const referrer = document.referrer;
    const hasValidReferrer =
      referrer.includes('/exercise-details') ||
      referrer.includes('/exercise-layout');

    // Hoặc kiểm tra session storage nếu có lưu thông tin truy cập
    const hasValidSession = sessionStorage.getItem(
      'quiz-access-' + this.exerciseId
    );

    return hasValidReferrer || !!hasValidSession;
  }

  ngOnDestroy() {
    // Xóa session storage khi rời khỏi quiz
    if (this.exerciseId) {
      sessionStorage.removeItem('quiz-access-' + this.exerciseId);
    }
  }

  /**
   * Nhận trạng thái từ QuizComponent
   */
  onQuizStateChanged(state: {
    isSubmitted: boolean;
    hasDataChanges: boolean;
  }): void {
    this.isQuizSubmitted = state.isSubmitted;
    this.hasQuizDataChanges = state.hasDataChanges;
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
