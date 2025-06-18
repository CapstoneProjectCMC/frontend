import { Component } from '@angular/core';
import {
  TextEditor,
  TextEditorConfig,
} from '../../../shared/components/fxdonad-shared/text-editor/text-editor';

@Component({
  selector: 'app-using-text-editor',
  imports: [TextEditor],
  templateUrl: './using-text-editor.component.html',
  styleUrl: './using-text-editor.component.scss',
})
export class UsingTextEditorComponent {
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

  setSampleContent() {
    this.editorContent = `
      <h1>Welcome to Text Editor</h1>
      <p>This is a <strong>rich text editor</strong> with various formatting options.</p>
      <p>You can create <em>italic text</em>, <u>underlined text</u>, and even <s>strikethrough text</s>.</p>
      
      <h2>Features</h2>
      <ul>
        <li>Text formatting (bold, italic, underline, strikethrough)</li>
        <li>Text alignment (left, center, right, justify)</li>
        <li>Lists (bulleted and numbered)</li>
        <li>Indentation controls</li>
        <li>Clear formatting</li>
      </ul>
      
      <h2>Code Example</h2>
      <pre><code>function hello() {
  console.log("Hello, World!");
}</code></pre>
      
      <blockquote>
        This is a blockquote example. It can be used to highlight important information.
      </blockquote>
      
      <h3>Table Example</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John</td>
            <td>25</td>
            <td>New York</td>
          </tr>
          <tr>
            <td>Jane</td>
            <td>30</td>
            <td>London</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  clearContent() {
    this.editorContent = '';
  }

  toggleReadonly() {
    this.editorConfig.readonly = !this.editorConfig.readonly;
    this.editorConfig = { ...this.editorConfig };
  }

  onSubmitCode() {
    console.log('Gửi bài');
  }
}
