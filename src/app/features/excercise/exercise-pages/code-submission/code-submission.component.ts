import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  NgZone,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CodeEditorComponent } from '../../../../shared/components/fxdonad-shared/code-editor/code-editor.component';
import { CodingService } from '../../../../core/services/api-service/coding.service';
import { Store } from '@ngrx/store';
import {
  ExerciseCodeResponse,
  submitCodeRequest,
} from '../../../../core/models/code.model';
import { ActivatedRoute, Router } from '@angular/router';
import {
  clearLoading,
  setLoading,
} from '../../../../shared/store/loading-state/loading.action';
import { decodeJWT } from '../../../../shared/utils/stringProcess';
import { openModalNotification } from '../../../../shared/utils/notification';
import { SocketService } from '../../../../core/services/socket-service/socket.service';

@Component({
  selector: 'app-code-submission',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CodeEditorComponent,
  ],
  templateUrl: './code-submission.component.html',
  styleUrl: './code-submission.component.scss',
})
export class CodeSubmissionComponent {
  @ViewChild(CodeEditorComponent) codeEditorComponent!: CodeEditorComponent;
  // --- Thêm các ViewChild để lấy tham chiếu tới element ---
  @ViewChild('submissionContainer') submissionContainer!: ElementRef;
  @ViewChild('leftPanel') leftPanel!: ElementRef;
  @ViewChild('resizer') resizer!: ElementRef;
  @ViewChild('consoleContainer') consoleContainer!: ElementRef;
  @ViewChild('logsContainer') logsContainer!: ElementRef;

  // --- State cho UI ---
  activeLeftTab: 'description' | 'testcases' = 'description';
  activeRightTab: 'console' | 'results' = 'console';

  // --- Dữ liệu bài tập ---
  exercise: ExerciseCodeResponse | null = null;
  exerciseId: string = '';
  examples: { id: string; input: string; output: string }[] = [];

  // --- Trạng thái thực thi code ---
  output = 'Click "Run Code" to see the output.';
  languageSelected = 'python';
  executionTime = '0';
  memoryUsage = '0';
  isRunning = false;
  isSubmitting = false; // Thêm trạng thái submit
  hasError = false;

  //anti-cheat
  allowTab: boolean = true;
  fullScreenRequire: boolean = false;
  allowDevTools: boolean = false;

  // --- Timer ---
  timeLeftSeconds: number = 0;
  totalDurationSeconds: number = 0;
  timerInterval: any;
  progressPercent: number = 100;
  endTime!: number;

  // --- Test cases ---
  testCases: {
    id: string; // Giữ lại ID ban đầu để map
    input: string;
    expected: string;
    // --- Các thông tin từ API response ---
    status: 'pending' | 'pass' | 'fail' | 'error'; // Thêm trạng thái 'error'
    actualOutput?: string;
    runtimeMs?: number;
    memoryKb?: number;
    errorMessage?: string;
  }[] = [];

  submissionResult: {
    score: number;
    totalPoints: number;
    passedAll: boolean;
    peakMemorymb: number;
  } | null = null;

  private unlistenMouseMove!: () => void;
  private unlistenMouseUp!: () => void;

  // --- Socket---
  private socketSubs: any[] = [];
  private phaseMap: { [key: string]: number } = {
    STARTED: 0,
    RUNNING: 30,
    STDOUT: 60,
    STDERR: 60, // lỗi thì cũng ngang STDOUT
    FINISHED: 100,
  };

  logs: { phase: string; chunk: string }[] = [];
  currentPhase: string = '';
  phaseProgress: number = 0;

  constructor(
    private codingService: CodingService,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2, // Inject Renderer2
    private socketService: SocketService,
    private ngZone: NgZone
  ) {
    this.exerciseId = this.route.snapshot.paramMap.get('id') ?? '';
  }

  ngOnInit() {
    this.fetchCodingDetails();

    // lắng nghe socket events
    this.socketSubs.push(
      this.socketService.on<any>('playground:run').subscribe((u) => {
        this.ngZone.run(() => {
          // console.log('🔄 phase', u);

          this.isRunning = true;
          this.currentPhase = u.phase;
          this.logs.push({ phase: u.phase, chunk: u.chunk ?? '' });

          if (u.phase === 'STDOUT') {
            this.output += u.chunk;
          }

          if (u.phase === 'STDERR') {
            this.output += `[ERROR] ${u.chunk}\n`;
            this.hasError = true;
          }

          // map phase → progress
          this.phaseProgress = this.phaseMap[u.phase] ?? this.phaseProgress;
        });
      }),

      this.socketService.on<any>('playground:finished').subscribe((u) => {
        this.ngZone.run(() => {
          console.log('✅ finished', u);
          this.isRunning = false;
          this.executionTime = u.runtimeMs.toString();
          this.memoryUsage = u.memoryMb.toString();
          // this.output += `\n[FINISHED] ExitCode=${u.exitCode}`;

          this.logs.push({ phase: 'FINISHED', chunk: `Exit ${u.exitCode}` });
          this.phaseProgress = 100; // full progress
        });
      }),

      this.socketService.on<any>('playground:error').subscribe((msg) => {
        this.ngZone.run(() => {
          this.isRunning = false;
          this.hasError = true;
          this.output = `[ERROR] ${msg}`;
        });
      })
    );
  }

  ngAfterViewChecked() {
    if (this.isRunning && this.logsContainer) {
      const el = this.logsContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  startTimer() {
    this.clearTimer();
    this.timerInterval = setInterval(() => {
      const now = Date.now();
      const diff = Math.floor((this.endTime - now) / 1000);

      if (diff > 0) {
        this.timeLeftSeconds = diff;
        this.progressPercent =
          (this.timeLeftSeconds / this.totalDurationSeconds) * 100;
      } else {
        this.timeLeftSeconds = 0;
        this.progressPercent = 0;
        this.clearTimer();
        openModalNotification(
          this.store,
          '⏱ Hết thời gian làm bài',
          'Bài của bạn đã được nộp!',
          'Đồng ý',
          'Thoát'
        );
        this.submitCode(); // auto submit khi hết giờ
      }
    }, 1000);
  }

  clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  fetchCodingDetails() {
    Promise.resolve().then(() => {
      this.store.dispatch(
        setLoading({ isLoading: true, content: 'Đang lấy dữ liệu chi tiết...' })
      );
    });

    this.codingService
      .getCodingExercise(this.exerciseId, 1, 99999, 'CREATED_AT', false)
      .subscribe({
        next: (res) => {
          this.exercise = res.result;
          // Setup timer nếu có duration
          if (this.exercise?.duration) {
            this.totalDurationSeconds = this.exercise.duration * 60;
            this.endTime = Date.now() + this.totalDurationSeconds * 1000;
            this.startTimer();
          }

          this.store.dispatch(clearLoading());
          this.testCases = this.exercise.codingDetail.testCases.map((tc) => ({
            id: tc.id,
            input: tc.input,
            expected: tc.expectedOutput,
            status: 'pending',
          }));

          this.examples = this.exercise.codingDetail.testCases
            .filter((tc) => tc.sample)
            .map((tc, i) => ({
              id: (i + 1).toString(),
              input: tc.input,
              output: tc.expectedOutput,
            }));
        },
        error: (err) => {
          console.log(err);
          this.router.navigate(['/exercise/exercise-layout/list']);
          this.store.dispatch(clearLoading());
        },
      });
  }

  onMouseDown(event: MouseEvent): void {
    event.preventDefault(); // Ngăn chặn các hành vi mặc định như chọn văn bản

    const container = this.submissionContainer.nativeElement;
    const leftPanel = this.leftPanel.nativeElement;

    // Lắng nghe sự kiện trên toàn bộ document
    // để người dùng có thể kéo chuột ra ngoài thanh resizer
    this.unlistenMouseMove = this.renderer.listen(
      'document',
      'mousemove',
      (e) => {
        this.onMouseMove(e, container, leftPanel);
      }
    );

    this.unlistenMouseUp = this.renderer.listen('document', 'mouseup', () => {
      this.onMouseUp();
    });

    // Thêm class để ngăn chọn văn bản khi đang kéo
    this.renderer.addClass(document.body, 'resizing');
  }

  private onMouseMove(
    event: MouseEvent,
    container: HTMLElement,
    leftPanel: HTMLElement
  ): void {
    // Tính toán vị trí của thanh resizer so với container
    const containerRect = container.getBoundingClientRect();
    const newLeftWidth = event.clientX - containerRect.left;

    // Giới hạn kích thước tối thiểu và tối đa
    const minWidth = container.clientWidth * 0.2; // 20%
    const maxWidth = container.clientWidth * 0.8; // 80%

    if (newLeftWidth > minWidth && newLeftWidth < maxWidth) {
      // Cập nhật lại grid-template-columns của container
      const newGridTemplate = `${newLeftWidth}px 5px auto`;
      this.renderer.setStyle(
        container,
        'grid-template-columns',
        newGridTemplate
      );
    }
  }

  private onMouseUp(): void {
    // Gỡ bỏ các listener khi người dùng nhả chuột
    if (this.unlistenMouseMove) {
      this.unlistenMouseMove();
    }
    if (this.unlistenMouseUp) {
      this.unlistenMouseUp();
    }
    // Xóa class khỏi body
    this.renderer.removeClass(document.body, 'resizing');
  }

  // --- Quan trọng: Dọn dẹp listener khi component bị hủy ---
  ngOnDestroy() {
    this.onMouseUp(); // Đảm bảo các listener được gỡ bỏ
    this.onMouseUp();
    this.clearTimer(); // cleanup

    // cleanup socket
    this.socketSubs.forEach((s) => s.unsubscribe());
    this.socketService.disconnect();
  }

  // --- Các hàm xử lý UI ---
  selectLeftTab(tab: 'description' | 'testcases') {
    this.activeLeftTab = tab;
  }

  selectRightTab(tab: 'console' | 'results') {
    this.activeRightTab = tab;
  }

  runCode() {
    this.isRunning = true;
    this.hasError = false;
    this.output = ''; // reset console

    const code = this.codeEditorComponent.getCode();
    const lang = this.codeEditorComponent.getLanguage();

    // gửi lên server để thực thi
    this.socketService.emit('playground:run', {
      language: lang,
      sourceCode: code,
      stdin: '',
      memoryMb: 256,
      cpus: 0.5,
      timeLimitSec: 5,
    });

    // reset test cases sang pending
    this.testCases = this.testCases.map((tc) => ({ ...tc, status: 'pending' }));
  }

  // stopCode() {
  //   if (this.socketService) {
  //     this.socketService.send(JSON.stringify({ event: 'playground:stop' })); // nếu server hỗ trợ cancel
  //     this.socketService.close(); // fallback: đóng socket luôn
  //     this.isRunning = false;
  //   }
  // }

  submitCode() {
    this.isSubmitting = true;
    this.activeLeftTab = 'testcases'; // Tự động chuyển qua tab
    this.submissionResult = null; // Reset kết quả cũ

    // Reset trạng thái từng test case về 'pending'
    this.testCases.forEach((tc) => {
      tc.status = 'pending';
      tc.actualOutput = undefined;
      tc.runtimeMs = undefined;
      tc.memoryKb = undefined;
      tc.errorMessage = undefined;
    });

    const dataSubmit: submitCodeRequest = {
      exerciseId: this.exerciseId,
      studentId: decodeJWT(localStorage.getItem('token') ?? '')?.payload.userId,
      language: this.codeEditorComponent.getLanguage(),
      sourceCode: this.codeEditorComponent.getCode(),
      timeTakenSeconds: (
        this.totalDurationSeconds - this.timeLeftSeconds
      ).toString(), // Có thể tính toán thời gian thực
    };

    this.codingService.submitCode(this.exerciseId, dataSubmit).subscribe({
      next: (res) => {
        const responseData = res.result;

        // Lưu kết quả tổng quan
        this.submissionResult = {
          score: responseData.score,
          totalPoints: responseData.totalpoints,
          passedAll: responseData.passed,
          peakMemorymb: responseData.peakmemorymb,
        };

        // Cập nhật chi tiết cho từng test case
        responseData.results.forEach((result) => {
          const testCase = this.testCases.find(
            (tc) => tc.id === result.testcaseid // đổi đúng key
          );
          if (testCase) {
            testCase.status = result.passed ? 'pass' : 'fail';
            testCase.actualOutput = result.output;
            testCase.runtimeMs = result.runtimems;
            testCase.memoryKb = result.memorykb;
            testCase.errorMessage = result.errormessage;
          }
        });

        this.isSubmitting = false;
      },
      error: (err) => {
        console.log(err);
        // Có thể hiển thị thông báo lỗi chung ở đây
        this.isSubmitting = false;
      },
    });
  }

  confirmSubmit() {
    openModalNotification(
      this.store,
      'Xác nhận nộp bài',
      'Bạn có chắc chắn hoàn thành bài tập?',
      'Đồng ý',
      'Soát lại',
      () => this.submitCode()
    );
  }

  get formattedTimeLeft(): string {
    const minutes = Math.floor(this.timeLeftSeconds / 60);
    const seconds = this.timeLeftSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}
