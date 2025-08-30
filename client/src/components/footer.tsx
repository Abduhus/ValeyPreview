import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card/90 border-t border-border px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-serif text-lg font-semibold text-foreground mb-4">
              Valley Breezes
            </h4>
            <p className="text-muted-foreground text-sm mb-4">
              Crafting luxury fragrances since 1992, bringing you the finest scents from around the world.
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary"
                data-testid="link-social-twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary"
                data-testid="link-social-facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary"
                data-testid="link-social-instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary"
                  data-testid="link-footer-womens"
                >
                  Women's Fragrances
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary"
                  data-testid="link-footer-mens"
                >
                  Men's Fragrances
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary"
                  data-testid="link-footer-unisex"
                >
                  Unisex Collection
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary"
                  data-testid="link-footer-limited"
                >
                  Limited Editions
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary"
                  data-testid="link-footer-gifts"
                >
                  Gift Sets
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary"
                  data-testid="link-footer-contact"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary"
                  data-testid="link-footer-shipping"
                >
                  Shipping Info
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary"
                  data-testid="link-footer-returns"
                >
                  Returns
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary"
                  data-testid="link-footer-size-guide"
                >
                  Size Guide
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary"
                  data-testid="link-footer-faq"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Newsletter</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Subscribe for exclusive offers and new arrivals.
            </p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
                data-testid="input-newsletter"
              />
              <button 
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                data-testid="button-subscribe"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © 2024 Valley Breezes Perfumes. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
