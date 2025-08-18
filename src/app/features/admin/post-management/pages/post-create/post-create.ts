import { NgFor, NgIf } from '@angular/common';

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  ViewChild,
} from '@angular/core';
import { DropdownButtonComponent } from '../../../../../shared/components/fxdonad-shared/dropdown/dropdown.component';
import { InputComponent } from '../../../../../shared/components/fxdonad-shared/input/input';
import { ButtonComponent } from '../../../../../shared/components/my-shared/button/button.component';
import {
  TextEditor,
  TextEditorConfig,
} from '../../../../../shared/components/fxdonad-shared/text-editor/text-editor';
import { HtmlToMdService } from '../../../../../shared/utils/HTMLtoMarkDown';
import { FormsModule, NgModel } from '@angular/forms';
import { PostDetailComponent } from '../post-detail/post-detail';
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
    NgFor,
    // PostDetailComponent,
  ],
})
export class PostCreatePageComponent {
  @ViewChild('linkInput') linkInput!: ElementRef<HTMLInputElement>;
  post: PostADD = {
    title: '',
    orgId: '',
    content: '',
    isPublic: false,
    allowComment: false,
    postType: 'Global',
    oldImagesUrls: [],
    hashtag: [],
    status: 'PENDING',
    fileDocument: undefined,
  };
  tag: { value: string; label: string }[] = [];
  wherepost: { value: string; label: string }[] = [];
  topics: { value: string; label: string }[] = [];

  selectedOptions: { [key: string]: any } = {};
  activeDropdown: string | null = null;

  constructor(
    private htmlToMd: HtmlToMdService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private postService: PostService,
    private store: Store,
    private router: Router
  ) {
    if (!this.post.fileDocument) {
      this.post.fileDocument = {
        category: [],
        description: '',
        tags: [],
        orgId: '',
        isLectureVideo: false,
        isTextBook: false,
      };
    }
    this.post.fileDocument.category = ['image'];

    (this.post.postType = 'Global'), (this.post.status = 'PENDING');
    this.tag = [
      { value: 'tag1', label: 'Tag 1' },
      { value: 'tag2', label: 'Tag 2' },
      { value: 'tag3', label: 'Tag 3' },
    ];
    this.wherepost = [
      { value: 'where1', label: 'Where 1' },
      { value: 'where2', label: 'Where 2' },
      { value: 'where3', label: 'Where 3' },
    ];
    this.topics = [
      { value: 'topic1', label: 'Topic 1' },
      { value: 'topic2', label: 'Topic 2' },
      { value: 'topic3', label: 'Topic 3' },
    ];
    this.post.content = '';
  }
  //xli nhiều file
  // selectedFiles: File[] = [];
  // filePreviews: string[] = [];
  // isImageFile: boolean = false;
  // onFileSelected(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     this.selectedFiles = Array.from(input.files).filter((file) =>
  //       file.type.startsWith('image/')
  //     );

  //     this.filePreviews = [];
  //     this.selectedFiles.forEach((file) => {
  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //         if (e.target?.result) {
  //           this.filePreviews.push(e.target.result as string);
  //         }
  //       };
  //       reader.readAsDataURL(file);
  //     });
  //   }
  // }
  //   removeImage(index: number) {
  //   this.selectedFiles.splice(index, 1);
  //   this.filePreviews.splice(index, 1);
  // }
  //xli 1 file
  selectedFile: File | null = null;
  filePreview: string | null = null;
  isImageFile: boolean = false;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0]; // chỉ lấy 1 file đầu tiên

      if (file.type.startsWith('image/')) {
        this.selectedFile = file;
        this.isImageFile = true;

        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            this.filePreview = e.target.result as string;
          }
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

  //xli link
  newLink = '';
  isAddingLink = false;

  startAddLink() {
    this.ngZone.run(() => {
      this.isAddingLink = true;
      this.cdr.detectChanges(); // Kích hoạt phát hiện thay đổi thủ công
      setTimeout(() => {
        if (this.linkInput) {
          this.linkInput.nativeElement.focus();
        }
      });
    });
  }

  addLink() {
    const trimmed = this.newLink.trim();
    if (trimmed) {
      this.post.oldImagesUrls.push(trimmed);
      this.newLink = '';
      this.isAddingLink = false;
      this.cdr.detectChanges(); // thông báo Angular check lại
    }
  }

  removeLink(index: number) {
    this.post.oldImagesUrls.splice(index, 1);
  }

  ///khác

  postTitleError: string | null = null;
  handleInputDesChange(value: string | number): void {
    if (!this.post.fileDocument) {
      this.post.fileDocument = {
        category: [],
        description: '',
        tags: [],
        orgId: '',
        isLectureVideo: false,
        isTextBook: false,
      };
    }
    this.post.fileDocument.description = value.toString();
  }

  handleInputTitleChange(value: string | number): void {
    this.post.title = value.toString();
  }
  handleSelect(dropdownKey: string, selected: any): void {
    // Reset toàn bộ các lựa chọn trước đó
    this.selectedOptions = {};
    if (!this.post.fileDocument) {
      this.post.fileDocument = {
        category: [],
        description: '',
        tags: [],
        orgId: '',
        isLectureVideo: false,
        isTextBook: false,
      };
    }
    // Lưu lại option vừa chọn
    this.selectedOptions[dropdownKey] = selected;
    // Nếu dropdownKey là 'wherepost' thì gán orgId
    if (dropdownKey === 'wherepost') {
      this.post.orgId = selected?.value || '';
      this.post.fileDocument.orgId = selected?.value;
    }
    if (dropdownKey === 'tag') {
      // Multi select → map label
      if (Array.isArray(selected)) {
        this.post.fileDocument.tags = selected.map((s) => s.label);
      } else {
        this.post.fileDocument.tags = selected?.label ? [selected.label] : [];
      }
    }
    if (dropdownKey === 'hashtag') {
      // Multi select → map label
      if (Array.isArray(selected)) {
        this.post.hashtag = selected.map((s) => s.label);
      } else {
        this.post.hashtag = selected?.label ? [selected.label] : [];
      }
    }
  }

  toggleDropdown(id: string): void {
    // Nếu bạn muốn chỉ mở 1 dropdown tại một thời điểm
    this.activeDropdown = this.activeDropdown === id ? null : id;
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
    setTimeout(() => {
      this.editorConfig.readonly = !this.editorConfig.readonly;
      this.editorConfig = { ...this.editorConfig };
    });
  }

  saveDraftPost(): void {
    // Logic to save the draft post
    console.log('Draft post saved:', this.post.title);
  }
  createPost(): void {
    this.post.content = this.htmlToMd.convert(this.editorContent);
    this.post.isPublic = this.post.postType != 'Private';
    if (!this.post.fileDocument) {
      this.post.fileDocument = {
        category: [],
        description: '',
        tags: [],
        orgId: '',
        isLectureVideo: false,
        isTextBook: false,
      };
    }
    if (this.selectedFile) {
      this.post.fileDocument.file = this.selectedFile;
    }
    this.store.dispatch(
      setLoading({ isLoading: true, content: 'Đang tạo, xin chờ...' })
    );
    // Logic to create the post
    console.log('Post created:', this.post);
    this.postService.addPost(this.post).subscribe({
      next: (res) => {
        sendNotification(
          this.store,
          'Đã thêm chi tiết bài code',
          res.message,
          'success'
        );
        setTimeout(() => {
          this.router.navigate(['/post-management/post-list']);
          this.store.dispatch(clearLoading());
        }, 300);
      },
      error: (err) => {
        console.log(err);
        this.store.dispatch(clearLoading());
      },
    });
  }
  cancelPost(): void {
    // Logic to cancel the post creation
    console.log('Post creation cancelled');
  }

  //nhap
  mapCreateExerciseToCardDataUI(data: PostADD): Post {
    return mapPostInfortoPost(data);
  }
}
