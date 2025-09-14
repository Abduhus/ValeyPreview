import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/header";
import ProductGrid from "@/components/product-grid";
import CurrencySelector from "@/components/currency-selector";
import Footer from "@/components/footer";
import CartSidebar from "@/components/cart-sidebar";
import AuthModal from "@/components/auth-modal";
import SearchOverlay from "@/components/search-overlay";

// Define the QuizResults interface
interface QuizResults {
  occasion: string;
  season: string;
  personality: string;
  intensity: string;
  notes: string;
  fragranceProfile: string;
  lifestyle: string;
}

// Map quiz answers to descriptive text
const answerDescriptions: Record<string, string> = {
  // Occasion
  "daily": "Daily Wear - For work and casual outings",
  "evening": "Evening Events - Perfect for dinner, parties, and dates",
  "special": "Special Occasions - Ideal for weddings and celebrations",
  "any": "Any Time - Versatile for all occasions",
  
  // Season
  "spring": "Spring - Fresh and light with blooming notes",
  "summer": "Summer - Citrusy and aquatic for energizing vibes",
  "autumn": "Autumn - Warm and spicy for cozy moments",
  "winter": "Winter - Rich and deep for comforting experiences",
  
  // Personality
  "romantic": "Romantic - Dreamy, soft, and feminine",
  "confident": "Confident - Bold, powerful, and assertive",
  "mysterious": "Mysterious - Enigmatic, alluring, and deep",
  "energetic": "Energetic - Vibrant, active, and fresh",
  
  // Intensity
  "subtle": "Subtle - Light and barely there",
  "moderate": "Moderate - Noticeable but not overpowering",
  "strong": "Strong - Bold and makes a statement",
  "intense": "Very Intense - Long-lasting with powerful projection",
  
  // Notes
  "floral": "Floral - Rose, jasmine, and lily notes",
  "citrus": "Citrus - Lemon, orange, and bergamot notes",
  "woody": "Woody - Sandalwood, cedar, and oak notes",
  "oriental": "Oriental - Vanilla, amber, and spices notes"
};

export default function QuizResultsPage() {
  const [location] = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<string[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
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

  // Get quiz results from localStorage on component mount
  useEffect(() => {
    const savedQuizResults = localStorage.getItem('quizResults');
    if (savedQuizResults) {
      try {
        const parsedResults = JSON.parse(savedQuizResults);
        setQuizResults(parsedResults);
        
        // Get recommended products from localStorage
        const savedRecommendedProducts = localStorage.getItem('recommendedProducts');
        if (savedRecommendedProducts) {
          setRecommendedProducts(JSON.parse(savedRecommendedProducts));
        }
      } catch (e) {
        console.error("Error parsing quiz results:", e);
      }
    } else {
      // If no quiz results, redirect to home
      window.location.href = '/';
    }
  }, []);

  // Update document title
  useEffect(() => {
    document.title = "Your Fragrance Recommendations - Valley Breezes";
  }, []);

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
        <section className="relative flex flex-col items-center justify-center text-center px-6 py-16 bg-gradient-to-br from-background/20 via-background/40 to-background/60">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-gradient mb-4">
              Your Personalized Fragrance Recommendations
            </h1>
            <p className="text-md text-foreground/85 max-w-2xl mx-auto mb-8 leading-relaxed">
              Based on your quiz answers, we've curated a selection of fragrances that perfectly match your preferences.
            </p>
            
            {/* Quiz Results Summary */}
            {quizResults && (
              <div className="bg-card/60 backdrop-blur-glass border border-primary/20 rounded-xl p-6 mb-8 text-left">
                <h2 className="font-serif text-xl font-bold text-primary mb-4">Your Fragrance Profile</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Preferences</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between border-b border-border/50 pb-2">
                        <span className="text-muted-foreground">Occasion:</span>
                        <span className="text-foreground">{answerDescriptions[quizResults.occasion] || quizResults.occasion}</span>
                      </li>
                      <li className="flex justify-between border-b border-border/50 pb-2">
                        <span className="text-muted-foreground">Season:</span>
                        <span className="text-foreground">{answerDescriptions[quizResults.season] || quizResults.season}</span>
                      </li>
                      <li className="flex justify-between border-b border-border/50 pb-2">
                        <span className="text-muted-foreground">Personality:</span>
                        <span className="text-foreground">{answerDescriptions[quizResults.personality] || quizResults.personality}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Characteristics</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between border-b border-border/50 pb-2">
                        <span className="text-muted-foreground">Intensity:</span>
                        <span className="text-foreground">{answerDescriptions[quizResults.intensity] || quizResults.intensity}</span>
                      </li>
                      <li className="flex justify-between border-b border-border/50 pb-2">
                        <span className="text-muted-foreground">Scent Family:</span>
                        <span className="text-foreground">{answerDescriptions[quizResults.notes] || quizResults.notes}</span>
                      </li>
                      <li className="flex justify-between border-b border-border/50 pb-2">
                        <span className="text-muted-foreground">Profile:</span>
                        <span className="text-foreground font-semibold">{quizResults.fragranceProfile}</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                  <h3 className="font-semibold text-primary mb-2">Lifestyle Match</h3>
                  <p className="text-foreground">{quizResults.lifestyle}</p>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-1"
              >
                Take Quiz Again
              </button>
              <button 
                onClick={() => window.location.href = '/catalog'}
                className="border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-1"
              >
                Browse All Products
              </button>
            </div>
          </div>
        </section>

        {/* Recommended Products Section */}
        <section className="px-6 py-12 bg-gradient-to-b from-background/30 to-background/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gradient mb-4">
                Recommended For You
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These fragrances have been carefully selected to match your unique preferences and lifestyle.
              </p>
            </div>
            
            {/* Product Grid with Recommended Products */}
            <ProductGrid 
              recommendedProductIds={recommendedProducts} 
              initialCategory="all"
              initialBrand="all"
              initialSearch=""
              currency={selectedCurrency}
              exchangeRate={exchangeRates[selectedCurrency]}
            />
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