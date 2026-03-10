export interface ListResponse<T> {
  items: T[];
  total: number,
  page: number,
  per_page: number
}

export interface Item {
  id?: number;
  name: string;
  description: string;
  quantity: number;
  tags: string[];
}
