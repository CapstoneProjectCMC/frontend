import { Component, Input } from '@angular/core';
import {
  ExerciseCodeResponse,
  TestCaseResponse,
  AddCodeDetailsRequest,
  TestCase,
} from '../../../../core/models/code.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CodingService } from '../../../../core/services/api-service/coding.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { sendNotification } from '../../../../shared/utils/notification';

@Component({
  selector: 'app-exercise-code-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './exercise-code-details.component.html',
  styleUrls: ['./exercise-code-details.component.scss'],
})
export class ExerciseCodeDetailsComponent {
  exercise: ExerciseCodeResponse | null = null;
  exerciseId: string = '';

  // Properties for create form
  availableLanguages: string[] = [
    'Java',
    'Python',
    'C++',
    'JavaScript',
    'C#',
    'Go',
    'Rust',
  ];
  testCases: TestCase[] = [];

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

  constructor(
    private codingService: CodingService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.exerciseId = this.route.snapshot.paramMap.get('id') ?? '';
    // Để component hoạt động ngay cả khi chưa có @Input, ta có thể dùng mock data
    this.fetchCodingDetails();

    // Initialize with one test case if creating new exercise
    if (!this.exerciseId) {
      this.addTestCase();
    }
  }

  fetchCodingDetails() {
    this.codingService
      .getCodingExercise(this.exerciseId, 1, 99999, 'CREATED_AT', false)
      .subscribe({
        next: (res) => {
          this.exercise = res.result;
        },
        error: (err) => {
          if (err.code === 4048310) {
            //thực hiện tạo mới exercise details tại đây
          }
          console.log(err);
        },
      });
  }

  // Lọc và trả về chỉ các test case là mẫu (sample = true)
  getSampleTestCases(): TestCaseResponse[] {
    if (this.exercise?.codingDetail?.testCases) {
      return this.exercise.codingDetail.testCases.filter((tc) => tc.sample);
    }
    return [];
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

  goBack() {
    this.router.navigate(['/exercises']);
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

    // Get form data and create AddCodeDetailsRequest
    const formData = this.getFormData();

    // TODO: Implement API call to create exercise
    console.log('Creating exercise with data:', formData);

    // Show success notification
    sendNotification(
      this.store,
      'Thành công',
      'Bài tập đã được tạo thành công!',
      'success'
    );
  }

  private validateForm(): { isValid: boolean; message: string } {
    // Check required fields
    const requiredFields = [
      { field: 'title', name: 'Tiêu đề bài tập' },
      { field: 'topic', name: 'Chủ đề' },
      { field: 'description', name: 'Mô tả bài toán' },
      { field: 'difficulty', name: 'Độ khó' },
      { field: 'duration', name: 'Thời gian làm bài' },
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
