import { Location, CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DropdownButtonComponent } from '../../../../shared/components/fxdonad-shared/dropdown/dropdown.component';
import { InputComponent } from '../../../../shared/components/fxdonad-shared/input/input';
import { ButtonComponent } from '../../../../shared/components/my-shared/button/button.component';
import {
  TextEditor,
  TextEditorConfig,
} from '../../../../shared/components/fxdonad-shared/text-editor/text-editor';

import { HtmlToMdService } from '../../../../shared/utils/HTMLtoMarkDown';
import {
  CreatePostRequest,
  Post,
  PostADD,
} from '../../../../core/models/post.models';
import { mapPostInfortoPost } from '../../../../shared/utils/mapData';
import { PostService } from '../../../../core/services/api-service/post.service';
import { sendNotification } from '../../../../shared/utils/notification';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import {
  clearLoading,
  setLoading,
} from '../../../../shared/store/loading-state/loading.action';

export interface Draft {
  id: string; // ID duy nhất cho mỗi bản nháp
  title: string;
  timestamp: number; // Ngày giờ lưu (dạng timestamp)
  data: any; // Dữ liệu của post và editor
}

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
    CommonModule
],
})
export class PostCreatePageComponent {
  @ViewChild('linkInput') linkInput!: ElementRef<HTMLInputElement>;

  drafts: Draft[] = [];
  selectedDraftId: string | null = null;

  post: PostADD = {
    title: '',
    content: '',
    isPublic: true, // sẽ tính từ postType ở component
    allowComment: true,
    postType: 'Global',
    fileUrls: '', // CHUẨN THEO BE (lưu ý đánh vần!)
    hashtag: '', // nếu muốn gửi dạng mảng
    fileDocument: null,
  };

  tag: { value: string; label: string }[] = [
    { value: 'tag1', label: 'Tag 1' },
    { value: 'tag2', label: 'Tag 2' },
    { value: 'tag3', label: 'Tag 3' },
  ];

  wherepost: { value: string; label: string }[] = [
    { value: '0', label: 'Where 1' },
    { value: '1', label: 'Where 2' },
    { value: '2', label: 'Where 3' },
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
    private location: Location,
    private postService: PostService,
    private store: Store,
    private router: Router
  ) {}

  // ===== File (1 ảnh) =====
  selectedFile: File | null = null;
  filePreview: string | null = null;
  isImageFile: boolean = false;
  isVideoFile: boolean = false;

  ngOnInit(): void {
    this.loadAllDrafts();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Reset tất cả các cờ
      this.selectedFile = null;
      this.filePreview = null;
      this.isImageFile = false;
      this.isVideoFile = false;

      if (file.type.startsWith('image/')) {
        this.selectedFile = file;
        this.isImageFile = true;
      } else if (file.type.startsWith('video/')) {
        this.selectedFile = file;
        this.isVideoFile = true;
      } else {
        // Nếu không phải ảnh hoặc video, không làm gì cả
        return;
      }

      // Đọc file để tạo URL xem trước
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.filePreview = e.target.result as string;
          // Kích hoạt phát hiện thay đổi để cập nhật UI
          this.cdr.detectChanges();
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removeFile() {
    // Đổi tên từ removeImage thành removeFile
    this.selectedFile = null;
    this.filePreview = null;
    this.isImageFile = false;
    this.isVideoFile = false;
    this.post.fileDocument = null; // Xóa luôn mô tả khi remove file
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
      image: false,
    },
  };

  onContentChange(content: string) {
    this.editorContent = content;
  }
  onEditorFocus() {}
  onEditorBlur() {}
  clearContent() {
    this.editorContent = '';
  }

  // ===== Submit =====
  saveDraftPost(): void {
    // Tạo một bản nháp mới
    const newDraft: Draft = {
      id: Date.now().toString(), // Tạo ID duy nhất từ timestamp
      title: this.post.title || `Bản nháp lúc ${new Date().toLocaleString()}`,
      timestamp: Date.now(),
      data: {
        postState: this.post,
        editorHTML: this.editorContent,
      },
    };

    // Thêm bản nháp mới vào danh sách
    this.drafts.unshift(newDraft); // Thêm vào đầu mảng để bản nháp mới nhất ở trên
    this.saveDraftsToLocalStorage();

    sendNotification(
      this.store,
      'Đã lưu nháp',
      'Bản nháp của bạn đã được lưu',
      'success'
    );
  }

  loadAllDrafts(): void {
    const draftsJson = localStorage.getItem('postDrafts');
    if (draftsJson) {
      try {
        this.drafts = JSON.parse(draftsJson);
        // Sắp xếp theo ngày giờ mới nhất
        this.drafts.sort((a, b) => b.timestamp - a.timestamp);
      } catch (e) {
        console.error('Lỗi khi tải bản nháp:', e);
        this.drafts = [];
        localStorage.removeItem('postDrafts');
      }
    }
  }

  // Hàm helper để cập nhật UI của dropdowns
  updateSelectedOptionsFromDraft(): void {
    if (this.post.hashtag) {
      const selectedTopic = this.topics.find(
        (t) => t.value === this.post.hashtag
      );
      if (selectedTopic) this.selectedOptions['hashtag'] = selectedTopic;
    }
    if (this.post.orgId) {
      const selectedWhere = this.wherepost.find(
        (w) => w.value === this.post.orgId
      );
      if (selectedWhere) this.selectedOptions['wherepost'] = selectedWhere;
    }
    // Lưu ý: Phần tag multi-select phức tạp hơn, nếu cần sẽ xử lý riêng
  }

  private saveDraftsToLocalStorage(): void {
    localStorage.setItem('postDrafts', JSON.stringify(this.drafts));
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
    const payload: CreatePostRequest = {
      title: this.post.title,
      content: this.post.content,
      isPublic: this.post.isPublic,
      allowComment: this.post.allowComment ?? false,
      postType: this.post.postType ?? 'Global',
      hashtag: this.post.hashtag,
      fileDocument: {
        file: this.post.fileDocument?.file,
        description: this.post.fileDocument?.description,
        isLectureVideo: this.isVideoFile, // Sử dụng cờ isVideoFile
        isTextBook: this.isImageFile, // Sử dụng cờ isImageFile
      },
    };

    this.postService.createPost(payload).subscribe({
      next: (res) => {
        sendNotification(this.store, 'Tạo bài viết', 'Thành công', 'success');
        localStorage.removeItem('postDraft');
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

  restoreDraft(draft: Draft): void {
    this.selectedDraftId = draft.id;
    const draftData = draft.data;
    this.post = { ...draftData.postState };
    this.editorContent = draftData.editorHTML;
    this.updateSelectedOptionsFromDraft(); // Hàm này vẫn giữ nguyên

    // Khôi phục file preview nếu có
    if (this.post.fileDocument?.file) {
      // Lưu ý: file trong localStorage chỉ là chuỗi, không phải object File.
      // Bạn cần xử lý trường hợp này, ví dụ: lưu base64 hoặc chỉ lưu URL
    }

    sendNotification(
      this.store,
      'Khôi phục bản nháp',
      `Đã khôi phục bản nháp: "${draft.title}"`,
      'info'
    );
  }

  deleteDraft(draftId: string): void {
    this.drafts = this.drafts.filter((d) => d.id !== draftId);
    this.saveDraftsToLocalStorage();
    if (this.selectedDraftId === draftId) {
      this.selectedDraftId = null;
      this.clearCurrentPost(); // Tùy chọn: xóa hết dữ liệu hiện tại khi xóa bản nháp đang chọn
    }
    sendNotification(
      this.store,
      'Xóa bản nháp',
      'Bản nháp đã được xóa',
      'warning'
    );
  }

  clearCurrentPost(): void {
    this.post = {
      title: '',
      content: '',
      isPublic: true,
      allowComment: true,
      postType: 'Global',
      fileUrls: '',
      hashtag: '',
      fileDocument: null,
    };
    this.editorContent = '';
    this.selectedFile = null;
    this.filePreview = null;
    this.isImageFile = false;
    this.isVideoFile = false;
    this.selectedOptions = {};
  }

  cancelPost(): void {
    this.location.back();
  }

  mapCreateExerciseToCardDataUI(data: PostADD): Post {
    return mapPostInfortoPost(data);
  }
}
