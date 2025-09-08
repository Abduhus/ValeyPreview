import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/header";
import ProductGrid from "@/components/product-grid";
import CurrencySelector from "@/components/currency-selector";
import Footer from "@/components/footer";
import CartSidebar from "@/components/cart-sidebar";
import AuthModal from "@/components/auth-modal";
import SearchOverlay from "@/components/search-overlay";
import PerfumeQuiz from "@/components/perfume-quiz";

export default function Catalog() {
  const [location] = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<string[]>([]);
  const [initialCategory, setInitialCategory] = useState<string>("all");
  const [initialBrand, setInitialBrand] = useState<string>("all");
  const [initialSearch, setInitialSearch] = useState<string>("");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("AED");

  // Enhanced currency persistence across refreshes
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency && ['AED', 'USD', 'SAR', 'BHD', 'OMR', 'GBP'].includes(savedCurrency)) {
      setSelectedCurrency(savedCurrency);
    }
  }, []);
  
  // Save currency selection
  useEffect(() => {
    localStorage.setItem('selectedCurrency', selectedCurrency);
  }, [selectedCurrency]);

  // Exchange rates (AED as base)
  const exchangeRates: { [key: string]: number } = {
    "AED": 1,
    "USD": 0.27,
    "SAR": 1.01,
    "BHD": 0.10,
    "OMR": 0.10,
    "GBP": 0.22
  };

  // Update document title and meta for better SEO and refresh handling
  useEffect(() => {
    const updatePageMeta = () => {
      let title = "Premium Fragrances Catalog - Valley Breezes";
      let description = "Discover our complete collection of luxury perfumes from prestigious brands";
      
      if (initialSearch) {
        title = `Search: ${initialSearch} - Valley Breezes`;
        description = `Search results for "${initialSearch}" in our premium fragrance collection`;
      } else if (initialCategory !== 'all') {
        title = `${initialCategory.charAt(0).toUpperCase() + initialCategory.slice(1)} Fragrances - Valley Breezes`;
        description = `Explore our ${initialCategory} fragrance collection with premium perfumes`;
      } else if (initialBrand !== 'all') {
        title = `${initialBrand} Perfumes - Valley Breezes`;
        description = `Discover ${initialBrand} luxury fragrances and premium perfumes`;
      }
      
      document.title = title;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }
    };
    
    updatePageMeta();
  }, [initialCategory, initialBrand, initialSearch]);

  // Enhanced refresh handling with scroll position and complete state preservation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const brand = urlParams.get('brand');
    const search = urlParams.get('search');
    const scrollY = sessionStorage.getItem('catalogScrollY');
    
    // Preserve URL parameters on refresh
    if (category && ['women', 'men', 'unisex'].includes(category)) {
      setInitialCategory(category);
    }
    
    // Validate brand parameter to ensure it's a supported brand
    const supportedBrands = ['all', 'rabdan', 'signature-royale', 'pure-essence', 'coreterno', 'valley-breezes'];
    if (brand && supportedBrands.includes(brand)) {
      setInitialBrand(brand);
    } else if (brand) {
      // If brand is not supported, reset to 'all'
      setInitialBrand('all');
      // Update URL to remove invalid brand parameter
      const newUrlParams = new URLSearchParams(window.location.search);
      newUrlParams.delete('brand');
      const newUrl = newUrlParams.toString() ? `/catalog?${newUrlParams.toString()}` : '/catalog';
      window.history.replaceState({}, '', newUrl);
    }
    
    if (search) {
      setInitialSearch(search);
    }
    
    // Restore scroll position after a short delay to allow content to load
    if (scrollY) {
      setTimeout(() => {
        window.scrollTo({ top: parseInt(scrollY), behavior: 'auto' });
        sessionStorage.removeItem('catalogScrollY');
      }, 100);
    }

    // Enhanced browser history state management
    const handlePopState = (event: PopStateEvent) => {
      const currentParams = new URLSearchParams(window.location.search);
      const newCategory = currentParams.get('category');
      const newBrand = currentParams.get('brand');
      const newSearch = currentParams.get('search');
      
      setInitialCategory(newCategory || 'all');
      
      // Validate brand parameter for popstate as well
      if (newBrand && supportedBrands.includes(newBrand)) {
        setInitialBrand(newBrand);
      } else {
        setInitialBrand('all');
      }
      
      setInitialSearch(newSearch || '');
    };
    
    // Store scroll position before page refresh/navigation
    const handleBeforeUnload = () => {
      sessionStorage.setItem('catalogScrollY', window.scrollY.toString());
    };
    
    // Enhanced visibility change handling for better refresh experience
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sessionStorage.setItem('catalogScrollY', window.scrollY.toString());
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location]);

  return (
    <div className="min-h-screen">
      <Header 
        onToggleSearch={() => setIsSearchOpen(!isSearchOpen)}
        onToggleCart={() => setIsCartOpen(!isCartOpen)}
        onToggleAuth={() => setIsAuthOpen(!isAuthOpen)}
      />
      
      {/* Currency Selector - Top Right */}
      <div className="fixed top-20 right-6 z-40">
        <CurrencySelector 
          selectedCurrency={selectedCurrency}
          onCurrencyChange={setSelectedCurrency}
        />
      </div>
      
      <main>
        {/* Minimized Page Header */}
        <section className="relative flex flex-col items-center justify-center text-center px-6 py-12 bg-gradient-to-b from-background/20 to-background/30">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-gradient mb-4">
              Premium Fragrances Catalog
            </h1>
            <p className="text-md text-foreground/85 max-w-2xl mx-auto mb-6 leading-relaxed">
              Discover our complete collection of luxury perfumes from prestigious brands.
            </p>
            
            {/* Compact Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              <button 
                onClick={() => setIsQuizOpen(true)}
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-1 text-sm"
              >
                Find Your Scent
              </button>
              <button 
                onClick={() => {
                  const productsSection = document.getElementById("products");
                  if (productsSection) {
                    productsSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="border border-primary text-primary px-6 py-2 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-1 text-sm"
              >
                Browse Products
              </button>
            </div>

            {/* Compact Key Features */}
            <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
              <div className="bg-card/40 backdrop-blur-sm border border-border rounded-lg p-3">
                <div className="text-lg font-bold text-primary">42</div>
                <div className="text-xs text-muted-foreground">Products</div>
              </div>
              <div className="bg-card/40 backdrop-blur-sm border border-border rounded-lg p-3">
                <div className="text-lg font-bold text-primary">9+</div>
                <div className="text-xs text-muted-foreground">Brands</div>
              </div>
              <div className="bg-card/40 backdrop-blur-sm border border-border rounded-lg p-3">
                <div className="text-lg font-bold text-primary">100%</div>
                <div className="text-xs text-muted-foreground">Authentic</div>
              </div>
              <div className="bg-card/40 backdrop-blur-sm border border-border rounded-lg p-3">
                <div className="text-lg font-bold text-primary">24/7</div>
                <div className="text-xs text-muted-foreground">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <ProductGrid 
          recommendedProductIds={recommendedProducts} 
          initialCategory={initialCategory}
          initialBrand={initialBrand}
          initialSearch={initialSearch}
          currency={selectedCurrency}
          exchangeRate={exchangeRates[selectedCurrency]}
        />
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
        onRecommendation={(productIds) => {
          console.log("Recommended products:", productIds); // Debug log
          setRecommendedProducts(productIds);
        }}
      />
    </div>
  );
}