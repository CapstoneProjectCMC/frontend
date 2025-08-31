import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import TurndownService from 'turndown';
import { marked } from 'marked';

export interface TextEditorConfig {
  placeholder?: string;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  readonly?: boolean;
  toolbar?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    alignLeft?: boolean;
    alignCenter?: boolean;
    alignRight?: boolean;
    alignJustify?: boolean;
    bulletList?: boolean;
    numberedList?: boolean;
    indent?: boolean;
    outdent?: boolean;
    clearFormat?: boolean;
    image?: boolean;
  };
}

@Component({
  selector: 'app-text-editor',
  imports: [CommonModule],
  templateUrl: './text-editor.html',
  styleUrl: './text-editor.scss',
})
export class TextEditor implements AfterViewInit, OnDestroy {
  @Input() config: TextEditorConfig = {
    placeholder: 'Nhập nội dung...',
    height: '300px',
    minHeight: '200px',
    maxHeight: '600px',
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

  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
  @Output() onFocus = new EventEmitter<void>();
  @Output() onBlur = new EventEmitter<void>();
  @Output() onChange = new EventEmitter<string>();

  @ViewChild('editor') editorRef!: ElementRef<HTMLDivElement>;
  @ViewChild('imageInput') imageInputRef!: ElementRef<HTMLInputElement>;

  private editorInstance: any;
  private observer: MutationObserver | null = null;
  private turndown = new TurndownService();
  private internalChange = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.initializeEditor();
    this.setupMutationObserver();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value'] && this.editorRef?.nativeElement) {
      // Nếu thay đổi đến từ chính editor thì bỏ qua
      if (this.internalChange) {
        this.internalChange = false;
        return;
      }

      const editorEl = this.editorRef.nativeElement;
      const html = this.value ? marked.parse(this.value, { async: false }) : '';
      if (editorEl.innerHTML !== html) {
        editorEl.innerHTML = html || '';
      }
    }
  }

  private initializeEditor() {
    if (this.editorRef && this.editorRef.nativeElement) {
      const editor = this.editorRef.nativeElement;
      editor.contentEditable = (!this.config.readonly).toString();

      const html = this.value ? marked.parse(this.value, { async: false }) : '';

      editor.innerHTML = html || '';

      if (this.config.placeholder && !this.value) {
        editor.setAttribute('data-placeholder', this.config.placeholder);
      }
    }
  }

  private setupMutationObserver() {
    if (this.editorRef && this.editorRef.nativeElement) {
      this.observer = new MutationObserver(() => {
        const html = this.editorRef.nativeElement.innerHTML;
        const markdown = this.turndown.turndown(html);

        if (markdown !== this.value) {
          this.internalChange = true;
          this.value = markdown;
          this.valueChange.emit(markdown);
          this.onChange.emit(markdown);
          this.cdr.markForCheck();
        }
      });

      this.observer.observe(this.editorRef.nativeElement, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
  }

  // Toolbar actions
  execCommand(command: string, value: string = '') {
    if (this.config.readonly) return;

    // @ts-ignore - document.execCommand is deprecated but still widely supported
    document.execCommand(command, false, value);
    this.editorRef?.nativeElement?.focus();
  }

  // Text formatting
  bold() {
    this.execCommand('bold');
  }

  italic() {
    this.execCommand('italic');
  }

  underline() {
    this.execCommand('underline');
  }

  strikethrough() {
    this.execCommand('strikeThrough');
  }

  // Text alignment
  alignLeft() {
    this.execCommand('justifyLeft');
  }

  alignCenter() {
    this.execCommand('justifyCenter');
  }

  alignRight() {
    this.execCommand('justifyRight');
  }

  alignJustify() {
    this.execCommand('justifyFull');
  }

  // Lists
  insertUnorderedList() {
    this.execCommand('insertUnorderedList');
  }

  insertOrderedList() {
    this.execCommand('insertOrderedList');
  }

  // Indentation
  indent() {
    this.execCommand('indent');
  }

  outdent() {
    this.execCommand('outdent');
  }

  // Clear formatting
  clearFormat() {
    this.execCommand('removeFormat');
  }

  // Focus and blur handlers
  onEditorFocus() {
    this.onFocus.emit();
  }

  onEditorBlur() {
    this.onBlur.emit();
  }

  // Check if command is active
  isCommandActive(command: string): boolean {
    return document.queryCommandState(command);
  }

  // Get current selection
  getSelection(): string {
    const selection = window.getSelection();
    return selection ? selection.toString() : '';
  }

  // Insert text at cursor
  insertText(text: string) {
    this.execCommand('insertText', text);
  }

  // Insert HTML at cursor
  insertHTML(html: string) {
    this.execCommand('insertHTML', html);
  }

  // Thêm hàm xử lý upload/chèn ảnh
  onImageUploadClick() {
    if (this.config.readonly) return;
    this.imageInputRef?.nativeElement?.click();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imgHtml = `<img src="${e.target.result}" alt="image" style="max-width:100%;"/>`;
        this.insertHTML(imgHtml);
      };
      reader.readAsDataURL(file);
      // Reset input để chọn lại cùng 1 file nếu muốn
      input.value = '';
    }
  }
}
