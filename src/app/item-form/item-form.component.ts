import { Component, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { ClickStopPropagationDirective } from '../../directives/click-stop-propagation.directive';
import { NgClass } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { form, FormField } from '@angular/forms/signals';
import { Item } from '../services/items.model';

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
    console.log(this.itemModel());
  }
}
