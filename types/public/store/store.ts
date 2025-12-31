export interface Store {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: number;
  created_at: string;
  updated_at: string;
  image: string;
}

export interface GetStoresParams {
  page?: number;
  paginate?: number;
}