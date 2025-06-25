import { Component } from '@angular/core';
import { TextEditorConfig } from '../../../shared/components/fxdonad-shared/text-editor/text-editor';
import { DropdownButtonComponent } from '../../../shared/components/fxdonad-shared/dropdown/dropdown.component';
import { DropdownOption } from '../../../core/models/data-handle';
import { FormsModule } from '@angular/forms';
import { TextEditor } from '../../../shared/components/fxdonad-shared/text-editor/text-editor';

@Component({
  selector: 'app-create-post',
  imports: [DropdownButtonComponent, TextEditor, FormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss',
})
export class CreatePostComponent {
  editorContent: string = '';

  post = {
    title: '',
    tags: [] as string[],
    visibility: 'organization',
    content: '',
  };

  availableTags: DropdownOption[] = [
    { value: 'Angular', label: 'Angular' },
    { value: 'JavaScript', label: 'JavaScript' },
    { value: 'TypeScript', label: 'TypeScript' },
    { value: 'Web', label: 'Web' },
    { value: 'UI/UX', label: 'UI/UX' },
  ];
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
      image: true,
    },
  };

  onEditorFocus() {
    console.log('Editor focused');
  }

  onEditorBlur() {
    console.log('Editor blurred');
  }

  onContentChange(content: string) {
    this.post.content = content;
  }

  onTagsChange(selected: DropdownOption | DropdownOption[]) {
    if (Array.isArray(selected)) {
      this.post.tags = selected.map((tag) => tag.value as string);
    } else if (selected) {
      this.post.tags = [selected.value as string];
    } else {
      this.post.tags = [];
    }
  }

  onSubmit() {
    // Xử lý gửi dữ liệu post lên server tại đây
    console.log('Bài viết:', this.post);
    // Reset form nếu cần
  }
}
