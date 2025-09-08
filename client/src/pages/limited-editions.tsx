import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CartSidebar from "@/components/cart-sidebar";
import AuthModal from "@/components/auth-modal";
import SearchOverlay from "@/components/search-overlay";
import CurrencySelector from "@/components/currency-selector";
import { ChevronLeft, Clock, Sparkles, Calendar, Gift } from "lucide-react";

export default function LimitedEditions() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("AED");

  const limitedEditions = [
    {
      id: "1",
      name: "Winter Solstice 2024",
      brand: "Maison Francis Kurkdjian",
      price: 1250,
      originalPrice: 1450,
      image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59db9?w=600&h=800&fit=crop&auto=format&q=90",
      description: "A captivating winter fragrance featuring snow-kissed pine and crystalline musk",
      notes: ["Snow Pine", "Crystalline Musk", "White Tea", "Frosted Bergamot"],
      availableUntil: "March 31, 2024",
      remaining: 23,
      totalProduced: 100,
      season: "Winter Limited",
      isNew: true
    },
    {
      id: "2",
      name: "Rose Garden Anniversary",
      brand: "Tom Ford Private Blend",
      price: 980,
      originalPrice: 1180,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=800&fit=crop&auto=format&q=90",
      description: "Celebrating 10 years with a magnificent rose composition from Bulgarian gardens",
      notes: ["Bulgarian Rose", "Peony Petals", "Green Stems", "Velvet Musk"],
      availableUntil: "June 15, 2024",
      remaining: 8,
      totalProduced: 50,
      season: "Anniversary Edition",
      isNew: false
    },
    {
      id: "3",
      name: "Desert Mirage Collection",
      brand: "Amouage",
      price: 1680,
      originalPrice: 1950,
      image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&h=800&fit=crop&auto=format&q=90",
      description: "Inspired by the mystical beauty of Arabian deserts at twilight",
      notes: ["Desert Rose", "Oud Mirage", "Sand Verbena", "Twilight Amber"],
      availableUntil: "August 20, 2024",
      remaining: 35,
      totalProduced: 75,
      season: "Summer Special",
      isNew: true
    },
    {
      id: "4",
      name: "Midnight in Tokyo",
      brand: "Yves Saint Laurent",
      price: 850,
      originalPrice: 1050,
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=800&fit=crop&auto=format&q=90",
      description: "A modern oriental fragrance capturing the energy of Tokyo's neon-lit nights",
      notes: ["Black Tea", "Neon Yuzu", "Steel Accord", "Urban Moss"],
      availableUntil: "December 31, 2024",
      remaining: 42,
      totalProduced: 120,
      season: "Urban Limited",
      isNew: false
    }
  ];

  const getUrgencyColor = (remaining: number, total: number) => {
    const percentage = (remaining / total) * 100;
    if (percentage <= 20) return "text-red-500";
    if (percentage <= 50) return "text-amber-500";
    return "text-green-500";
  };

  const getUrgencyBg = (remaining: number, total: number) => {
    const percentage = (remaining / total) * 100;
    if (percentage <= 20) return "bg-red-500/20 border-red-500/30";
    if (percentage <= 50) return "bg-amber-500/20 border-amber-500/30";
    return "bg-green-500/20 border-green-500/30";
  };

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
            <span className="text-primary font-semibold">Limited Editions</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-br from-background/20 via-background/40 to-background/60">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1588405748880-12d1d2a59db9?w=1920&h=1080&fit=crop&auto=format&q=90" 
              alt="Limited Editions" 
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
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center shadow-2xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <span className="bg-gradient-to-r from-red-500/80 to-red-600/80 text-white text-sm px-4 py-2 rounded-full font-semibold backdrop-blur-sm border border-red-400/30 shadow-lg animate-pulse">
                LIMITED TIME
              </span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-gradient mb-6">
              Limited Editions
            </h1>
            <p className="text-xl md:text-2xl text-foreground/85 max-w-3xl mx-auto mb-8 leading-relaxed">
              Seasonal releases and exclusive collaborations with renowned perfume houses. Each bottle tells a unique story and captures a moment in time.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-3xl mx-auto">
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
                <div className="text-3xl font-bold text-primary">4</div>
                <div className="text-sm text-muted-foreground">Current Releases</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
                <div className="text-3xl font-bold text-primary">108</div>
                <div className="text-sm text-muted-foreground">Bottles Remaining</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
                <div className="text-3xl font-bold text-primary">345</div>
                <div className="text-sm text-muted-foreground">Total Produced</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
                <div className="text-3xl font-bold text-primary">Time</div>
                <div className="text-sm text-muted-foreground">Limited</div>
              </div>
            </div>
          </div>
        </section>

        {/* Limited Editions Grid */}
        <section className="px-6 py-24 bg-gradient-to-b from-background/30 to-background/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-gradient mb-6">
                Available Now
              </h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
                Don't miss these exclusive fragrances. Once they're gone, they're gone forever.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {limitedEditions.map((edition) => (
                <div
                  key={edition.id}
                  className="group cursor-pointer transition-all duration-700 hover:-translate-y-4"
                >
                  <div className="relative bg-gradient-to-br from-card/80 via-background/60 to-card/70 backdrop-blur-lg border-2 border-primary/20 rounded-3xl overflow-hidden group-hover:shadow-2xl group-hover:shadow-primary/25 group-hover:border-primary/40 transition-all duration-700">
                    
                    <div className="flex flex-col lg:flex-row">
                      {/* Image Section */}
                      <div className="lg:w-1/2 relative h-64 lg:h-80">
                        <img 
                          src={edition.image} 
                          alt={edition.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent"></div>
                        
                        {/* Status Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {edition.isNew && (
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              NEW
                            </span>
                          )}
                          <span className={`${getUrgencyBg(edition.remaining, edition.totalProduced)} backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold border`}>
                            {edition.remaining} Left
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-black/50 backdrop-blur-sm rounded-full p-2">
                            <div className="bg-white/20 rounded-full h-2 mb-1">
                              <div 
                                className={`h-full rounded-full ${edition.remaining <= edition.totalProduced * 0.2 ? 'bg-red-500' : edition.remaining <= edition.totalProduced * 0.5 ? 'bg-amber-500' : 'bg-green-500'}`}
                                style={{ width: `${(edition.remaining / edition.totalProduced) * 100}%` }}
                              ></div>
                            </div>
                            <div className="text-white text-xs font-semibold">
                              {Math.round((edition.remaining / edition.totalProduced) * 100)}% Available
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Content Section */}
                      <div className="lg:w-1/2 p-8">
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-primary text-sm font-semibold uppercase tracking-wider">{edition.brand}</span>
                            <span className="bg-accent/20 text-accent px-2 py-1 rounded-full text-xs font-medium">
                              {edition.season}
                            </span>
                          </div>
                          <h3 className="font-serif text-2xl font-bold text-gradient mb-2 group-hover:scale-105 transition-transform duration-500 origin-left">
                            {edition.name}
                          </h3>
                        </div>
                        
                        <p className="text-foreground/90 mb-4 text-sm leading-relaxed">
                          {edition.description}
                        </p>
                        
                        <div className="mb-4">
                          <h4 className="font-semibold text-primary mb-2 text-sm">Key Notes:</h4>
                          <div className="flex flex-wrap gap-2">
                            {edition.notes.map((note, index) => (
                              <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                                {note}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mb-6 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-amber-500" />
                            <span className="text-foreground/70">Available until: <span className="font-semibold text-amber-500">{edition.availableUntil}</span></span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Gift className="w-4 h-4 text-primary" />
                            <span className="text-foreground/70">Production: <span className="font-semibold">{edition.totalProduced} bottles total</span></span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-primary">د.إ {edition.price.toLocaleString()}</span>
                              <span className="text-lg text-muted-foreground line-through">د.إ {edition.originalPrice.toLocaleString()}</span>
                            </div>
                            <div className="text-xs text-green-600 font-semibold">
                              Save د.إ {(edition.originalPrice - edition.price).toLocaleString()}
                            </div>
                          </div>
                          <button className="bg-gradient-to-r from-accent to-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:shadow-xl hover:shadow-accent/30 transition-all duration-500 hover:scale-105 group-hover:-translate-y-1">
                            Reserve Now
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

        {/* Newsletter Signup */}
        <section className="px-6 py-24 bg-gradient-to-b from-background/50 to-background/70">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-primary/10 via-card/50 to-accent/10 backdrop-blur-lg border border-primary/20 rounded-3xl p-12">
              <Calendar className="w-16 h-16 text-primary mx-auto mb-6" />
              <h3 className="font-serif text-3xl md:text-4xl font-bold text-gradient mb-6">
                Never Miss a Limited Edition
              </h3>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                Be the first to know about new limited edition releases, exclusive previews, and early access opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-background/50 border border-primary/30 rounded-full px-6 py-3 text-foreground flex-1 focus:outline-none focus:border-primary transition-colors"
                />
                <button className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-1 whitespace-nowrap">
                  Subscribe
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