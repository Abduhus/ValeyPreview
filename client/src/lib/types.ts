import { Product, CartItem } from "@shared/schema";

export interface CartItemWithProduct extends CartItem {
  product?: Product;
}

export interface FilterState {
  category: string;
  sortBy: string;
  minRating: number;
}
