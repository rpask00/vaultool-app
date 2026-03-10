import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import { loadItems } from '../store/app.actions';

@Component({
  selector: 'app-item-list',
  imports: [],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css',
})
export class ItemListComponent implements OnInit {
  constructor(private store: Store<AppState>) {}
  ngOnInit(): void {
    this.store.dispatch(loadItems.action());
  }
}
