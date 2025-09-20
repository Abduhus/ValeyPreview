import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { ProductCard } from "./product-card";
import { FilterState } from "@/lib/types";

interface ProductGridProps {
  recommendedProductIds?: string[];
  initialCategory?: string;
  initialBrand?: string;
  initialSearch?: string;
  currency?: string;
  exchangeRate?: number;
}

export default function ProductGrid({ recommendedProductIds = [], initialCategory = "all", initialBrand = "all", initialSearch = "", currency = "AED", exchangeRate = 1 }: ProductGridProps) {
  const [filter, setFilter] = useState<FilterState>({
    category: initialCategory,
    sortBy: "default",
    minRating: 0,
    brand: initialBrand,
  });
  
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);

  // Update filter when initialCategory, initialBrand, or initialSearch changes
  useEffect(() => {
    setFilter(prev => ({ ...prev, category: initialCategory, brand: initialBrand }));
    setSearchQuery(initialSearch);
  }, [initialCategory, initialBrand, initialSearch]);

  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products", filter.category, filter.brand, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery && searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      } else {
        if (filter.category && filter.category !== "all") {
          params.append("category", filter.category);
        }
        if (filter.brand && filter.brand !== "all") {
          params.append("brand", filter.brand);
        }
      }
      const url = `/api/products?${params.toString()}`;
      console.log("Fetching products from:", url); // Debug log
      const response = await fetch(url);
      console.log("Response status:", response.status); // Debug log
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log("Products fetched:", data.length); // Debug log
      return data;
    },
  });

  // Log any errors
  useEffect(() => {
    if (error) {
      console.error("Error fetching products:", error);
    }
  }, [error]);

  // Helper function to get display name for brand
  const getBrandDisplayName = (brandId: string): string => {
    const brandNames: { [key: string]: string } = {
      'all': 'All Brands',
      'rabdan': 'Rabdan',
      'signature-royale': 'Signature Royale',
      'pure-essence': 'Pure Essence',
      'coreterno': 'Coreterno',
      'bvlgari': 'BVLGARI',
      'christian': 'Christian Dior',
      'marc': 'Marc Antoine Barrois',
      'escentric': 'Escentric Molecules',
      'escentric-molecule': 'Escentric Molecules',
      'diptyque': 'Diptyque',
      'giardini': 'Giardini di Toscana',
      'bohoboco': 'Bohoboco',
      'tom-ford': 'Tom Ford',
      'chanel': 'Chanel',
      'yves-saint-laurent': 'Yves Saint Laurent',
      'creed': 'Creed',
      'montale': 'Montale',
      'gucci': 'Gucci',
      'dior': 'Dior',
      'armani': 'Armani',
      'burberry': 'Burberry',
      'lancome': 'Lancôme',
      'mont-blanc': 'Mont Blanc',
      'hugo-boss': 'Hugo Boss',
      'versace': 'Versace',
      'xerjoff': 'Xerjoff'
    };
    return brandNames[brandId] || brandId;
  };

  // Helper function to extract brand from product name
  const getBrandFromProductName = (productName: string): string => {
    const name = productName.toLowerCase();
    
    // Check for Rabdan brands
    if (name.includes('rabdan')) return 'rabdan';
    if (name.includes('signature royale')) return 'signature-royale';
    if (name.includes('pure essence')) return 'pure-essence';
    if (name.includes('coreterno')) return 'coreterno';
    
    // Check for Escentric Molecules
    if (name.includes('escentric')) return 'escentric';
    
    // Check for traditional brands
    if (name.includes('tom ford')) return 'tom-ford';
    if (name.includes('chanel')) return 'chanel';
    if (name.includes('yves saint laurent') || name.includes('ysl')) return 'yves-saint-laurent';
    if (name.includes('creed')) return 'creed';
    if (name.includes('montale')) return 'montale';
    if (name.includes('gucci')) return 'gucci';
    if (name.includes('dior')) return 'dior';
    if (name.includes('armani')) return 'armani';
    if (name.includes('burberry')) return 'burberry';
    if (name.includes('lancôme') || name.includes('lancome')) return 'lancome';
    if (name.includes('mont blanc') || name.includes('montblanc')) return 'mont-blanc';
    if (name.includes('hugo boss') || name.includes('boss')) return 'hugo-boss';
    
    // Default to rabdan for original products
    return 'rabdan';
  };

  // Helper function to group products by name
  const groupProductsByName = (products: Product[]): { [key: string]: Product[] } => {
    const groups: { [key: string]: Product[] } = {};
    products.forEach(product => {
      // Use original brand and name (case-sensitive, unmodified) for grouping
      const key = `${product.brand || ''}|${product.name || ''}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(product);
    });
    // Sort products within each group by volume (ml value)
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => {
        const volA = parseInt(a.volume.replace('ml', ''));
        const volB = parseInt(b.volume.replace('ml', ''));
        return volA - volB;
      });
    });
    return groups;
  };

  // Group products by name to find similar products
  const productGroups = groupProductsByName(products);
  
  // Create a map of product ID to similar products
  const productToSimilarProductsMap = new Map<string, Product[]>();
  
  Object.keys(productGroups).forEach(key => {
    const group = productGroups[key];
    group.forEach(product => {
      // For each product, similar products are all other products in the same group
      productToSimilarProductsMap.set(
        product.id, 
        group.filter(p => p.id !== product.id)
      );
    });
  });

  // Create a unique list of products (one per group) for display
  // Ensure grouping is by BOTH brand and name (case-insensitive, trimmed)
  const uniqueProducts = Object.keys(productGroups).map(key => {
    // key is `${normalizedBrand}|${normalizedName}`
    const group = productGroups[key];
    group.sort((a, b) => {
      const volA = parseInt(a.volume.replace('ml', ''));
      const volB = parseInt(b.volume.replace('ml', ''));
      return volA - volB;
    });
    return group[0]; // Return the first product in the sorted group
  });

  const filteredAndSortedProducts = [...uniqueProducts]
    .filter((product) => {
      // Brand filter
      if (filter.brand && filter.brand !== "all") {
        // Map frontend brand IDs to all possible database brand names (case-insensitive)
        const brandIdToNamesMap: { [key: string]: string[] } = {
          'rabdan': ['RABDAN'],
          'signature-royale': ['SIGNATURE ROYALE'],
          'pure-essence': ['PURE ESSENCE'],
          'coreterno': ['CORETERNO'],
          'bvlgari': ['BVLGARI', 'BVLGARI LE GEMME', 'BVLGARI LE GEMME MEN', 'BVLGARI LE GEMME WOMEN'],
          'christian': ['CHRISTIAN DIOR'],
          'marc': ['MARC ANTOINE BARROIS'],
          'escentric': ['ESCENTRIC MOLECULE', 'ESCENTRIC'],
          'escentric-molecule': ['ESCENTRIC MOLECULE', 'ESCENTRIC'],
          'diptyque': ['DIPTYQUE'],
          'giardini': ['GIARDINI DI TOSCANA'],
          'bohoboco': ['BOHOBOCO'],
          'tom-ford': ['TOM FORD'],
          'chanel': ['CHANEL'],
          'yves-saint-laurent': ['YVES SAINT LAURENT', 'YSL'],
          'creed': ['CREED'],
          'montale': ['MONTALE'],
          'gucci': ['GUCCI'],
          'dior': ['DIOR'],
          'armani': ['ARMANI'],
          'burberry': ['BURBERRY'],
          'lancome': ['LANCÔME', 'LANCOME'],
          'mont-blanc': ['MONT BLANC', 'MONTBLANC'],
          'hugo-boss': ['HUGO BOSS', 'BOSS'],
          'versace': ['VERSACE'],
          'xerjoff': ['XERJOFF']
        };
        const possibleNames = brandIdToNamesMap[filter.brand.toLowerCase()] || [filter.brand];
        // Normalize product brand for comparison
        const normalizedBrand = (product.brand || '').toUpperCase();
        if (!possibleNames.some(name => normalizedBrand === name.toUpperCase())) {
          return false;
        }
      }
      // Rating filter (this is only done client-side)
      if (filter.minRating > 0) {
        const productRating = parseFloat(product.rating);
        return productRating >= filter.minRating;
      }
      return true;
    })
    .sort((a, b) => {
      switch (filter.sortBy) {
        case "price-asc":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-desc":
          return parseFloat(b.price) - parseFloat(a.price);
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  // Show unique products instead of all individual products
  const displayProducts = filteredAndSortedProducts;

  // Debug log to see what's happening with the products
  useEffect(() => {
    console.log("All products:", products.length);
    console.log("Filtered products:", filteredAndSortedProducts.length);
    console.log("Filter state:", filter);
  }, [products, filteredAndSortedProducts, filter]);

  // Update URL when filters change
  const updateURL = (newCategory: string, newBrand: string, newSearch: string) => {
    const params = new URLSearchParams();
    
    if (newCategory && newCategory !== 'all') {
      params.set('category', newCategory);
    }
    
    if (newBrand && newBrand !== 'all') {
      params.set('brand', newBrand);
    }
    
    if (newSearch && newSearch.trim()) {
      params.set('search', newSearch.trim());
    }
    
    const newUrl = params.toString() ? `/catalog?${params.toString()}` : '/catalog';
    
    // Update URL without triggering a page refresh
    window.history.replaceState(
      { category: newCategory, brand: newBrand, search: newSearch },
      '',
      newUrl
    );
  };

  const handleFilterChange = (newCategory: string) => {
    setFilter({ ...filter, category: newCategory });
    updateURL(newCategory, filter.brand || 'all', searchQuery || '');
  };

  const handleBrandChange = (newBrand: string) => {
    setFilter({ ...filter, brand: newBrand });
    updateURL(filter.category || 'all', newBrand, searchQuery || '');
  };

  const handleSortChange = (sortBy: string) => {
    setFilter({ ...filter, sortBy });
  };

  const handleRatingChange = (minRating: number) => {
    setFilter({ ...filter, minRating });
  };

  if (isLoading) {
    return (
      <section id="products" className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card/65 backdrop-blur-glass border border-border rounded-xl p-8">
            <div className="text-center">Loading products...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="px-6 py-16 bg-gradient-to-b from-background/30 to-background/50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 luxury-card glass-effect">
          {recommendedProductIds.length > 0 && (
            <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl backdrop-blur-sm">
              <h3 className="font-serif text-xl font-bold text-primary mb-1">🎯 Recommended For You</h3>
              <p className="text-muted-foreground text-sm">Based on your quiz results, these fragrances match your preferences perfectly.</p>
            </div>
          )}
          
          {/* Brand-specific header */}
          {filter.brand && filter.brand !== "all" && (
            <div className="mb-6">
              <button
                onClick={() => window.location.href = '/catalog'}
                className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors duration-300 mb-4 luxury-button"
              >
                ← Back to All Products
              </button>
            </div>
          )}
          
          <h2 className="luxury-heading font-serif text-3xl md:text-4xl font-bold text-gradient mb-4">
            {searchQuery 
              ? `Search Results for "${searchQuery}"`
              : filter.brand && filter.brand !== "all" 
                ? `${getBrandDisplayName(filter.brand)} Collection` 
                : "Premium Fragrances Catalog"
            }
          </h2>
          <div className="luxury-divider"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            {searchQuery
              ? `Found ${filteredAndSortedProducts.length} products matching "${searchQuery}"`
              : filter.brand && filter.brand !== "all" 
                ? `Discover ${getBrandDisplayName(filter.brand)}'s exquisite collection of ${filteredAndSortedProducts.length} luxury fragrances`
                : `Discover our extensive collection of ${filteredAndSortedProducts.length} luxury perfumes`
            }
          </p>
        </div>
        
        {/* Enhanced Filters - Frameless Design */}
        <div className="mb-8 luxury-card glass-effect">
          <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm font-semibold text-foreground">Filter by Category:</span>
              {["all", "women", "men", "unisex"].map((category) => (
                <button
                  key={category}
                  onClick={() => handleFilterChange(category)}
                  className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 backdrop-blur-sm ${
                    filter.category === category
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg luxury-button"
                      : "bg-card/40 border border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/30"
                  }`}
                  data-testid={`button-filter-${category}`}
                >
                  {category === "all" ? "All Products" : category === "women" ? "Women's" : category === "men" ? "Men's" : "Unisex"}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-foreground">Sort by:</span>
              <select 
                value={filter.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-card/80 backdrop-blur-glass border border-primary/30 text-primary px-4 py-3 rounded-full text-sm cursor-pointer hover:border-primary/50 focus:border-primary transition-all duration-300 hover:bg-card/90 focus:bg-card/90 shadow-lg luxury-button"
                data-testid="select-sort-price"
                style={{
                  color: '#D4AF37',
                  backgroundColor: 'rgba(33, 33, 33, 0.85)'
                }}
              >
                <option value="default" style={{ backgroundColor: '#1a1a1a', color: '#D4AF37' }}>Featured</option>
                <option value="price-asc" style={{ backgroundColor: '#1a1a1a', color: '#D4AF37' }}>Price: Low to High</option>
                <option value="price-desc" style={{ backgroundColor: '#1a1a1a', color: '#D4AF37' }}>Price: High to Low</option>
                <option value="name-asc" style={{ backgroundColor: '#1a1a1a', color: '#D4AF37' }}>Name: A-Z</option>
                <option value="name-desc" style={{ backgroundColor: '#1a1a1a', color: '#D4AF37' }}>Name: Z-A</option>
              </select>
              
              <select 
                value={filter.minRating}
                onChange={(e) => handleRatingChange(Number(e.target.value))}
                className="bg-card/80 backdrop-blur-glass border border-primary/30 text-primary px-4 py-3 rounded-full text-sm cursor-pointer hover:border-primary/50 focus:border-primary transition-all duration-300 hover:bg-card/90 focus:bg-card/90 shadow-lg luxury-button"
                data-testid="select-sort-rating"
                style={{
                  color: '#D4AF37',
                  backgroundColor: 'rgba(33, 33, 33, 0.85)'
                }}
              >
                <option value={0} style={{ backgroundColor: '#1a1a1a', color: '#D4AF37' }}>All Ratings</option>
                <option value={4} style={{ backgroundColor: '#1a1a1a', color: '#D4AF37' }}>4+ Stars Only</option>
                <option value={3} style={{ backgroundColor: '#1a1a1a', color: '#D4AF37' }}>3+ Stars Only</option>
              </select>
            </div>
          </div>
          
          {/* Brand Filter Row */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="text-sm font-semibold text-foreground">Filter by Brand:</span>
            {["all", "rabdan", "signature-royale", "pure-essence", "coreterno", "bvlgari", "christian", "marc", "escentric", "escentric-molecule", "diptyque", "giardini", "bohoboco", "chanel", "versace", "xerjoff"].map((brand) => (
              <button
                key={brand}
                onClick={() => handleBrandChange(brand)}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 backdrop-blur-sm ${
                  filter.brand === brand
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg luxury-button"
                    : "bg-card/40 border border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/30"
                }`}
                data-testid={`button-filter-brand-${brand}`}
              >
                {getBrandDisplayName(brand)}
              </button>
            ))}
          </div>
          
          {/* Results Summary - Seamless Integration */}
          <div className="flex justify-between items-center text-sm text-muted-foreground border-t border-primary/10 pt-6">
            <span className="font-medium">Showing {filteredAndSortedProducts.length} of {products.length} products</span>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-gradient-to-r from-green-600 to-green-500 rounded-full shadow-sm"></span>
                <span className="font-medium">In Stock: {filteredAndSortedProducts.filter(p => p.inStock).length}</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-gradient-to-r from-red-600 to-red-500 rounded-full shadow-sm"></span>
                <span className="font-medium">Out of Stock: {filteredAndSortedProducts.filter(p => !p.inStock).length}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Product Grid with Enhanced Layout - Frameless */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              similarProducts={productToSimilarProductsMap.get(product.id) || []}
              isRecommended={recommendedProductIds.includes(product.id)}
              currency={currency}
              exchangeRate={exchangeRate}
              allProducts={products} // Pass the full product list for robust size grouping
            />
          ))}
        </div>

        {filteredAndSortedProducts.length === 0 && (
          <div className="text-center text-muted-foreground py-20">
            <div className="bg-card/40 backdrop-blur-sm border border-primary/10 rounded-2xl p-12 max-w-md mx-auto luxury-card glass-effect">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">No products found</h3>
              <p className="text-sm">Try adjusting your filters to find what you're looking for</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
