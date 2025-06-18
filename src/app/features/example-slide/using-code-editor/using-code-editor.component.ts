import { Component } from '@angular/core';
import { CodeEditorComponent } from '../../../shared/components/fxdonad-shared/code-editor/code-editor.component';

@Component({
  selector: 'app-using-code-editor',
  imports: [CodeEditorComponent],
  templateUrl: './using-code-editor.component.html',
  styleUrl: './using-code-editor.component.scss',
})
export class UsingCodeEditorComponent {}
