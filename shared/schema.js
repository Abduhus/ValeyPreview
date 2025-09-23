import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
export const users = pgTable("users", {
    id: varchar("id").primaryKey().default(sql `gen_random_uuid()`),
    username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
});
export const products = pgTable("products", {
    id: varchar("id").primaryKey().default(sql `gen_random_uuid()`),
    name: text("name").notNull(),
    description: text("description").notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    category: text("category").notNull(),
    brand: text("brand").notNull(),
    volume: text("volume").notNull(),
    rating: decimal("rating", { precision: 2, scale: 1 }).notNull(),
    imageUrl: text("image_url").notNull(),
    moodImageUrl: text("mood_image_url").notNull(),
    images: text("images"),
    inStock: boolean("in_stock").notNull().default(true),
    topNotes: text("top_notes"),
    middleNotes: text("middle_notes"),
    baseNotes: text("base_notes"),
});
export const cartItems = pgTable("cart_items", {
    id: varchar("id").primaryKey().default(sql `gen_random_uuid()`),
    sessionId: text("session_id").notNull(),
    productId: varchar("product_id").notNull().references(() => products.id),
    quantity: integer("quantity").notNull().default(1),
});
export const insertUserSchema = createInsertSchema(users).omit({
    id: true,
});
export const insertProductSchema = createInsertSchema(products).omit({
    id: true,
});
export const insertCartItemSchema = createInsertSchema(cartItems).omit({
    id: true,
});
//# sourceMappingURL=schema.js.map