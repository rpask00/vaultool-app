import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { ItemsResource } from '../services/items-resource.service';
import { addItem, deleteItem, loadItems, updateItem } from './app.actions';
import { FilesResource } from '../services/files-resource.service';

@Injectable()
export class AppEffects {
  private actions$ = inject(Actions);

  readonly itemsResource = inject(ItemsResource);
  readonly filesResource = inject(FilesResource);

  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadItems.action),
      switchMap(() =>
        this.itemsResource.getAll().pipe(
          switchMap((items) =>
            forkJoin({
              items: of(items.items),
              files: this.filesResource.getAll(items.items.map((item) => item.id)),
            }),
          ),
          map(({ items, files }) =>
            loadItems.success({
              items: items.map((item) => ({
                ...item,
                files: files.filter((f) => f.item_id === item.id),
              })),
            }),
          ),
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
}
