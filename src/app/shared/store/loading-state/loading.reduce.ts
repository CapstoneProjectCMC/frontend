import { createReducer, on } from '@ngrx/store';
import { setLoading, clearLoading } from './loading.action';

export interface LoadingState {
  isLoading: boolean;
  content: string;
}

export const initialState: LoadingState = {
  isLoading: false,
  content: '',
};

export const loadingReducer = createReducer(
  initialState,
  on(setLoading, (state, { isLoading, content }) => ({
    ...state,
    isLoading,
    content,
  })),
  on(clearLoading, (state) => ({ ...state, isLoading: false, content: '' }))
);
