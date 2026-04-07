import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ItemsResource } from '../services/items-resource.service';
import {
  addItem,
  deleteFile,
  deleteItem,
  loadFiles,
  loadItems,
  searchItems,
  updateFile,
  updateItem,
  uploadFiles,
} from './app.actions';
import { FilesResource } from '../services/files-resource.service';

@Injectable()
export class AppEffects {
  private actions$ = inject(Actions);

  readonly itemsResource = inject(ItemsResource);
  readonly filesResource = inject(FilesResource);

  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadItems.action),
      switchMap(({ search, page }) =>
        this.itemsResource.getAll(search, page).pipe(
          map((response) => loadItems.success({ response })),
          catchError((err) => of(loadItems.failed({ error: err.message }))),
        ),
      ),
    ),
  );

  searchItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(searchItems.action),
      switchMap(({ photo }) =>
        this.itemsResource.getByPhoto(photo).pipe(
          map((results) => {
            console.log(results);
            return searchItems.success({ results });
          }),
          catchError((err) => of(searchItems.failed({ error: err.message }))),
        ),
      ),
    ),
  );

  loadFiles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadItems.success),
      switchMap(({ response }) =>
        this.filesResource.getAll(response.items.map((item) => item.id)).pipe(
          map((files) => loadFiles.success({ files })),
          catchError((err) => of(loadFiles.failed({ error: err.message }))),
        ),
      ),
    ),
  );

  createFiles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadFiles.action),
      switchMap(({ file, files }) =>
        this.filesResource.upload(file, files).pipe(
          map((files) => uploadFiles.success({ files })),
          catchError((err) => of(uploadFiles.failed({ error: err.message }))),
        ),
      ),
    ),
  );

  addItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addItem.action),
      concatMap(({ item, files }) =>
        this.itemsResource.create(item).pipe(
          concatMap((item) => [
            addItem.success({ item }),
            ...files.map((file, i) =>
              updateFile.action({ file: { ...file, priority: i + 1, item_id: item.id } }),
            ),
          ]),
          catchError((err) => of(addItem.failed({ error: err.message }))),
        ),
      ),
    ),
  );

  updateItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateItem.action),
      concatMap(({ item, id }) =>
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

  updateFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateFile.action),
      concatMap(({ file }) =>
        this.filesResource.update(file.id, file).pipe(
          map((file) => updateFile.success({ file })),
          catchError((err) => of(updateFile.failed({ error: err.message }))),
        ),
      ),
    ),
  );

  deleteFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteFile.action),
      concatMap(({ id }) =>
        this.filesResource.delete(id).pipe(
          map(() => deleteFile.success({ id })),
          catchError((err) => of(deleteFile.failed({ error: err.message }))),
        ),
      ),
    ),
  );
}
