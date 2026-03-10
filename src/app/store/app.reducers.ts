import { createReducer, on } from '@ngrx/store';
import { loadItems } from './app.actions';
import { initialState } from './app.state';

export const appReducer = createReducer(
  initialState,
  on(loadItems.action, (state) => ({ ...state, loading: true })),
  on(loadItems.success, (state, { items }) => ({ ...state, items, loading: false })),
  on(loadItems.failed, (state) => ({ ...state, loading: false })),
);
