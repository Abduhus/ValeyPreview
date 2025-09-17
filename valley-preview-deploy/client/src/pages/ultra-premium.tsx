import { useState } from "react";
import { useLocation, Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CartSidebar from "@/components/cart-sidebar";
import AuthModal from "@/components/auth-modal";
import SearchOverlay from "@/components/search-overlay";
import CurrencySelector from "@/components/currency-selector";
import { ChevronLeft, Star, Shield, Award, Crown } from "lucide-react";

export default function UltraPremiumCollection() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("AED");

  const premiumFragrances = [
    {
      id: "1",
      name: "Royal Oud Imperiale",
      brand: "Maison Francis Kurkdjian",
      price: 3850,
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=800&fit=crop&auto=format&q=90",
      description: "An exceptional oud composition featuring 30-year aged agarwood from Cambodia",
      notes: ["Cambodian Oud", "Rose Petals", "Saffron", "Ambergris"],
      limited: "Limited to 12 bottles worldwide",
      rating: 4.9,
      reviews: 8
    },
    {
      id: "2", 
      name: "Parfum de la Nuit Éternelle",
      brand: "Creed Private Collection",
      price: 4200,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=800&fit=crop&auto=format&q=90",
      description: "A masterpiece featuring rare Bulgarian rose and vintage sandalwood",
      notes: ["Bulgarian Rose", "Vintage Sandalwood", "White Truffle", "Madagascan Vanilla"],
      limited: "Limited to 25 bottles worldwide",
      rating: 4.8,
      reviews: 12
    },
    {
      id: "3",
      name: "Essence of Time",
      brand: "Tom Ford Private Blend",
      price: 2890,
      image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59db9?w=600&h=800&fit=crop&auto=format&q=90",
      description: "A sophisticated blend featuring rare iris from Florence and vintage patchouli",
      notes: ["Florentine Iris", "Vintage Patchouli", "Kashmir Wood", "Golden Amber"],
      limited: "Limited to 50 bottles worldwide",
      rating: 4.7,
      reviews: 18
    },
    {
      id: "4",
      name: "L'Élixir Mystique",
      brand: "Amouage Royal Collection",
      price: 5500,
      image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&h=800&fit=crop&auto=format&q=90",
      description: "The ultimate expression of luxury with royal frankincense and pure gold essence",
      notes: ["Royal Frankincense", "Pure Gold Essence", "Himalayan Musk", "Aged Cognac"],
      limited: "Limited to 10 bottles worldwide",
      rating: 5.0,
      reviews: 5
    }
  ];

  const benefits = [
    {
      icon: <Crown className="w-6 h-6" />,
      title: "Master Perfumer Signed",
      description: "Each bottle personally signed by the master perfumer"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Authenticity Guarantee",
      description: "Certificate of authenticity with unique serial number"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "VIP Service",
      description: "Personal fragrance consultant and priority access"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Collector's Edition",
      description: "Handcrafted bottles with premium materials"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header 
        onToggleSearch={() => setIsSearchOpen(!isSearchOpen)}
        onToggleCart={() => setIsCartOpen(!isCartOpen)}
        onToggleAuth={() => setIsAuthOpen(!isAuthOpen)}
      />
      
      {/* Currency Selector */}
      <div className="fixed top-20 right-6 z-40">
        <CurrencySelector 
          selectedCurrency={selectedCurrency}
          onCurrencyChange={setSelectedCurrency}
        />
      </div>
      
      <main>
        {/* Breadcrumb */}
        <div className="px-6 py-4 bg-card/20 border-b border-border">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/exclusive-collections" className="text-muted-foreground hover:text-primary transition-colors">Exclusive Collections</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-primary font-semibold">Ultra Premium Collection</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-br from-background/20 via-background/40 to-background/60">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=1920&h=1080&fit=crop&auto=format&q=90" 
              alt="Ultra Premium Collection" 
              className="w-full h-full object-cover opacity-15"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/80"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <Link href="/exclusive-collections" className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors mb-6">
              <ChevronLeft className="w-4 h-4" />
              Back to Collections
            </Link>
            
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-2xl">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <span className="bg-gradient-to-r from-primary/80 to-accent/80 text-white text-sm px-4 py-2 rounded-full font-semibold backdrop-blur-sm border border-primary/30 shadow-lg">
                ULTRA EXCLUSIVE
              </span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-gradient mb-6">
              Ultra Premium Collection
            </h1>
            <p className="text-xl md:text-2xl text-foreground/85 max-w-3xl mx-auto mb-8 leading-relaxed">
              The pinnacle of luxury fragrances featuring rare ingredients, master perfumer signatures, and centuries-old craftsmanship. Each piece is a work of art, limited to the most discerning collectors worldwide.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-3xl mx-auto">
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
                <div className="text-3xl font-bold text-primary">4</div>
                <div className="text-sm text-muted-foreground">Exclusive Fragrances</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
                <div className="text-3xl font-bold text-primary">97</div>
                <div className="text-sm text-muted-foreground">Available Now</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Authentic</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
                <div className="text-3xl font-bold text-primary">Premium</div>
                <div className="text-sm text-muted-foreground">Quality</div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="px-6 py-16 bg-gradient-to-b from-background/30 to-background/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gradient text-center mb-12">
              Ultra Premium Experience
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-xl text-white">
                    {benefit.icon}
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-gradient mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fragrances Grid */}
        <section className="px-6 py-24 bg-gradient-to-b from-background/50 to-background/70">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-gradient mb-6">
                Exclusive Fragrances
              </h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
                Each fragrance in our Ultra Premium Collection represents the absolute pinnacle of perfumery art, featuring the rarest ingredients and master craftsmanship.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
              {premiumFragrances.map((fragrance) => (
                <div
                  key={fragrance.id}
                  className="group cursor-pointer transition-all duration-700 hover:-translate-y-4"
                >
                  <div className="relative bg-gradient-to-br from-card/80 via-background/60 to-card/70 backdrop-blur-lg border-2 border-primary/20 rounded-3xl overflow-hidden group-hover:shadow-2xl group-hover:shadow-primary/25 group-hover:border-primary/40 transition-all duration-700">
                    
                    <div className="flex flex-col lg:flex-row">
                      {/* Image Section */}
                      <div className="lg:w-1/2 relative h-64 lg:h-80">
                        <img 
                          src={fragrance.image} 
                          alt={fragrance.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent"></div>
                        
                        {/* Rating Badge */}
                        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {fragrance.rating} ({fragrance.reviews})
                        </div>
                      </div>
                      
                      {/* Content Section */}
                      <div className="lg:w-1/2 p-8">
                        <div className="mb-4">
                          <span className="text-primary text-sm font-semibold uppercase tracking-wider">{fragrance.brand}</span>
                          <h3 className="font-serif text-2xl font-bold text-gradient mb-2 group-hover:scale-105 transition-transform duration-500 origin-left">
                            {fragrance.name}
                          </h3>
                        </div>
                        
                        <p className="text-foreground/90 mb-4 text-sm leading-relaxed">
                          {fragrance.description}
                        </p>
                        
                        <div className="mb-4">
                          <h4 className="font-semibold text-primary mb-2 text-sm">Key Notes:</h4>
                          <div className="flex flex-wrap gap-2">
                            {fragrance.notes.map((note, index) => (
                              <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                                {note}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <p className="text-amber-600 text-xs font-semibold mb-2">{fragrance.limited}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-primary">د.إ {fragrance.price.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Exclusive Price</div>
                          </div>
                          <button className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-3 rounded-full font-semibold hover:shadow-xl hover:shadow-primary/30 transition-all duration-500 hover:scale-105 group-hover:-translate-y-1">
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Shopping Section */}
        <section className="px-6 py-24 bg-gradient-to-b from-background/70 to-background/90">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-primary/10 via-card/50 to-accent/10 backdrop-blur-lg border border-primary/20 rounded-3xl p-12">
              <Crown className="w-16 h-16 text-primary mx-auto mb-6" />
              <h3 className="font-serif text-3xl md:text-4xl font-bold text-gradient mb-6">
                Experience Ultra Premium Quality
              </h3>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                Our fragrance experts are available to provide detailed information about each Ultra Premium fragrance and assist with your selection process.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-1">
                  Shop Ultra Premium
                </button>
                <button className="border border-primary text-primary px-8 py-4 rounded-full font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-1">
                  Contact Our Experts
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
    </div>
  );
}