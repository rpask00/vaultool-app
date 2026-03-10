import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import { loadItems } from '../store/app.actions';
import { AsyncPipe } from '@angular/common';
import { selectItems } from '../store/app.selectors';

@Component({
  selector: 'app-item-list',
  imports: [AsyncPipe],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css',
})
export class ItemListComponent implements OnInit {
  private store: Store<AppState> = inject(Store<AppState>);

  readonly items$ = this.store.select(selectItems);

  constructor() {}

  ngOnInit(): void {
    this.store.dispatch(loadItems.action());
  }
}
