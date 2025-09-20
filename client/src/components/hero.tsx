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
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-32 bg-gradient-to-b from-background/90 to-background/70">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2175&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        <img 
          src={logoUrl}
          alt="Valley Breezes Logo"
          className="w-24 h-24 object-contain mb-8 rounded-lg logo-glow float-animation"
          style={{ 
            filter: 'drop-shadow(0 0 16px rgba(212, 175, 55, 0.6)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4))',
            boxShadow: '0 12px 40px rgba(212, 175, 55, 0.3)'
          }}
        />
        
        <h1 className="luxury-heading font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-gradient-smooth mb-6">
          Valley Breezes
        </h1>
        <div className="luxury-divider mx-auto max-w-xs"></div>
        <p className="font-arabic text-xl md:text-2xl text-gradient mb-6" dir="rtl">
          نسمات الوادي للعطور
        </p>
        <p className="text-lg md:text-xl text-foreground/85 max-w-2xl mb-10 leading-relaxed glass-effect rounded-xl p-6 mx-auto">
          Premium fragrance distributor offering authentic luxury perfumes at competitive prices.
          Explore our extensive catalog of renowned international brands.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-2xl mx-auto text-center">
          <div className="luxury-card glass-effect">
            <div className="text-3xl font-bold text-primary gold-accent">42</div>
            <div className="text-sm text-muted-foreground">Products</div>
          </div>
          <div className="luxury-card glass-effect">
            <div className="text-3xl font-bold text-primary gold-accent">9+</div>
            <div className="text-sm text-muted-foreground">Brands</div>
          </div>
          <div className="luxury-card glass-effect">
            <div className="text-3xl font-bold text-primary gold-accent">100%</div>
            <div className="text-sm text-muted-foreground">Authentic</div>
          </div>
          <div className="luxury-card glass-effect">
            <div className="text-3xl font-bold text-primary gold-accent">24/7</div>
            <div className="text-sm text-muted-foreground">Support</div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button 
            onClick={navigateToCatalog}
            className="luxury-button px-8 py-4 rounded-lg font-semibold text-lg hover:-translate-y-1"
            data-testid="button-explore-collection"
          >
            Browse Catalog
          </button>
          <button 
            onClick={onOpenQuiz}
            className="luxury-button px-8 py-4 rounded-lg font-semibold text-lg hover:-translate-y-1 bg-gradient-to-r from-secondary to-secondary/80"
            data-testid="button-find-scent"
          >
            Find Your Scent
          </button>
        </div>
      </div>
    </section>
  );
}