import { createAction, props } from '@ngrx/store';
import {
  FileAttachment,
  FileAttachmentDto,
  Item,
  ItemDto,
  ListResponse,
} from '../services/items.model';

export const loadItems = {
  action: createAction('[App] Load Items', props<{ search: string; page: number }>()),
  success: createAction('[App] Load Items Success', props<{ response: ListResponse<Item> }>()),
  failed: createAction('[App] Load Items Failed', props<{ error: string }>()),
};

export const loadFiles = {
  action: createAction('[App] Load files'),
  success: createAction('[App] Load files Success', props<{ files: FileAttachment[] }>()),
  failed: createAction('[App] Load files Failed', props<{ error: string }>()),
};
export const addItem = {
  action: createAction('[App] Add Item', props<{ item: ItemDto; files: FileAttachment[] }>()),
  success: createAction('[App] Add Item Success', props<{ item: Item }>()),
  failed: createAction('[App] Add Item Failed', props<{ error: string }>()),
};

export const deleteItem = {
  action: createAction('[App] Delete Item', props<{ id: number }>()),
  success: createAction('[App] Delete Item Success', props<{ id: number }>()),
  failed: createAction('[App] Delete Item Failed', props<{ error: string }>()),
};

export const updateItem = {
  action: createAction('[App] Update Item', props<{ item: ItemDto; id: number }>()),
  success: createAction('[App] Update Item Success', props<{ item: Item }>()),
  failed: createAction('[App] Update Item Failed', props<{ error: string }>()),
};

export const uploadFiles = {
  action: createAction('[App] Create Files', props<{ file: FileAttachmentDto; files: File[] }>()),
  success: createAction('[App] Create Files Success', props<{ files: FileAttachment[] }>()),
  failed: createAction('[App] Create Files Failed', props<{ error: string }>()),
};
export const updateFile = {
  action: createAction('[App] Update File', props<{ file: FileAttachment }>()),
  success: createAction('[App] Update File Success', props<{ file: FileAttachment }>()),
  failed: createAction('[App] Update File Failed', props<{ error: string }>()),
};

export const deleteFile = {
  action: createAction('[App] Delete File', props<{ id: number }>()),
  success: createAction('[App] Delete File Success', props<{ id: number }>()),
  failed: createAction('[App] Delete File Failed', props<{ error: string }>()),
};
