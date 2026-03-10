import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import { deleteItem, loadItems } from '../store/app.actions';
import { AsyncPipe } from '@angular/common';
import { selectItems } from '../store/app.selectors';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';
import { MatChip, MatChipGrid } from '@angular/material/chips';
import { AppService } from '../services/app.service';
import { Item } from '../services/items.model';

@Component({
  selector: 'app-item-list',
  imports: [AsyncPipe, MatIcon, MatMiniFabButton, MatChipGrid, MatChip],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css',
})
export class ItemListComponent implements OnInit {
  private store: Store<AppState> = inject(Store<AppState>);

  readonly items$ = this.store.select(selectItems);

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    this.store.dispatch(loadItems.action());
  }

  protected edit(item: Item) {
    this.appService.editItem$.next(item);
  }

  protected delete(id: number | null) {
    this.store.dispatch(deleteItem.action({ id: id as number }));
  }
}
