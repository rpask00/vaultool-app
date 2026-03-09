import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item, ListResponse } from './items.model';

@Injectable({
  providedIn: 'root',
})
export class ItemsResource {
  readonly resource = 'items';
  constructor(private readonly _http: HttpClient) {}

  public getAll(name?: string) {
    const query = name ? `?name=${name}` : '';
    return this._http.get<ListResponse<Item>>(`${this.resource}${query}`);
  }

  public getById(id: string) {
    return this._http.get<Item>(`${this.resource}/${id}`);
  }

  public create(item: Item) {
    return this._http.post<Item>(`${this.resource}`, item);
  }

  public update(id: string, item: Partial<Item>) {
    return this._http.put<Item>(`${this.resource}/${id}`, item);
  }

  public delete(id: string) {
    return this._http.delete<void>(`${this.resource}/${id}`);
  }
}
