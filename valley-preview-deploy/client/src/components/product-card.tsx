import { Product } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import aedLogoUrl from "@assets/UAE_Dirham_Symbol.svg.png";

interface ProductCardProps {
  product: Product;
  isRecommended?: boolean;
  currency?: string;
  exchangeRate?: number;
  // Add similar products prop for size selection
  similarProducts?: Product[];
}

export default function ProductCard({ 
  product, 
  isRecommended = false, 
  currency = "AED", 
  exchangeRate = 1,
  similarProducts = []
}: ProductCardProps) {
  const { addToCart, isAdding } = useCart();
  const [, setLocation] = useLocation();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Add state for selected size
  const [selectedSize, setSelectedSize] = useState<Product>(product);
  
  // Touch handling state
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const touchAreaRef = useRef<HTMLDivElement>(null);
  
  // Reset image index when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product.id]);
  
  // Update selected size when product changes
  useEffect(() => {
    setSelectedSize(product);
  }, [product]);
  
  // Parse additional images from the product
  const additionalImages = selectedSize.images ? JSON.parse(selectedSize.images) : [];
  
  // Create a Set to track unique images and preserve order
  const uniqueImages = new Set<string>();
  
  // Add main images first (they should be displayed first in carousel)
  if (selectedSize.imageUrl) uniqueImages.add(selectedSize.imageUrl);
  if (selectedSize.moodImageUrl) uniqueImages.add(selectedSize.moodImageUrl);
  
  // Add additional images, avoiding duplicates
  additionalImages.forEach((img: string) => {
    if (img) uniqueImages.add(img);
  });
  
  // Convert Set back to array
  const allImages = Array.from(uniqueImages);
  
  // Function to get higher quality image paths where available
  const getHighQualityImagePath = (imagePath: string): string => {
    // For Rabdan images with -300x300 suffix, try to find higher quality versions
    if (imagePath.includes('-300x300')) {
      // Try removing the -300x300 suffix to get full size
      const fullPath = imagePath.replace('-300x300', '');
      return fullPath;
    }
    
    // For other images, return as is
    return imagePath;
  };

  // Map all images to potentially higher quality versions
  const highQualityImages = allImages.map(getHighQualityImagePath);

  // Generate fragrance notes based on product name and description
  const generateFragranceNotes = (name: string, description: string) => {
    const topNotes = [];
    const middleNotes = [];
    const baseNotes = [];

    if (name.toLowerCase().includes("ginger")) {
      topNotes.push("Ginger", "Lemon", "Pink Pepper");
      middleNotes.push("Cardamom", "Cinnamon");
      baseNotes.push("Amber", "Sandalwood");
    } else if (name.toLowerCase().includes("cigar") || name.toLowerCase().includes("honey")) {
      topNotes.push("Honey", "Bergamot", "Orange");
      middleNotes.push("Tobacco", "Cinnamon", "Rose");
      baseNotes.push("Vanilla", "Amber", "Leather");
    } else if (name.toLowerCase().includes("hibiscus")) {
      topNotes.push("Hibiscus", "Peach", "Mandarin");
      middleNotes.push("Jasmine", "Rose", "Lily");
      baseNotes.push("Musk", "Cedarwood", "Vanilla");
    } else if (name.toLowerCase().includes("oud")) {
      topNotes.push("Rose", "Saffron", "Bergamot");
      middleNotes.push("Oud", "Sandalwood", "Patchouli");
      baseNotes.push("Amber", "Musk", "Vanilla");
    } else if (name.toLowerCase().includes("vetiver")) {
      topNotes.push("Vetiver", "Lemon", "Green Leaves");
      middleNotes.push("Cedarwood", "Lavender");
      baseNotes.push("Sandalwood", "Musk");
    } else {
      // Default sophisticated notes
      topNotes.push("Bergamot", "Mandarin", "Pink Pepper");
      middleNotes.push("Rose", "Jasmine", "Geranium");
      baseNotes.push("Sandalwood", "Musk", "Amber");
    }

    return { topNotes, middleNotes, baseNotes };
  };

  // Use authentic fragrance notes if available, otherwise generate them
  const fragranceNotes = selectedSize.topNotes && selectedSize.middleNotes && selectedSize.baseNotes
    ? {
        topNotes: selectedSize.topNotes.split(',').map(note => note.trim()),
        middleNotes: selectedSize.middleNotes.split(',').map(note => note.trim()),
        baseNotes: selectedSize.baseNotes.split(',').map(note => note.trim())
      }
    : generateFragranceNotes(selectedSize.name, selectedSize.description);

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchEnd(null);
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchEnd({
      x: touch.clientX,
      y: touch.clientY,
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > 50 && Math.abs(distanceY) < 100;
    const isRightSwipe = distanceX < -50 && Math.abs(distanceY) < 100;
    
    if (isLeftSwipe) {
      // Swipe left - go to next image
      handleImageNextSwipe();
    } else if (isRightSwipe) {
      // Swipe right - go to previous image
      handleImagePrevSwipe();
    }
  };

  const handleImageNextSwipe = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };
  
  const handleImagePrevSwipe = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleImageNext = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking image buttons
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };
  
  const handleImagePrev = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking image buttons
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking add to cart
    addToCart({ productId: selectedSize.id, quantity: selectedQuantity });
  };

  const handleCardClick = () => {
    setLocation(`/product/${selectedSize.id}`);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking buttons
  };

  const formatPrice = (price: string) => {
    const numericPrice = parseFloat(price) * exchangeRate;
    const currencySymbols: { [key: string]: string } = {
      "AED": "AED",
      "USD": "$",
      "SAR": "SAR",
      "BHD": "د.ب",
      "OMR": "ر.ع",
      "GBP": "£"
    };
    
    if (currency === "AED") {
      return (
        <span className="flex items-center gap-1">
          <img 
            src={aedLogoUrl} 
            alt="AED logo" 
            className="w-4 h-4 object-contain"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
          {numericPrice.toFixed(2)}
        </span>
      );
    }
    
    return `${currencySymbols[currency] || currency} ${numericPrice.toFixed(2)}`;
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

  // Get brand logo SVG based on actual product name
  const getBrandLogo = (productName: string) => {
    const name = productName.toLowerCase();
    
    // Bvlgari product-specific branding
    if (name.includes('bvlgari') || name.includes('le gemme')) {
      return `data:image/svg+xml,${encodeURIComponent(`
        <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bvlgariGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#000000;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#8B0000;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect x="5" y="5" width="190" height="70" fill="none" stroke="url(#bvlgariGrad)" stroke-width="2" rx="10"/>
          <text x="100" y="45" fill="url(#bvlgariGrad)" text-anchor="middle" font-family="serif" font-size="16" font-weight="bold">BVLGARI</text>
          <text x="100" y="65" fill="url(#bvlgariGrad)" text-anchor="middle" font-family="serif" font-size="12" font-weight="bold">LE GEMME</text>
        </svg>
      `)}`;
    }
    // Valley Breezes product-specific branding
    else if (name.includes('mystic rose')) {
      return `data:image/svg+xml,${encodeURIComponent(`
        <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="mysticGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#D4AF37;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#F9E79F;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect x="5" y="5" width="190" height="70" fill="none" stroke="url(#mysticGrad)" stroke-width="2" rx="10"/>
          <circle cx="100" cy="25" r="15" fill="none" stroke="url(#mysticGrad)" stroke-width="1.5"/>
          <path d="M90 20 Q100 12 110 20 Q100 28 90 20" fill="url(#mysticGrad)" opacity="0.7"/>
          <text x="100" y="50" fill="url(#mysticGrad)" text-anchor="middle" font-family="serif" font-size="14" font-weight="bold">MYSTIC</text>
          <text x="100" y="65" fill="url(#mysticGrad)" text-anchor="middle" font-family="serif" font-size="14" font-weight="bold">ROSE</text>
        </svg>
      `)}`;
    } else if (name.includes('midnight woods')) {
      return `data:image/svg+xml,${encodeURIComponent(`
        <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="midnightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#D4AF37;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#F9E79F;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect x="5" y="5" width="190" height="70" fill="none" stroke="url(#midnightGrad)" stroke-width="2" rx="10"/>
          <rect x="20" y="15" width="160" height="25" fill="none" stroke="url(#midnightGrad)" stroke-width="1.5" rx="5"/>
          <circle cx="50" cy="20" r="2" fill="url(#midnightGrad)"/>
          <circle cx="100" cy="25" r="3" fill="url(#midnightGrad)"/>
          <circle cx="150" cy="20" r="2" fill="url(#midnightGrad)"/>
          <text x="100" y="55" fill="url(#midnightGrad)" text-anchor="middle" font-family="serif" font-size="13" font-weight="bold">MIDNIGHT</text>
          <text x="100" y="70" fill="url(#midnightGrad)" text-anchor="middle" font-family="serif" font-size="13" font-weight="bold">WOODS</text>
        </svg>
      `)}`;
    } else if (name.includes('ocean breeze')) {
      return `data:image/svg+xml,${encodeURIComponent(`
        <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#D4AF37;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#F9E79F;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect x="5" y="5" width="190" height="70" fill="none" stroke="url(#oceanGrad)" stroke-width="2" rx="10"/>
          <path d="M20 25 Q40 15 60 25 Q80 35 100 25 Q120 15 140 25 Q160 35 180 25" fill="none" stroke="url(#oceanGrad)" stroke-width="2"/>
          <path d="M20 30 Q40 20 60 30 Q80 40 100 30 Q120 20 140 30 Q160 40 180 30" fill="none" stroke="url(#oceanGrad)" stroke-width="1.5" opacity="0.7"/>
          <text x="100" y="50" fill="url(#oceanGrad)" text-anchor="middle" font-family="serif" font-size="14" font-weight="bold">OCEAN</text>
          <text x="100" y="65" fill="url(#oceanGrad)" text-anchor="middle" font-family="serif" font-size="14" font-weight="bold">BREEZE</text>
        </svg>
      `)}`;
    } else if (name.includes('golden lotus')) {
      return `data:image/svg+xml,${encodeURIComponent(`
        <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#D4AF37;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#F9E79F;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect x="5" y="5" width="190" height="70" fill="none" stroke="url(#goldenGrad)" stroke-width="2" rx="10"/>
          <ellipse cx="100" cy="25" rx="25" ry="12" fill="none" stroke="url(#goldenGrad)" stroke-width="1.5"/>
          <path d="M85 25 Q100 15 115 25 Q100 35 85 25" fill="url(#goldenGrad)" opacity="0.5"/>
          <circle cx="100" cy="25" r="4" fill="url(#goldenGrad)"/>
          <text x="100" y="50" fill="url(#goldenGrad)" text-anchor="middle" font-family="serif" font-size="14" font-weight="bold">GOLDEN</text>
          <text x="100" y="65" fill="url(#goldenGrad)" text-anchor="middle" font-family="serif" font-size="14" font-weight="bold">LOTUS</text>
        </svg>
      `)}`;
    } else if (name.includes('urban legend')) {
      return `data:image/svg+xml,${encodeURIComponent(`
        <svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="urbanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#D4AF37;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#F9E79F;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect x="70" y="20" width="60" height="20" fill="none" stroke="url(#urbanGrad)" stroke-width="2" rx="2"/>
          <rect x="75" y="25" width="10" height="10" fill="url(#urbanGrad)" opacity="0.7"/>
          <rect x="90" y="25" width="10" height="10" fill="url(#urbanGrad)" opacity="0.7"/>
          <rect x="105" y="25" width="10" height="10" fill="url(#urbanGrad)" opacity="0.7"/>
          <rect x="120" y="25" width="5" height="10" fill="url(#urbanGrad)" opacity="0.7"/>
          <text x="100" y="52" fill="url(#urbanGrad)" text-anchor="middle" font-family="serif" font-size="10" font-weight="bold">URBAN LEGEND</text>
        </svg>
      `)}`;
    } else if (name.includes('celestial moon')) {
      return `data:image/svg+xml,${encodeURIComponent(`
        <svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="celestialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#D4AF37;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#F9E79F;stop-opacity:1" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="30" r="20" fill="none" stroke="url(#celestialGrad)" stroke-width="2"/>
          <path d="M90 30 A10 10 0 0 1 110 30 A8 8 0 0 0 90 30" fill="url(#celestialGrad)" opacity="0.8"/>
          <circle cx="95" cy="25" r="1.5" fill="url(#celestialGrad)"/>
          <circle cx="105" cy="35" r="1" fill="url(#celestialGrad)"/>
          <circle cx="110" cy="25" r="0.8" fill="url(#celestialGrad)"/>
          <text x="100" y="52" fill="url(#celestialGrad)" text-anchor="middle" font-family="serif" font-size="9" font-weight="bold">CELESTIAL MOON</text>
        </svg>
      `)}`;
    } else if (name.includes('royal garden')) {
      return `data:image/svg+xml,${encodeURIComponent(`
        <svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="royalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#D4AF37;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#F9E79F;stop-opacity:1" />
            </linearGradient>
          </defs>
          <polygon points="100,15 110,25 125,25 115,35 120,50 100,40 80,50 85,35 75,25 90,25" fill="none" stroke="url(#royalGrad)" stroke-width="2"/>
          <polygon points="100,20 105,25 115,25 110,30 112,40 100,35 88,40 90,30 85,25 95,25" fill="url(#royalGrad)" opacity="0.6"/>
          <text x="100" y="55" fill="url(#royalGrad)" text-anchor="middle" font-family="serif" font-size="10" font-weight="bold">ROYAL GARDEN</text>
        </svg>
      `)}`;
    } else if (name.includes('heritage oak')) {
      return `data:image/svg+xml,${encodeURIComponent(`
        <svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="heritageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#D4AF37;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#F9E79F;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect x="80" y="20" width="40" height="25" fill="none" stroke="url(#heritageGrad)" stroke-width="2" rx="3"/>
          <path d="M90 25 L95 30 L90 35 M100 25 L105 30 L100 35 M110 25 L115 30 L110 35" stroke="url(#heritageGrad)" stroke-width="1.5" fill="none"/>
          <text x="100" y="52" fill="url(#heritageGrad)" text-anchor="middle" font-family="serif" font-size="10" font-weight="bold">HERITAGE OAK</text>
        </svg>
      `)}`;
    } else {
      // Default Valley Breezes brand logo
      return `data:image/svg+xml,${encodeURIComponent(`
        <svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="valleyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#D4AF37;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#F9E79F;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect x="40" y="15" width="120" height="30" fill="none" stroke="url(#valleyGrad)" stroke-width="2" rx="15"/>
          <text x="100" y="35" fill="url(#valleyGrad)" text-anchor="middle" font-family="serif" font-size="12" font-weight="bold">VALLEY BREEZES</text>
        </svg>
      `)}`;
    }
  };

  // Get all products with the same name (different sizes)
  const sameNameProducts = [product, ...similarProducts].filter(p => 
    p.name === product.name
  ).sort((a, b) => {
    // Sort by volume size (ml value)
    const volA = parseInt(a.volume.replace('ml', ''));
    const volB = parseInt(b.volume.replace('ml', ''));
    return volA - volB;
  });

  return (
    <div 
      className="product-card-hover filter-transition bg-gradient-to-br from-card/85 via-background/70 to-card/65 backdrop-blur-glass border border-border/60 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 hover:bg-gradient-to-br hover:from-card/95 hover:via-background/80 hover:to-card/75 transition-all duration-700 relative group hover:-translate-y-2 cursor-pointer"
      data-testid={`card-product-${selectedSize.id}`}
      onClick={handleCardClick}
    >
      {/* Stock Status Badge - Top Right */}
      <div className="relative z-20">
        {selectedSize.inStock ? (
          <div className="absolute top-3 right-3 z-30 bg-gradient-to-r from-green-600 to-green-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg flex items-center gap-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            ✓ In Stock
          </div>
        ) : (
          <div className="absolute top-3 right-3 z-30 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg flex items-center gap-1">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            Out of Stock
          </div>
        )}
        
        {/* Recommended Badge - Below Stock Status */}
        {isRecommended && (
          <div className="absolute top-12 right-3 z-30 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg animate-pulse">
            🎯 Recommended
          </div>
        )}
        
        <div 
          className="relative w-full h-96 overflow-hidden"
          ref={touchAreaRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Product Image with Carousel - Enhanced Quality Rendering */}
          <img 
            src={highQualityImages[currentImageIndex] || selectedSize.imageUrl} 
            alt={selectedSize.name} 
            className="absolute inset-0 w-full h-full object-contain p-6 transition-all duration-500 hover:opacity-100 opacity-90 z-10 group-hover:scale-125 group-hover:-translate-y-3"
            data-testid={`img-product-${selectedSize.id}`}
            loading="lazy"
            decoding="async"
            style={{
              imageRendering: 'auto' as const,
              filter: 'contrast(1.15) saturate(1.2) brightness(1.05)',
              willChange: 'transform',
              // CSS-based sharpening for small images
              backdropFilter: 'contrast(1.1)'
            }}
          />
          
          {/* Image Navigation Buttons - Only show if multiple images */}
          {highQualityImages.length > 1 && (
            <>
              <button
                onClick={handleImagePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 bg-gradient-to-r from-black/60 via-primary/40 to-black/60 backdrop-blur-xl text-white p-3 rounded-xl hover:from-primary/80 hover:via-accent/60 hover:to-primary/80 transition-all duration-500 shadow-2xl hover:shadow-primary/40 hover:scale-110 border border-primary/20 hover:border-primary/60"
                aria-label="Previous image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleImageNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 bg-gradient-to-r from-black/60 via-primary/40 to-black/60 backdrop-blur-xl text-white p-3 rounded-xl hover:from-primary/80 hover:via-accent/60 hover:to-primary/80 transition-all duration-500 shadow-2xl hover:shadow-primary/40 hover:scale-110 border border-primary/20 hover:border-primary/60"
                aria-label="Next image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Enhanced Image Dots Indicator */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3 bg-gradient-to-r from-black/40 via-background/30 to-black/40 backdrop-blur-xl px-4 py-2 rounded-2xl border border-primary/20 shadow-xl">
                {highQualityImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-400 relative ${
                      index === currentImageIndex 
                        ? 'bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/60 scale-125 ring-2 ring-primary/30'
                        : 'bg-white/40 hover:bg-white/70 hover:scale-110'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    {index === currentImageIndex && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse opacity-50"></div>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
          
          {/* Enhanced Image Counter - Top Left */}
          {highQualityImages.length > 1 && (
            <div className="absolute top-6 left-6 z-30 bg-gradient-to-br from-black/70 via-background/50 to-black/70 backdrop-blur-xl border-2 border-primary/30 text-primary text-sm px-4 py-2 rounded-2xl font-bold shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"></div>
                <span className="text-gradient font-serif">{currentImageIndex + 1}</span>
                <span className="text-primary/60">/</span>
                <span className="text-primary/80">{highQualityImages.length}</span>
              </div>
            </div>
          )}
          
          {/* NEW Badge for Rabdan Products (IDs 9+) - Bottom Left */}
          {parseInt(selectedSize.id) >= 9 && (
            <div className="absolute bottom-6 left-6 z-30 bg-gradient-to-r from-green-600 to-green-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg animate-pulse">
              ✨ NEW
            </div>
          )}
          
          {/* Full-Frame Brand Logo - High Quality Enhanced */}
          <div className="absolute bottom-3 right-3 z-20 w-32 h-20 bg-gradient-to-br from-background/98 via-background/95 to-background/98 backdrop-blur-2xl border-2 border-primary/50 rounded-2xl p-2 shadow-2xl group-hover:shadow-primary/40 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
            <img 
              src={getBrandLogo(selectedSize.name)} 
              alt={`${selectedSize.name} brand logo`} 
              className="w-full h-full object-contain opacity-95 group-hover:opacity-100 transition-opacity duration-300"
              loading="lazy"
              decoding="async"
              style={{
                imageRendering: 'auto' as const,
                filter: 'contrast(1.1) saturate(1.05)',
                willChange: 'opacity'
              }}
            />
          </div>
          
          {/* Enhanced brand accent - Top Left (when no image counter) */}
          {highQualityImages.length <= 1 && (
            <div className="absolute top-6 left-6 z-20 w-20 h-10 bg-gradient-to-r from-primary/25 to-accent/25 backdrop-blur-md border border-primary/30 rounded-full flex items-center justify-center opacity-70 group-hover:opacity-90 transition-all duration-500 group-hover:scale-105">
              <div className="w-3 h-3 bg-gradient-to-r from-primary to-accent rounded-full shadow-lg animate-pulse"></div>
              <span className="ml-2 text-xs font-semibold text-primary">VB</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-8 relative z-20">
        <div className="flex justify-between items-start mb-4">
          <h3 
            className="font-serif text-xl font-semibold text-foreground group-hover:text-gradient transition-all duration-400 flex-1 leading-tight"
            data-testid={`text-product-name-${selectedSize.id}`}
          >
            {selectedSize.name}
          </h3>
          <div className="ml-4 text-right">
            <div className="text-right">
              <span 
                className="text-primary font-bold text-2xl group-hover:text-gradient transition-all duration-400"
                data-testid={`text-price-${selectedSize.id}`}
              >
                {formatPrice(selectedSize.price)}
              </span>
              <div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300 mt-1">per piece</div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1" data-testid={`rating-product-${selectedSize.id}`}>
            {renderStars(selectedSize.rating)}
            <span className="text-xs text-muted-foreground ml-1 group-hover:text-foreground transition-colors duration-300">({selectedSize.rating})</span>
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors duration-300">
            SKU: PU{selectedSize.id.toString().padStart(4, '0')}
          </div>
        </div>
        
        {/* Size Selection - Show if there are multiple sizes */}
        {sameNameProducts.length > 1 && (
          <div className="mb-4">
            <div className="text-sm font-medium text-foreground mb-2">Size Options:</div>
            <div className="flex flex-wrap gap-2">
              {sameNameProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(p);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                    selectedSize.id === p.id
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-card/50 text-foreground hover:bg-primary/20 border border-border'
                  }`}
                >
                  {p.volume} {p.inStock ? '' : '(Out of Stock)'}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">
            {selectedSize.category} • {selectedSize.volume}
          </div>
          <div className="text-xs font-semibold text-primary group-hover:text-accent transition-colors duration-300">
            MOQ: 1 pc
          </div>
        </div>
        
        <p 
          className="text-muted-foreground text-sm mb-4 line-clamp-2 group-hover:text-foreground transition-colors duration-300"
          data-testid={`text-product-description-${selectedSize.id}`}
        >
          {selectedSize.description}
        </p>
        
        {/* Fragrance Notes Preview */}
        <div className="mb-4 p-3 bg-gradient-to-r from-card/60 via-background/40 to-card/60 border border-primary/20 rounded-lg backdrop-blur-sm">
          <h4 className="text-xs font-semibold text-primary mb-2">FRAGRANCE NOTES</h4>
          <div className="flex flex-wrap gap-1">
            <div className="flex flex-wrap gap-1">
              {fragranceNotes.topNotes.slice(0, 2).map((note, index) => (
                <span key={index} className="text-[10px] bg-primary/20 text-primary px-2 py-1 rounded-full">
                  {note}
                </span>
              ))}
              {fragranceNotes.middleNotes.slice(0, 2).map((note, index) => (
                <span key={index} className="text-[10px] bg-accent/20 text-accent px-2 py-1 rounded-full">
                  {note}
                </span>
              ))}
              {fragranceNotes.baseNotes.slice(0, 2).map((note, index) => (
                <span key={index} className="text-[10px] bg-secondary/20 text-secondary-foreground px-2 py-1 rounded-full">
                  {note}
                </span>
              ))}
              {(fragranceNotes.topNotes.length + fragranceNotes.middleNotes.length + fragranceNotes.baseNotes.length) > 6 && (
                <span className="text-[10px] bg-muted/20 text-muted-foreground px-2 py-1 rounded-full">
                  +{(fragranceNotes.topNotes.length + fragranceNotes.middleNotes.length + fragranceNotes.baseNotes.length) - 6} more
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Enhanced Stock and Availability Information */}
        {selectedSize.inStock && (
          <div className="mb-4 p-3 bg-gradient-to-r from-green-50/80 via-green-50/60 to-green-50/80 border border-green-200/50 rounded-lg backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-green-700">AVAILABLE NOW</span>
              </div>
              <span className="text-xs text-green-600 font-medium">Ready to Ship</span>
            </div>
            <div className="flex justify-between items-center text-xs text-green-600">
              <span>Same-day processing</span>
              <span>•</span>
              <span>UAE delivery</span>
              <span>•</span>
              <span>In stock</span>
            </div>
          </div>
        )}
        {selectedSize.inStock && (
          <div className="mb-6 p-4 bg-gradient-to-r from-primary/8 via-primary/5 to-accent/8 border border-primary/25 rounded-lg backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-primary">BULK PRICING</span>
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">Save more with quantity</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="text-center bg-card/40 rounded-md p-2">
                <div className="font-semibold text-foreground">1-5 pcs</div>
                <div className="text-muted-foreground">{formatPrice(selectedSize.price)}</div>
              </div>
              <div className="text-center bg-card/40 rounded-md p-2">
                <div className="font-semibold text-foreground">6-20 pcs</div>
                <div className="text-green-600 font-semibold">{formatPrice((parseFloat(selectedSize.price) * 0.95).toFixed(2))}</div>
              </div>
              <div className="text-center bg-card/40 rounded-md p-2">
                <div className="font-semibold text-foreground">21+ pcs</div>
                <div className="text-green-600 font-semibold">{formatPrice((parseFloat(selectedSize.price) * 0.90).toFixed(2))}</div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex gap-3">
          <div className="flex-1">
            {selectedSize.inStock ? (
              <div className="flex gap-2">
                <select 
                  value={selectedQuantity}
                  onChange={(e) => {
                    e.stopPropagation();
                    setSelectedQuantity(Number(e.target.value));
                  }}
                  onClick={handleButtonClick}
                  className="bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm border-2 border-primary/40 text-primary px-3 py-2.5 rounded-lg text-sm flex-1 hover:border-primary/60 focus:border-primary transition-all duration-300 font-semibold shadow-lg"
                  style={{
                    color: '#D4AF37',
                    backgroundColor: 'rgba(33, 33, 33, 0.85)'
                  }}
                >
                  <option value={1} style={{ backgroundColor: '#1a1a1a', color: '#D4AF37' }}>Qty: 1</option>
                  <option value={5} style={{ backgroundColor: '#1a1a1a', color: '#D4AF37' }}>Qty: 5</option>
                  <option value={10} style={{ backgroundColor: '#1a1a1a', color: '#D4AF37' }}>Qty: 10</option>
                  <option value={20} style={{ backgroundColor: '#1a1a1a', color: '#D4AF37' }}>Qty: 20</option>
                  <option value={50} style={{ backgroundColor: '#1a1a1a', color: '#D4AF37' }}>Qty: 50+</option>
                </select>
                <button 
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 text-sm hover:-translate-y-0.5"
                  data-testid={`button-add-cart-${selectedSize.id}`}
                >
                  {isAdding ? "Adding..." : "Add"}
                </button>
              </div>
            ) : (
              <button 
                disabled
                className="w-full bg-muted/60 text-muted-foreground px-4 py-2.5 rounded-lg font-semibold cursor-not-allowed backdrop-blur-sm"
                onClick={handleButtonClick}
              >
                Out of Stock
              </button>
            )}
          </div>
          <button 
            className="border border-primary/60 text-primary px-4 py-2.5 rounded-lg hover:bg-primary/15 hover:border-primary transition-all duration-300 backdrop-blur-sm hover:shadow-md"
            title="Add to Wishlist"
            onClick={handleButtonClick}
          >
            ♡
          </button>
        </div>
      </div>
    </div>
  );
}