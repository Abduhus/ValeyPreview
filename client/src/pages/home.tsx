import { useState } from "react";
import Header from "@/components/header";
import Hero from "@/components/hero";
import ProductGrid from "@/components/product-grid";
import IngredientsShowcase from "@/components/ingredients-showcase";
import Footer from "@/components/footer";
import CartSidebar from "@/components/cart-sidebar";
import AuthModal from "@/components/auth-modal";
import SearchOverlay from "@/components/search-overlay";

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Header 
        onToggleSearch={() => setIsSearchOpen(!isSearchOpen)}
        onToggleCart={() => setIsCartOpen(!isCartOpen)}
        onToggleAuth={() => setIsAuthOpen(!isAuthOpen)}
      />
      <main>
        <Hero />
        <ProductGrid />
        <IngredientsShowcase />
      </main>
      <Footer />
      
      {/* Modals and Overlays */}
      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
      <SearchOverlay 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
