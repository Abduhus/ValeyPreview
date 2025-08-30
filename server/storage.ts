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
  createProduct(product: InsertProduct): Promise<Product>;

  // Cart operations
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private cartItems: Map<string, CartItem>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.initializeProducts();
  }

  private initializeProducts() {
    const products: Product[] = [
      {
        id: "1",
        name: "Mystic Rose",
        description: "Enchanting blend of Bulgarian rose and white jasmine",
        price: "120.00",
        category: "women",
        volume: "50ml",
        rating: "5.0",
        imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        moodImageUrl: "https://images.unsplash.com/photo-1617103996386-c42684d7c7c3?q=80&w=1887&auto=format&fit=crop",
        inStock: true,
      },
      {
        id: "2",
        name: "Midnight Woods",
        description: "Deep sandalwood with hints of cedar and bergamot",
        price: "95.00",
        category: "men",
        volume: "75ml",
        rating: "4.0",
        imageUrl: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        moodImageUrl: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        inStock: true,
      },
      {
        id: "3",
        name: "Ocean Breeze",
        description: "Fresh aquatic notes with citrus and marine accord",
        price: "150.00",
        category: "unisex",
        volume: "100ml",
        rating: "5.0",
        imageUrl: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        moodImageUrl: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        inStock: true,
      },
      {
        id: "4",
        name: "Golden Lotus",
        description: "Exotic lotus flower with vanilla and amber base",
        price: "180.00",
        category: "women",
        volume: "50ml",
        rating: "5.0",
        imageUrl: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        moodImageUrl: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        inStock: true,
      },
      {
        id: "5",
        name: "Urban Legend",
        description: "Contemporary blend of leather, spices, and tobacco",
        price: "135.00",
        category: "men",
        volume: "75ml",
        rating: "4.0",
        imageUrl: "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        moodImageUrl: "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        inStock: true,
      },
      {
        id: "6",
        name: "Celestial Moon",
        description: "Mystical blend of white musk and silver iris",
        price: "165.00",
        category: "unisex",
        volume: "100ml",
        rating: "5.0",
        imageUrl: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        moodImageUrl: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        inStock: true,
      },
      {
        id: "7",
        name: "Royal Garden",
        description: "Limited edition with rare French lavender and gold leaf",
        price: "200.00",
        category: "women",
        volume: "50ml",
        rating: "5.0",
        imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        moodImageUrl: "https://images.unsplash.com/photo-1527368746281-798b65e1ac6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        inStock: true,
      },
      {
        id: "8",
        name: "Heritage Oak",
        description: "Classic oakmoss with vetiver and patchouli",
        price: "110.00",
        category: "men",
        volume: "75ml",
        rating: "4.0",
        imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        moodImageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        inStock: true,
      },
    ];

    products.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category,
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  // Cart methods
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.sessionId === sessionId,
    );
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      (item) => item.sessionId === insertCartItem.sessionId && item.productId === insertCartItem.productId,
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += insertCartItem.quantity;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    }

    const id = randomUUID();
    const cartItem: CartItem = { ...insertCartItem, id };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;

    cartItem.quantity = quantity;
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const itemsToDelete = Array.from(this.cartItems.entries())
      .filter(([, item]) => item.sessionId === sessionId)
      .map(([id]) => id);

    itemsToDelete.forEach(id => this.cartItems.delete(id));
    return true;
  }
}

export const storage = new MemStorage();
