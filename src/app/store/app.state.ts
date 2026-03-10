import { Item } from '../services/items.model';

export interface AppState {
  items: Item[];
  loading: boolean;
}

export const initialState: AppState = {
  items: [],
  loading: false,
};
