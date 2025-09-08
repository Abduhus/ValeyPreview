import logoUrl from "@assets/valley-logo-gold-resized.png";
import { useLocation } from "wouter";

interface HeroProps {
  onOpenQuiz: () => void;
}

export default function Hero({ onOpenQuiz }: HeroProps) {
  const [, setLocation] = useLocation();
  
  const navigateToCatalog = () => {
    setLocation('/catalog');
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-32">
      <img 
        src={logoUrl}
        alt="Valley Breezes Logo"
        className="w-20 h-20 object-contain mb-6 rounded-lg logo-glow"
        style={{ 
          filter: 'drop-shadow(0 0 12px rgba(212, 175, 55, 0.4)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
          boxShadow: '0 8px 32px rgba(212, 175, 55, 0.2)'
        }}
      />
      
      <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-gradient mb-4">
        Valley Breezes
      </h1>
      <p className="font-arabic text-xl md:text-2xl text-gradient mb-4" dir="rtl">
        نسمات الوادي للعطور
      </p>
      <p className="text-lg md:text-xl text-foreground/85 max-w-2xl mb-6 leading-relaxed">
        Premium fragrance distributor offering authentic luxury perfumes at competitive prices.
        Explore our extensive catalog of renowned international brands.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 max-w-2xl text-center">
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-primary">42</div>
          <div className="text-sm text-muted-foreground">Products</div>
        </div>
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-primary">9+</div>
          <div className="text-sm text-muted-foreground">Brands</div>
        </div>
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-primary">100%</div>
          <div className="text-sm text-muted-foreground">Authentic</div>
        </div>
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-primary">24/7</div>
          <div className="text-sm text-muted-foreground">Support</div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={navigateToCatalog}
          className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-1"
          data-testid="button-explore-collection"
        >
          Browse Catalog
        </button>
        <button 
          onClick={onOpenQuiz}
          className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-1"
          data-testid="button-find-scent"
        >
          Find Your Scent
        </button>
      </div>
    </section>
  );
}
