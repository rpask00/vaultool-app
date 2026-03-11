import { createReducer, on } from '@ngrx/store';
import { addItem, deleteItem, loadItems, updateItem } from './app.actions';
import { initialState } from './app.state';

export const appReducer = createReducer(
  initialState,
  on(loadItems.action, (state) => ({ ...state, loading: true })),
  on(loadItems.success, (state, { items }) => ({ ...state, items, loading: false })),
  on(loadItems.failed, (state) => ({ ...state, loading: false })),

  on(addItem.action, (state) => ({ ...state, loading: true })),
  on(addItem.success, (state, { item }) => ({
    ...state,
    items: [...state.items, { ...item, files: [] }],
    loading: false,
  })),
  on(addItem.failed, (state) => ({ ...state, loading: false })),

  on(updateItem.action, (state) => ({ ...state, loading: true })),
  on(updateItem.success, (state, { item }) => ({
    ...state,
    items: state.items.map((i) => (i.id === item.id ? { ...item, files: [] } : i)),
    loading: false,
  })),
  on(updateItem.failed, (state) => ({ ...state, loading: false })),

  on(deleteItem.action, (state) => ({ ...state, loading: true })),
  on(deleteItem.success, (state, { id }) => ({
    ...state,
    items: state.items.filter((item) => item.id !== id),
    loading: false,
  })),
  on(deleteItem.failed, (state) => ({ ...state, loading: false })),
);
