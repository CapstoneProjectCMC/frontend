import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LoadingState } from './loading.reduce';

export const selectLoadingState =
  createFeatureSelector<LoadingState>('loading');

export const selectIsLoading = createSelector(
  selectLoadingState,
  (state) => state.isLoading
);

export const selectLoadingContent = createSelector(
  selectLoadingState,
  (state) => state.content
);
