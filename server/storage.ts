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
  private initialized = false;

  // Initialize with sample data
  async initialize() {
    if (this.initialized) return;
    
    try {
      // Try to load sample data
      const fs = await import('fs');
      const path = await import('path');
      
      if (fs.existsSync('processed-perfumes.json')) {
        const perfumesData = JSON.parse(fs.readFileSync('processed-perfumes.json', 'utf-8'));
        const sampleProducts = perfumesData; // Load all products
        
        console.log(`Loading ${sampleProducts.length} sample products into memory storage...`);
        
        // Mark ALL products as in stock, regardless of brand
        for (const product of sampleProducts) {
          const newProduct = { 
            id: product.id || Math.random().toString(36).substr(2, 9),
            images: null,
            // Set all products as in stock
            inStock: true,
            topNotes: null,
            middleNotes: null,
            baseNotes: null,
            ...product 
          } as Product;
          this.products.push(newProduct);
        }
        
        const inStockCount = this.products.filter(p => p.inStock).length;
        console.log(`✅ Successfully loaded ${this.products.length} products into memory storage (${inStockCount} in stock)`);
        console.log(`First product: ${JSON.stringify(this.products[0], null, 2)}`);
      } else {
        console.log('⚠️  No processed-perfumes.json file found, storage will be empty');
      }
    } catch (error: any) {
      console.log('⚠️  Could not load sample data, storage will be empty:', error.message || error);
    }
    
    this.initialized = true;
  }

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
    // Make the category comparison case-insensitive
    return Promise.resolve(this.products.filter((product) => 
      product.category && product.category.toLowerCase() === category.toLowerCase()
    ));
  }

  getProductsByBrand(brand: string): Promise<Product[]> {
    // Create a mapping from frontend brand IDs to actual database brand names
    const brandIdToNameMap: { [key: string]: string } = {
      'rabdan': 'RABDAN',
      'signature-royale': 'SIGNATURE ROYALE',
      'pure-essence': 'PURE ESSENCE',
      'coreterno': 'CORETERNO',
      'bvlgari': 'BVLGARI',
      'christian': 'CHRISTIAN DIOR',
      'marc': 'MARC ANTOINE BARROIS',
      'escentric': 'ESCENTRIC MOLECULE',
      'diptyque': 'DIPTYQUE',
      'giardini': 'GIARDINI DI TOSCANA',
      'bohoboco': 'BOHOBOCO',
      'tom-ford': 'TOM FORD',
      'chanel': 'CHANEL',
      'yves-saint-laurent': 'YVES SAINT LAURENT',
      'creed': 'CREED',
      'montale': 'MONTALE',
      'gucci': 'GUCCI',
      'dior': 'DIOR',
      'armani': 'ARMANI',
      'burberry': 'BURBERRY',
      'lancome': 'LANCÔME',
      'mont-blanc': 'MONT BLANC',
      'hugo-boss': 'HUGO BOSS',
      'versace': 'VERSACE',
      'xerjoff': 'XERJOFF'
    };

    // Get the actual brand name from the mapping, or use the provided brand ID as-is
    const actualBrandName = brandIdToNameMap[brand.toLowerCase()] || brand;
    
    // Make the brand comparison case-insensitive
    return Promise.resolve(this.products.filter((product) => 
      product.brand && product.brand.toLowerCase() === actualBrandName.toLowerCase()
    ));
  }

  searchProducts(query: string): Promise<Product[]> {
    return Promise.resolve(
      this.products.filter((product) => {
        const name = typeof product.name === 'string' ? product.name : '';
        const description = typeof product.description === 'string' ? product.description : '';
        return (
          name.toLowerCase().includes(query.toLowerCase()) ||
          description.toLowerCase().includes(query.toLowerCase())
        );
      })
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
async function createStorage(): Promise<IStorage> {
  const db = getDatabase();
  if (db) {
    console.log("✅ Using database storage");
    try {
      return new DatabaseStorage();
    } catch (err) {
      console.error('❌ Failed to initialize DatabaseStorage, falling back to memory:', err);
    }
  }

  console.log("⚠️  Using in-memory storage (data will not persist)");
  const memStorage = new MemStorage();
  await memStorage.initialize();
  return memStorage;
}

// Create a storage initializer with a timeout so a slow/unreachable DB doesn't block server startup
async function createStorageWithTimeout(timeoutMs = 5000): Promise<IStorage> {
  // Race the real createStorage against a simple timeout that rejects.
  // We avoid initializing the in-memory storage until the timeout actually occurs
  // so we don't run two MemStorage.initialze() in parallel and produce duplicate logs.
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('storage-init-timeout')), timeoutMs);
  });

  try {
    // If createStorage resolves before the timeout, return it.
    return await Promise.race([createStorage(), timeoutPromise]);
  } catch (err: any) {
    // The createStorage() did not finish within the timeout window.
    // Initialize and return an in-memory storage as a fallback.
    console.warn(`⏱️  Storage init timed out after ${timeoutMs}ms — falling back to in-memory storage`);
    const mem = new MemStorage();
    await mem.initialize();
    return mem;
  }
}

// Export storage as a promise that resolves to the initialized storage
// Start with an eagerly-initialized in-memory storage so the server can start fast.
// We'll attempt to initialize a DatabaseStorage in the background and swap it in
// if it becomes available.
const currentStorage: IStorage = new MemStorage();

// Initialize in-memory storage immediately (don't block exports)
void (async () => {
  try {
    await (currentStorage as MemStorage).initialize();
  } catch (err) {
    console.warn('⚠️ Failed to initialize in-memory storage immediately:', err);
  }
})();

// Expose a getter for routes to retrieve the current storage instance
export function getStorage(): IStorage {
  return currentStorage;
}

// Attempt to initialize a DatabaseStorage in the background and swap it in if ready
void (async () => {
  try {
    const db = getDatabase();
    if (!db) {
      console.log('⚠️ DATABASE_URL not provided or database not configured; staying on in-memory storage');
      return;
    }

    console.log('🔁 Attempting background initialization of DatabaseStorage...');
    const dbStorage = new DatabaseStorage();
    // If we reach here without throwing, swap storage
    // Note: we purposely don't re-run MemStorage.initialize() to avoid duplicate loads
    (currentStorage as any) = dbStorage as unknown as MemStorage; // swap type for runtime
    console.log('✅ DatabaseStorage initialized and swapped in successfully');
  } catch (err) {
    console.warn('⚠️ DatabaseStorage background initialization failed, remaining on in-memory storage:', err);
  }
})();