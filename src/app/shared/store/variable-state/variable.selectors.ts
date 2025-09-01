import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VariableState } from './variable.reducer';

// Feature selector cho nhánh 'app'
export const selectAppState = createFeatureSelector<VariableState>('variable');

// Selector generic: lấy giá trị theo key
export const selectVariable = (key: string) =>
  createSelector(selectAppState, (state: VariableState) => state[key]);

// export const selectVariable = (key: string) =>
//   createSelector(selectAppState, (state: VariableState) =>
//     state[key] !== undefined ? state[key] : false
//   );
