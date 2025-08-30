import { Product } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isAdding } = useCart();

  const handleAddToCart = () => {
    addToCart({ productId: product.id, quantity: 1 });
  };

  const renderStars = (rating: string) => {
    const ratingNumber = parseFloat(rating);
    const fullStars = Math.floor(ratingNumber);
    const hasHalfStar = ratingNumber % 1 !== 0;
    
    return (
      <span className="text-primary">
        {"★".repeat(fullStars)}
        {hasHalfStar && "☆"}
        {"☆".repeat(5 - Math.ceil(ratingNumber))}
      </span>
    );
  };

  return (
    <div 
      className="product-card-hover filter-transition bg-card border border-border rounded-lg p-6 text-center"
      data-testid={`card-product-${product.id}`}
    >
      <div className="relative w-full h-72 rounded-lg overflow-hidden mb-4">
        <img 
          src={product.moodImageUrl} 
          alt={`${product.name} mood`} 
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="absolute inset-0 w-full h-full object-contain p-5 transition-opacity duration-300 hover:opacity-100 opacity-80 z-10"
          data-testid={`img-product-${product.id}`}
        />
      </div>
      
      <h3 
        className="font-serif text-xl font-semibold text-foreground mb-2"
        data-testid={`text-product-name-${product.id}`}
      >
        {product.name}
      </h3>
      
      <div className="flex justify-center mb-2" data-testid={`rating-product-${product.id}`}>
        {renderStars(product.rating)}
      </div>
      
      <div className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
        {product.category} • {product.volume}
      </div>
      
      <p 
        className="text-muted-foreground text-sm mb-4 min-h-[2.5rem]"
        data-testid={`text-product-description-${product.id}`}
      >
        {product.description}
      </p>
      
      <div className="flex items-center justify-between">
        <span 
          className="text-primary font-semibold text-lg"
          data-testid={`text-price-${product.id}`}
        >
          ${product.price}
        </span>
        <button 
          onClick={handleAddToCart}
          disabled={isAdding || !product.inStock}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid={`button-add-cart-${product.id}`}
        >
          {isAdding ? "Adding..." : product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}
