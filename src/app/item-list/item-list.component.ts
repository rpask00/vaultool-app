import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { deleteItem, loadItems } from '../store/app.actions';
import { AsyncPipe } from '@angular/common';
import { selectItems, selectTotalItems } from '../store/app.selectors';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatChip, MatChipGrid } from '@angular/material/chips';
import { AppService } from '../services/app.service';
import { Item } from '../services/items.model';
import { environment } from '../app.config';
import { MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, debounceTime, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-item-list',
  imports: [
    AsyncPipe,
    MatIcon,
    MatMiniFabButton,
    MatChipGrid,
    MatChip,
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    MatPaginator,
    MatSuffix,
    MatIconButton,
  ],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css',
})
export class ItemListComponent implements OnInit {
  private store: Store<any> = inject(Store<any>);
  readonly destroyRef = inject(DestroyRef);

  readonly totalItems$ = this.store.select(selectTotalItems);

  readonly searchControl = new FormControl<string>('', { nonNullable: true });
  readonly pageControl = new FormControl(1, { nonNullable: true });

  readonly items$ = this.store.select(selectItems);
  protected apiUrl: string = environment.apiUrl;

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    combineLatest([
      this.searchControl.valueChanges.pipe(startWith('twoja stara')),
      this.pageControl.valueChanges.pipe(startWith(1)),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(50))
      .subscribe(([search, page]) => this.store.dispatch(loadItems.action({ search, page })));
  }

  protected edit(item: Item) {
    this.appService.editItem$.next(item);
  }

  protected delete(id: number) {
    this.store.dispatch(deleteItem.action({ id }));
  }
}
