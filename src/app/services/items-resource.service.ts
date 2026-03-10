import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item, ItemDto, ListResponse } from './items.model';
import { environment } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class ItemsResource {
  readonly resource = 'items';
  constructor(private readonly _http: HttpClient) {}

  public getAll(name?: string) {
    const query = name ? `?name=${name}` : '';
    return this._http.get<ListResponse<Item>>(`${environment.apiUrl}/${this.resource}${query}`);
  }

  public getById(id: string) {
    return this._http.get<Item>(`${environment.apiUrl}/${this.resource}/${id}`);
  }

  public create(item: ItemDto) {
    return this._http.post<Item>(`${environment.apiUrl}/${this.resource}`, item);
  }

  public update(id: number, item: ItemDto) {
    return this._http.put<Item>(`${environment.apiUrl}/${this.resource}/${id}`, item);
  }

  public delete(id: number) {
    return this._http.delete<void>(`${environment.apiUrl}/${this.resource}/${id}`);
  }
}
