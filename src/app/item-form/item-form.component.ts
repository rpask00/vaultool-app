import { Component, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { ClickStopPropagationDirective } from '../../directives/click-stop-propagation.directive';
import { NgClass } from '@angular/common';
import { MatButton } from '@angular/material/button';

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
  ],
  templateUrl: './item-form.component.html',
  styleUrl: './item-form.component.css',
})
export class ItemFormComponent {
  readonly formOpen = signal(false);
  protected readonly Array = Array;

  protected addPhoto() {}
}
