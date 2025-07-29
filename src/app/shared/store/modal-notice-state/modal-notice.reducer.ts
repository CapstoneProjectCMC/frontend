import { createReducer, on } from '@ngrx/store';
import {
  openNoticeModal,
  closeNoticeModal,
  NoticeModalPayload,
} from './modal-notice.actions';

export interface ModalNoticeState {
  isOpen: boolean;
  payload: NoticeModalPayload | null;
}

const initialState: ModalNoticeState = {
  isOpen: false,
  payload: null,
};

export const modalNoticeReducer = createReducer(
  initialState,
  on(openNoticeModal, (state, { payload }) => ({
    isOpen: true,
    payload,
  })),
  on(closeNoticeModal, (state) => ({
    isOpen: false,
    payload: null,
  }))
);
