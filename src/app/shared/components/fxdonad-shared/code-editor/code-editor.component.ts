import { Component, OnInit, OnDestroy } from '@angular/core';
import { EditorView, basicSetup } from 'codemirror';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { oneDark } from '@codemirror/theme-one-dark';

import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../../styles/theme-service/theme.service';
import { Subscription } from 'rxjs';
import { placeholder } from '@codemirror/view';

@Component({
  selector: 'app-code-editor',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss'],
})
export class CodeEditorComponent implements OnInit, OnDestroy {
  private editor: EditorView | null = null;
  selectedLanguage: string = 'python';
  selectedTheme: string = 'oneDark';
  private themeSubscription: Subscription;

  languages = [
    { id: 'python', name: 'Python', extension: python },
    { id: 'cpp', name: 'C++', extension: cpp },
    { id: 'java', name: 'Java', extension: java },
    // { id: 'javascript', name: 'JavaScript', extension: javascript },
  ];

  constructor(private themeService: ThemeService) {
    this.selectedTheme =
      this.themeService.getCurrentTheme() === 'light' ? 'light' : 'oneDark';
    this.themeSubscription = this.themeService.themeChanged$.subscribe(
      (theme) => {
        this.selectedTheme = theme === 'light' ? 'light' : 'oneDark';
        if (this.editor) {
          this.editor.destroy();
          this.initializeEditor();
        }
      }
    );
  }

  ngOnInit() {
    this.initializeEditor();
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  initializeEditor() {
    const editorElement = document.getElementById('editor');
    if (!editorElement) return;

    // Xóa nội dung cũ trước khi tạo lại editor
    editorElement.innerHTML = '';

    const language = this.languages.find(
      (lang) => lang.id === this.selectedLanguage
    )?.extension;

    const extensions = [
      basicSetup,
      language ? language() : python(),
      EditorView.lineWrapping,
      placeholder('// Bắt đầu code tại đây...'),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const code = update.state.doc.toString();
          // console.log('Code changed:', code);
          // console.log('Code type:', typeof code);
        }
      }),
    ];

    // Thêm theme dựa trên lựa chọn
    if (this.selectedTheme === 'oneDark') {
      extensions.push(oneDark);
    } else if (this.selectedTheme === 'light') {
      extensions.push(
        EditorView.theme(
          {
            '&': {
              backgroundColor: '#ffffff',
              color: '#000000',
            },
            '.cm-content': {
              caretColor: '#000000',
            },
            '.cm-gutters': {
              backgroundColor: '#f0f0f0',
              color: '#888888',
              borderRight: '1px solid #ddd',
            },
          },
          { dark: false }
        )
      );
    }

    this.editor = new EditorView({
      doc: '',
      extensions,
      parent: editorElement,
    });
  }

  onLanguageChange() {
    if (this.editor) {
      this.editor.destroy();
      this.initializeEditor();
    }
  }

  onThemeChange() {
    if (this.editor) {
      this.editor.destroy();
      this.initializeEditor();
    }
  }

  getCode(): string {
    return this.editor?.state.doc.toString() || '';
  }

  getLanguage(): string {
    return this.selectedLanguage;
  }
}
