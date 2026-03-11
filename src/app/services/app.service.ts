import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Item } from './items.model';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public editItem$ = new Subject<Item | null>()
}
