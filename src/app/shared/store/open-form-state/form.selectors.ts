import { createSelector, createFeatureSelector } from '@ngrx/store';
import { FormState } from './form.reducer';

export const selectFormState = createFeatureSelector<FormState>('form');

export const selectOpenedForms = createSelector(
  selectFormState,
  (state) => state.openedForms
);
