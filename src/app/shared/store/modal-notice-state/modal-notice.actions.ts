import { createAction, props } from '@ngrx/store';

export interface NoticeModalPayload {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  // Có thể mở rộng thêm các props khác nếu cần
}

export const openNoticeModal = createAction(
  '[Modal Notice] Open',
  props<{ payload: NoticeModalPayload }>()
);

export const closeNoticeModal = createAction('[Modal Notice] Close');

//cách 1 dùng:

/*
openModal() {
    this.store.dispatch(openNoticeModal({
      payload: {
        title: 'Xác nhận',
        message: 'Bạn có chắc chắn muốn xóa?',
        confirmText: 'Đồng ý',
        cancelText: 'Hủy',
        onConfirm: () => {
          // Hành động khi xác nhận
        },
        onCancel: () => {
          // Hành động khi hủy
        }
      }
    }));
  }
*/

//cách 2 dùng utils
/*
  openModal() {
    openModalNotification(
      this.store,
      'Xác nhận nộp bài',
      'Bạn có chắc chắn hoàn thành bài thi?',
      'Đồng ý',
      'Soát lại',
      () => this.submitQuiz(),
      () => this.cancelSubmit()
    );
  }
*/
