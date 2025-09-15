import { type User, type InsertUser, type Product, type InsertProduct, type CartItem, type InsertCartItem } from "@shared/schema";
import { randomUUID } from "crypto";
import { getDatabase } from "./db";
import { eq, like, or, and } from "drizzle-orm";
import { users, products, cartItems } from "../shared/schema";

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

export class DatabaseStorage implements IStorage {
  private db = getDatabase();

  constructor() {
    if (!this.db) {
      throw new Error("Database connection required for DatabaseStorage");
    }
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db!.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db!.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.db!.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await this.db!.insert(users).values(user).returning();
    return result[0];
  }

  // Product operations
  async getAllProducts(): Promise<Product[]> {
    return await this.db!.select().from(products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = await this.db!.select().from(products).where(eq(products.id, id)).limit(1);
    return result[0];
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await this.db!.select().from(products).where(eq(products.category, category));
  }

  async getProductsByBrand(brand: string): Promise<Product[]> {
    return await this.db!.select().from(products).where(eq(products.brand, brand));
  }

  async searchProducts(query: string): Promise<Product[]> {
    const searchTerm = `%${query.toLowerCase()}%`;
    return await this.db!.select().from(products).where(
      or(
        like(products.name, searchTerm),
        like(products.description, searchTerm),
        like(products.brand, searchTerm)
      )
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await this.db!.insert(products).values(product).returning();
    return result[0];
  }

  // Cart operations
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return await this.db!.select().from(cartItems).where(eq(cartItems.sessionId, sessionId));
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existing = await this.db!.select().from(cartItems).where(
      and(
        eq(cartItems.sessionId, cartItem.sessionId),
        eq(cartItems.productId, cartItem.productId)
      )
    ).limit(1);

    if (existing.length > 0) {
      // Update quantity if item exists
      const updated = await this.db!.update(cartItems)
        .set({ quantity: existing[0].quantity + (cartItem.quantity || 1) })
        .where(eq(cartItems.id, existing[0].id))
        .returning();
      return updated[0];
    } else {
      // Insert new item
      const result = await this.db!.insert(cartItems).values(cartItem).returning();
      return result[0];
    }
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const result = await this.db!.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return result[0];
  }

  async removeFromCart(id: string): Promise<boolean> {
    const result = await this.db!.delete(cartItems).where(eq(cartItems.id, id)).returning();
    return result.length > 0;
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const result = await this.db!.delete(cartItems).where(eq(cartItems.sessionId, sessionId)).returning();
    return result.length > 0;
  }
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

// Create storage instance based on database availability
function createStorage(): IStorage {
  const db = getDatabase();
  if (db) {
    console.log("✅ Using database storage");
    return new DatabaseStorage();
  } else {
    console.log("⚠️  Using in-memory storage (data will not persist)");
    return new MemStorage();
  }
}

export const storage = createStorage();