import { type User, type InsertUser, type Product, type InsertProduct, type CartItem, type InsertCartItem } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Product operations
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProductsByBrand(brand: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Cart operations
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: User[] = [];
  private products: Product[] = [];
  private cartItems: CartItem[] = [];

  // User operations
  getUser(id: string): Promise<User | undefined> {
    return Promise.resolve(this.users.find((user) => user.id === id));
  }

  getUserByUsername(username: string): Promise<User | undefined> {
    return Promise.resolve(this.users.find((user) => user.username === username));
  }

  getUserByEmail(email: string): Promise<User | undefined> {
    return Promise.resolve(this.users.find((user) => user.email === email));
  }

  createUser(user: InsertUser): Promise<User> {
    const newUser = { id: randomUUID(), ...user };
    this.users.push(newUser);
    return Promise.resolve(newUser);
  }

  // Product operations
  getAllProducts(): Promise<Product[]> {
    return Promise.resolve(this.products);
  }

  getProduct(id: string): Promise<Product | undefined> {
    return Promise.resolve(this.products.find((product) => product.id === id));
  }

  getProductsByCategory(category: string): Promise<Product[]> {
    return Promise.resolve(this.products.filter((product) => product.category === category));
  }

  getProductsByBrand(brand: string): Promise<Product[]> {
    return Promise.resolve(this.products.filter((product) => product.brand === brand));
  }

  searchProducts(query: string): Promise<Product[]> {
    return Promise.resolve(
      this.products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      )
    );
  }

  createProduct(product: InsertProduct): Promise<Product> {
    const newProduct = { 
      id: randomUUID(), 
      images: null,
      inStock: true,
      topNotes: null,
      middleNotes: null,
      baseNotes: null,
      ...product 
    } as Product;
    this.products.push(newProduct);
    return Promise.resolve(newProduct);
  }

  // Cart operations
  getCartItems(sessionId: string): Promise<CartItem[]> {
    return Promise.resolve(this.cartItems.filter((cartItem) => cartItem.sessionId === sessionId));
  }

  addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    const newCartItem = { 
      id: randomUUID(), 
      quantity: 1,
      ...cartItem 
    } as CartItem;
    this.cartItems.push(newCartItem);
    return Promise.resolve(newCartItem);
  }

  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.find((cartItem) => cartItem.id === id);
    if (cartItem) {
      cartItem.quantity = quantity;
      return Promise.resolve(cartItem);
    }
    return Promise.resolve(undefined);
  }

  removeFromCart(id: string): Promise<boolean> {
    const index = this.cartItems.findIndex((cartItem) => cartItem.id === id);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  clearCart(sessionId: string): Promise<boolean> {
    const initialLength = this.cartItems.length;
    this.cartItems = this.cartItems.filter((cartItem) => cartItem.sessionId !== sessionId);
    return Promise.resolve(this.cartItems.length !== initialLength);
  }
}

export const storage = new MemStorage();