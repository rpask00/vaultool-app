import { Component, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { ClickStopPropagationDirective } from '../../directives/click-stop-propagation.directive';
import { NgClass } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { form, FormField } from '@angular/forms/signals';
import { Item } from '../services/items.model';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import { addItem, loadItems } from '../store/app.actions';

@Component({
  selector: 'app-item-form',
  imports: [
    MatIcon,
    MatFormField,
    MatLabel,
    MatInput,
    ClickStopPropagationDirective,
    NgClass,
    MatButton,
    FormField,
  ],
  templateUrl: './item-form.component.html',
  styleUrl: './item-form.component.css',
})
export class ItemFormComponent {
  readonly store: Store<AppState> = inject(Store<AppState>);

  readonly formOpen = signal(false);
  protected readonly Array = Array;

  readonly itemModel = signal<Item>({
    quantity: 0,
    tags: [],
    name: '',
    description: '',
  });
  readonly itemForm = form(this.itemModel);

  protected addPhoto() {}

  protected add() {
    this.store.dispatch(
      addItem.action({
        item: this.itemModel(),
      }),
    );
  }
}
