import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item, ItemDto, ListResponse, SearchItemResult } from './items.model';
import { environment } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class ItemsResource {
  readonly resource = 'items';
  constructor(private readonly _http: HttpClient) {}

  public getAll(name?: string, page?: number, per_page?: number) {
    const query = `?name=${name || ''}&page=${page || 1}&per_page=${per_page || 10}`;
    return this._http.get<ListResponse<Item>>(`${environment.apiUrl}/${this.resource}${query}`);
  }

  public getById(id: string) {
    return this._http.get<Item>(`${environment.apiUrl}/${this.resource}/${id}`);
  }

  public getByPhoto(photo: File) {
    const form = new FormData();
    form.append('image', photo);

    return this._http.post<SearchItemResult[]>(`http://127.0.0.1:5000/query`, form);
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
