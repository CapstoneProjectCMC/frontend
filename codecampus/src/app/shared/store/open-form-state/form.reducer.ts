import { createReducer, on } from '@ngrx/store';
import { openForm, closeForm } from './form.actions';

export interface FormState {
  openedForms: { [key: string]: boolean }; // Cho phép nhiều form cùng mở
}

const initialState: FormState = {
  openedForms: {}, // Không có form nào mở ban đầu
};

export const formReducer = createReducer(
  initialState,
  on(openForm, (state, { formType }) => ({
    ...state,
    openedForms: { ...state.openedForms, [formType]: true }, // Mở form cụ thể
  })),
  on(closeForm, (state, { formType }) => {
    const updatedForms = { ...state.openedForms };
    if (formType) {
      delete updatedForms[formType]; // Chỉ xóa form cụ thể
    } else {
      Object.keys(updatedForms).forEach((key) => delete updatedForms[key]); // Xóa tất cả form nếu không có formType
    }
    return { ...state, openedForms: updatedForms };
  })
);

//trước khi dùng giá trị form mới nhớ thêm type form mới tại form.action.ts

/* 
- cách lấy giá trị vào component:

  export class AppComponent {
    openedForms$: Observable<{ [key: string]: boolean }>;

    constructor(private store: Store) {
      this.openedForms$ = this.store.select(selectOpenedForms);
    }
  }


- thay đổi hoặc thêm giá trị tại component:
 => mở:
 this.store.dispatch(openForm({ formType: 'login' }));
 this.store.dispatch(openForm({ formType: 'register' }));
 => đóng:
 this.store.dispatch(closeForm({ formType: 'login' }));
 this.store.dispatch(closeForm({ formType: null })); // Hoặc không truyền formType



- minh hoạ giá trị:
  {
    openedForms: {
      login: true,
      register: true
    }
  }

- kiểm tra trạng thái:
  <app *ngIf="(openedForms$ | async)?.['login']"/>
  <app *ngIf="(openedForms$ | async)?.['register']"/>

*/
