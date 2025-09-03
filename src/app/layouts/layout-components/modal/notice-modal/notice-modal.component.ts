import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectModalNoticeIsOpen,
  selectModalNoticePayload,
} from '../../../../shared/store/modal-notice-state/modal-notice.selectors';
import { closeNoticeModal } from '../../../../shared/store/modal-notice-state/modal-notice.actions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notice-modal',
  imports: [CommonModule],
  templateUrl: './notice-modal.component.html',
  styleUrls: ['./notice-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoticeModalComponent {
  isOpen$: Observable<boolean>;
  payload$;

  constructor(private store: Store) {
    this.isOpen$ = this.store.select(selectModalNoticeIsOpen);
    this.payload$ = this.store.select(selectModalNoticePayload);
  }

  onConfirm(payload: any) {
    if (payload?.onConfirm) payload.onConfirm();
    this.store.dispatch(closeNoticeModal());
  }

  onCancel(payload: any) {
    if (payload?.onCancel) payload.onCancel();
    this.store.dispatch(closeNoticeModal());
  }

  onClose() {
    this.store.dispatch(closeNoticeModal());
  }

  getFormattedMessage(message: string): string {
    return message.replace(/\n/g, '<br>');
  }
}
