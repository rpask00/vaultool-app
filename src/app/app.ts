import { Component } from '@angular/core';
import { ItemFormComponent } from './item-form/item-form.component';

@Component({
  selector: 'app-root',
  imports: [ItemFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
