import { useState } from "react";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would handle authentication
    alert(`${isSignUp ? "Sign up" : "Sign in"} functionality would be implemented here`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 modal-backdrop z-50 flex items-center justify-center px-6">
      <div 
        className="bg-card border border-border rounded-lg p-8 w-full max-w-md slide-down"
        data-testid="modal-auth"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-2xl font-semibold text-foreground">
            {isSignUp ? "Create Account" : "Sign In"}
          </h3>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            data-testid="button-close-auth"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              className="block text-sm font-medium text-foreground mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent outline-none" 
              placeholder="Enter your email"
              required
              data-testid="input-email"
            />
          </div>
          <div>
            <label 
              className="block text-sm font-medium text-foreground mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input 
              id="password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent outline-none" 
              placeholder="Enter your password"
              required
              data-testid="input-password"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            data-testid="button-submit-auth"
          >
            {isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:text-accent"
              data-testid="button-toggle-auth"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
