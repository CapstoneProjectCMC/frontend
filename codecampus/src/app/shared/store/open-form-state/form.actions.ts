import { createAction, props } from '@ngrx/store';

export const openForm = createAction(
  '[Form] Open',
  props<{
    formType:
      | 'login'
      | 'register'
      | 'forgot-password'
      | 'modal-warning'
      | 're-login-required-form'
      | 'reg-moderator'
      | 'modal-update-info-account'
      | 'update-password'
      | 'create-episode'
      | 'lock-account'
      | 'return-video-duration'
      | 'update-anime';
  }>()
);

export const closeForm = createAction(
  '[Form] Close',
  props<{
    formType?:
      | 'login'
      | 'register'
      | 'forgot-password'
      | 'modal-warning'
      | 're-login-required-form'
      | 'reg-moderator'
      | 'modal-update-info-account'
      | 'update-password'
      | 'create-episode'
      | 'lock-account'
      | 'return-video-duration'
      | 'update-anime';
  }>()
);

// nhớ thêm mới type form ở đây, ở cả open và close
