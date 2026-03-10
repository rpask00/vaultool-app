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

export interface Item extends ItemDto {
  id: number;
}
