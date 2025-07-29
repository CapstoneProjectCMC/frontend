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

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.html',
  styleUrls: ['./post-create.scss'],
  imports: [
    InputComponent,
    TextEditor,
    DropdownButtonComponent,
    ButtonComponent,
  ],
})
export class PostCreatePageComponent {
  tag: { value: string; label: string }[] = [];
  wherepost: { value: string; label: string }[] = [];
  topics: { value: string; label: string }[] = [];
  //   wherepostOptions: { [key: string]: any } = {};
  //   topicsOptions: { [key: string]: any } = {};
  //   tagOptions: { [key: string]: any } = {};
  selectedOptions: { [key: string]: any } = {};
  activeDropdown: string | null = null;
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
  postTitle: string = '';
  postTitleError: string | null = null;
  handleInputChange(value: string | number): void {
    this.postTitle = value.toString();

    // // Validate input
    // if (!this.postTitle) {
    //   this.postTitleError = 'Không được để trống';
    // } else if (this.postTitle.length < 3) {
    //   this.postTitleError = 'Tối thiểu 3 ký tự';
    // } else {
    //   this.postTitleError = null;
    // }

    // Emit changes if needed
    console.log('Input changed:', this.postTitle);
  }
  handleSelect(dropdownKey: string, selected: any): void {
    // Reset toàn bộ các lựa chọn trước đó
    this.selectedOptions = {};

    // Lưu lại option vừa chọn
    this.selectedOptions[dropdownKey] = selected;

    // this.router.navigate(['/', dropdownKey, selected.label]);

    console.log(this.selectedOptions);
  }

  toggleDropdown(id: string): void {
    // Nếu bạn muốn chỉ mở 1 dropdown tại một thời điểm
    this.activeDropdown = this.activeDropdown === id ? null : id;
  }
  saveDraftPost(): void {
    // Logic to save the draft post
    console.log('Draft post saved:', this.postTitle);
  }
  createPost(): void {
    // Logic to create the post
    console.log('Post created:', this.htmlToMd.convert(this.editorContent));
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
