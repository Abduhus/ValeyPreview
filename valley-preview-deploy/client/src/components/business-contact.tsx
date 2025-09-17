import { Clock, Phone, Mail, MessageCircle, MapPin, Globe } from "lucide-react";

export default function BusinessContact() {
  return (
    <section className="px-6 py-24 bg-gradient-to-b from-background/30 to-background/50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gradient-smooth mb-6">
            Business Contact
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connect with our wholesale team for bulk orders, custom pricing, and business partnerships.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information - Frameless */}
          <div className="space-y-8">
            <h3 className="font-serif text-2xl font-bold text-gradient mb-8">
              Get In Touch
            </h3>
            
            <div className="space-y-8">
              {/* Business Hours */}
              <div className="group flex items-start gap-6 cursor-pointer transition-all duration-300 hover:-translate-y-1">
                <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-foreground mb-2 group-hover:text-gradient transition-colors duration-300">Business Hours</h3>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">9:30 AM - 6:00 PM</p>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">Monday to Friday</p>
                </div>
              </div>

              {/* Phone */}
              <div className="group flex items-start gap-6 cursor-pointer transition-all duration-300 hover:-translate-y-1">
                <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-foreground mb-2 group-hover:text-gradient transition-colors duration-300">Phone</h3>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300 font-medium">+971 50 889 7070</p>
                  <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">Available during business hours</p>
                </div>
              </div>

              {/* Email */}
              <div className="group flex items-start gap-6 cursor-pointer transition-all duration-300 hover:-translate-y-1">
                <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-foreground mb-2 group-hover:text-gradient transition-colors duration-300">Email</h3>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300 font-medium">wholesale@valleybreezes.com</p>
                  <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">Response within 24 hours</p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="group flex items-start gap-6 cursor-pointer transition-all duration-300 hover:-translate-y-1">
                <div className="bg-gradient-to-br from-green-600/20 to-green-500/20 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-foreground mb-2 group-hover:text-gradient transition-colors duration-300">WhatsApp Business</h3>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300 font-medium mb-3">+971 50 889 7070</p>
                  <a 
                    href="https://wa.me/971508897070?text=Hello%20Valley%20Breezes!%20I'm%20interested%20in%20your%20luxury%20fragrances%20and%20would%20like%20to%20discuss%20wholesale%20options."
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-3 rounded-2xl hover:shadow-xl hover:shadow-green-600/25 transition-all duration-300 font-semibold hover:-translate-y-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Contact on WhatsApp
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="group flex items-start gap-6 cursor-pointer transition-all duration-300 hover:-translate-y-1">
                <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-foreground mb-2 group-hover:text-gradient transition-colors duration-300">Location</h3>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">Dubai Investment Park 2</p>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">United Arab Emirates</p>
                </div>
              </div>

              {/* Shipping */}
              <div className="group flex items-start gap-6 cursor-pointer transition-all duration-300 hover:-translate-y-1">
                <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-foreground mb-2 group-hover:text-gradient transition-colors duration-300">Worldwide Shipping</h3>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">Fast shipping on orders over $2000</p>
                  <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">Express delivery available</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form - Frameless */}
          <div>
            <h3 className="font-serif text-2xl font-bold text-gradient mb-8">
              Write Us
            </h3>
            <p className="text-muted-foreground mb-8">
              Jot us a note and we'll get back to you as quickly as possible.
            </p>
            
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Name *
                </label>
                <input
                  type="text"
                  className="w-full bg-card/40 backdrop-blur-sm border border-primary/20 rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 hover:border-primary/30"
                  placeholder="Your full name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Email *
                </label>
                <input
                  type="email"
                  className="w-full bg-card/40 backdrop-blur-sm border border-primary/20 rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 hover:border-primary/30"
                  placeholder="your.email@company.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full bg-card/40 backdrop-blur-sm border border-primary/20 rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 hover:border-primary/30"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  What's on your mind? *
                </label>
                <textarea
                  rows={5}
                  className="w-full bg-card/40 backdrop-blur-sm border border-primary/20 rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 hover:border-primary/30 resize-none"
                  placeholder="Tell us about your wholesale requirements, bulk order needs, or any questions..."
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-4 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-1 product-card-enhanced"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}