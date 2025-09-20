import type { Express } from "express";
import { createServer, type Server } from "http";
import { storagePromise } from "./storage";
import type { IStorage } from "./storage";
import { insertCartItemSchema } from "../shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Wait for storage to be initialized
  const storage: IStorage = await storagePromise;
  
  console.log('Routes registration started');

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      console.log('GET /api/products called');
      const { category, brand, search } = req.query;
      console.log('Query params:', { category, brand, search });
      
      if (search && typeof search === 'string' && search.trim()) {
        const products = await storage.searchProducts(search.trim());
        console.log(`Found ${products.length} products for search: ${search}`);
        res.json(products);
      } else if (brand && typeof brand === 'string' && brand !== 'all') {
        const products = await storage.getProductsByBrand(brand);
        console.log(`Found ${products.length} products for brand: ${brand}`);
        res.json(products);
      } else if (category && typeof category === 'string' && category !== 'all') {
        const products = await storage.getProductsByCategory(category);
        console.log(`Found ${products.length} products for category: ${category}`);
        res.json(products);
      } else {
        const products = await storage.getAllProducts();
        console.log(`Found ${products.length} products total`);
        res.json(products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Cart routes
  app.get("/api/cart/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const cartItems = await storage.getCartItems(sessionId);
      
      // Get product details for each cart item
      const cartWithProducts = await Promise.all(
        cartItems.map(async (item: any) => {
          const product = await storage.getProduct(item.productId);
          return { ...item, product };
        })
      );
      
      res.json(cartWithProducts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(validatedData);
      res.json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.issues });
      }
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  app.patch("/api/cart/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      
      if (typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({ message: "Quantity must be a positive number" });
      }
      
      const cartItem = await storage.updateCartItem(id, quantity);
      
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(cartItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.removeFromCart(id);
      
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });

  app.delete("/api/cart/session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      await storage.clearCart(sessionId);
      res.json({ message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  const httpServer = createServer(app);
  console.log('Routes registration completed');
  return httpServer;
}