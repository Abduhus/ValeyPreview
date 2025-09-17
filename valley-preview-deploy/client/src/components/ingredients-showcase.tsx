export default function IngredientsShowcase() {
  const ingredients = [
    {
      name: "Bulgarian Rose",
      description: "Hand-picked at dawn for maximum potency and fragrance depth.",
      image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    },
    {
      name: "White Jasmine",
      description: "Captured during midnight bloom for its most intoxicating essence.",
      image: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    },
    {
      name: "Sacred Sandalwood",
      description: "Aged for decades to develop its signature creamy, woody aroma.",
      image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    },
    {
      name: "French Lavender",
      description: "Sourced from Provence fields known for their exceptional quality.",
      image: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    },
    {
      name: "Madagascar Vanilla",
      description: "Premium vanilla pods providing rich, warm, and sensual notes.",
      image: "https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    },
    {
      name: "Italian Bergamot",
      description: "Bright, zesty top notes that awaken the senses instantly.",
      image: "https://images.unsplash.com/photo-1557800636-894a64c1696f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    },
  ];

  return (
    <section className="px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="bg-card/65 backdrop-blur-glass border border-border rounded-xl p-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gradient text-center mb-12">
            Premium Ingredients
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ingredients.map((ingredient, index) => (
              <div 
                key={ingredient.name} 
                className="text-center"
                data-testid={`card-ingredient-${index}`}
              >
                <img 
                  src={ingredient.image}
                  alt={ingredient.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  data-testid={`img-ingredient-${index}`}
                />
                <h3 
                  className="font-serif text-xl font-semibold text-foreground mb-2"
                  data-testid={`text-ingredient-name-${index}`}
                >
                  {ingredient.name}
                </h3>
                <p 
                  className="text-muted-foreground text-sm"
                  data-testid={`text-ingredient-description-${index}`}
                >
                  {ingredient.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
