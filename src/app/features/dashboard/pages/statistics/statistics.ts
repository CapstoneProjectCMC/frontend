import { Component } from '@angular/core';
import { NotificationTestComponent } from '../../../../shared/components/fxdonad-shared/notification-test/notification-test';
import { Tooltip } from '../../../../shared/components/fxdonad-shared/tooltip/tooltip';
import { CodeEditorComponent } from '../../../../shared/components/fxdonad-shared/code-editor/code-editor.component';
import { Button } from '../../../../shared/components/fxdonad-shared/button/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics',
  imports: [
    CommonModule,
    NotificationTestComponent,
    CodeEditorComponent,
    Button,
  ],
  templateUrl: './statistics.html',
  styleUrl: './statistics.scss',
})
export class Statistics {
  sendIcon = {
    // SVG Element or Component class
    template: 'dád',
  };

  onSubmitCode() {
    console.log('Gửi bài');
  }
}
