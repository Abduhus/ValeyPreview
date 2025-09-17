import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CartSidebar from "@/components/cart-sidebar";
import AuthModal from "@/components/auth-modal";
import SearchOverlay from "@/components/search-overlay";
import PerfumeQuiz from "@/components/perfume-quiz";
import CurrencySelector from "@/components/currency-selector";

export default function ExclusiveCollections() {
  const [location] = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<string[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("AED");

  // Exchange rates (AED as base)
  const exchangeRates: { [key: string]: number } = {
    "AED": 1,
    "USD": 0.27,
    "SAR": 1.01,
    "BHD": 0.10,
    "OMR": 0.10,
    "GBP": 0.22
  };

  const collections = [
    {
      id: "ultra-premium",
      name: "Ultra Premium Collection",
      description: "The pinnacle of luxury fragrances featuring rare ingredients and master perfumer signatures",
      icon: "👑",
      productCount: 12,
      startingPrice: 2500,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&h=800&fit=crop&auto=format&q=90",
      features: ["Limited to 50 pieces worldwide", "Master perfumer signatures", "Rare natural ingredients", "Handcrafted bottles"],
      badge: "ULTRA EXCLUSIVE",
      badgeColor: "from-primary/80 to-accent/80"
    },
    {
      id: "limited-editions",
      name: "Limited Editions",
      description: "Seasonal releases and exclusive collaborations with renowned perfume houses",
      icon: "⭐",
      productCount: 8,
      startingPrice: 850,
      image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59db9?w=1200&h=800&fit=crop&auto=format&q=90",
      features: ["Seasonal collections", "Designer collaborations", "Limited production runs", "Collectible packaging"],
      badge: "LIMITED TIME",
      badgeColor: "from-red-500/80 to-red-600/80"
    },
    {
      id: "gift-sets",
      name: "Gift Sets",
      description: "Elegantly curated gift sets perfect for special occasions and celebrations",
      icon: "🎁",
      productCount: 25,
      startingPrice: 450,
      image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1200&h=800&fit=crop&auto=format&q=90",
      features: ["Luxury packaging", "Multiple fragrances", "Exclusive accessories", "Personal customization"],
      badge: "GIFT READY",
      badgeColor: "from-green-500/80 to-green-600/80"
    },
    {
      id: "vintage-collection",
      name: "Vintage Collection",
      description: "Timeless classics and discontinued treasures from legendary fragrance houses",
      icon: "🏛️",
      productCount: 15,
      startingPrice: 1200,
      image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=1200&h=800&fit=crop&auto=format&q=90",
      features: ["Discontinued classics", "Vintage formulations", "Historical significance", "Collector's value"],
      badge: "RARE FINDS",
      badgeColor: "from-amber-500/80 to-yellow-600/80"
    },
    {
      id: "artisan-collection",
      name: "Artisan Collection",
      description: "Handcrafted fragrances from independent perfumers and niche ateliers",
      icon: "🎨",
      productCount: 20,
      startingPrice: 680,
      image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1200&h=800&fit=crop&auto=format&q=90",
      features: ["Independent perfumers", "Handcrafted quality", "Unique compositions", "Small batch production"],
      badge: "ARTISAN MADE",
      badgeColor: "from-purple-500/80 to-indigo-600/80"
    },
    {
      id: "exclusive-blends",
      name: "Exclusive Blends",
      description: "Valley Breezes signature fragrances created exclusively for our discerning clientele",
      icon: "✨",
      productCount: 10,
      startingPrice: 950,
      image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=1200&h=800&fit=crop&auto=format&q=90",
      features: ["Valley Breezes exclusives", "Custom formulations", "Signature scents", "Personalized service"],
      badge: "VALLEY EXCLUSIVE",
      badgeColor: "from-primary/80 to-accent/80"
    }
  ];

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
        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-32 bg-gradient-to-br from-background/20 via-background/40 to-background/60">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=1920&h=1080&fit=crop&auto=format&q=90" 
              alt="Exclusive Collections Background" 
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/80"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-gradient mb-6">
              Exclusive Collections
            </h1>
            <p className="text-xl md:text-2xl text-foreground/85 max-w-3xl mx-auto mb-8 leading-relaxed">
              Discover our most prestigious and carefully curated fragrance collections, featuring rare gems, limited editions, and bespoke luxury experiences.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-3xl mx-auto">
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
                <div className="text-3xl font-bold text-primary">6</div>
                <div className="text-sm text-muted-foreground">Collections</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
                <div className="text-3xl font-bold text-primary">90+</div>
                <div className="text-sm text-muted-foreground">Fragrances</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Authentic</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
                <div className="text-3xl font-bold text-primary">VIP</div>
                <div className="text-sm text-muted-foreground">Service</div>
              </div>
            </div>
            
            <button 
              onClick={() => {
                const collectionsSection = document.getElementById("collections");
                if (collectionsSection) {
                  collectionsSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-10 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-1 text-lg"
            >
              Explore Collections
            </button>
          </div>
        </section>

        {/* Collections Grid */}
        <section id="collections" className="px-6 py-24 bg-gradient-to-b from-background/30 to-background/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-gradient mb-6">
                Our Exclusive Collections
              </h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
                Each collection represents the pinnacle of fragrance artistry, carefully curated for the most discerning enthusiasts.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className="group cursor-pointer transition-all duration-700 hover:-translate-y-4"
                >
                  <div className="relative h-96 bg-gradient-to-br from-card/80 via-background/60 to-card/70 backdrop-blur-lg border-2 border-primary/20 rounded-3xl overflow-hidden group-hover:shadow-2xl group-hover:shadow-primary/25 group-hover:border-primary/40 transition-all duration-700">
                    {/* Background Image */}
                    <img 
                      src={collection.image} 
                      alt={collection.name} 
                      className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-all duration-700 scale-105 group-hover:scale-100"
                    />
                    
                    {/* Enhanced Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-background/60 z-5"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-80 group-hover:opacity-100 transition-opacity duration-700 z-5"></div>
                    
                    {/* Content */}
                    <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                            <span className="text-xl">{collection.icon}</span>
                          </div>
                          <span className={`bg-gradient-to-r ${collection.badgeColor} text-white text-xs px-3 py-1.5 rounded-full font-semibold backdrop-blur-sm border border-primary/30 shadow-lg`}>
                            {collection.badge}
                          </span>
                        </div>
                        
                        <h3 className="font-serif text-xl md:text-2xl font-bold text-gradient mb-3 group-hover:scale-105 transition-transform duration-500 origin-left">
                          {collection.name}
                        </h3>
                        
                        <p className="text-foreground/90 mb-4 group-hover:text-foreground transition-colors duration-500 text-sm leading-relaxed">
                          {collection.description}
                        </p>
                        
                        <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                          {collection.features.slice(0, 2).map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="w-1 h-1 bg-primary rounded-full"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-foreground/70">
                          <div className="font-semibold text-primary">{collection.productCount} Fragrances</div>
                          <div>From د.إ {collection.startingPrice}</div>
                        </div>
                        <button className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-2.5 rounded-full font-semibold hover:shadow-xl hover:shadow-primary/30 transition-all duration-500 hover:scale-105 group-hover:-translate-y-1 text-sm">
                          <Link 
                            href={collection.id === 'ultra-premium' ? '/ultra-premium' : collection.id === 'limited-editions' ? '/limited-editions' : '/catalog'} 
                            className="text-decoration-none"
                          >
                            Explore
                          </Link>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-24 bg-gradient-to-b from-background/50 to-background/70">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-primary/10 via-card/50 to-accent/10 backdrop-blur-lg border border-primary/20 rounded-3xl p-12">
              <h3 className="font-serif text-3xl md:text-4xl font-bold text-gradient mb-6">
                Personalized Fragrance Consultation
              </h3>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                Our fragrance experts provide personalized consultations to help you discover your perfect scent from our exclusive collections. Book a private appointment for a bespoke fragrance experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-1">
                  Book Consultation
                </button>
                <button 
                  onClick={() => setIsQuizOpen(true)}
                  className="border border-primary text-primary px-8 py-4 rounded-full font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-1"
                >
                  Take Fragrance Quiz
                </button>
              </div>
            </div>
          </div>
        </section>
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
        onRecommendation={(productIds) => setRecommendedProducts(productIds)}
      />
    </div>
  );
}