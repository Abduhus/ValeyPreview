import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Star, Heart, ShoppingCart, ArrowLeft, Check, Truck, Shield, Award, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CartSidebar from "@/components/cart-sidebar";
import AuthModal from "@/components/auth-modal";
import SearchOverlay from "@/components/search-overlay";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Product } from "@shared/schema";

interface ProductDetailParams {
  id: string;
}

const ProductDetail = () => {
  const { id } = useParams<ProductDetailParams>();
  const [, setLocation] = useLocation();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Product | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all products to find similar ones
  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ["allProducts"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    },
  });

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        throw new Error("Product not found");
      }
      return response.json();
    },
    enabled: !!id,
    // Disable caching to prevent cross-product contamination
    staleTime: 0,
    // Ensure we get fresh data
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Set selected size when product loads
  useEffect(() => {
    if (product) {
      setSelectedSize(product);
    }
  }, [product]);

  // Find similar products (same name, different sizes)
  const similarProducts = allProducts.filter(p => 
    product && p.name === product.name && p.id !== product.id
  ).sort((a, b) => {
    // Sort by volume size (ml value)
    const volA = parseInt((a.volume || '').replace('ml', ''));
    const volB = parseInt((b.volume || '').replace('ml', ''));
    return volA - volB;
  });

  // All products with the same name (including current product)
  const allSizes = product ? [product, ...similarProducts].sort((a, b) => {
    const volA = parseInt((a.volume || '').replace('ml', ''));
    const volB = parseInt((b.volume || '').replace('ml', ''));
    return volA - volB;
  }) : [];

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const sessionId = localStorage.getItem("sessionId") || "guest";
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          productId,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({
        title: "Added to Cart",
        description: `${selectedSize?.name} has been added to your cart.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = () => {
    if (selectedSize) {
      addToCartMutation.mutate({ productId: selectedSize.id, quantity });
    }
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      description: `${selectedSize?.name} has been ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
          <p className="text-foreground/80 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product || !selectedSize) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Product Not Found</h1>
          <p className="text-foreground/80 mb-8 text-lg">The product you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation("/catalog")} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Catalog
          </Button>
        </div>
      </div>
    );
  }

  // --- Chanel & BVLGARI-specific image gallery logic ---
  function findChanelImages(name: string): string[] {
    const chanelImageDir = "/perfumes/chanel/";
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
      ["chance", ["1-chance-eau-de-parfum-spray-3-4fl-oz--packshot-default-126150-9564893937694.avif", "2-chance-eau-de-parfum-spray-3-4fl-oz--packshot-default-126150-9564893937694.webp"]]
    ];
    for (const [keyword, files] of chanelPairs) {
      if (typeof name === 'string' && name.includes(keyword)) {
        return Array.isArray(files) ? files.map((f: string) => chanelImageDir + f) : [];
      }
    }
    return [];
  }

  function findBvlgariImages(name: string): string[] {
    const bvlgariImageDir = "/perfumes/bvlgari/";
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
    if (typeof name === 'string') {
      const lowerName = name.toLowerCase();
      // Try exact and partial matches, prefer longer matches
      let bestMatch: string[] = [];
      let bestLength = 0;
      for (const [keyword, files] of bvlgariPairs) {
        if (lowerName === keyword || lowerName.includes(keyword)) {
          if (keyword.length > bestLength) {
            bestMatch = files;
            bestLength = keyword.length;
          }
        }
      }
      if (bestMatch.length > 0) {
        return bestMatch.map((f: string) => bvlgariImageDir + f);
      }
    }
    return [];
  }

  let highQualityImages: string[] = [];
  const isChanel = selectedSize.brand && selectedSize.brand.toUpperCase() === "CHANEL";
  const isBvlgari = selectedSize.brand && selectedSize.brand.toUpperCase().includes("BVLGARI");
  if (isChanel) {
    highQualityImages = findChanelImages(selectedSize.name.toLowerCase());
    if (highQualityImages.length === 0 && selectedSize.imageUrl) {
      highQualityImages = [selectedSize.imageUrl];
    }
  } else if (isBvlgari) {
    highQualityImages = findBvlgariImages(selectedSize.name.toLowerCase());
    if (highQualityImages.length === 0 && selectedSize.imageUrl) {
      highQualityImages = [selectedSize.imageUrl];
    }
  } else {
    // Parse images array for non-Chanel/BVLGARI
    const additionalImages = selectedSize.images ? JSON.parse(selectedSize.images) : [];
    const allImages = [selectedSize.imageUrl, selectedSize.moodImageUrl, ...additionalImages].filter(
      (img, index, arr) => img && arr.indexOf(img) === index
    );
    // Function to get higher quality image paths where available
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
        topNotes: selectedSize.topNotes.split(',').map((note: string) => note.trim()),
        middleNotes: selectedSize.middleNotes.split(',').map((note: string) => note.trim()),
        baseNotes: selectedSize.baseNotes.split(',').map((note: string) => note.trim())
      }
    : generateFragranceNotes(selectedSize.name, selectedSize.description);

  return (
    <div className="min-h-screen">
      <Header 
        onToggleSearch={() => setIsSearchOpen(!isSearchOpen)}
        onToggleCart={() => setIsCartOpen(!isCartOpen)}
        onToggleAuth={() => setIsAuthOpen(!isAuthOpen)}
      />
      
      {/* Header - Valley Breezes Theme */}
      <div className="bg-card/90 backdrop-blur-glass border-b border-border">
        <div className="container mx-auto px-6 py-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/catalog")}
            className="mb-4 text-primary hover:text-accent hover:bg-primary/10 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Catalog
          </Button>
          
          {/* Breadcrumb - Valley Breezes Style */}
          <nav className="text-sm text-muted-foreground">
            <span>Home</span> → <span>Catalog</span> → <span className="text-primary">{selectedSize.brand}</span> → 
            <span className="text-foreground font-medium ml-1">{selectedSize.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Image Gallery - Valley Breezes Theme */}
          <div className="space-y-6">
            <div className="aspect-square bg-gradient-to-br from-card/85 via-background/70 to-card/65 backdrop-blur-glass border border-border/60 rounded-2xl p-8 overflow-hidden relative group">
              {/* Valley Breezes luxury background patterns */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/4 via-transparent to-accent/4 opacity-70"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(212,175,55,0.12),transparent_60%)] opacity-80"></div>
              
              <img
                src={highQualityImages[selectedImageIndex]}
                alt={selectedSize.name}
                className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-500"
                loading="eager"
              />
            </div>
            
            {highQualityImages.length > 1 && (
              <div className="flex space-x-4 justify-center">
                {highQualityImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-24 h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImageIndex === index
                        ? "border-primary ring-2 ring-primary/30 scale-110"
                        : "border-border/60 hover:border-primary/60 hover:scale-105"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${selectedSize.name} view ${index + 1}`}
                      className="w-full h-full object-contain bg-gradient-to-br from-card/50 to-background/30 p-3"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information - Valley Breezes Theme */}
          <div className="space-y-8">
            {selectedSize && (
              <>
                {/* Brand Badge - Valley Breezes Style */}
                <Badge variant="secondary" className="text-sm font-medium bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/30">
                  {selectedSize.brand}
                </Badge>

                {/* Product Title - Valley Breezes Typography */}
                <div>
                  <h1 className="font-serif text-5xl font-bold text-gradient mb-4">{selectedSize.name}</h1>
                  <p className="text-xl text-foreground/85 leading-relaxed">{selectedSize.description}</p>
                </div>

                {/* Rating and Volume - Valley Breezes Style */}
                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 ${
                            i < Math.floor(parseFloat(selectedSize.rating))
                              ? "text-primary fill-current"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-foreground/80">({selectedSize.rating}/5.0)</span>
                  </div>
                  <Separator orientation="vertical" className="h-8 bg-border" />
                  <span className="text-foreground/80 font-medium">{selectedSize.volume}</span>
                </div>

                {/* Price - Valley Breezes Gold Theme */}
                <div className="text-4xl font-bold text-gradient">
                  {selectedSize.price} د.إ
                </div>
              </>
            )}
          </div>
        </div>

        {/* Detailed Information Sections - Valley Breezes Theme */}
        <div className="mt-20 grid lg:grid-cols-2 gap-12">
          {/* Fragrance Notes - Valley Breezes Card Style */}
          <Card className="bg-gradient-to-br from-card/85 via-background/70 to-card/65 backdrop-blur-glass border border-border/60 shadow-2xl hover:shadow-primary/10 transition-all duration-500">
            <CardContent className="p-10">
              <h3 className="font-serif text-3xl font-bold mb-8 flex items-center text-gradient">
                <Info className="w-7 h-7 mr-4 text-primary" />
                Fragrance Notes
              </h3>
              
              <div className="space-y-8">
                <div>
                  <h4 className="font-semibold text-foreground mb-4 text-lg">Top Notes</h4>
                  <div className="flex flex-wrap gap-3">
                    {fragranceNotes.topNotes.map((note: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-sm bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 transition-colors">
                        {note}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-4 text-lg">Middle Notes</h4>
                  <div className="flex flex-wrap gap-3">
                    {fragranceNotes.middleNotes.map((note: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-sm bg-accent/10 border-accent/30 text-accent hover:bg-accent/20 transition-colors">
                        {note}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-4 text-lg">Base Notes</h4>
                  <div className="flex flex-wrap gap-3">
                    {fragranceNotes.baseNotes.map((note: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-sm bg-secondary/20 border-secondary/30 text-secondary-foreground hover:bg-secondary/30 transition-colors">
                        {note}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Details - Valley Breezes Card Style */}
          <Card className="bg-gradient-to-br from-card/85 via-background/70 to-card/65 backdrop-blur-glass border border-border/60 shadow-2xl hover:shadow-primary/10 transition-all duration-500">
            <CardContent className="p-10">
              <h3 className="font-serif text-3xl font-bold mb-8 text-gradient">Product Details</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between py-3 border-b border-border/50">
                  <span className="font-medium text-muted-foreground">Brand</span>
                  <span className="text-foreground font-semibold">{selectedSize.brand}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border/50">
                  <span className="font-medium text-muted-foreground">Volume</span>
                  <span className="text-foreground font-semibold">{selectedSize.volume}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border/50">
                  <span className="font-medium text-muted-foreground">Category</span>
                  <span className="text-foreground font-semibold capitalize">{selectedSize.category}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border/50">
                  <span className="font-medium text-muted-foreground">Rating</span>
                  <span className="text-foreground font-semibold">{selectedSize.rating}/5.0</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="font-medium text-muted-foreground">Availability</span>
                  <span className={`font-semibold ${selectedSize.inStock ? "text-primary" : "text-destructive"}`}>
                    {selectedSize.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              <div className="mt-10 p-6 bg-gradient-to-r from-primary/10 via-card/50 to-accent/10 backdrop-blur-sm border border-primary/20 rounded-xl">
                <h4 className="font-semibold text-primary mb-3 text-lg">Usage Recommendation</h4>
                <p className="text-foreground/80 leading-relaxed">
                  For best results, apply to pulse points such as wrists, neck, and behind ears. 
                  The fragrance will develop beautifully throughout the day, revealing different notes 
                  as it settles on your skin.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Brand Story Section - Valley Breezes Theme */}
        {selectedSize && (
          <Card className="bg-gradient-to-br from-card/85 via-background/70 to-card/65 backdrop-blur-glass border border-border/60 shadow-2xl hover:shadow-primary/10 transition-all duration-500 mt-12">
            <CardContent className="p-12">
              <h3 className="font-serif text-4xl font-bold mb-8 text-gradient">About {selectedSize.brand}</h3>
              <div className="prose prose-lg max-w-none text-foreground/85">
                {selectedSize.brand === "Rabdan" && (
                  <p className="text-foreground/85 leading-relaxed text-lg">
                    Rabdan represents the pinnacle of luxury fragrance craftsmanship, drawing inspiration 
                    from the rich heritage of Arabian perfumery while embracing modern sophistication. 
                    Each fragrance in the Rabdan collection is meticulously crafted using the finest 
                    ingredients sourced from around the world, creating unique olfactory experiences 
                    that capture the essence of luxury and elegance.
                  </p>
                )}
                {selectedSize.brand === "Signature Royale" && (
                  <p className="text-foreground/85 leading-relaxed text-lg">
                    Signature Royale embodies royal elegance and timeless sophistication. Our master 
                    perfumers create exclusive fragrances that reflect the grandeur and refinement 
                    of royal courts, using precious ingredients and traditional techniques passed 
                    down through generations.
                  </p>
                )}
                {selectedSize.brand === "Pure Essence" && (
                  <p className="text-foreground/85 leading-relaxed text-lg">
                    Pure Essence focuses on creating clean, contemporary fragrances that celebrate 
                    the beauty of natural ingredients. Our commitment to purity and quality ensures 
                    that each fragrance delivers an authentic and memorable scent experience.
                  </p>
                )}
                {selectedSize.brand === "Coreterno" && (
                  <p className="text-foreground/85 leading-relaxed text-lg">
                    Coreterno pushes the boundaries of traditional perfumery with bold, innovative 
                    compositions that challenge conventional fragrance norms. Our avant-garde approach 
                    creates unique scent profiles for the modern, confident individual.
                  </p>
                )}
                {!["Rabdan", "Signature Royale", "Pure Essence", "Coreterno"].includes(selectedSize.brand) && (
                  <p className="text-foreground/85 leading-relaxed text-lg">
                    This prestigious fragrance brand represents excellence in perfumery, combining 
                    traditional craftsmanship with innovative techniques to create exceptional 
                    fragrances that stand the test of time.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
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
};

export default ProductDetail;