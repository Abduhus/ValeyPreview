import { Award, Users, Shield, Truck, Globe2, Clock } from "lucide-react";

export default function CompanyStory() {
  return (
    <section className="px-6 py-24 bg-gradient-to-b from-background/30 to-background/50">
      <div className="max-w-7xl mx-auto">
        {/* Main Story Section - Frameless */}
        <div className="text-center mb-20">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gradient mb-8">
            Your Fragrance Journey Begins Here
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="text-lg text-muted-foreground leading-relaxed space-y-6">
              <p className="text-xl">
                <strong className="text-primary font-serif">Valley Breezes - Curating Excellence in Luxury Fragrances</strong>
              </p>
              <p>
                Born from a passion for exceptional fragrances, Valley Breezes represents the finest in luxury perfumery. We believe that every scent tells a story, and every bottle holds the power to transform moments into memories.
              </p>
              <p>
                Our commitment goes beyond simply offering fragrances - we curate experiences. From the rarest oud compositions to contemporary masterpieces, we handpick each fragrance to ensure it meets our exacting standards of quality and authenticity.
              </p>
              <p>
                Whether you're discovering your signature scent or exploring new olfactory horizons, we're here to guide you through the enchanting world of premium fragrances, making luxury accessible to those who appreciate true artistry.
              </p>
            </div>
          </div>
        </div>



        {/* Core Values - Frameless Integration */}
        <div className="text-center">
          <h3 className="font-serif text-3xl md:text-4xl font-bold text-gradient mb-12">
            Our Core Values
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group text-center cursor-pointer transition-all duration-500 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-card/40 via-background/30 to-card/40 backdrop-blur-sm border border-primary/15 rounded-3xl p-8 group-hover:shadow-2xl group-hover:border-primary/30 transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-primary/20 to-accent/20 w-18 h-18 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Shield className="w-10 h-10 text-primary" />
                  </div>
                  <h4 className="font-serif font-bold text-foreground mb-3 text-lg">100% Authenticity</h4>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    Every product is guaranteed authentic, sourced directly from authorized distributors
                  </p>
                </div>
              </div>
            </div>

            <div className="group text-center cursor-pointer transition-all duration-500 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-card/40 via-background/30 to-card/40 backdrop-blur-sm border border-primary/15 rounded-3xl p-8 group-hover:shadow-2xl group-hover:border-primary/30 transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-primary/20 to-accent/20 w-18 h-18 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Award className="w-10 h-10 text-primary" />
                  </div>
                  <h4 className="font-serif font-bold text-foreground mb-3 text-lg">Premium Quality</h4>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    We select only the finest fragrances from the world's most prestigious brands
                  </p>
                </div>
              </div>
            </div>

            <div className="group text-center cursor-pointer transition-all duration-500 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-card/40 via-background/30 to-card/40 backdrop-blur-sm border border-primary/15 rounded-3xl p-8 group-hover:shadow-2xl group-hover:border-primary/30 transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-primary/20 to-accent/20 w-18 h-18 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Truck className="w-10 h-10 text-primary" />
                  </div>
                  <h4 className="font-serif font-bold text-foreground mb-3 text-lg">Fast Delivery</h4>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    Express worldwide shipping with secure packaging and tracking
                  </p>
                </div>
              </div>
            </div>

            <div className="group text-center cursor-pointer transition-all duration-500 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-card/40 via-background/30 to-card/40 backdrop-blur-sm border border-primary/15 rounded-3xl p-8 group-hover:shadow-2xl group-hover:border-primary/30 transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-primary/20 to-accent/20 w-18 h-18 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Users className="w-10 h-10 text-primary" />
                  </div>
                  <h4 className="font-serif font-bold text-foreground mb-3 text-lg">Customer First</h4>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    24/7 dedicated support for wholesale partners and retail customers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}