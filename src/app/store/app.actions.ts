import { createAction, props } from '@ngrx/store';
import { Item } from '../services/items.model';

export const loadItems = {
  action: createAction('[App] Load Items'),
  success: createAction('[App] Load Items Success', props<{ items: Item[] }>()),
  failed: createAction('[App] Load Items Failed', props<{ error: string }>()),
};
export const addItem = {
  action: createAction('[App] Add Item', props<{ item: Item }>()),
  success: createAction('[App] Add Item Success', props<{ item: Item }>()),
  failed: createAction('[App] Add Item Failed', props<{ error: string }>()),
};

export const deleteItem = {
  action: createAction('[App] Delete Item', props<{ id: number }>()),
  success: createAction('[App] Delete Item Success', props<{ id: number }>()),
  failed: createAction('[App] Delete Item Failed', props<{ error: string }>()),
};

export const updateItem = {
  action: createAction('[App] Update Item'),
  success: createAction('[App] Update Item Success', props<{ item: Item }>()),
  failed: createAction('[App] Update Item Failed', props<{ error: string }>()),
};
