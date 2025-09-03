import { Component } from '@angular/core';
import { CodingService } from '../../../../core/services/api-service/coding.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  AddCodeDetailsRequest,
  TestCase,
} from '../../../../core/models/code.model';
import { sendNotification } from '../../../../shared/utils/notification';
import {
  clearLoading,
  setLoading,
} from '../../../../shared/store/loading-state/loading.action';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-code-details',
  imports: [FormsModule],
  templateUrl: './add-code-details.component.html',
  styleUrl: './add-code-details.component.scss',
})
export class AddCodeDetailsComponent {
  exerciseId: string = '';
  // Form data object
  formData: any = {
    title: '',
    topic: '',
    description: '',
    difficulty: '',
    duration: 0,
    input: '',
    output: '',
    constraintText: '',
    timeLimit: 0,
    memoryLimit: 0,
    maxSubmissions: 0,
    codeTemplate: '',
    solution: '',
    tags: '',
    allowedLanguages: [],
  };

  // Properties for create form
  availableLanguages: string[] = [
    'Java',
    'Python',
    'C++',
    // 'JavaScript',
    // 'C#',
    // 'Go',
    // 'Rust',
  ];

  testCases: TestCase[] = [];

  constructor(
    private codingService: CodingService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.exerciseId = this.route.snapshot.paramMap.get('id') ?? '';
    // Để component hoạt động ngay cả khi chưa có @Input, ta có thể dùng mock data
  }

  createExercise() {
    // Validate form data before creating
    const validationResult = this.validateForm();

    if (!validationResult.isValid) {
      sendNotification(
        this.store,
        'Lỗi validation',
        validationResult.message,
        'error'
      );
      return;
    }

    this.store.dispatch(
      setLoading({ isLoading: true, content: 'Đang tạo, xin chờ...' })
    );

    // Get form data and create AddCodeDetailsRequest
    const formData = this.getFormData();

    this.codingService.addCodingDetails(this.exerciseId, formData).subscribe({
      next: (res) => {
        sendNotification(
          this.store,
          'Đã thêm chi tiết bài code',
          res.message,
          'success'
        );
        setTimeout(() => {
          this.router.navigate([
            '/exercise/exercise-layout/exercise-code-details',
            this.exerciseId,
          ]);
          this.store.dispatch(clearLoading());
        }, 300);
      },
      error: (err) => {
        console.log(err);
        this.store.dispatch(clearLoading());
      },
    });
  }

  // Methods for create form
  addTestCase() {
    this.testCases.push({
      input: '',
      expectedOutput: '',
      sample: false,
      note: '',
    });
  }

  goBack() {
    this.router.navigate(['/exercise/exercise-layout/list']);
  }

  removeTestCase(index: number) {
    this.testCases.splice(index, 1);
  }

  toggleLanguage(language: string) {
    const index = this.formData.allowedLanguages.indexOf(language);
    if (index > -1) {
      this.formData.allowedLanguages.splice(index, 1);
    } else {
      this.formData.allowedLanguages.push(language);
    }
  }

  isLanguageSelected(language: string): boolean {
    return this.formData.allowedLanguages.includes(language);
  }

  private validateForm(): { isValid: boolean; message: string } {
    // Check required fields
    const requiredFields = [
      { field: 'topic', name: 'Chủ đề' },
      { field: 'input', name: 'Định dạng đầu vào' },
      { field: 'output', name: 'Định dạng đầu ra' },
      { field: 'constraintText', name: 'Các ràng buộc' },
      { field: 'timeLimit', name: 'Giới hạn thời gian' },
      { field: 'memoryLimit', name: 'Giới hạn bộ nhớ' },
      { field: 'maxSubmissions', name: 'Lượt nộp tối đa' },
      { field: 'solution', name: 'Giải pháp' },
    ];

    for (const fieldInfo of requiredFields) {
      const value = this.formData[fieldInfo.field];
      if (
        !value ||
        (typeof value === 'string' && !value.trim()) ||
        (typeof value === 'number' && value <= 0)
      ) {
        return {
          isValid: false,
          message: `Vui lòng điền đầy đủ thông tin cho trường: ${fieldInfo.name}`,
        };
      }
    }

    // Check if at least one language is selected
    if (
      !this.formData.allowedLanguages ||
      this.formData.allowedLanguages.length === 0
    ) {
      return {
        isValid: false,
        message: 'Vui lòng chọn ít nhất một ngôn ngữ lập trình',
      };
    }

    // Check test cases
    if (this.testCases.length === 0) {
      return {
        isValid: false,
        message: 'Vui lòng thêm ít nhất một test case',
      };
    }

    // Check each test case has required fields
    for (let i = 0; i < this.testCases.length; i++) {
      const testCase = this.testCases[i];
      if (!testCase.input.trim()) {
        return {
          isValid: false,
          message: `Test case ${i + 1}: Vui lòng điền input`,
        };
      }
      if (!testCase.expectedOutput.trim()) {
        return {
          isValid: false,
          message: `Test case ${i + 1}: Vui lòng điền expected output`,
        };
      }
    }

    // Check if at least one sample test case exists
    const sampleTestCases = this.testCases.filter((tc) => tc.sample);
    if (sampleTestCases.length === 0) {
      return {
        isValid: false,
        message: 'Vui lòng đánh dấu ít nhất một test case là mẫu (sample)',
      };
    }

    return { isValid: true, message: '' };
  }

  private getFormData(): AddCodeDetailsRequest {
    return {
      topic: this.formData.topic,
      allowedLanguages: this.formData.allowedLanguages,
      input: this.formData.input,
      output: this.formData.output,
      constraintText: this.formData.constraintText,
      timeLimit: this.formData.timeLimit,
      memoryLimit: this.formData.memoryLimit,
      maxSubmissions: this.formData.maxSubmissions,
      codeTemplate: this.formData.codeTemplate,
      solution: this.formData.solution,
      testCases: this.testCases,
    };
  }
}
