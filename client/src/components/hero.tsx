export default function Hero() {
  const scrollToProducts = () => {
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-32">
      <svg 
        className="w-16 h-16 text-primary mb-6" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="1.2" 
          d="M18.5 11.5H5.5C4.94772 11.5 4.5 11.9477 4.5 12.5V19C4.5 20.3807 5.61929 21.5 7 21.5H17C18.3807 21.5 19.5 20.3807 19.5 19V12.5C19.5 11.9477 19.0523 11.5 18.5 11.5Z"
        />
      </svg>
      
      <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-gradient mb-4">
        Valley Breezes
      </h1>
      <p className="font-arabic text-xl md:text-2xl text-gradient mb-6" dir="rtl">
        عطور وادي النسائم
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
