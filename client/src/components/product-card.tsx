import { Product } from "@shared/schema";
// import { useCatalog } from "@/hooks/use-catalog";
import { useCart } from "@/hooks/use-cart";
import { useState, useEffect, useRef } from "react";
// Utility to check if an image exists
function imageExists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}
import { useLocation } from "wouter";
import aedLogoUrl from "@assets/UAE_Dirham_Symbol.svg.png";

interface ProductCardProps {
  product: Product;
  isRecommended?: boolean;
  currency?: string;
  exchangeRate?: number;
  similarProducts?: Product[];
  allProducts?: Product[]; // Pass the full product list for robust size grouping
}
export function ProductCard({
  product, 
  isRecommended = false, 
  currency = "AED", 
  exchangeRate = 1,
  similarProducts = [],
  allProducts = []
}: ProductCardProps) {
  // Use allProducts prop for catalog context
  const fullCatalog = Array.isArray(allProducts) && allProducts.length > 0 ? allProducts : [];
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
  }, [product.id]);
  

  // --- CHANEL IMAGE REMATCHING LOGIC ---
  // Only for Chanel products, rematch images from dist/public/perfumes/chanel
  // const isChanel = selectedSize.brand && selectedSize.brand.toUpperCase() === "CHANEL";
  let highQualityImages: string[] = [];
  const chanelImageDir = "/perfumes/chanel/";
  const bvlgariImageDir = "/perfumes/bvlgari/";
  const type = (selectedSize.type || "").toLowerCase();
  const name = selectedSize.name.toLowerCase();
  const volume = selectedSize.volume ? selectedSize.volume.replace(/ml/i, "ml").replace(/\s+/g, "") : "";
  const isChanel = selectedSize.brand && selectedSize.brand.toUpperCase() === "CHANEL";
  const isBvlgari = selectedSize.brand && selectedSize.brand.toUpperCase().includes("BVLGARI");

  // Chanel image matching: match by name keyword only (reverted)
  function findChanelImages(name: string): string[] {
    const chanelPairs: [string, string[]][] = [
      ["allure homme edition blanche", ["1-allure-homme-edition-blanche-eau-de-parfum-spray-3-4fl-oz--packshot-default-127460-9564893642782.avif", "2-allure-homme-edition-blanche-eau-de-parfum-spray-3-4fl-oz--packshot-default-127460-9564893642782.webp"]],
      ["allure homme sport eau extreme", ["1-allure-homme-sport-eau-extreme-eau-de-parfum-spray-3-4fl-oz--packshot-default-123560-9564919988254.avif", "2-allure-homme-sport-eau-extreme-eau-de-parfum-spray-3-4fl-oz--packshot-default-123560-9564919988254.webp"]],
      ["allure homme sport cologne", ["1-allure-homme-sport-cologne-3-4fl-oz--packshot-default-123320-9564892692510.avif", "2-allure-homme-sport-cologne-3-4fl-oz--packshot-default-123320-9564892692510.webp"]],
      ["allure homme sport", ["1-allure-homme-sport-eau-de-toilette-spray-3-4fl-oz--packshot-default-123630-9564892856350.avif", "2-allure-homme-sport-eau-de-toilette-spray-3-4fl-oz--packshot-default-123630-9564892856350.webp"]],
      ["allure homme", ["1-allure-homme-eau-de-toilette-spray-3-4fl-oz--packshot-default-121460-9564890333214.avif", "2-allure-homme-eau-de-toilette-spray-3-4fl-oz--packshot-default-121460-9564890333214.webp"]],
      ["allure sensuelle", ["1-allure-sensuelle-eau-de-parfum-spray-3-4fl-oz--packshot-default-129730-9564893708318.avif", "2-allure-sensuelle-eau-de-parfum-spray-3-4fl-oz--packshot-default-129730-9564893708318.webp"]],
      ["antaeus", ["1-antaeus-eau-de-toilette-spray-3-4fl-oz--packshot-default-118460-9564891316254.avif", "2-antaeus-eau-de-toilette-spray-3-4fl-oz--packshot-default-118460-9564891316254.webp"]],
      ["bleu de chanel", ["1-bleu-de-chanel-eau-de-toilette-spray-3-4fl-oz--packshot-default-107460-9564920184862.avif", "2-bleu-de-chanel-eau-de-toilette-spray-3-4fl-oz--packshot-default-107460-9564920184862.webp"]],
      ["coco mademoiselle l'eau privee", ["1-coco-mademoiselle-l-eau-privee-eau-pour-la-nuit-spray-3-4fl-oz--packshot-default-116260-9564864282654.avif", "2-coco-mademoiselle-l-eau-privee-eau-pour-la-nuit-spray-3-4fl-oz--packshot-default-116260-9564864282654.webp"]],
      ["coco mademoiselle", ["1-coco-mademoiselle-eau-de-parfum-spray-3-4fl-oz--packshot-default-116520-9564892495902.avif", "2-coco-mademoiselle-eau-de-parfum-spray-3-4fl-oz--packshot-default-116520-9564892495902.webp"]],
      ["coco", ["1-coco-eau-de-parfum-spray-3-4fl-oz--packshot-default-113530-9539148840990.avif", "2-coco-eau-de-parfum-spray-3-4fl-oz--packshot-default-113530-9539148840990.webp"]],
      ["chance eau tendre", ["1-chance-eau-tendre-eau-de-parfum-spray-1-7fl-oz--packshot-default-126250-9564866412574.avif", "2-chance-eau-tendre-eau-de-parfum-spray-1-7fl-oz--packshot-default-126250-9564866412574.webp"]],
      ["chance eau fraiche", ["1-chance-eau-fraiche-eau-de-parfum-spray-1-2fl-oz--packshot-default-136440-9543031685150.avif", "2-chance-eau-fraiche-eau-de-parfum-spray-1-2fl-oz--packshot-default-136440-9543031685150.webp"]],
      ["chance eau de toilette", ["1-chance-eau-de-toilette-spray-3-4fl-oz--packshot-default-126460-9564893937694.avif", "2-chance-eau-de-toilette-spray-3-4fl-oz--packshot-default-126460-9564893937694.webp"]],
      ["chance", ["1-chance-eau-de-toilette-spray-3-4fl-oz--packshot-default-126460-9564893937694.avif", "2-chance-eau-de-toilette-spray-3-4fl-oz--packshot-default-126460-9564893937694.webp"]]
    ];
    for (const [keyword, files] of chanelPairs) {
      if (typeof name === 'string' && name.includes(keyword)) {
        return Array.isArray(files) ? files.map((f: string) => chanelImageDir + f) : [];
      }
    }
    return [];
  }

  // BVLGARI image matching logic
  function findBvlgariImages(name: string): string[] {
    // Map product name keywords to image filenames
    const bvlgariPairs: [string, string[]][] = [
      ["amunae", ["Bvlgari Le Gemme Amunae.avif", "Bvlgari Le Gemme Amunae1.avif"]],
      ["falkar", ["Bvlgari Le Gemme Falkar Eau De Parfum.avif", "Bvlgari Le Gemme Falkar Eau De Parfum1.avif"]],
      ["gyan", ["Bvlgari Le Gemme Gyan Eau De Parfum.avif", "Bvlgari Le Gemme Gyan Eau De Parfum1.avif"]],
      ["onekh", ["Bvlgari Le Gemme Onekh Eau De Parfum.avif", "Bvlgari Le Gemme Onekh Eau De Parfum 1.avif"]],
      ["orom", ["Bvlgari Le Gemme Orom Eau De Parfum.avif", "Bvlgari Le Gemme Orom Eau De Parfum1.avif"]],
      ["sahare", ["Bvlgari Le Gemme Sahare Eau De Parfum.avif", "Bvlgari Le Gemme Sahare Eau De Parfum1.avif"]],
      ["tygar eau de parfum, 125ml", ["Le Gemme Tygar Eau de Parfum, 125ml.webp", "Le Gemme Tygar Eau de Parfum, 125ml 1.webp"]],
      ["tygar", ["Bvlgari Le Gemme Tygar Eau De Parfum.avif", "Bvlgari Le Gemme Tygar Eau De Parfum 1.avif", "Bvlgari Le Gemme Tygar Eau de Parfum .avif"]],
      ["kobraa", ["Le Gemme Kobraa Eau De Parfum.avif", "Le Gemme Kobraa Eau De Parfum1.avif"]],
    ];
    for (const [keyword, files] of bvlgariPairs) {
      if (typeof name === 'string' && name.includes(keyword)) {
        return Array.isArray(files) ? files.map((f: string) => bvlgariImageDir + f) : [];
      }
    }
    return [];
  }

  if (isChanel) {
    highQualityImages = findChanelImages(name);
    if (highQualityImages.length === 0 && selectedSize.imageUrl) {
      highQualityImages = [selectedSize.imageUrl];
    }
  } else if (isBvlgari) {
    highQualityImages = findBvlgariImages(name);
    if (highQualityImages.length === 0 && selectedSize.imageUrl) {
      highQualityImages = [selectedSize.imageUrl];
    }
  } else {
    const additionalImages = selectedSize.images ? JSON.parse(selectedSize.images) : [];
    const uniqueImages = new Set<string>();
    if (selectedSize.imageUrl) uniqueImages.add(selectedSize.imageUrl);
    if (selectedSize.moodImageUrl) uniqueImages.add(selectedSize.moodImageUrl);
    const isRabdan = selectedSize.brand === "RABDAN";
    const isBohoboco = selectedSize.brand === "BOHOBOCO";
    const maxImages = isRabdan ? 2 : (isBohoboco ? 10 : 2);
    let additionalImageCount = 0;
    for (const img of additionalImages) {
      if (img && additionalImageCount < maxImages && uniqueImages.size < maxImages) {
        uniqueImages.add(img);
        additionalImageCount++;
      }
    }
    const allImages = Array.from(uniqueImages).slice(0, maxImages);
    const getHighQualityImagePath = (imagePath: string): string => {
      if (imagePath.includes('-300x300')) {
        const fullPath = imagePath.replace('-300x300', '');
        return fullPath;
      }
      return imagePath;
    };
    highQualityImages = allImages.map(getHighQualityImagePath);
  }

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
    setCurrentImageIndex((prev) => (prev + 1) % highQualityImages.length);
  };
  
  const handleImagePrevSwipe = () => {
    setCurrentImageIndex((prev) => (prev - 1 + highQualityImages.length) % highQualityImages.length);
  };

  const handleImageNext = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking image buttons
    setCurrentImageIndex((prev) => (prev + 1) % highQualityImages.length);
  };
  
  const handleImagePrev = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking image buttons
    setCurrentImageIndex((prev) => (prev - 1 + highQualityImages.length) % highQualityImages.length);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking add to cart
    addToCart({ productId: selectedSize.id, quantity: selectedQuantity });
  };

  const handleCardClick = () => {
    // Always navigate to the product's own page using the correct product ID
    // Use window.location for hard navigation to ensure proper page load and state reset
    window.location.href = `/product/${product.id}`;
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

  // Group all Chanel perfumes by base name and type for size selection
  let chanelSizeOptions: Product[] = [];
  if (isChanel && Array.isArray(fullCatalog) && fullCatalog.length > 0) {
    // Extract base name (remove type and volume)
    const baseName = selectedSize.name.toLowerCase().replace(/\s+(edp|edt|edp intense|edt refillable|eau pour la nuit|cologne)?\s*\d*\s*ml?.*$/i, '').trim();
    const type = (selectedSize.type || '').toUpperCase();
    // Special case: ALLURE HOMME SPORT EAU EXTREME (EDP) 20ml travel spray is NOT grouped with 50/100ml
    const isAllureSportExtreme = baseName.includes('allure homme sport eau extreme');
    chanelSizeOptions = fullCatalog.filter((p: Product) => {
      if (!p.brand || p.brand.toUpperCase() !== "CHANEL") return false;
      const pBase = p.name.toLowerCase().replace(/\s+(edp|edt|edp intense|edt refillable|eau pour la nuit|cologne)?\s*\d*\s*ml?.*$/i, '').trim();
      const pType = (p.type || '').toUpperCase();
      if (isAllureSportExtreme) {
        // Only group 50ml and 100ml EDP, not 20ml travel spray
        if (pBase === baseName && pType === 'EDP') {
          const v = (p.volume || '').replace(/ml/i, '').replace(/\D/g, '');
          return v === '50' || v === '100';
        }
        return false;
      }
      // For all other Chanel, group by base name and type
      return pBase === baseName && pType === type;
    }).sort((a, b) => {
      // Sort by volume
      const volA = parseInt(a.volume);
      const volB = parseInt(b.volume);
      return volA - volB;
    });
  }

  // Brand logo logic: return logo path for any brand, fallback to empty string
  // Robust brand logo rematching logic
  // Async logo finder with file existence check
  const [brandLogoUrl, setBrandLogoUrl] = useState<string>("");
  useEffect(() => {
    async function findLogo() {
      if (!selectedSize.brand) {
        setBrandLogoUrl("");
        return;
      }
      const brand = selectedSize.brand;
      const candidates = [];
      candidates.push(brand.toLowerCase().replace(/\s+/g, ""));
      candidates.push(brand.toLowerCase().replace(/\s+/g, "_"));
      candidates.push(brand.toLowerCase());
      candidates.push(brand.replace(/\s+/g, ""));
      candidates.push(brand.replace(/\s+/g, "_"));
      for (const c of candidates) {
        const pngPath = `/assets/logos/${c}.png`;
        if (await imageExists(pngPath)) {
          setBrandLogoUrl(pngPath);
          return;
        }
      }
      setBrandLogoUrl("");
    }
    findLogo();
  }, [selectedSize.brand]);
  // ...existing getBrandLogo code...

  // For Chanel, use chanelSizeOptions for size selection; otherwise, use sameNameProducts
  // Ensure unique size options by volume and type
  function getUniqueSizeOptions(products: Product[]) {
    const seen = new Set();
    return products.filter((p) => {
      const key = `${(p.type || '').toUpperCase()}-${(p.volume || '').replace(/\s+/g, '')}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  const sameNameProducts = isChanel && chanelSizeOptions.length > 1
    ? getUniqueSizeOptions(chanelSizeOptions)
    : Array.isArray(fullCatalog) && fullCatalog.length > 0
      ? getUniqueSizeOptions(fullCatalog.filter((p: Product) => p.name === product.name))
      : getUniqueSizeOptions([product, ...similarProducts].filter(p => p.name === product.name));

  return (
    <div 
      className="product-card-hover filter-transition bg-gradient-to-br from-card/85 via-background/70 to-card/65 backdrop-blur-glass border border-border/60 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 hover:bg-gradient-to-br hover:from-card/95 hover:via-background/80 hover:to-card/75 transition-all duration-700 relative group hover:-translate-y-2 cursor-pointer"
      data-testid={`card-product-${product.id}`}
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
          className="relative w-full h-[450px] overflow-hidden"
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
          
          {/* Brand Logo Overlay - Bottom Right (for any brand with a logo) */}
          {brandLogoUrl && (
            <div className="absolute bottom-3 right-3 z-20 w-20 h-12 bg-gradient-to-br from-background/98 via-background/95 to-background/98 backdrop-blur-2xl border border-primary/40 rounded-xl p-1 shadow-2xl group-hover:shadow-primary/40 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 flex items-end justify-end">
              <img 
                src={brandLogoUrl}
                alt={`${selectedSize.brand} brand logo`} 
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
          )}
          
          {/* Enhanced brand accent - Top Left (when no image counter) */}
          {highQualityImages.length <= 1 && (
            <div className="absolute top-6 left-6 z-20 w-20 h-10 bg-gradient-to-r from-primary/25 to-accent/25 backdrop-blur-md border border-primary/30 rounded-full flex items-center justify-center opacity-70 group-hover:opacity-90 transition-all duration-500 group-hover:scale-105">
              <div className="w-3 h-3 bg-gradient-to-r from-primary to-accent rounded-full shadow-lg animate-pulse"></div>
              <span className="ml-2 text-xs font-semibold text-primary">VB</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-10 relative z-20">
        <div className="flex justify-between items-start mb-4">
          <h3 
            className="font-serif text-xl font-semibold text-primary group-hover:text-gradient transition-all duration-400 flex-1 leading-tight"
            data-testid={`text-product-name-${selectedSize.id}`}
          >
            {selectedSize.name}
          </h3>
          {/* Remove price display from front - keep it hidden but preserve space */}
          <div className="ml-4 text-right opacity-0 h-0 w-0">
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1" data-testid={`rating-product-${selectedSize.id}`}>
            {renderStars(selectedSize.rating)}
            <span className="text-xs text-primary ml-1 group-hover:text-primary transition-colors duration-300">({selectedSize.rating})</span>
          </div>
          <div className="text-xs text-primary uppercase tracking-wider group-hover:text-primary transition-colors duration-300">
            SKU: PU{selectedSize.id.toString().padStart(4, '0')}
          </div>
        </div>
        
        {/* Size Selection - Show if there are multiple sizes */}
        {sameNameProducts.length > 1 && (
          <div className="mb-4">
            <div className="text-sm font-medium text-primary mb-2">Size Options:</div>
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
                      : 'bg-card/50 text-primary hover:bg-primary/20 border border-border'
                  }`}
                >
                  {p.volume} {p.inStock ? '' : '(Out of Stock)'}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-xs text-primary group-hover:text-primary transition-colors duration-300">
            {selectedSize.category} • {selectedSize.volume}
          </div>
          <div className="text-xs font-semibold text-primary group-hover:text-primary transition-colors duration-300">
            MOQ: 1 pc
          </div>
        </div>
        
        <p 
          className="text-primary text-sm mb-4 line-clamp-2 group-hover:text-primary transition-colors duration-300"
          data-testid={`text-product-description-${selectedSize.id}`}
        >
          {selectedSize.description}
        </p>
        
        {/* Perfume Type Display */}
        <div className="mb-4 p-3 bg-gradient-to-r from-card/60 via-background/40 to-card/60 border border-primary/20 rounded-lg backdrop-blur-sm">
          <h4 className="text-xs font-semibold text-primary mb-2">PERFUME TYPE</h4>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-bold bg-primary/20 text-primary px-3 py-1 rounded-full">
              {selectedSize.type || 'N/A'}
            </span>
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
              <span className="text-xs text-primary group-hover:text-primary transition-colors duration-300">Save more with quantity</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="text-center bg-card/40 rounded-md p-2">
                <div className="font-semibold text-primary">1-5 pcs</div>
                <div className="text-primary">{formatPrice(selectedSize.price)}</div>
              </div>
              <div className="text-center bg-card/40 rounded-md p-2">
                <div className="font-semibold text-primary">6-20 pcs</div>
                <div className="text-green-600 font-semibold">{formatPrice((parseFloat(selectedSize.price) * 0.95).toFixed(2))}</div>
              </div>
              <div className="text-center bg-card/40 rounded-md p-2">
                <div className="font-semibold text-primary">21+ pcs</div>
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
                className="w-full bg-muted/60 text-primary px-4 py-2.5 rounded-lg font-semibold cursor-not-allowed backdrop-blur-sm"
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