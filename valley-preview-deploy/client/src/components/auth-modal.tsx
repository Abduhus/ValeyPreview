import { useState } from "react";
import { X, Building, User, Crown } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [accountType, setAccountType] = useState<'retail' | 'wholesale'>('retail');
  const [companyName, setCompanyName] = useState("");
  const [taxId, setTaxId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // In a real app, this would handle authentication
    const authType = isSignUp ? "Sign up" : "Sign in";
    const accType = accountType === 'wholesale' ? 'wholesale' : 'retail';
    alert(`${authType} for ${accType} account functionality would be implemented here`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 modal-backdrop z-50 flex items-center justify-center px-6">
      <div 
        className="bg-card border border-border rounded-lg p-8 w-full max-w-lg slide-down"
        data-testid="modal-auth"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-2xl font-semibold text-foreground">
            {isSignUp ? "Create Account" : "Validate Your Login"}
          </h3>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            data-testid="button-close-auth"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {isSignUp && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-4">
              Please complete your information below to {isSignUp ? 'create your account' : 'login'}.
            </p>
            
            {/* Account Type Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-3">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAccountType('retail')}
                  className={`p-4 border rounded-lg text-center transition-all duration-200 ${
                    accountType === 'retail'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  <User className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold">Retail Customer</div>
                  <div className="text-xs">Personal shopping</div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setAccountType('wholesale')}
                  className={`p-4 border rounded-lg text-center transition-all duration-200 ${
                    accountType === 'wholesale'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  <Building className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold">Wholesale Partner</div>
                  <div className="text-xs">Bulk orders & pricing</div>
                </button>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Wholesale Business Information */}
          {isSignUp && accountType === 'wholesale' && (
            <>
              <div>
                <label 
                  className="block text-sm font-medium text-foreground mb-2"
                  htmlFor="companyName"
                >
                  Company Name *
                </label>
                <input 
                  id="companyName"
                  type="text" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent outline-none" 
                  placeholder="Your company name"
                  required
                />
              </div>
              <div>
                <label 
                  className="block text-sm font-medium text-foreground mb-2"
                  htmlFor="taxId"
                >
                  Tax ID / Business Registration
                </label>
                <input 
                  id="taxId"
                  type="text" 
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent outline-none" 
                  placeholder="Business registration number"
                />
              </div>
            </>
          )}
          
          <div>
            <label 
              className="block text-sm font-medium text-foreground mb-2"
              htmlFor="email"
            >
              Email *
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
              Password *
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
          {isSignUp && (
            <div>
              <label 
                className="block text-sm font-medium text-foreground mb-2"
                htmlFor="confirmPassword"
              >
                Confirm Password *
              </label>
              <input 
                id="confirmPassword"
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent outline-none" 
                placeholder="Confirm your password"
                required
              />
            </div>
          )}
          
          {accountType === 'wholesale' && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Wholesale Benefits</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Bulk pricing tiers (up to 10% off)</li>
                <li>• Dedicated account manager</li>
                <li>• Priority customer support</li>
                <li>• Fast shipping on orders over $2000</li>
              </ul>
            </div>
          )}
          
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            data-testid="button-submit-auth"
          >
            {isSignUp ? `Create ${accountType === 'wholesale' ? 'Wholesale' : 'Retail'} Account` : "Sign In"}
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
