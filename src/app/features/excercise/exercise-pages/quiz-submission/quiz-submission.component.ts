import {
  Component,
  OnInit,
  ElementRef,
  Renderer2,
  AfterViewInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { QuizComponent } from '../../../../shared/components/fxdonad-shared/quiz/quiz.component';
import {
  QuestionPreview,
  QuizQuestion,
} from '../../../../core/models/exercise.model';
import { ExerciseService } from '../../../../core/services/api-service/exercise.service';
import {
  BoxChatAiComponent,
  ChatContext,
  ChatMessage,
} from '../../../../shared/components/fxdonad-shared/box-chat-ai/box-chat-ai.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { CommonModule } from '@angular/common';

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
  chatContexts: ChatContext[] = [];
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
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    // Initialize fake chat data
    this.initializeFakeChatData();
  }

  canDeactivate(): Observable<boolean> {
    if (!this.quizStarted) return of(true);
    if (this.hasQuizDataChanges) {
      const confirmResult = window.confirm(
        'Bạn có chắc muốn thoát? Dữ liệu sẽ mất.'
      );
      return of(confirmResult);
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
    // Kiểm tra referrer hoặc session storage để đảm bảo user đến từ trang exercise details
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

  /////////////////////////////////////////////Phần này code cho chatboxAi chỉ để test/////////////////////////////

  private initializeFakeChatData(): void {
    // Create a few sample chat contexts with messages
    const context1: ChatContext = {
      id: '1',
      title: 'Hỏi đáp về bài tập',
      messages: [
        {
          id: '1',
          content:
            'Tôi không hiểu câu hỏi số 2 lắm. Bạn có thể giải thích thêm không?',
          sender: 'user',
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        },
        {
          id: '2',
          content:
            'Câu hỏi số 2 đang hỏi về cách triển khai thuật toán sắp xếp. Bạn cần phân tích độ phức tạp của thuật toán và chọn phương án tối ưu nhất.',
          sender: 'ai',
          timestamp: new Date(Date.now() - 3540000), // 59 minutes ago
        },
        {
          id: '3',
          content: 'Cảm ơn bạn! Vậy tôi nên chọn Quick Sort phải không?',
          sender: 'user',
          timestamp: new Date(Date.now() - 3480000), // 58 minutes ago
        },
        {
          id: '4',
          content:
            'Đúng vậy, Quick Sort có độ phức tạp trung bình là O(n log n) và thường hiệu quả trong thực tế. Tuy nhiên, hãy nhớ rằng trong trường hợp xấu nhất, độ phức tạp có thể lên tới O(n²).',
          sender: 'ai',
          timestamp: new Date(Date.now() - 3420000), // 57 minutes ago
        },
      ],
    };

    const context2: ChatContext = {
      id: '2',
      title: 'Hỏi về thời gian làm bài',
      messages: [
        {
          id: '1',
          content: 'Tôi có thể gia hạn thời gian làm bài không?',
          sender: 'user',
          timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        },
        {
          id: '2',
          content:
            'Rất tiếc, thời gian làm bài được cố định và không thể gia hạn. Bạn nên tập trung vào những câu hỏi dễ trước để đảm bảo hoàn thành càng nhiều càng tốt.',
          sender: 'ai',
          timestamp: new Date(Date.now() - 1740000), // 29 minutes ago
        },
      ],
    };

    const context3: ChatContext = {
      id: '3',
      title: 'Cuộc trò chuyện mới',
      messages: [],
    };

    this.chatContexts = [context1, context2, context3];
    this.currentContextId = context1.id; // Set the first context as active
  }

  handleSendMessage(event: { contextId: string; message: string }): void {
    this.isLoading = true;

    // Simulate API delay
    setTimeout(() => {
      // Find the current context
      const context = this.chatContexts.find((c) => c.id === event.contextId);
      if (context) {
        // Add AI response
        context.messages.push({
          id: Date.now().toString(),
          content: this.generateAIResponse(event.message),
          sender: 'ai',
          timestamp: new Date(),
        });
      }
      this.isLoading = false;
    }, 1500);
  }

  private generateAIResponse(message: string): string {
    // Simple fake AI response generator
    const responses = [
      'Tôi hiểu câu hỏi của bạn. Trong bài tập này, bạn nên tập trung vào việc phân tích yêu cầu trước khi đưa ra giải pháp.',
      'Đây là một câu hỏi hay. Hãy xem xét các khái niệm đã học trong chương trước để tìm ra đáp án.',
      'Để giải quyết vấn đề này, bạn cần áp dụng kiến thức về cấu trúc dữ liệu và thuật toán.',
      'Tôi khuyên bạn nên đọc kỹ đề bài và xác định các yêu cầu chính trước khi trả lời.',
      'Câu hỏi này liên quan đến các nguyên tắc cơ bản của lập trình. Hãy nhớ lại các khái niệm về biến, điều kiện và vòng lặp.',
      'Đây là một khái niệm quan trọng trong môn học. Bạn có thể tìm thêm thông tin trong tài liệu tham khảo.',
    ];

    // Return a random response
    return responses[Math.floor(Math.random() * responses.length)];
  }

  handleCreateNewChat(): void {
    // In a real app, you might want to call an API to create a new chat
    console.log('New chat created');
  }

  handleSelectContext(contextId: string): void {
    this.currentContextId = contextId;
  }

  handleDeleteContext(contextId: string): void {
    this.chatContexts = this.chatContexts.filter((c) => c.id !== contextId);

    // If we deleted the current context, select another one
    if (contextId === this.currentContextId && this.chatContexts.length > 0) {
      this.currentContextId = this.chatContexts[0].id;
    }
  }
}
