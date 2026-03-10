import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ItemsResource } from '../services/items-resource.service';
import { loadItems } from './app.actions';

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

  constructor(private itemsResource: ItemsResource) {}
}
