import { Store } from "./store";

export interface Product {
  id: number;
  store_id: number;
  name: string;
  slug: string;
  price: number;
  markup_price: number;
  stock: number;
  description: string | null;
  external_link: string;
  status: number;
  created_at: string;
  updated_at: string;
  image: string;
  store: Store; // Nested store object inside product
}

export interface GetProductsParams {
  page?: number;
  paginate?: number;
  store_id?: number;
}