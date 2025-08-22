import { createAction, props } from '@ngrx/store';

// Set 1 biến bất kỳ
export const setVariable = createAction(
  '[App] Set Variable',
  props<{ key: string; value: any }>()
);

// Reset 1 biến
export const resetVariable = createAction(
  '[App] Reset Variable',
  props<{ key: string }>()
);

/* Cách dùng:

// Set biến
    this.store.dispatch(setVariable({ key: 'state1', value: true }));
    this.store.dispatch(setVariable({ key: 'state2', value: 'To Duc' }));

// Get biến
- Lấy 1 biến:
    state$: Observable<any>; // any hoặc type chính xác của biến
    constructor(private store: Store) { 
        this.state$ = this.store.select(selectVariable('state1')); //thay state = tên biến đã set
    }
-lấy toàn bộ:
    state$: Observable<{ [key: string]: any }>;
    constructor(private store: Store) {
        this.state$ = this.store.select(selectAppState);
    }

// Reset biến (xóa khỏi store)
    this.store.dispatch(resetVariable({ key: 'state1' }));

*/
