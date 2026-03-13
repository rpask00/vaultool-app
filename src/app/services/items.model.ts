export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
}

export interface ItemDto {
  name: string;
  description: string;
  quantity: number;
  tags: string[];
}

export enum FileCategory {
  PHOTO = 1,
  OTHER = 999,
}

export interface FileAttachmentDto {
  item_id?: number;
  priority: number;
  category: FileCategory;
}

export interface FileAttachment extends FileAttachmentDto {
  id: number;
  ext: string;
  name: string;
  created_at: string;
  size: number;
}

export interface Item extends ItemDto {
  id: number;
  files: FileAttachment[];
}
