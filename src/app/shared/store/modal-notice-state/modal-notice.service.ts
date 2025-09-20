import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, Observable } from 'rxjs';
import { openNoticeModal, closeNoticeModal } from './modal-notice.actions';

@Injectable({ providedIn: 'root' })
export class ModalNoticeService {
  private decision$ = new Subject<boolean>();

  constructor(private store: Store) {}

  confirm(
    title: string,
    message: string,
    confirmText: string,
    cancelText: string
  ): Observable<boolean> {
    this.decision$ = new Subject<boolean>();
    this.store.dispatch(
      openNoticeModal({
        payload: {
          title,
          message,
          confirmText,
          cancelText,
          onConfirm: () => {
            this.decision$.next(true);
            this.decision$.complete();
            this.store.dispatch(closeNoticeModal());
          },
          onCancel: () => {
            this.decision$.next(false);
            this.decision$.complete();
            this.store.dispatch(closeNoticeModal());
          },
        },
      })
    );

    return this.decision$.asObservable();
  }
}
