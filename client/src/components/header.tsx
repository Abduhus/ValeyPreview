import { useState } from "react";
import { ChevronDown, Search, Heart, User, ShoppingCart, Menu } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

interface HeaderProps {
  onToggleSearch: () => void;
  onToggleCart: () => void;
  onToggleAuth: () => void;
}

export default function Header({ onToggleSearch, onToggleCart, onToggleAuth }: HeaderProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-glass bg-black/80 border-b border-border">
      {/* Logo */}
      <a href="#" className="flex items-center gap-3 text-decoration-none">
        <svg 
          className="w-8 h-8 text-primary" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="1.5" 
            d="M18.5 11.5H5.5C4.94772 11.5 4.5 11.9477 4.5 12.5V19C4.5 20.3807 5.61929 21.5 7 21.5H17C18.3807 21.5 19.5 20.3807 19.5 19V12.5C19.5 11.9477 19.0523 11.5 18.5 11.5Z"
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="1.5" 
            d="M14.5 11.5V9C14.5 8.44772 14.0523 8 13.5 8H10.5C9.94772 8 9.5 8.44772 9.5 9V11.5"
          />
        </svg>
        <span className="font-serif text-2xl font-semibold text-primary">Valley Breezes</span>
      </a>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        {/* Shop Dropdown */}
        <div className="relative group">
          <button 
            className="sticker-hover flex items-center justify-center w-8 h-8 text-primary"
            data-testid="button-shop-dropdown"
          >
            <ShoppingCart className="w-6 h-6" />
          </button>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-black/85 backdrop-blur-glass border border-border rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 slide-down">
            <div className="p-3 font-serif text-lg font-semibold text-accent border-b border-border/50">Shop</div>
            <div className="py-2">
              <a 
                href="#" 
                className="block px-4 py-2 text-primary hover:bg-primary/20 transition-colors"
                data-testid="link-shop-women"
              >
                Women's
              </a>
              <a 
                href="#" 
                className="block px-4 py-2 text-primary hover:bg-primary/20 transition-colors"
                data-testid="link-shop-men"
              >
                Men's
              </a>
              <a 
                href="#" 
                className="block px-4 py-2 text-primary hover:bg-primary/20 transition-colors"
                data-testid="link-shop-unisex"
              >
                Unisex
              </a>
              <a 
                href="#" 
                className="block px-4 py-2 text-primary hover:bg-primary/20 transition-colors"
                data-testid="link-shop-limited"
              >
                Limited Edition
              </a>
            </div>
          </div>
        </div>

        {/* Search */}
        <button 
          className="sticker-hover flex items-center justify-center w-8 h-8 text-primary" 
          onClick={onToggleSearch}
          data-testid="button-search"
        >
          <Search className="w-6 h-6" />
        </button>

        {/* Favorites */}
        <button 
          className="sticker-hover flex items-center justify-center w-8 h-8 text-primary"
          data-testid="button-favorites"
        >
          <Heart className="w-6 h-6" />
        </button>

        {/* Account */}
        <button 
          className="sticker-hover flex items-center justify-center w-8 h-8 text-primary" 
          onClick={onToggleAuth}
          data-testid="button-account"
        >
          <User className="w-6 h-6" />
        </button>

        {/* Cart */}
        <button 
          className="sticker-hover relative flex items-center justify-center w-8 h-8 text-primary" 
          onClick={onToggleCart}
          data-testid="button-cart"
        >
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span 
              className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
              data-testid="text-cart-count"
            >
              {cartCount}
            </span>
          )}
        </button>
      </nav>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden sticker-hover flex items-center justify-center w-8 h-8 text-primary"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        data-testid="button-mobile-menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="absolute top-full left-0 right-0 bg-black/90 backdrop-blur-glass border-b border-border md:hidden">
          <nav className="flex flex-col p-4 space-y-4">
            <button 
              onClick={onToggleSearch}
              className="flex items-center gap-3 text-primary hover:text-accent transition-colors"
              data-testid="button-mobile-search"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
            <button 
              className="flex items-center gap-3 text-primary hover:text-accent transition-colors"
              data-testid="button-mobile-favorites"
            >
              <Heart className="w-5 h-5" />
              Favorites
            </button>
            <button 
              onClick={onToggleAuth}
              className="flex items-center gap-3 text-primary hover:text-accent transition-colors"
              data-testid="button-mobile-account"
            >
              <User className="w-5 h-5" />
              Account
            </button>
            <button 
              onClick={onToggleCart}
              className="flex items-center gap-3 text-primary hover:text-accent transition-colors"
              data-testid="button-mobile-cart"
            >
              <ShoppingCart className="w-5 h-5" />
              Cart ({cartCount})
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
