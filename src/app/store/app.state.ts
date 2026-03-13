import { FileAttachment, Item } from '../services/items.model';

export interface AppState {
  items: Item[];
  files: FileAttachment[];
  loading: boolean;
}

export const initialState: AppState = {
  items: [],
  files: [],
  loading: false,
};
