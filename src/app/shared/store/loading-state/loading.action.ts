import { createAction, props } from '@ngrx/store';

export const setLoading = createAction(
  '[Loading] Set Loading',
  props<{ isLoading: boolean; content: string }>()
);

export const clearLoading = createAction('[Loading] Clear Loading');

//Hướng dẫn dùng:

// Để bật loading với nội dung
//
// this.store.dispatch(setLoading({ isLoading: true, content: 'Đang xử lý...' }));

// Để tắt loading
//
// this.store.dispatch(clearLoading());
