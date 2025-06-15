import { Component } from '@angular/core';
import { NotificationTestComponent } from '../../../../shared/components/fxdonad-shared/notification-test/notification-test';
import { Tooltip } from '../../../../shared/components/fxdonad-shared/tooltip/tooltip';
import { CodeEditorComponent } from '../../../../shared/components/fxdonad-shared/code-editor/code-editor.component';

@Component({
  selector: 'app-statistics',
  imports: [NotificationTestComponent, CodeEditorComponent],
  templateUrl: './statistics.html',
  styleUrl: './statistics.scss',
})
export class Statistics {}
