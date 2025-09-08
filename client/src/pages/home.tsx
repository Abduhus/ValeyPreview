import { useState } from "react";
import Header from "@/components/header";
import Hero from "@/components/hero";
import BrandShowcase from "@/components/brand-showcase";
import CompanyStory from "@/components/company-story";
import BusinessContact from "@/components/business-contact";
import Footer from "@/components/footer";
import CartSidebar from "@/components/cart-sidebar";
import AuthModal from "@/components/auth-modal";
import SearchOverlay from "@/components/search-overlay";
import PerfumeQuiz from "@/components/perfume-quiz";

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Header 
        onToggleSearch={() => setIsSearchOpen(!isSearchOpen)}
        onToggleCart={() => setIsCartOpen(!isCartOpen)}
        onToggleAuth={() => setIsAuthOpen(!isAuthOpen)}
      />
      <main>
        <Hero onOpenQuiz={() => setIsQuizOpen(true)} />
        <BrandShowcase />
        <CompanyStory />
        <BusinessContact />
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
      <PerfumeQuiz 
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onRecommendation={() => {
          // Navigate to catalog page to show recommendations
          window.location.href = '/catalog';
        }}
      />
    </div>
  );
}
