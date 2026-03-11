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

export interface FileAttachment {
  id: number;
  item_id?: number;
  name: string;
  priority: number;
  ext: string;
  category: FileCategory;
  created_at: string;
  size: number;
}

export interface Item extends ItemDto {
  id: number;
  files: FileAttachment[];
}
