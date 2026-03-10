import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { ClickStopPropagationDirective } from '../../directives/click-stop-propagation.directive';
import { NgClass } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { form, FormField } from '@angular/forms/signals';
import { Item } from '../services/items.model';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import { addItem, updateItem } from '../store/app.actions';
import { AppService } from '../services/app.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
export class ItemFormComponent implements OnInit {
  readonly store: Store<AppState> = inject(Store<AppState>);
  private destroyRef = inject(DestroyRef); // 👈 inject as field

  readonly formOpen = signal(false);
  protected readonly Array = Array;

  readonly emptyItem: Item = {
    id: null,
    quantity: 0,
    tags: [],
    name: '',
    description: '',
  };

  readonly itemModel = signal<Item>({ ...this.emptyItem });

  readonly itemForm = form(this.itemModel);

  constructor(private appService: AppService) {
    effect(() => {
      if (!this.formOpen()) this.itemModel.set({ ...this.emptyItem });
    });
  }
  ngOnInit(): void {
    this.appService.editItem$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((item) => {
      this.itemModel.set(item);
      this.formOpen.set(true);
    });
  }

  protected addPhoto() {}

  protected save() {
    if (this.itemModel().id) {
      this.store.dispatch(
        updateItem.action({
          item: this.itemModel(),
          id: this.itemModel().id as number,
        }),
      );
    } else {
      this.store.dispatch(
        addItem.action({
          item: this.itemModel(),
        }),
      );
    }

    this.formOpen.set(false);
  }
}
