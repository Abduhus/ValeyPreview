import logoUrl from "@assets/generated_images/Valley_Breezes_perfume_logo_1497af38.png";

export default function Hero() {
  const scrollToProducts = () => {
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-32">
      <img 
        src={logoUrl}
        alt="Valley Breezes Logo"
        className="w-16 h-16 object-contain mb-6"
      />
      
      <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-gradient mb-4">
        Valley Breezes
      </h1>
      <p className="font-arabic text-xl md:text-2xl text-gradient mb-6" dir="rtl">
        نسمات الوادي للعطور
      </p>
      <p className="text-lg md:text-xl text-foreground/85 max-w-2xl mb-8 leading-relaxed">
        Discover our curated collection of luxury fragrances, where each scent tells a story of elegance and sophistication.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={scrollToProducts}
          className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-1"
          data-testid="button-explore-collection"
        >
          Explore Collection
        </button>
        <button 
          className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          data-testid="button-create-account"
        >
          Create Account
        </button>
      </div>
    </section>
  );
}
