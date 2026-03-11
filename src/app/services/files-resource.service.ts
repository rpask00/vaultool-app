import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileAttachment, ItemDto } from './items.model';
import { environment } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class FilesResource {
  readonly resource = 'files';
  constructor(private readonly _http: HttpClient) {}

  public getAll(itemIds: number[]) {
    const query = `?item_ids=${itemIds.join(',')}`;
    return this._http.get<FileAttachment[]>(`${environment.apiUrl}/${this.resource}${query}`);
  }

  public create(item: ItemDto) {
    return this._http.post<FileAttachment>(`${environment.apiUrl}/${this.resource}`, item);
  }

  public update(id: number, item: ItemDto) {
    return this._http.put<FileAttachment>(`${environment.apiUrl}/${this.resource}/${id}`, item);
  }

  public delete(id: number) {
    return this._http.delete<void>(`${environment.apiUrl}/${this.resource}/${id}`);
  }
}
