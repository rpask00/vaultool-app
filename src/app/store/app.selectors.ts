import { AppState } from './app.state';
import { createSelector } from '@ngrx/store';
import { Item } from '../services/items.model';

const appSelector = (state: { app: AppState }) => state.app;

export const selectItems = createSelector(
  appSelector,
  (state) =>
    state.items.map((item) => ({
      ...item,
      files: state.files.filter((file) => file.item_id === item.id),
    })) as Item[],
);

export const selectTotalItems = createSelector(appSelector, (state) => state.total_items);
