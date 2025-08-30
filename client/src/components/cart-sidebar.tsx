import { X, Plus, Minus } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { 
    cartItems, 
    cartTotal, 
    updateQuantity, 
    removeItem, 
    clearCart,
    isUpdating,
    isRemoving 
  } = useCart();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      updateQuantity({ id, quantity: newQuantity });
    }
  };

  const handleCheckout = () => {
    // In a real app, this would navigate to checkout
    alert("Checkout functionality would be implemented here");
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
          data-testid="backdrop-cart"
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        data-testid="sidebar-cart"
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-semibold text-foreground">
              Shopping Cart
            </h3>
            <button 
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
              data-testid="button-close-cart"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              Your cart is empty
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg"
                  data-testid={`cart-item-${item.id}`}
                >
                  {item.product && (
                    <>
                      <img 
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                        data-testid={`img-cart-item-${item.id}`}
                      />
                      <div className="flex-1">
                        <h4 
                          className="font-semibold text-foreground"
                          data-testid={`text-cart-item-name-${item.id}`}
                        >
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {item.product.volume}
                        </p>
                        <p 
                          className="text-primary font-semibold"
                          data-testid={`text-cart-item-price-${item.id}`}
                        >
                          ${item.product.price}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={isUpdating || isRemoving}
                          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50"
                          data-testid={`button-decrease-${item.id}`}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span 
                          className="w-8 text-center"
                          data-testid={`text-quantity-${item.id}`}
                        >
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={isUpdating}
                          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50"
                          data-testid={`button-increase-${item.id}`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-foreground">Total:</span>
              <span 
                className="font-bold text-xl text-primary"
                data-testid="text-cart-total"
              >
                ${cartTotal.toFixed(2)}
              </span>
            </div>
            <div className="space-y-2">
              <button 
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                data-testid="button-checkout"
              >
                Proceed to Checkout
              </button>
              <button 
                onClick={clearCart}
                className="w-full border border-destructive text-destructive py-2 rounded-lg font-semibold hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
                data-testid="button-clear-cart"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
