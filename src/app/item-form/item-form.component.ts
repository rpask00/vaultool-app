import { Component, DestroyRef, effect, HostListener, inject, OnInit, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { ClickStopPropagationDirective } from '../../directives/click-stop-propagation.directive';
import { NgClass } from '@angular/common';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { form, FormField } from '@angular/forms/signals';
import { FileAttachment, FileCategory, ItemDto } from '../services/items.model';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import { addItem, deleteFile, updateFile, updateItem, uploadFiles } from '../store/app.actions';
import { AppService } from '../services/app.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../app.config';
import { Actions, ofType } from '@ngrx/effects';
import { take } from 'rxjs';
import { DragDropDirective } from './drag-drop.directive';

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
    DragDropDirective,
  ],
  templateUrl: './item-form.component.html',
  styleUrl: './item-form.component.css',
})
export class ItemFormComponent implements OnInit {
  readonly store: Store<AppState> = inject(Store<AppState>);
  readonly actions$ = inject(Actions);
  readonly destroyRef = inject(DestroyRef);

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
        this.resetForm();
      }
    });
  }
  ngOnInit(): void {}

  protected uploadAttachments($event: Event | DragEvent) {
    const fileList =
      ($event.target as HTMLInputElement).files || ($event as DragEvent)?.dataTransfer?.files;

    if (!fileList) return;

    this.store.dispatch(
      uploadFiles.action({
        file: {
          priority: this.filesModel().length + 1,
          category: FileCategory.PHOTO,
        },
        files: Array.from(fileList),
      }),
    );

    this.actions$
      .pipe(takeUntilDestroyed(this.destroyRef), ofType(uploadFiles.success), take(1))
      .subscribe(({ files }) => this.filesModel.update((_files) => [..._files, ...files]));
  }

  protected save() {
    const item_id = this.editedItem()?.id;
    if (item_id) {
      this.store.dispatch(
        updateItem.action({
          item: this.itemModel(),
          id: item_id as number,
        }),
      );

      this.filesModel()
        .map((file, i) => ({ ...file, priority: i + 1, item_id }))
        .forEach((file) => this.store.dispatch(updateFile.action({ file })));

      this.editedItem()?.files.forEach((file) => {
        if (!this.filesModel().find((f) => f.id === file.id)) {
          this.store.dispatch(deleteFile.action({ id: file.id }));
        }
      });
    } else {
      this.store.dispatch(
        addItem.action({
          item: this.itemModel(),
          files: this.filesModel(),
        }),
      );
    }

    // this.formOpen.set(false);
    this.resetForm();
  }

  protected readonly Math = Math;
  protected apiUrl = environment.apiUrl;

  protected removeFile(file: FileAttachment) {
    this.filesModel.update((files) => files.filter((f) => f !== file));
  }

  protected resetForm() {
    this.itemModel.set({ ...this.emptyItem });
    this.filesModel.set([]);
    this.appService.editItem$.next(null);
  }

  @HostListener('window:keydown.enter', ['$event'])
  onEnter(event: Event) {
    if (this.formOpen()) {
      event.preventDefault();
      this.save();
    }
  }

  @HostListener('window:keydown.escape', ['$event'])
  onEscape(event: Event) {
    if (this.formOpen()) {
      event.preventDefault();
      this.formOpen.set(false);
    }
  }
}
