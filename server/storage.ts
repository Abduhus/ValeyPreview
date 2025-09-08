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
        brand: "Valley Breezes",
        volume: "50ml",
        rating: "5.0",
        imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        moodImageUrl: "https://images.unsplash.com/photo-1617103996386-c42684d7c7c3?q=80&w=1887&auto=format&fit=crop",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
          "https://images.unsplash.com/photo-1617103996386-c42684d7c7c3?q=80&w=1887&auto=format&fit=crop"
        ]),
        inStock: true,
      },
      {
        id: "2",
        name: "Midnight Woods",
        description: "Deep sandalwood with hints of cedar and bergamot",
        price: "95.00",
        category: "men",
        brand: "Valley Breezes",
        volume: "75ml",
        rating: "4.0",
        imageUrl: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        moodImageUrl: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1615634260167-c8cdede054de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600"
        ]),
        inStock: true,
      },
      {
        id: "3",
        name: "Ocean Breeze",
        description: "Fresh aquatic notes with citrus and marine accord",
        price: "150.00",
        category: "unisex",
        brand: "Valley Breezes",
        volume: "100ml",
        rating: "5.0",
        imageUrl: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        moodImageUrl: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600"
        ]),
        inStock: true,
      },
      {
        id: "4",
        name: "Golden Lotus",
        description: "Exotic lotus flower with vanilla and amber base",
        price: "180.00",
        category: "women",
        brand: "Valley Breezes",
        volume: "50ml",
        rating: "5.0",
        imageUrl: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        moodImageUrl: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600"
        ]),
        inStock: true,
      },
      {
        id: "5",
        name: "Urban Legend",
        description: "Contemporary blend of leather, spices, and tobacco",
        price: "135.00",
        category: "men",
        brand: "Valley Breezes",
        volume: "75ml",
        rating: "4.0",
        imageUrl: "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        moodImageUrl: "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600"
        ]),
        inStock: true,
      },
      {
        id: "6",
        name: "Celestial Moon",
        description: "Mystical blend of white musk and silver iris",
        price: "165.00",
        category: "unisex",
        brand: "Valley Breezes",
        volume: "100ml",
        rating: "5.0",
        imageUrl: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        moodImageUrl: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600"
        ]),
        inStock: true,
      },
      {
        id: "7",
        name: "Royal Garden",
        description: "Limited edition with rare French lavender and gold leaf",
        price: "200.00",
        category: "women",
        brand: "Valley Breezes",
        volume: "50ml",
        rating: "5.0",
        imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        moodImageUrl: "https://images.unsplash.com/photo-1527368746281-798b65e1ac6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
          "https://images.unsplash.com/photo-1527368746281-798b65e1ac6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600"
        ]),
        inStock: true,
      },
      {
        id: "8",
        name: "Heritage Oak",
        description: "Classic oakmoss with vetiver and patchouli",
        price: "110.00",
        category: "men",
        brand: "Valley Breezes",
        volume: "75ml",
        rating: "4.0",
        imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        moodImageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600"
        ]),
        inStock: true,
      },
      // RABDAN BRAND PRODUCTS (375 AED each)
      {
        id: "9",
        name: "Rabdan Chill Vibes",
        description: "A refreshing and contemporary fragrance perfect for relaxed moments with modern appeal and vibrant energy",
        price: "375.00",
        category: "unisex",
        brand: "Rabdan",
        volume: "50ml",
        rating: "4.8",
        imageUrl: "/perfumes/Rabdan_CHILL-VIBES_1.webp",
        moodImageUrl: "/perfumes/Rabdan_CHILL_-VIBES_2.webp",
        images: JSON.stringify([
          "/perfumes/Rabdan_CHILL-VIBES_1.webp",
          "/perfumes/Rabdan_CHILL_-VIBES_2.webp"
        ]),
        inStock: true,
      },
      {
        id: "10",
        name: "Rabdan Cigar Honey",
        description: "Rich tobacco and honey blend for sophisticated evening wear with luxurious depth and warmth",
        price: "375.00",
        category: "men",
        brand: "Rabdan",
        volume: "50ml",
        rating: "4.9",
        imageUrl: "/perfumes/Rabdan_CIGAR_HONEY_1.webp",
        moodImageUrl: "/perfumes/Rabdan_CIGAR_HONEY_2.webp",
        images: JSON.stringify([
          "/perfumes/Rabdan_CIGAR_HONEY_1.webp",
          "/perfumes/Rabdan_CIGAR_HONEY_2.webp"
        ]),
        inStock: true,
      },
      {
        id: "11",
        name: "Rabdan Ginger Time",
        description: "Vibrant ginger-based composition with warm spices, energizing and invigorating for the adventurous spirit",
        price: "375.00",
        category: "unisex",
        brand: "Rabdan",
        volume: "50ml",
        rating: "4.7",
        imageUrl: "/perfumes/Rabdan_GINGER_TIME_1.webp",
        moodImageUrl: "/perfumes/Rabdan_GINGER_TIME_2.webp",
        images: JSON.stringify([
          "/perfumes/Rabdan_GINGER_TIME_1.webp",
          "/perfumes/Rabdan_GINGER_TIME_2.webp"
        ]),
        inStock: true,
      },
      {
        id: "12",
        name: "Rabdan GWY",
        description: "Modern unisex fragrance with fresh contemporary appeal, perfect for the modern urbanite",
        price: "375.00",
        category: "unisex",
        brand: "Rabdan",
        volume: "50ml",
        rating: "4.6",
        imageUrl: "/perfumes/Rabdan_GWY_1.webp",
        moodImageUrl: "/perfumes/Rabdan_GWY_2.webp",
        images: JSON.stringify([
          "/perfumes/Rabdan_GWY_1.webp",
          "/perfumes/Rabdan_GWY_2.webp"
        ]),
        inStock: true,
      },
      {
        id: "13",
        name: "Rabdan Hibiscus",
        description: "Floral masterpiece featuring exotic hibiscus blooms with tropical elegance and feminine charm",
        price: "375.00",
        category: "women",
        brand: "Rabdan",
        volume: "50ml",
        rating: "4.8",
        imageUrl: "/perfumes/Rabdan_HIBISCUS_1.webp",
        moodImageUrl: "/perfumes/Rabdan_HIBISCUS_2.webp",
        images: JSON.stringify([
          "/perfumes/Rabdan_HIBISCUS_1.webp",
          "/perfumes/Rabdan_HIBISCUS_2.webp"
        ]),
        inStock: true,
      },
      {
        id: "14",
        name: "Rabdan Il Mio Viziato",
        description: "Indulgent and luxurious fragrance for special occasions with opulent sophistication",
        price: "375.00",
        category: "unisex",
        brand: "Rabdan",
        volume: "50ml",
        rating: "4.9",
        imageUrl: "/perfumes/Rabdan_IL_MIO_VIZIATO_1.webp",
        moodImageUrl: "/perfumes/Rabdan_IL_MIO_VIZIATO_2.webp",
        images: JSON.stringify([
          "/perfumes/Rabdan_IL_MIO_VIZIATO_1.webp",
          "/perfumes/Rabdan_IL_MIO_VIZIATO_2.webp"
        ]),
        inStock: true,
      },
      {
        id: "15",
        name: "Rabdan Iris Tabac",
        description: "Elegant iris combined with rich tobacco notes creating a sophisticated and refined composition",
        price: "375.00",
        category: "unisex",
        brand: "Rabdan",
        volume: "50ml",
        rating: "4.7",
        imageUrl: "/perfumes/Rabdan_THE_VERT_VETIVER_1.webp",
        moodImageUrl: "/perfumes/Rabdan_THE_VERT_VETIVER_2.webp",
        images: JSON.stringify([
          "/perfumes/Rabdan_THE_VERT_VETIVER_1.webp",
          "/perfumes/Rabdan_THE_VERT_VETIVER_2.webp"
        ]),
        inStock: true,
      },
      {
        id: "16",
        name: "Rabdan Love Confession Daring",
        description: "Bold and romantic fragrance for confident personalities with passionate intensity",
        price: "375.00",
        category: "women",
        brand: "Rabdan",
        volume: "50ml",
        rating: "4.8",
        imageUrl: "/perfumes/Rabdan_LOVE_CONFESSION_1.webp",
        moodImageUrl: "/perfumes/Rabdan_LOVE_CONFESSION_2.webp",
        images: JSON.stringify([
          "/perfumes/Rabdan_LOVE_CONFESSION_1.webp",
          "/perfumes/Rabdan_LOVE_CONFESSION_2.webp"
        ]),
        inStock: true,
      },
      {
        id: "17",
        name: "Rabdan Oud of King",
        description: "Royal oud composition fit for royalty with majestic presence and luxurious depth",
        price: "375.00",
        category: "unisex",
        brand: "Rabdan",
        volume: "50ml",
        rating: "5.0",
        imageUrl: "/perfumes/Rabdan_Room_816_1.webp",
        moodImageUrl: "/perfumes/Rabdan_Room_816_2.webp",
        images: JSON.stringify([
          "/perfumes/Rabdan_Room_816_1.webp",
          "/perfumes/Rabdan_Room_816_2.webp"
        ]),
        inStock: true,
      },
      {
        id: "18",
        name: "Rabdan Rolling in the Deep",
        description: "Deep and mysterious fragrance with complex layers, perfect for evening sophistication",
        price: "375.00",
        category: "unisex",
        brand: "Rabdan",
        volume: "50ml",
        rating: "4.8",
        imageUrl: "/perfumes/Rabdan_TOBACCO_NIGHT_1.webp",
        moodImageUrl: "/perfumes/Rabdan_TOBACCO_NIGHT_2.webp",
        images: JSON.stringify([
          "/perfumes/Rabdan_TOBACCO_NIGHT_1.webp",
          "/perfumes/Rabdan_TOBACCO_NIGHT_2.webp"
        ]),
        inStock: true,
      },
      {
        id: "19",
        name: "Rabdan Room 816",
        description: "Intimate and personal fragrance inspired by private moments with sensual appeal",
        price: "375.00",
        category: "unisex",
        brand: "Rabdan",
        volume: "50ml",
        rating: "4.7",
        imageUrl: "/perfumes/Rabdan_Room_816_1.webp",
        moodImageUrl: "/perfumes/Rabdan_Room_816_2.webp",
        images: JSON.stringify([
          "/perfumes/Rabdan_Room_816_1.webp",
          "/perfumes/Rabdan_Room_816_2.webp"
        ]),
        inStock: true,
      },
      {
        id: "20",
        name: "Rabdan Saint Petersburg",
        description: "Classic European-inspired elegance with timeless sophistication and refined appeal",
        price: "375.00",
        category: "unisex",
        brand: "Rabdan",
        volume: "50ml",
        rating: "4.9",
        imageUrl: "/perfumes/Rabdan_TEA_TIME_1.webp",
        moodImageUrl: "/perfumes/Rabdan_TEA_TIME_2.webp",
        images: JSON.stringify([
          "/perfumes/Rabdan_TEA_TIME_1.webp",
          "/perfumes/Rabdan_TEA_TIME_2.webp"
        ]),
        inStock: true,
      },
      {
        id: "21",
        name: "Rabdan The Vert Vetiver",
        description: "Fresh green vetiver with natural sophistication and earthy elegance",
        price: "375.00",
        category: "unisex",
        brand: "Rabdan",
        volume: "50ml",
        rating: "4.6",
        imageUrl: "/perfumes/Rabdan_THE_VERT_VETIVER_1.webp",
        moodImageUrl: "/perfumes/Rabdan_THE_VERT_VETIVER_2.webp",
        images: JSON.stringify([
          "/perfumes/Rabdan_THE_VERT_VETIVER_1.webp",
          "/perfumes/Rabdan_THE_VERT_VETIVER_2.webp"
        ]),
        inStock: true,
      },
      {
        id: "43",
        name: "Rabdan Lignum Vitae",
        description: "Rare woody fragrance featuring precious lignum vitae wood with sophisticated depth and earthy elegance",
        price: "375.00",
        category: "unisex",
        brand: "Rabdan",
        volume: "50ml",
        rating: "4.8",
        imageUrl: "/perfumes/Rabdan_SILKY_VANILLA_1.webp",
        moodImageUrl: "/perfumes/Rabdan_SILKY_VANILLA_2.webp",
        images: JSON.stringify([
          "/perfumes/Rabdan_SILKY_VANILLA_1.webp",
          "/perfumes/Rabdan_SILKY_VANILLA_2.webp"
        ]),
        inStock: true,
      },
      // SIGNATURE ROYALE BRAND PRODUCTS (380 AED each)
      {
        id: "22",
        name: "Signature Royale Caramel Sugar",
        description: "Sweet and gourmand fragrance with caramel sweetness and luxurious indulgence",
        price: "380.00",
        category: "women",
        brand: "Signature Royale",
        volume: "50ml",
        rating: "4.8",
        imageUrl: "/perfumes/CaramelSugar-SignatureRoyale.webp",
        moodImageUrl: "/perfumes/CaramelSugar-SignatureRoyale-Boite.webp",
        images: JSON.stringify([
          "/perfumes/CaramelSugar-SignatureRoyale.webp",
          "/perfumes/CaramelSugar-SignatureRoyale-Boite.webp"
        ]),
        inStock: true,
      },
      {
        id: "23",
        name: "Signature Royale Creamy Love",
        description: "Romantic and creamy composition for intimate moments with soft elegance",
        price: "380.00",
        category: "women",
        brand: "Signature Royale",
        volume: "50ml",
        rating: "4.9",
        imageUrl: "/perfumes/CreamyLove-SignatureRoyale.webp",
        moodImageUrl: "/perfumes/CreamyLove-SignatureRoyale-Boite.webp",
        images: JSON.stringify([
          "/perfumes/CreamyLove-SignatureRoyale.webp",
          "/perfumes/CreamyLove-SignatureRoyale-Boite.webp"
        ]),
        inStock: true,
      },
      {
        id: "24",
        name: "Signature Royale Dragée Blanc",
        description: "Pure white floral elegance with almond sweetness and sophisticated charm",
        price: "380.00",
        category: "women",
        brand: "Signature Royale",
        volume: "50ml",
        rating: "4.7",
        imageUrl: "/perfumes/dragee_blanc_SignatureRoyale_1.webp",
        moodImageUrl: "/perfumes/dragee_blanc_SignatureRoyale_2.webp",
        images: JSON.stringify([
          "/perfumes/dragee_blanc_SignatureRoyale_1.webp",
          "/perfumes/dragee_blanc_SignatureRoyale_2.webp"
        ]),
        inStock: true,
      },
      {
        id: "25",
        name: "Signature Royale Grey London",
        description: "Urban sophistication inspired by London's elegance with modern metropolitan appeal",
        price: "380.00",
        category: "unisex",
        brand: "Signature Royale",
        volume: "50ml",
        rating: "4.8",
        imageUrl: "/perfumes/GreyLondon-SignatureRoyale.webp",
        moodImageUrl: "/perfumes/GreyLondon-SignatureRoyale-Boite.webp",
        images: JSON.stringify([
          "/perfumes/GreyLondon-SignatureRoyale.webp",
          "/perfumes/GreyLondon-SignatureRoyale-Boite.webp"
        ]),
        inStock: true,
      },
      {
        id: "26",
        name: "Signature Royale Iris Impérial",
        description: "Imperial iris composition of royal quality with regal sophistication and noble presence",
        price: "380.00",
        category: "unisex",
        brand: "Signature Royale",
        volume: "50ml",
        rating: "5.0",
        imageUrl: "/perfumes/GhostOud-SignatureRoyale.webp",
        moodImageUrl: "/perfumes/GhostOud-SignatureRoyale-Boite.webp",
        images: JSON.stringify([
          "/perfumes/GhostOud-SignatureRoyale.webp",
          "/perfumes/GhostOud-SignatureRoyale-Boite.webp"
        ]),
        inStock: true,
      },
      {
        id: "27",
        name: "Signature Royale Mythologia",
        description: "Mythical and mysterious fragrance with ancient allure and legendary sophistication",
        price: "380.00",
        category: "unisex",
        brand: "Signature Royale",
        volume: "50ml",
        rating: "4.9",
        imageUrl: "/perfumes/GhostOud-SignatureRoyale.webp",
        moodImageUrl: "/perfumes/GhostOud-SignatureRoyale-Boite.webp",
        images: JSON.stringify([
          "/perfumes/GhostOud-SignatureRoyale.webp",
          "/perfumes/GhostOud-SignatureRoyale-Boite.webp"
        ]),
        inStock: true,
      },
      {
        id: "28",
        name: "Signature Royale Oud Envoutant",
        description: "Enchanting oud blend with hypnotic appeal and mesmerizing depth",
        price: "380.00",
        category: "unisex",
        brand: "Signature Royale",
        volume: "50ml",
        rating: "4.8",
        imageUrl: "/perfumes/GhostOud-SignatureRoyale.webp",
        moodImageUrl: "/perfumes/GhostOud-SignatureRoyale-Boite.webp",
        images: JSON.stringify([
          "/perfumes/GhostOud-SignatureRoyale.webp",
          "/perfumes/GhostOud-SignatureRoyale-Boite.webp"
        ]),
        inStock: true,
      },
      {
        id: "29",
        name: "Signature Royale Sunset Vibes",
        description: "Warm sunset-inspired fragrance for golden hour moments with radiant warmth",
        price: "380.00",
        category: "unisex",
        brand: "Signature Royale",
        volume: "50ml",
        rating: "4.7",
        imageUrl: "/perfumes/GreyLondon-SignatureRoyale.webp",
        moodImageUrl: "/perfumes/GreyLondon-SignatureRoyale-Boite.webp",
        images: JSON.stringify([
          "/perfumes/GreyLondon-SignatureRoyale.webp",
          "/perfumes/GreyLondon-SignatureRoyale-Boite.webp"
        ]),
        inStock: true,
      },
      {
        id: "30",
        name: "Signature Royale Sweet Cherry",
        description: "Luscious cherry fragrance with fruity sophistication and playful elegance",
        price: "380.00",
        category: "women",
        brand: "Signature Royale",
        volume: "50ml",
        rating: "4.8",
        imageUrl: "/perfumes/CreamyLove-SignatureRoyale.webp",
        moodImageUrl: "/perfumes/CreamyLove-SignatureRoyale-Boite.webp",
        images: JSON.stringify([
          "/perfumes/CreamyLove-SignatureRoyale.webp",
          "/perfumes/CreamyLove-SignatureRoyale-Boite.webp"
        ]),
        inStock: true,
      },
      // PURE ESSENCE BRAND PRODUCTS (265 AED each)
      {
        id: "31",
        name: "Pure Essence Ambernomade",
        description: "Amber-based nomadic fragrance for the adventurous spirit with wanderlust appeal",
        price: "265.00",
        category: "unisex",
        brand: "Pure Essence",
        volume: "50ml",
        rating: "4.6",
        imageUrl: "/perfumes/AMBER-NOMADE-scaled.jpg",
        moodImageUrl: "/perfumes/AMBER-NOMADE-scaled.jpg",
        images: JSON.stringify([
          "/perfumes/AMBER-NOMADE-scaled.jpg"
        ]),
        inStock: true,
      },
      {
        id: "32",
        name: "Pure Essence Babycat",
        description: "Playful and charming fragrance with youthful energy and whimsical appeal",
        price: "265.00",
        category: "women",
        brand: "Pure Essence",
        volume: "50ml",
        rating: "4.5",
        imageUrl: "/perfumes/BABYCAT-scaled.jpg",
        moodImageUrl: "/perfumes/BABYCAT-scaled.jpg",
        images: JSON.stringify([
          "/perfumes/BABYCAT-scaled.jpg"
        ]),
        inStock: true,
      },
      {
        id: "33",
        name: "Pure Essence Flowerbomb",
        description: "Explosive floral bouquet with vibrant energy and captivating bloom",
        price: "265.00",
        category: "women",
        brand: "Pure Essence",
        volume: "50ml",
        rating: "4.7",
        imageUrl: "/perfumes/BOMB-scaled.jpg",
        moodImageUrl: "/perfumes/BOMB-scaled.jpg",
        images: JSON.stringify([
          "/perfumes/BOMB-scaled.jpg"
        ]),
        inStock: true,
      },
      {
        id: "34",
        name: "Pure Essence Imagination",
        description: "Creative and artistic fragrance that sparks imagination with innovative composition",
        price: "265.00",
        category: "unisex",
        brand: "Pure Essence",
        volume: "50ml",
        rating: "4.6",
        imageUrl: "/perfumes/IMAGINATION-scaled.jpg",
        moodImageUrl: "/perfumes/IMAGINATION-scaled.jpg",
        images: JSON.stringify([
          "/perfumes/IMAGINATION-scaled.jpg"
        ]),
        inStock: true,
      },
      {
        id: "35",
        name: "Pure Essence Maidan",
        description: "Field-inspired natural fragrance with green freshness and outdoor vitality",
        price: "265.00",
        category: "unisex",
        brand: "Pure Essence",
        volume: "50ml",
        rating: "4.5",
        imageUrl: "/perfumes/MAIDAN-1-scaled.jpg",
        moodImageUrl: "/perfumes/MAIDAN-1-scaled.jpg",
        images: JSON.stringify([
          "/perfumes/MAIDAN-1-scaled.jpg"
        ]),
        inStock: true,
      },
      // CORETERNO BRAND PRODUCTS (715 AED each)
      {
        id: "36",
        name: "Coreterno Catharsis",
        description: "Emotionally powerful fragrance for inner transformation with profound depth and therapeutic appeal",
        price: "715.00",
        category: "unisex",
        brand: "Coreterno",
        volume: "100ml",
        rating: "5.0",
        imageUrl: "/perfumes/coreterno_EDP03_Eau_de_Parfum_Catharsis_2.webp",
        moodImageUrl: "/perfumes/EDP03_Eau-de-Parfum_Catharsis_03-scaled.webp",
        images: JSON.stringify([
          "/perfumes/coreterno_EDP03_Eau_de_Parfum_Catharsis_2.webp",
          "/perfumes/EDP03_Eau-de-Parfum_Catharsis_03-scaled.webp"
        ]),
        inStock: true,
      },
      {
        id: "37",
        name: "Coreterno Freakincense",
        description: "Rebellious incense blend with punk rock attitude and unconventional sophistication",
        price: "715.00",
        category: "unisex",
        brand: "Coreterno",
        volume: "100ml",
        rating: "4.9",
        imageUrl: "/perfumes/Coreterno_Break_The_Rules_2.webp",
        moodImageUrl: "/perfumes/Coreterno_Break_The_Rules_1.webp",
        images: JSON.stringify([
          "/perfumes/Coreterno_Break_The_Rules_2.webp",
          "/perfumes/Coreterno_Break_The_Rules_1.webp"
        ]),
        inStock: true,
      },
      {
        id: "38",
        name: "Coreterno Godimenta",
        description: "Divine and transcendent fragrance experience with spiritual elevation and celestial appeal",
        price: "715.00",
        category: "unisex",
        brand: "Coreterno",
        volume: "100ml",
        rating: "5.0",
        imageUrl: "/perfumes/Coreterno-_Believe_2.webp",
        moodImageUrl: "/perfumes/Coreterno-_Believe_1.webp",
        images: JSON.stringify([
          "/perfumes/Coreterno-_Believe_2.webp",
          "/perfumes/Coreterno-_Believe_1.webp"
        ]),
        inStock: true,
      },
      {
        id: "39",
        name: "Coreterno Hardkor",
        description: "Hardcore intensity for bold personalities with unapologetic strength and fierce character",
        price: "715.00",
        category: "unisex",
        brand: "Coreterno",
        volume: "100ml",
        rating: "4.8",
        imageUrl: "/perfumes/Coreterno_Break_The_Rules_2.webp",
        moodImageUrl: "/perfumes/Coreterno_Break_The_Rules_1.webp",
        images: JSON.stringify([
          "/perfumes/Coreterno_Break_The_Rules_2.webp",
          "/perfumes/Coreterno_Break_The_Rules_1.webp"
        ]),
        inStock: true,
      },
      {
        id: "40",
        name: "Coreterno Hierba Nera",
        description: "Dark herbal composition with mysterious allure and enigmatic sophistication",
        price: "715.00",
        category: "unisex",
        brand: "Coreterno",
        volume: "100ml",
        rating: "4.9",
        imageUrl: "/perfumes/Coreterno_Eau_De_Parfum_Discovery_Set_2.webp",
        moodImageUrl: "/perfumes/Coreterno_Eau_De_Parfum_Discovery_Set_1.webp",
        images: JSON.stringify([
          "/perfumes/Coreterno_Eau_De_Parfum_Discovery_Set_2.webp",
          "/perfumes/Coreterno_Eau_De_Parfum_Discovery_Set_1.webp"
        ]),
        inStock: true,
      },
      {
        id: "41",
        name: "Coreterno Night Idol",
        description: "Nocturnal fragrance for night-time adventures with seductive darkness and magnetic appeal",
        price: "715.00",
        category: "unisex",
        brand: "Coreterno",
        volume: "100ml",
        rating: "4.8",
        imageUrl: "/perfumes/BROOKLYN-NIGHT-1_001_CROP-1536x1536-1.webp",
        moodImageUrl: "/perfumes/BROOKLYN-NIGHT-2_001-1536x1152-1.webp",
        images: JSON.stringify([
          "/perfumes/BROOKLYN-NIGHT-1_001_CROP-1536x1536-1.webp",
          "/perfumes/BROOKLYN-NIGHT-2_001-1536x1152-1.webp"
        ]),
        inStock: true,
      },
      {
        id: "42",
        name: "Coreterno Punk Motel",
        description: "Edgy and unconventional fragrance with punk spirit and rebellious charm",
        price: "715.00",
        category: "unisex",
        brand: "Coreterno",
        volume: "100ml",
        rating: "4.7",
        imageUrl: "/perfumes/BROOKLYN-NIGHT-3_001_CROP-1536x1536-2.webp",
        moodImageUrl: "/perfumes/BROOKLYN-NIGHT_SHOWER-GEL-.webp",
        images: JSON.stringify([
          "/perfumes/BROOKLYN-NIGHT-3_001_CROP-1536x1536-2.webp",
          "/perfumes/BROOKLYN-NIGHT_SHOWER-GEL-.webp"
        ]),
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

  async getProductsByBrand(brand: string): Promise<Product[]> {
    // Convert filter brand to actual brand name
    const brandMap: { [key: string]: string } = {
      'rabdan': 'Rabdan',
      'signature-royale': 'Signature Royale',
      'pure-essence': 'Pure Essence',
      'coreterno': 'Coreterno',
      'valley-breezes': 'Valley Breezes'
    };
    
    const actualBrand = brandMap[brand] || brand;
    
    const result = Array.from(this.products.values()).filter(
      (product) => product.brand === actualBrand,
    );
    
    return result;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) {
      return this.getAllProducts();
    }

    return Array.from(this.products.values()).filter(
      (product) => {
        // Search in product name
        if (product.name.toLowerCase().includes(searchTerm)) {
          return true;
        }
        
        // Search in product description
        if (product.description.toLowerCase().includes(searchTerm)) {
          return true;
        }
        
        // Search in brand name
        if (product.brand.toLowerCase().includes(searchTerm)) {
          return true;
        }
        
        // Search in category
        if (product.category.toLowerCase().includes(searchTerm)) {
          return true;
        }
        
        return false;
      }
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      images: insertProduct.images ?? null,
      inStock: insertProduct.inStock ?? true
    };
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
      existingItem.quantity += insertCartItem.quantity ?? 1;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    }

    const id = randomUUID();
    const cartItem: CartItem = { 
      ...insertCartItem, 
      id,
      quantity: insertCartItem.quantity ?? 1
    };
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
