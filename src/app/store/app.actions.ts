import { createAction, props } from '@ngrx/store';
import { Item } from '../services/items.model';

export const loadItems = {
  action: createAction('[App] Load Items'),
  success: createAction('[App] Load Items Success', props<{ items: Item[] }>()),
  failed: createAction('[App] Load Items Failed', props<{ error: string }>()),
};
