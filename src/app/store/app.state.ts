import { FileAttachment, Item } from '../services/items.model';

export interface AppState {
  total_items: number;
  items: Item[];
  files: FileAttachment[];
  loading: boolean;
}

export const initialState: AppState = {
  total_items: 0,
  items: [],
  files: [],
  loading: false,
};
