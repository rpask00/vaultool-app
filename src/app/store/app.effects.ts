import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ItemsResource } from '../services/items-resource.service';
import { addItem, deleteItem, loadItems, updateItem } from './app.actions';

@Injectable()
export class AppEffects {
  private actions$ = inject(Actions);

  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadItems.action),
      switchMap(() =>
        this.itemsResource.getAll().pipe(
          map((items) => loadItems.success({ items: items.items })),
          catchError((err) => of(loadItems.failed({ error: err.message }))),
        ),
      ),
    ),
  );

  addItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addItem.action),
      switchMap(({ item }) =>
        this.itemsResource.create(item).pipe(
          map((item) => addItem.success({ item })),
          catchError((err) => of(addItem.failed({ error: err.message }))),
        ),
      ),
    ),
  );

  updateItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateItem.action),
      switchMap(({ item, id }) =>
        this.itemsResource.update(id, item).pipe(
          map((item) => updateItem.success({ item })),
          catchError((err) => of(updateItem.failed({ error: err.message }))),
        ),
      ),
    ),
  );

  deleteItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteItem.action),
      switchMap(({ id }) =>
        this.itemsResource.delete(id).pipe(
          map(() => deleteItem.success({ id })),
          catchError((err) => of(deleteItem.failed({ error: err.message }))),
        ),
      ),
    ),
  );

  constructor(private itemsResource: ItemsResource) {}
}
