import { useState } from "react";
import { ChevronDown, Search, Heart, User, ShoppingCart, Menu } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Link } from "wouter";
import logoUrl from "@assets/valley-logo-gold-resized.png";

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
      <Link href="/" className="flex items-center gap-3 text-decoration-none hover:opacity-80 transition-opacity">
        <img
          src={logoUrl}
          alt="Valley Breezes Logo"
          className="w-12 h-12 object-contain drop-shadow-lg logo-glow"
          style={{ 
            filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.3)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' 
          }}
        />
        <span className="font-serif text-2xl font-semibold text-primary">Valley Breezes</span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        {/* Shop Dropdown */}
        <div className="relative group">
          <div className="relative">
            <button 
              className="sticker-hover flex items-center justify-center w-8 h-8 text-primary"
              data-testid="button-shop-dropdown"
            >
              <img
                src={logoUrl}
                alt="Shop"
                className="w-7 h-7 object-contain drop-shadow-md logo-glow"
                style={{ 
                  filter: 'drop-shadow(0 0 6px rgba(212, 175, 55, 0.4))' 
                }}
              />
            </button>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black/90 text-primary px-3 py-1 rounded text-sm font-semibold opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap pointer-events-none z-20">
              Shop
            </div>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-black/85 backdrop-blur-glass border border-border rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 slide-down">
            <div className="p-3 font-serif text-lg font-semibold text-accent border-b border-border/50">Browse Catalog</div>
            <div className="py-2">
              <Link 
                href="/exclusive-collections" 
                className="block px-4 py-2 text-primary hover:bg-primary/20 transition-colors"
                data-testid="link-shop-exclusive"
              >
                Exclusive Collections
              </Link>
              <Link 
                href="/catalog" 
                className="block px-4 py-2 text-primary hover:bg-primary/20 transition-colors"
                data-testid="link-shop-all"
              >
                All Products
              </Link>
              <Link 
                href="/catalog?category=women" 
                className="block px-4 py-2 text-primary hover:bg-primary/20 transition-colors"
                data-testid="link-shop-women"
              >
                Women's Fragrances
              </Link>
              <Link 
                href="/catalog?category=men" 
                className="block px-4 py-2 text-primary hover:bg-primary/20 transition-colors"
                data-testid="link-shop-men"
              >
                Men's Fragrances
              </Link>
              <Link 
                href="/catalog?category=unisex" 
                className="block px-4 py-2 text-primary hover:bg-primary/20 transition-colors"
                data-testid="link-shop-unisex"
              >
                Unisex Collection
              </Link>
              <Link 
                href="/catalog" 
                className="block px-4 py-2 text-primary hover:bg-primary/20 transition-colors"
                data-testid="link-shop-brands"
              >
                Shop by Brand
              </Link>
              <Link 
                href="/catalog?featured=limited" 
                className="block px-4 py-2 text-primary hover:bg-primary/20 transition-colors border-t border-border/30 mt-2 pt-3"
                data-testid="link-shop-limited"
              >
                Limited Edition
              </Link>
              <Link 
                href="/catalog?type=sets" 
                className="block px-4 py-2 text-primary hover:bg-primary/20 transition-colors"
                data-testid="link-shop-sets"
              >
                Gift Sets
              </Link>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative group">
          <button 
            className="sticker-hover flex items-center justify-center w-8 h-8 text-primary" 
            onClick={onToggleSearch}
            data-testid="button-search"
          >
            <Search className="w-6 h-6" />
          </button>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black/90 text-primary px-3 py-1 rounded text-sm font-semibold opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap pointer-events-none z-20">
            Search
          </div>
        </div>

        {/* Favorites */}
        <div className="relative group">
          <button 
            className="sticker-hover flex items-center justify-center w-8 h-8 text-primary"
            data-testid="button-favorites"
          >
            <Heart className="w-6 h-6" />
          </button>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black/90 text-primary px-3 py-1 rounded text-sm font-semibold opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap pointer-events-none z-20">
            Favorites
          </div>
        </div>

        {/* Account */}
        <div className="relative group">
          <button 
            className="sticker-hover flex items-center justify-center w-8 h-8 text-primary" 
            onClick={onToggleAuth}
            data-testid="button-account"
          >
            <User className="w-6 h-6" />
          </button>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black/90 text-primary px-3 py-1 rounded text-sm font-semibold opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap pointer-events-none z-20">
            Account
          </div>
        </div>

        {/* Cart */}
        <div className="relative group">
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
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black/90 text-primary px-3 py-1 rounded text-sm font-semibold opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap pointer-events-none z-20">
            Cart ({cartCount})
          </div>
        </div>
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
