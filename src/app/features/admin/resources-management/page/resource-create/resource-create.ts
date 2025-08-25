import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  ViewChild,
} from '@angular/core';
import { DropdownButtonComponent } from '../../../../../shared/components/fxdonad-shared/dropdown/dropdown.component';
import { ButtonComponent } from '../../../../../shared/components/my-shared/button/button.component';
import {
  TextEditor,
  TextEditorConfig,
} from '../../../../../shared/components/fxdonad-shared/text-editor/text-editor';
import { HtmlToMdService } from '../../../../../shared/utils/HTMLtoMarkDown';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { ResourceService } from '../../../../../core/services/api-service/resource.service';
import { sendNotification } from '../../../../../shared/utils/notification';
import { clearLoading } from '../../../../../shared/store/loading-state/loading.action';
import { Store } from '@ngrx/store';
import { InputComponent } from '../../../../../shared/components/fxdonad-shared/input/input';
import { decodeJWT } from '../../../../../shared/utils/stringProcess';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-resource-create',
  templateUrl: './resource-create.html',
  styleUrls: ['./resource-create.scss'],
  imports: [
    InputComponent,
    TextEditor,
    DropdownButtonComponent,
    ButtonComponent,
    NgIf,
    FormsModule,
    NgFor,
  ],
})
export class ResourceCreatePageComponent {
  @ViewChild('linkInput') linkInput!: ElementRef<HTMLInputElement>;
  tag: { value: string; label: string }[] = [];
  category: { value: string; label: string }[] = [];
  topics: { value: string; label: string }[] = [];
  selectedOptions: { [key: string]: any } = {};
  activeDropdown: string | null = null;
  associatedResourceIds: string[] = [];
  constructor(
    private htmlToMd: HtmlToMdService,
    private router: Router,
    private resourceService: ResourceService,
    private store: Store,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.tag = [
      { value: 'tag1', label: 'Tag 1' },
      { value: 'tag2', label: 'Tag 2' },
      { value: 'tag3', label: 'Tag 3' },
    ];
    this.category = [
      { value: '0', label: 'Tệp ảnh' },
      { value: '1', label: 'Tệp video' },
      { value: '2', label: 'Tệp tài liệu' },
      { value: '3', label: 'Tệp khác' },
    ];
  }
  thumbnail: string = '';
  thumbnailError: string | null = null;
  handleInputChange(value: string | number): void {
    this.thumbnail = value.toString();

    // Emit changes if needed
    console.log('Input changed:', this.thumbnail);
  }
  handleSelect(dropdownKey: string, selected: any): void {
    this.selectedOptions[dropdownKey] = selected;
    console.log(this.selectedOptions);
  }

  // ===== Link cũ (oldImgesUrls) =====
  newLink = '';
  isAddingLink = false;

  startAddLink() {
    this.ngZone.run(() => {
      this.isAddingLink = true;
      this.cdr.detectChanges();
      setTimeout(() => this.linkInput?.nativeElement?.focus());
    });
  }

  addLink() {
    const trimmed = this.newLink.trim();
    if (trimmed) {
      this.associatedResourceIds.push(trimmed);
      this.newLink = '';
      this.isAddingLink = false;
      this.cdr.detectChanges();
    }
  }

  removeLink(i: number) {
    this.associatedResourceIds.splice(i, 1);
  }
  /////tag
  tagInput: string = ''; // người dùng nhập tag thô
  tags: string[] = []; // danh sách tag đã cắt ra

  handleTagInputChange(value: string | number): void {
    this.tagInput = value.toString();
    this.tags = this.tagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0); // loại bỏ tag rỗng
    console.log('Danh sách tag:', this.tags);
  }

  toggleDropdown(id: string): void {
    // Nếu bạn muốn chỉ mở 1 dropdown tại một thời điểm
    this.activeDropdown = this.activeDropdown === id ? null : id;
  }
  saveDraftPost(): void {
    // Logic to save the draft post
    console.log('Draft post saved:', this.thumbnail);
  }
  createPost(): void {
    // kiểm tra bắt buộc
    if (!this.selectedFile) {
      sendNotification(
        this.store,
        'Tạo tài nguyên',
        'Vui lòng chọn file!',
        'error'
      );
      return;
    }

    if (!this.selectedOptions['category']) {
      sendNotification(
        this.store,
        'Tạo tài nguyên',
        'Vui lòng chọn danh mục!',
        'error'
      );
      return;
    }
    // Kiểm tra loại file theo MIME type hoặc phần mở rộng
    const file = this.selectedFile;
    let isTextbook = false;
    let isLectureVideo = false;

    if (file) {
      const fileType = file.type; // ví dụ: "application/pdf", "video/mp4", "image/png"

      // Nếu là file tài liệu (pdf, doc, docx, txt, ppt, pptx...)
      if (
        fileType.includes('pdf') ||
        fileType.includes('msword') ||
        fileType.includes('officedocument.wordprocessingml') ||
        fileType.includes('presentation') ||
        fileType.includes('text')
      ) {
        isTextbook = true;
      }

      // Nếu là file video (mp4, avi, mkv...)
      if (fileType.startsWith('video/')) {
        isLectureVideo = true;
      }
    }
    const role = decodeJWT(localStorage.getItem('token') ?? '')?.payload.scope;
    const postData = {
      file: file, // có
      category: Number(this.selectedOptions['category']?.value), // có
      description: this.htmlToMd.convert(this.editorContent), // có
      tags: this.tags,
      isTextbook: isTextbook, //có
      isLectureVideo: isLectureVideo, //có
      orgId: undefined,
      associatedResourceIds: [],
      thumbnailUrl: '',
    };

    this.resourceService.addResource(postData).subscribe({
      next: (res) => {
        sendNotification(this.store, 'Tạo tài nguyên', 'Thành công', 'success');
        setTimeout(() => {
          this.router.navigate(['/post-management/post-list']);
          this.store.dispatch(clearLoading());
        }, 300);
      },
      error: (err) => {
        console.error(err);
        this.store.dispatch(clearLoading());
      },
    });

    console.log('Dữ liệu bài viết:', postData);
  }

  cancelPost(): void {
    // Logic to cancel the post creation
    console.log('Post creation cancelled');
  }
  editorContent: string = '';
  readonlyContent: string =
    '<h2>This is a readonly text editor</h2><p>You cannot edit this content.</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>';
  minimalContent: string = '';

  editorConfig: TextEditorConfig = {
    placeholder: 'Nhập nội dung của bạn ở đây...',
    height: '300px',
    minHeight: '200px',
    maxHeight: '500px',
    readonly: false,
    toolbar: {
      bold: true,
      italic: true,
      underline: true,
      strikethrough: true,
      alignLeft: true,
      alignCenter: true,
      alignRight: true,
      alignJustify: true,
      bulletList: true,
      numberedList: true,
      indent: true,
      outdent: true,
      clearFormat: true,
    },
  };

  readonlyConfig: TextEditorConfig = {
    placeholder: 'Readonly content',
    height: '200px',
    readonly: true,
    toolbar: {},
  };

  minimalConfig: TextEditorConfig = {
    placeholder: 'Minimal toolbar editor...',
    height: '200px',
    readonly: false,
    toolbar: {
      bold: true,
      italic: true,
      bulletList: true,
      numberedList: true,
    },
  };
  selectedFile: File | null = null;
  filePreview: string | null = null;
  isImageFile: boolean = false;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const fileType = this.selectedFile.type;

      this.isImageFile = fileType.startsWith('image/');
      if (this.isImageFile) {
        const reader = new FileReader();
        reader.onload = (e) => (this.filePreview = e.target?.result as string);
        reader.readAsDataURL(this.selectedFile);
      } else {
        this.filePreview = null;
      }
    }
  }

  onContentChange(content: string) {
    console.log('Content changed:', content);
  }

  onEditorFocus() {
    console.log('Editor focused');
  }

  onEditorBlur() {
    console.log('Editor blurred');
  }

  clearContent() {
    this.editorContent = '';
  }

  toggleReadonly() {
    this.editorConfig.readonly = !this.editorConfig.readonly;
    this.editorConfig = { ...this.editorConfig };
  }
}
