import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileAttachment, FileAttachmentDto } from './items.model';
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

  public upload(filesDto: FileAttachmentDto, files: File[]) {
    const formData = new FormData();

    if (filesDto.item_id) formData.append('item_id', filesDto.item_id.toString());

    formData.append('priority', filesDto.priority.toString());
    formData.append('category', filesDto.category.toString());

    for (const i in files) {
      formData.append(`files`, files[i]);
    }

    return this._http.post<FileAttachment[]>(`${environment.apiUrl}/${this.resource}`, formData);
  }

  public update(id: number, item: FileAttachment) {
    return this._http.put<FileAttachment>(`${environment.apiUrl}/${this.resource}/${id}`, item);
  }

  public delete(id: number) {
    return this._http.delete<void>(`${environment.apiUrl}/${this.resource}/${id}`);
  }
}
