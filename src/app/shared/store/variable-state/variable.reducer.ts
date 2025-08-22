import { createReducer, on } from '@ngrx/store';
import { setVariable, resetVariable } from './variable.actions';

// State tổng quát
export interface VariableState {
  [key: string]: any;
}

export const initialState: VariableState = {};

// Reducer
export const variableReducer = createReducer(
  initialState,
  on(setVariable, (state, { key, value }) => ({
    ...state,
    [key]: value,
  })),
  on(resetVariable, (state, { key }) => {
    const { [key]: removed, ...rest } = state;
    return rest;
  })
);
