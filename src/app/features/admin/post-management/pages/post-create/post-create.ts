import { NgFor, NgIf } from '@angular/common';

import { Component } from '@angular/core';
import { DropdownButtonComponent } from '../../../../../shared/components/fxdonad-shared/dropdown/dropdown.component';
import { InputComponent } from '../../../../../shared/components/fxdonad-shared/input/input';
import { ButtonComponent } from '../../../../../shared/components/my-shared/button/button.component';
import {
  TextEditor,
  TextEditorConfig,
} from '../../../../../shared/components/fxdonad-shared/text-editor/text-editor';
import { HtmlToMdService } from '../../../../../shared/utils/HTMLtoMarkDown';
import { FormsModule, NgModel } from '@angular/forms';

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
  ],
})
export class PostCreatePageComponent {
  post = {
    title: '',
    orgId: '',
    content: '',
    isPublic: false,
    allowComment: false,
    postType: '',
    oldImagesUrls: [] as string[],
    hashtag: [] as string[],
    status: 'PENDING',
    fileDocument: {
      file: File,
      category: [] as string[],
      description: '',
      tags: [] as string[],
      isLectureVideo: false,
      isTextBook: false,
      orgId: '',
    },
  };
  tag: { value: string; label: string }[] = [];
  wherepost: { value: string; label: string }[] = [];
  topics: { value: string; label: string }[] = [];

  selectedOptions: { [key: string]: any } = {};
  activeDropdown: string | null = null;
  selectedFiles: File[] = [];
  filePreviews: string[] = [];
  isImageFile: boolean = false;
  constructor(private htmlToMd: HtmlToMdService) {
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
  }
  //xli file
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles = Array.from(input.files).filter((file) =>
        file.type.startsWith('image/')
      );

      this.filePreviews = [];
      this.selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            this.filePreviews.push(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }
  removeImage(index: number) {
    this.selectedFiles.splice(index, 1);
    this.filePreviews.splice(index, 1);
  }
  //xli link
  newLink: string = '';
  isAddingLink: boolean = false;

  startAddLink() {
    this.isAddingLink = true;
    setTimeout(() => {
      const input = document.getElementById('linkInput');
      if (input) (input as HTMLInputElement).focus();
    });
  }

  addLink() {
    const trimmed = this.newLink.trim();
    if (trimmed) {
      this.post.oldImagesUrls.push(trimmed);
      this.newLink = '';
      this.isAddingLink = false;
    }
  }

  removeLink(index: number) {
    this.post.oldImagesUrls.splice(index, 1);
  }
  ///khác

  postTitleError: string | null = null;
  handleInputChange(value: string | number): void {
    this.post.title = value.toString();
  }
  handleSelect(dropdownKey: string, selected: any): void {
    // Reset toàn bộ các lựa chọn trước đó
    this.selectedOptions = {};

    // Lưu lại option vừa chọn
    this.selectedOptions[dropdownKey] = selected;
    // Nếu dropdownKey là 'wherepost' thì gán orgId
    if (dropdownKey === 'wherepost') {
      this.post.orgId = selected?.value || '';
    }
    if (dropdownKey === 'tag') {
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
    this.editorConfig.readonly = !this.editorConfig.readonly;
    this.editorConfig = { ...this.editorConfig };
  }
  saveDraftPost(): void {
    // Logic to save the draft post
    console.log('Draft post saved:', this.post.title);
  }
  createPost(): void {
    (this.post.content = this.htmlToMd.convert(this.editorContent)),
      (this.post.isPublic = this.post.postType != 'Private'),
      // Logic to create the post
      console.log('Post created:', this.post);
  }
  cancelPost(): void {
    // Logic to cancel the post creation
    console.log('Post creation cancelled');
  }
}
