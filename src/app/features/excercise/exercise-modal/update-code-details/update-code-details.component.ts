import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CodingDetailResponse,
  TestCaseResponse,
  UpdateCodingDetailRequest,
  UpdateTestCaseRequest,
} from '../../../../core/models/code.model';
import { Store } from '@ngrx/store';
import { sendNotification } from '../../../../shared/utils/notification';
import {
  clearLoading,
  setLoading,
} from '../../../../shared/store/loading-state/loading.action';

@Component({
  selector: 'app-update-code-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './update-code-details.component.html',
  styleUrl: './update-code-details.component.scss',
})
export class UpdateCodeDetailsComponent implements OnInit {
  @Input() codingDetail: CodingDetailResponse | null = null;
  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveChanges = new EventEmitter<UpdateCodingDetailRequest>();

  // Form data
  formData: any = {
    topic: '',
    input: '',
    output: '',
    constraintText: '',
    timeLimit: 0,
    memoryLimit: 0,
    maxSubmissions: 0,
    codeTemplate: '',
    solution: '',
    allowedLanguages: [],
  };

  // Available languages
  availableLanguages: string[] = [
    'Java',
    'Python',
    'C++',
    'JavaScript',
    'C#',
    'Go',
    'Rust',
  ];

  // Test cases management
  testCases: UpdateTestCaseRequest[] = [];

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(): void {
    if (this.codingDetail) {
      this.initializeForm();
    }
  }

  initializeForm(): void {
    if (this.codingDetail) {
      this.formData = {
        topic: this.codingDetail.topic || '',
        input: this.codingDetail.input || '',
        output: this.codingDetail.output || '',
        constraintText: this.codingDetail.constraintText || '',
        timeLimit: this.codingDetail.timeLimit || 0,
        memoryLimit: this.codingDetail.memoryLimit || 0,
        maxSubmissions: this.codingDetail.maxSubmissions || 0,
        codeTemplate: this.codingDetail.codeTemplate || '',
        solution: this.codingDetail.solution || '',
        allowedLanguages: [...(this.codingDetail.allowedLanguages || [])],
      };

      // Initialize test cases
      this.testCases =
        this.codingDetail.testCases?.map((tc) => ({
          id: tc.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          sample: tc.sample,
          note: tc.note,
        })) || [];
    }
  }

  // Language management
  toggleLanguage(language: string): void {
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

  // Test case management
  addTestCase(): void {
    this.testCases.push({
      id: this.generateId(),
      input: '',
      expectedOutput: '',
      sample: false,
      note: '',
    });
  }

  removeTestCase(index: number): void {
    const testCase = this.testCases[index];
    if (testCase.id) {
      // Mark for deletion if it has an ID (existing test case)
      testCase.delete = true;
    } else {
      // Remove immediately if it's a new test case
      this.testCases.splice(index, 1);
    }
  }

  toggleSampleTestCase(index: number): void {
    this.testCases[index].sample = !this.testCases[index].sample;
  }

  // Modal actions
  onClose(): void {
    this.closeModal.emit();
  }

  onSave(): void {
    if (this.validateForm()) {
      const updatedCodingDetail: UpdateCodingDetailRequest = {
        topic: this.formData.topic,
        input: this.formData.input,
        output: this.formData.output,
        constraintText: this.formData.constraintText,
        timeLimit: this.formData.timeLimit,
        memoryLimit: this.formData.memoryLimit,
        maxSubmissions: this.formData.maxSubmissions,
        codeTemplate: this.formData.codeTemplate,
        solution: this.formData.solution,
        allowedLanguages: this.formData.allowedLanguages,
        testCases: this.testCases.filter((tc) => !tc.delete),
      };

      this.saveChanges.emit(updatedCodingDetail);
    }
  }

  private validateForm(): boolean {
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
        sendNotification(
          this.store,
          'Lỗi validation',
          `Vui lòng điền đầy đủ thông tin cho trường: ${fieldInfo.name}`,
          'error'
        );
        return false;
      }
    }

    // Check if at least one language is selected
    if (
      !this.formData.allowedLanguages ||
      this.formData.allowedLanguages.length === 0
    ) {
      sendNotification(
        this.store,
        'Lỗi validation',
        'Vui lòng chọn ít nhất một ngôn ngữ lập trình',
        'error'
      );
      return false;
    }

    // Check test cases
    const activeTestCases = this.testCases.filter((tc) => !tc.delete);
    if (activeTestCases.length === 0) {
      sendNotification(
        this.store,
        'Lỗi validation',
        'Vui lòng thêm ít nhất một test case',
        'error'
      );
      return false;
    }

    // Check each test case has required fields
    for (let i = 0; i < activeTestCases.length; i++) {
      const testCase = activeTestCases[i];
      if (!testCase.input.trim()) {
        sendNotification(
          this.store,
          'Lỗi validation',
          `Test case ${i + 1}: Vui lòng điền input`,
          'error'
        );
        return false;
      }
      if (!testCase.expectedOutput.trim()) {
        sendNotification(
          this.store,
          'Lỗi validation',
          `Test case ${i + 1}: Vui lòng điền expected output`,
          'error'
        );
        return false;
      }
    }

    // Check if at least one sample test case exists
    const sampleTestCases = activeTestCases.filter((tc) => tc.sample);
    if (sampleTestCases.length === 0) {
      sendNotification(
        this.store,
        'Lỗi validation',
        'Vui lòng đánh dấu ít nhất một test case là mẫu (sample)',
        'error'
      );
      return false;
    }

    return true;
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Prevent modal close when clicking inside
  onModalClick(event: Event): void {
    event.stopPropagation();
  }
}
