import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { ClickStopPropagationDirective } from '../../directives/click-stop-propagation.directive';
import { NgClass } from '@angular/common';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { form, FormField } from '@angular/forms/signals';
import { FileAttachment, ItemDto } from '../services/items.model';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import { addItem, updateItem } from '../store/app.actions';
import { AppService } from '../services/app.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../app.config';

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
    MatMiniFabButton,
  ],
  templateUrl: './item-form.component.html',
  styleUrl: './item-form.component.css',
})
export class ItemFormComponent implements OnInit {
  readonly store: Store<AppState> = inject(Store<AppState>);
  private appService = inject(AppService);

  readonly formOpen = signal(false);
  protected readonly Array = Array;

  readonly editedItem = toSignal(this.appService.editItem$);

  readonly emptyItem: ItemDto = {
    quantity: 0,
    tags: [],
    name: '',
    description: '',
  };

  readonly filesModel = signal<FileAttachment[]>([]);

  readonly itemModel = signal<ItemDto>({ ...this.emptyItem });
  readonly itemForm = form(this.itemModel);

  constructor() {
    effect(() => {
      const item = this.editedItem();
      if (!item) return;

      this.filesModel.set(structuredClone(item.files));
      this.itemModel.set(structuredClone(item));

      this.formOpen.set(true);
    });

    effect(() => {
      if (!this.formOpen()) {
        this.itemModel.set({ ...this.emptyItem });
        this.filesModel.set([]);
        this.appService.editItem$.next(null);
      }
    });
  }
  ngOnInit(): void {}

  protected addPhoto() {}

  protected save() {
    if (this.editedItem()?.id) {
      this.store.dispatch(
        updateItem.action({
          item: this.itemModel(),
          id: this.editedItem()?.id as number,
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

  protected readonly Math = Math;
  protected apiUrl = environment.apiUrl;

  protected removeFile(file: FileAttachment) {
    this.filesModel.update((files) => files.filter((f) => f !== file));
  }
}
