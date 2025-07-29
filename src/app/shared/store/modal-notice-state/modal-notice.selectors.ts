import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ModalNoticeState } from './modal-notice.reducer';

export const selectModalNoticeState =
  createFeatureSelector<ModalNoticeState>('modalNotice');

export const selectModalNoticeIsOpen = createSelector(
  selectModalNoticeState,
  (state) => state.isOpen
);

export const selectModalNoticePayload = createSelector(
  selectModalNoticeState,
  (state) => state.payload
);
