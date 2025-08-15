import { CommonModule } from '@angular/common';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CodeEditorComponent } from '../../../../shared/components/fxdonad-shared/code-editor/code-editor.component';
import { CodingService } from '../../../../core/services/api-service/coding.service';
import { Store } from '@ngrx/store';
import { CodeSubmission } from '../../../../core/models/coding.model';
import { sendNotification } from '../../../../shared/utils/notification';
import { ExerciseCodeResponse } from '../../../../core/models/code.model';
import { ActivatedRoute, Router } from '@angular/router';
import {
  clearLoading,
  setLoading,
} from '../../../../shared/store/loading-state/loading.action';

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
  // --- State cho UI ---
  activeLeftTab: 'description' | 'testcases' = 'description';
  activeRightTab: 'console' | 'results' = 'console';

  // --- Dữ liệu bài tập ---
  exercise: ExerciseCodeResponse | null = null;
  exerciseId: string = '';
  examples: { id: string; input: string; output: string }[] = [];

  // --- Trạng thái thực thi code ---
  output = 'Click "Run Code" to see the output.';
  executionTime = '0';
  memoryUsage = '0';
  isRunning = false;
  isSubmitting = false; // Thêm trạng thái submit
  hasError = false;

  // --- Test cases ---
  testCases: {
    id: string;
    input: string;
    expected: string;
    actual?: string; // Thêm output thực tế để so sánh
    status: 'pending' | 'pass' | 'fail'; // Dùng 'pending' thay cho null
  }[] = [];

  private unlistenMouseMove!: () => void;
  private unlistenMouseUp!: () => void;

  constructor(
    private codingService: CodingService,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2 // Inject Renderer2
  ) {
    this.exerciseId = this.route.snapshot.paramMap.get('id') ?? '';
  }

  ngOnInit() {
    this.fetchCodingDetails();
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
  }

  // --- Các hàm xử lý UI ---
  selectLeftTab(tab: 'description' | 'testcases') {
    this.activeLeftTab = tab;
  }

  selectRightTab(tab: 'console' | 'results') {
    this.activeRightTab = tab;
  }

  runCode() {
    // Lấy code từ editor và in ra console
    const code: CodeSubmission = {
      submissionId: 4,
      submittedCode: this.codeEditorComponent.getCode(),
      userId: 'hdawhdjhawdbasj',
      exerciseId: '1',
      memory: 256,
      cpus: 1,
    };

    console.log('Code gửi đi:', code);

    // this.codingService.sendCode(code).subscribe({
    //   next: (res) => {
    //     console.log('đã gửi request');
    //     sendNotification(
    //       this.store,
    //       'Thành công',
    //       res.result.actualOutput,
    //       'success'
    //     );
    //   },
    //   error: (err) => {
    //     console.log('Lỗi gửi');
    //   },
    // });

    this.isRunning = true;
    this.hasError = false;
    // Reset test case status
    this.testCases = this.testCases.map((tc) => ({ ...tc, status: 'pending' }));
    // Simulate code execution
    setTimeout(() => {
      this.output = '[0, 1]';
      this.executionTime = '0.05';
      this.memoryUsage = '5.2';
      this.isRunning = false;
      // Simulate test case checking
      this.testCases = this.testCases.map((tc) => ({
        ...tc,
        status: tc.expected === '[0,1]' ? 'pass' : 'fail',
      }));
    }, 1000);
  }

  submitCode() {
    const codePayload = this.buildCodePayload();
    console.log('Submitting code with:', codePayload);

    this.isSubmitting = true;
    this.activeLeftTab = 'testcases'; // Tự động chuyển qua tab test case
    this.testCases.forEach((tc) => (tc.status = 'pending')); // Reset trạng thái

    // *** LOGIC GỌI API THỰC TẾ ***
    // this.codingService.submit(codePayload).subscribe({ ... });

    // --- Giả lập quá trình chấm bài ---
    setTimeout(() => {
      this.testCases = this.testCases.map((tc) => {
        // Giả lập logic pass/fail
        const isPass = Math.random() > 0.3; // 70% chance to pass
        return {
          ...tc,
          status: isPass ? 'pass' : 'fail',
          actual: isPass ? tc.expected : '[1, 2]', // Giả lập output sai
        };
      });
      this.isSubmitting = false;
    }, 1500);
  }

  private buildCodePayload(): CodeSubmission {
    return {
      submissionId: 4, // Nên là giá trị động
      submittedCode: this.codeEditorComponent.getCode(),
      userId: 'hdawhdjhawdbasj', // Lấy từ state/auth service
      exerciseId: this.exerciseId,
      memory: 256,
      cpus: 1,
    };
  }
}
