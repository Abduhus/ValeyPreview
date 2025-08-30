import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import ProductCard from "./product-card";
import { FilterState } from "@/lib/types";

export default function ProductGrid() {
  const [filter, setFilter] = useState<FilterState>({
    category: "all",
    sortBy: "default",
    minRating: 0,
  });

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", filter.category === "all" ? "" : filter.category],
  });

  const filteredAndSortedProducts = [...products]
    .filter((product) => {
      if (filter.minRating > 0) {
        return parseFloat(product.rating) >= filter.minRating;
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

  const handleFilterChange = (newCategory: string) => {
    setFilter({ ...filter, category: newCategory });
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
    <section id="products" className="px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="bg-card/65 backdrop-blur-glass border border-border rounded-xl p-8 mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gradient text-center mb-8">
            Featured Collection
          </h2>
          
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            {["all", "women", "men", "unisex"].map((category) => (
              <button
                key={category}
                onClick={() => handleFilterChange(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  filter.category === category
                    ? "bg-primary text-primary-foreground"
                    : "border border-primary text-primary hover:bg-primary/20"
                }`}
                data-testid={`button-filter-${category}`}
              >
                {category === "all" ? "All" : category === "women" ? "Women's" : category === "men" ? "Men's" : "Unisex"}
              </button>
            ))}
            
            <select 
              value={filter.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-input border border-border text-foreground px-4 py-2 rounded-full font-semibold cursor-pointer"
              data-testid="select-sort-price"
            >
              <option value="default">Sort by Price</option>
              <option value="price-asc">Low to High</option>
              <option value="price-desc">High to Low</option>
              <option value="name-asc">Name: A-Z</option>
              <option value="name-desc">Name: Z-A</option>
            </select>
            
            <select 
              value={filter.minRating}
              onChange={(e) => handleRatingChange(Number(e.target.value))}
              className="bg-input border border-border text-foreground px-4 py-2 rounded-full font-semibold cursor-pointer"
              data-testid="select-sort-rating"
            >
              <option value={0}>All Ratings</option>
              <option value={4}>4+ Stars</option>
              <option value={3}>3+ Stars</option>
            </select>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredAndSortedProducts.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              No products found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
