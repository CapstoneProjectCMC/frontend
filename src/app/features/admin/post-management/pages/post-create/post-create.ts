import { NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DropdownButtonComponent } from '../../../../../shared/components/fxdonad-shared/dropdown/dropdown.component';
import { InputComponent } from '../../../../../shared/components/fxdonad-shared/input/input';
import { ButtonComponent } from '../../../../../shared/components/my-shared/button/button.component';
import {
  TextEditor,
  TextEditorConfig,
} from '../../../../../shared/components/fxdonad-shared/text-editor/text-editor';

import { HtmlToMdService } from '../../../../../shared/utils/HTMLtoMarkDown';
import { Post, PostADD } from '../../../../../core/models/post.models';
import { mapPostInfortoPost } from '../../../../../shared/utils/mapData';
import { PostService } from '../../../../../core/services/api-service/post.service';
import { sendNotification } from '../../../../../shared/utils/notification';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import {
  clearLoading,
  setLoading,
} from '../../../../../shared/store/loading-state/loading.action';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.html',
  styleUrls: ['./post-create.scss'],
  imports: [
    InputComponent,
    TextEditor,
    DropdownButtonComponent,
    ButtonComponent,
    FormsModule,
    NgIf,
  ],
})
export class PostCreatePageComponent {
  @ViewChild('linkInput') linkInput!: ElementRef<HTMLInputElement>;

  post: PostADD = {
    postId: '', // BE có field này -> để trống
    title: '',
    orgId: '',
    content: '',
    isPublic: false, // sẽ set theo postType ở createPost()
    allowComment: false,
    postType: 'Global',
    oldImgesUrls: '', // ĐÚNG CHÍNH TẢ THEO BE
    hashtag: '',
    status: 'PENDING',
    fileDocument: {
      category: 'image', // STRING, BE yêu cầu
      description: '',
      tags: [],
      orgId: '',
      isLectureVideo: false,
      isTextBook: false,
    },
  };

  tag: { value: string; label: string }[] = [
    { value: 'tag1', label: 'Tag 1' },
    { value: 'tag2', label: 'Tag 2' },
    { value: 'tag3', label: 'Tag 3' },
  ];

  wherepost: { value: string; label: string }[] = [
    { value: '550e8400-e29b-41d4-a716-446655440000', label: 'Where 1' },
    { value: '550e8400-e29b-41d4-a716-446655440000', label: 'Where 2' },
    { value: '550e8400-e29b-41d4-a716-446655440000', label: 'Where 3' },
  ];

  topics: { value: string; label: string }[] = [
    { value: 'topic1', label: 'Topic 1' },
    { value: 'topic2', label: 'Topic 2' },
    { value: 'topic3', label: 'Topic 3' },
  ];

  selectedOptions: { [key: string]: any } = {};
  activeDropdown: string | null = null;

  constructor(
    private htmlToMd: HtmlToMdService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private postService: PostService,
    private store: Store,
    private router: Router
  ) {}

  // ===== File (1 ảnh) =====
  selectedFile: File | null = null;
  filePreview: string | null = null;
  isImageFile: boolean = false;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type.startsWith('image/')) {
        this.selectedFile = file;
        this.isImageFile = true;

        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) this.filePreview = e.target.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        this.selectedFile = null;
        this.filePreview = null;
        this.isImageFile = false;
      }
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.filePreview = null;
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
      this.post.oldImgesUrls = trimmed; // gán trực tiếp string
      this.newLink = '';
      this.isAddingLink = false;
      this.cdr.detectChanges();
    }
  }

  removeLink() {
    this.post.oldImgesUrls = '';
  }

  // ===== Input handlers =====
  postTitleError: string | null = null;

  handleInputDesChange(value: string | number): void {
    if (!this.post.fileDocument) this.post.fileDocument = {};
    this.post.fileDocument.description = String(value);
  }

  handleInputTitleChange(value: string | number): void {
    this.post.title = String(value);
  }

  handleSelect(dropdownKey: string, selected: any): void {
    this.selectedOptions = {};
    this.selectedOptions[dropdownKey] = selected;

    if (dropdownKey === 'wherepost') {
      this.post.orgId = selected?.value || '';
      if (!this.post.fileDocument) this.post.fileDocument = {};
      this.post.fileDocument.orgId = selected?.value || '';
    }

    if (dropdownKey === 'tag') {
      if (!this.post.fileDocument) this.post.fileDocument = {};
      if (Array.isArray(selected)) {
        this.post.fileDocument.tags = selected.map((s) => s.label);
      } else {
        this.post.fileDocument.tags = selected?.label ? [selected.label] : [];
      }
    }

    if (dropdownKey === 'hashtag') {
      this.post.hashtag = selected?.value || '';
    }
  }

  toggleDropdown(id: string): void {
    this.activeDropdown = this.activeDropdown === id ? null : id;
  }

  // ===== Text editor =====
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
    toolbar: { bold: true, italic: true, bulletList: true, numberedList: true },
  };

  onContentChange(content: string) {}
  onEditorFocus() {}
  onEditorBlur() {}
  clearContent() {
    this.editorContent = '';
  }
  toggleReadonly() {
    setTimeout(() => {
      this.editorConfig.readonly = !this.editorConfig.readonly;
      this.editorConfig = { ...this.editorConfig };
    });
  }

  // ===== Submit =====
  saveDraftPost(): void {
    console.log('Draft post saved:', this.post.title);
  }

  createPost(): void {
    // Convert HTML -> MD (nếu cần)
    this.post.content = this.htmlToMd.convert(this.editorContent || '');

    // Tự tính isPublic theo postType
    this.post.isPublic = this.post.postType !== 'Private';

    // Gắn file vào fileDocument
    if (this.selectedFile) {
      if (!this.post.fileDocument) this.post.fileDocument = {};
      this.post.fileDocument.file = this.selectedFile;
    }

    this.store.dispatch(
      setLoading({ isLoading: true, content: 'Đang tạo, xin chờ...' })
    );

    // Debug nhanh
    console.log('Post type:', this.post.postType);

    this.postService.createPost(this.post).subscribe({
      next: (res) => {
        sendNotification(this.store, 'Tạo bài viết', 'Thành công', 'success');
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
  }

  cancelPost(): void {
    console.log('Post creation cancelled');
  }

  mapCreateExerciseToCardDataUI(data: PostADD): Post {
    return mapPostInfortoPost(data);
  }
}
