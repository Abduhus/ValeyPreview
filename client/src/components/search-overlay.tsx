import { useState } from "react";
import { X, Search } from "lucide-react";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const popularSearches = ["Rose", "Vanilla", "Woody", "Fresh", "Oriental"];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would handle search functionality
    alert(`Search functionality for "${searchQuery}" would be implemented here`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 modal-backdrop z-50 flex items-start justify-center pt-32 px-6">
      <div 
        className="bg-card border border-border rounded-lg p-6 w-full max-w-2xl slide-down"
        data-testid="overlay-search"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-xl font-semibold text-foreground">
            Search Fragrances
          </h3>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            data-testid="button-close-search"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, notes, or brand..." 
              className="w-full bg-input border border-border rounded-lg pl-10 pr-4 py-3 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
              autoFocus
              data-testid="input-search"
            />
          </div>
        </form>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <span>Popular searches: </span>
          {popularSearches.map((search, index) => (
            <button
              key={search}
              onClick={() => setSearchQuery(search)}
              className="text-primary hover:text-accent mx-1"
              data-testid={`button-popular-search-${index}`}
            >
              {search}
              {index < popularSearches.length - 1 && ", "}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
