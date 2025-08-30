import Header from "@/components/header";
import Hero from "@/components/hero";
import ProductGrid from "@/components/product-grid";
import IngredientsShowcase from "@/components/ingredients-showcase";
import Footer from "@/components/footer";
import CartSidebar from "@/components/cart-sidebar";
import AuthModal from "@/components/auth-modal";
import SearchOverlay from "@/components/search-overlay";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <ProductGrid />
        <IngredientsShowcase />
      </main>
      <Footer />
      
      {/* Modals and Overlays */}
      <CartSidebar />
      <AuthModal />
      <SearchOverlay />
    </div>
  );
}
