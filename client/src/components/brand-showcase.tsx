import { useState, useRef, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Link } from "wouter";

// Import local perfume images
import tomFordImage from '../assets/Best_tom_ford_perfumes_1980x.webp';
import yslImage from '../assets/YSL_black-opium_1686207039.jpg';
import creedImage from '../assets/Creed-Perfume-.png';
import chanelImage from '../assets/chanel-no5.jpg';
import xerjoffImage from '../assets/xerjoff-aventus.jpg';
import armaniImage from '../assets/armani-acqua-di-gio.jpg';
// Note: versace and dior images still need to be sourced

interface Brand {
  id: string;
  name: string;
  logo: string;
  productCount: number;
  featured?: boolean;
}

const featuredBrands: Brand[] = [
  { 
    id: "tom-ford", 
    name: "Tom Ford", 
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 280 80'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23D4AF37;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23F9E79F;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Ctext x='140' y='45' text-anchor='middle' fill='url(%23grad1)' font-family='serif' font-size='24' font-weight='bold' letter-spacing='2px'%3ETOM FORD%3C/text%3E%3C/svg%3E",
    productCount: 37, 
    featured: true 
  },
  { 
    id: "chanel", 
    name: "Chanel", 
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 280 80'%3E%3Cdefs%3E%3ClinearGradient id='grad2' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23D4AF37;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23F9E79F;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Ctext x='140' y='45' text-anchor='middle' fill='url(%23grad2)' font-family='serif' font-size='32' font-weight='bold' letter-spacing='4px'%3ECHANEL%3C/text%3E%3C/svg%3E",
    productCount: 65, 
    featured: true 
  },
  { 
    id: "yves-saint-laurent", 
    name: "Yves Saint Laurent", 
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 280 80'%3E%3Cdefs%3E%3ClinearGradient id='grad3' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23D4AF37;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23F9E79F;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Ctext x='140' y='45' text-anchor='middle' fill='url(%23grad3)' font-family='serif' font-size='32' font-weight='bold' letter-spacing='4px'%3EYSL%3C/text%3E%3C/svg%3E",
    productCount: 32, 
    featured: true 
  },
  { 
    id: "creed", 
    name: "Creed", 
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 280 80'%3E%3Cdefs%3E%3ClinearGradient id='grad4' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23D4AF37;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23F9E79F;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Ctext x='140' y='45' text-anchor='middle' fill='url(%23grad4)' font-family='serif' font-size='28' font-weight='bold' letter-spacing='3px'%3ECREED%3C/text%3E%3C/svg%3E",
    productCount: 28, 
    featured: true 
  },
  { 
    id: "versace", 
    name: "Versace", 
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 280 80'%3E%3Cdefs%3E%3ClinearGradient id='grad5' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23D4AF37;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23F9E79F;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Ctext x='140' y='45' text-anchor='middle' fill='url(%23grad5)' font-family='serif' font-size='28' font-weight='bold' letter-spacing='3px'%3EVERSACE%3C/text%3E%3C/svg%3E",
    productCount: 60, 
    featured: true 
  },
  { 
    id: "xerjoff", 
    name: "Xerjoff", 
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 280 80'%3E%3Cdefs%3E%3ClinearGradient id='grad6' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23D4AF37;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23F9E79F;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Ctext x='140' y='45' text-anchor='middle' fill='url(%23grad6)' font-family='serif' font-size='28' font-weight='bold' letter-spacing='3px'%3EXERJOFF%3C/text%3E%3C/svg%3E",
    productCount: 57, 
    featured: true 
  },
  { 
    id: "dior", 
    name: "Dior", 
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 280 80'%3E%3Cdefs%3E%3ClinearGradient id='grad7' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23D4AF37;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23F9E79F;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Ctext x='140' y='45' text-anchor='middle' fill='url(%23grad7)' font-family='serif' font-size='32' font-weight='bold' letter-spacing='4px'%3EDIOR%3C/text%3E%3C/svg%3E",
    productCount: 41, 
    featured: true 
  },
  { 
    id: "armani", 
    name: "Armani", 
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 280 80'%3E%3Cdefs%3E%3ClinearGradient id='grad8' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23D4AF37;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23F9E79F;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Ctext x='140' y='45' text-anchor='middle' fill='url(%23grad8)' font-family='serif' font-size='24' font-weight='bold' letter-spacing='2px'%3EARMANI%3C/text%3E%3C/svg%3E",
    productCount: 29, 
    featured: true 
  }
];

const latestBrands: Brand[] = [
  { 
    id: "rabdan", 
    name: "Rabdan", 
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 280 80'%3E%3Cdefs%3E%3ClinearGradient id='grad12' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23D4AF37;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23F9E79F;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Ctext x='140' y='45' text-anchor='middle' fill='url(%23grad12)' font-family='serif' font-size='28' font-weight='bold' letter-spacing='3px'%3ERABDAN%3C/text%3E%3C/svg%3E",
    productCount: 14 
  },
  { 
    id: "signature-royale", 
    name: "Signature Royale", 
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 280 80'%3E%3Cdefs%3E%3ClinearGradient id='grad13' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23D4AF37;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23F9E79F;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Ctext x='140' y='35' text-anchor='middle' fill='url(%23grad13)' font-family='serif' font-size='16' font-weight='bold' letter-spacing='1px'%3ESIGNATURE%3C/text%3E%3Ctext x='140' y='55' text-anchor='middle' fill='url(%23grad13)' font-family='serif' font-size='16' font-weight='bold' letter-spacing='2px'%3EROYALE%3C/text%3E%3C/svg%3E",
    productCount: 9 
  },
  { 
    id: "pure-essence", 
    name: "Pure Essence", 
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 280 80'%3E%3Cdefs%3E%3ClinearGradient id='grad14' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23D4AF37;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23F9E79F;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Ctext x='140' y='35' text-anchor='middle' fill='url(%23grad14)' font-family='serif' font-size='18' font-weight='bold' letter-spacing='1px'%3EPURE%3C/text%3E%3Ctext x='140' y='55' text-anchor='middle' fill='url(%23grad14)' font-family='serif' font-size='18' font-weight='bold' letter-spacing='2px'%3EESSENCE%3C/text%3E%3C/svg%3E",
    productCount: 5 
  },
  { 
    id: "coreterno", 
    name: "Coreterno", 
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 280 80'%3E%3Cdefs%3E%3ClinearGradient id='grad15' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23D4AF37;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23F9E79F;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Ctext x='140' y='45' text-anchor='middle' fill='url(%23grad15)' font-family='serif' font-size='22' font-weight='bold' letter-spacing='2px'%3ECORETERNO%3C/text%3E%3C/svg%3E",
    productCount: 7 
  },
  { 
    id: "chanel", 
    name: "Chanel", 
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 280 80'%3E%3Cdefs%3E%3ClinearGradient id='grad16' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23D4AF37;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23F9E79F;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Ctext x='140' y='45' text-anchor='middle' fill='url(%23grad16)' font-family='serif' font-size='28' font-weight='bold' letter-spacing='3px'%3ECHANEL%3C/text%3E%3C/svg%3E",
    productCount: 65 
  },
  { 
    id: "versace", 
    name: "Versace", 
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 280 80'%3E%3Cdefs%3E%3ClinearGradient id='grad17' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23D4AF37;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23F9E79F;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Ctext x='140' y='45' text-anchor='middle' fill='url(%23grad17)' font-family='serif' font-size='28' font-weight='bold' letter-spacing='3px'%3EVERSACE%3C/text%3E%3C/svg%3E",
    productCount: 60 
  },
  { 
    id: "xerjoff", 
    name: "Xerjoff", 
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 280 80'%3E%3Cdefs%3E%3ClinearGradient id='grad18' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23D4AF37;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23F9E79F;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Ctext x='140' y='45' text-anchor='middle' fill='url(%23grad18)' font-family='serif' font-size='28' font-weight='bold' letter-spacing='3px'%3EXERJOFF%3C/text%3E%3C/svg%3E",
    productCount: 57 
  }
];

export default function BrandShowcase() {
  const [activeTab, setActiveTab] = useState<'best-loved' | 'latest' | 'exclusive'>('best-loved');
  const bestLovedRef = useRef<HTMLDivElement>(null);
  const latestAdditionsRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Hero carousel data - Updated with brand-specific images
  const heroSlides = [
    {
      id: 1,
      title: "Tom Ford Luxury Collection",
      subtitle: "Experience the epitome of luxury with Tom Ford's exclusive fragrance collection",
      image: tomFordImage,
      ctaText: "Discover Tom Ford",
      ctaLink: "/catalog?brand=tom-ford"
    },
    {
      id: 2,
      title: "Yves Saint Laurent Elegance",
      subtitle: "Embrace the bold sophistication of YSL's iconic fragrances",
      image: yslImage,
      ctaText: "Explore YSL",
      ctaLink: "/catalog?brand=yves-saint-laurent"
    },
    {
      id: 3,
      title: "Creed Heritage Collection",
      subtitle: "Discover the legacy of Creed's handcrafted fragrances since 1760",
      image: creedImage,
      ctaText: "View Creed Collection",
      ctaLink: "/catalog?brand=creed"
    },
    {
      id: 4,
      title: "Chanel Timeless Classics",
      subtitle: "Experience the legendary allure of Chanel's iconic fragrances",
      image: chanelImage,
      ctaText: "Shop Chanel",
      ctaLink: "/catalog?brand=chanel"
    },
    {
      id: 5,
      title: "Versace Bold Statements",
      subtitle: "Make a powerful impression with Versace's dynamic fragrances",
      // TODO: Replace with high-quality local image after downloading
      image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59db9?w=1920&h=800&fit=crop&auto=format&q=90",
      ctaText: "Browse Versace",
      ctaLink: "/catalog?brand=versace"
    },
    {
      id: 6,
      title: "Xerjoff Niche Luxury",
      subtitle: "Indulge in the exceptional craftsmanship of Xerjoff's premium fragrances",
      image: xerjoffImage,
      ctaText: "Discover Xerjoff",
      ctaLink: "/catalog?brand=xerjoff"
    },
    {
      id: 7,
      title: "Dior Prestige Collection",
      subtitle: "Discover the art of sophistication with Dior's exceptional fragrances",
      // TODO: Replace with high-quality local image after downloading
      image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59db9?w=1920&h=800&fit=crop&auto=format&q=90",
      ctaText: "Explore Dior",
      ctaLink: "/catalog?brand=dior"
    },
    {
      id: 8,
      title: "Armani Exclusive Selection",
      subtitle: "Experience the essence of Italian elegance with Armani's luxury fragrances",
      image: armaniImage,
      ctaText: "View Armani",
      ctaLink: "/catalog?brand=armani"
    }
  ];
  
  // Custom smooth scroll function
  const smoothScroll = (element: HTMLDivElement, scrollAmount: number) => {
    const start = element.scrollLeft;
    const end = start + scrollAmount;
    const duration = 500; // milliseconds
    let startTime: number | null = null;
    
    const animateScroll = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Ease-out function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentScroll = start + (scrollAmount * easeOut);
      
      element.scrollLeft = currentScroll;
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
    
    requestAnimationFrame(animateScroll);
  };
  
  // Auto-scroll functionality with smooth scrolling
  useEffect(() => {
    if (!isHovering) {
      autoScrollInterval.current = setInterval(() => {
        if (bestLovedRef.current) {
          const container = bestLovedRef.current;
          const scrollAmount = container.offsetWidth * 0.6666; // 2 cards width
          
          // If we're near the end, scroll back to the beginning
          if (container.scrollLeft + container.offsetWidth >= container.scrollWidth - 10) {
            smoothScroll(container, -container.scrollLeft); // Smooth scroll to beginning
          } else {
            smoothScroll(container, scrollAmount); // Smooth scroll by 2 cards
          }
        }
      }, 5000); // Auto-scroll every 5 seconds
    }
    
    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [isHovering]);
  
  // Hero carousel auto-advance
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 7000); // Change slide every 7 seconds
    
    return () => clearInterval(interval);
  }, [heroSlides.length]);
  
  // Scroll functions for best-loved brands
  const scrollBestLovedLeft = () => {
    if (bestLovedRef.current) {
      const container = bestLovedRef.current;
      const scrollAmount = -(container.offsetWidth * 0.6666); // 2 cards width
      smoothScroll(container, scrollAmount);
    }
  };
  
  const scrollBestLovedRight = () => {
    if (bestLovedRef.current) {
      const container = bestLovedRef.current;
      const scrollAmount = container.offsetWidth * 0.6666; // 2 cards width
      smoothScroll(container, scrollAmount);
    }
  };
  
  // Scroll functions for latest additions
  const scrollLatestLeft = () => {
    if (latestAdditionsRef.current) {
      const container = latestAdditionsRef.current;
      const scrollAmount = -(container.offsetWidth * 0.6666); // 2 cards width
      smoothScroll(container, scrollAmount);
    }
  };
  
  const scrollLatestRight = () => {
    if (latestAdditionsRef.current) {
      const container = latestAdditionsRef.current;
      const scrollAmount = container.offsetWidth * 0.6666; // 2 cards width
      smoothScroll(container, scrollAmount);
    }
  };

  // Get high-resolution perfume bottle background based on brand name
  const getPerfumeBottleBackground = (brandName: string) => {
    const name = brandName.toLowerCase();
    if (name.includes('tom ford')) {
      // Tom Ford - Use local downloaded image
      return tomFordImage;
    } else if (name.includes('chanel')) {
      // Chanel No. 5 - legendary square crystal bottle with minimalist design
      return 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=700&h=1200&fit=crop&auto=format&q=90';
    } else if (name.includes('dior')) {
      // Dior - Please add your Dior image to assets folder and update this path
      // Using external image as fallback until local Dior image is added
      return 'https://images.unsplash.com/photo-1588405748880-12d1d2a59db9?w=700&h=1200&fit=crop&auto=format&q=90';
    } else if (name.includes('yves saint laurent') || name.includes('ysl')) {
      // YSL - Use local downloaded image
      return yslImage;
    } else if (name.includes('creed')) {
      // Creed Aventus - Use local downloaded image
      return creedImage;
    } else if (name.includes('montale')) {
      // Montale - signature cylindrical aluminum bottles (silver/metallic)
      return 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=700&h=1200&fit=crop&auto=format&q=90';
    } else if (name.includes('gucci')) {
      // Gucci Bloom - pink/rose modern luxury bottle with floral design
      return 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=700&h=1200&fit=crop&auto=format&q=90';
    } else if (name.includes('armani')) {
      // Armani Acqua di Gio - blue ocean-inspired frosted bottle
      return 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=700&h=1200&fit=crop&auto=format&q=90';
    } else if (name.includes('burberry')) {
      // Burberry Her - pink/rose bottle with signature tartan bow detail
      return 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=700&h=1200&fit=crop&auto=format&q=90';
    } else if (name.includes('lancôme') || name.includes('lancome')) {
      // Lancôme La Vie Est Belle - elegant crystal bottle with pink/rose tones
      return 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=700&h=1200&fit=crop&auto=format&q=90';
    } else if (name.includes('mont blanc') || name.includes('montblanc')) {
      // Mont Blanc Legend - sophisticated black/dark bottle with silver accents
      return 'https://images.unsplash.com/photo-1562832135-14a35d25edef?w=700&h=1200&fit=crop&auto=format&q=90';
    } else if (name.includes('hugo boss') || name.includes('boss')) {
      // Hugo Boss Bottled - modern gray/silver bottle with geometric design
      return 'https://images.unsplash.com/photo-1588405748880-12d1d2a59db9?w=700&h=1200&fit=crop&auto=format&q=90';
    } else if (name.includes('rabdan')) {
      // Rabdan - Premium Middle Eastern fragrances with elegant bottle design
      return 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=700&h=1200&fit=crop&auto=format&q=90';
    } else if (name.includes('signature royale')) {
      // Signature Royale - Royal luxury fragrances with ornate bottle design
      return 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=700&h=1200&fit=crop&auto=format&q=90';
    } else if (name.includes('pure essence')) {
      // Pure Essence - Clean, minimalist bottle design with pure aesthetic
      return 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=700&h=1200&fit=crop&auto=format&q=90';
    } else if (name.includes('coreterno')) {
      // Coreterno - Bold, edgy bottle design with contemporary appeal
      return 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=700&h=1200&fit=crop&auto=format&q=90';
    } else if (name.includes('versace')) {
      // Versace - Bold, glamorous bottle design with gold accents
      return 'https://images.unsplash.com/photo-1588405748880-12d1d2a59db9?w=700&h=1200&fit=crop&auto=format&q=90';
    } else if (name.includes('xerjoff')) {
      // Xerjoff - Premium niche fragrance with elegant bottle design
      return 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=700&h=1200&fit=crop&auto=format&q=90';
    } else {
      // Generic luxury perfume bottle
      return 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=700&h=1200&fit=crop&auto=format&q=90';
    }
  };

  // Exclusive perfumes for the Exclusive Collections section
  const exclusivePerfumes = [
    {
      id: "151",
      name: "CHANEL No.5",
      brand: "CHANEL",
      price: "550.00",
      imageUrl: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400&h=500&fit=crop&auto=format&q=90",
      description: "The legendary fragrance that epitomizes timeless elegance"
    },
    {
      id: "161",
      name: "VERSACE EROS",
      brand: "VERSACE",
      price: "210.00",
      imageUrl: "https://images.unsplash.com/photo-1588405748880-12d1d2a59db9?w=400&h=500&fit=crop&auto=format&q=90",
      description: "A bold and masculine fragrance for the modern man"
    },
    {
      id: "176",
      name: "XERJOFF ACCENTO",
      brand: "XERJOFF",
      price: "490.00",
      imageUrl: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400&h=500&fit=crop&auto=format&q=90",
      description: "A luxurious niche fragrance with exceptional quality"
    },
    {
      id: "131",
      name: "CHANEL COCO MADEMOISELLE",
      brand: "CHANEL",
      price: "540.00",
      imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=500&fit=crop&auto=format&q=90",
      description: "An elegant floral fragrance with a modern twist"
    },
    {
      id: "167",
      name: "VERSACE DYLAN BLUE",
      brand: "VERSACE",
      price: "165.00",
      imageUrl: "https://images.unsplash.com/photo-1588405748880-12d1d2a59db9?w=400&h=500&fit=crop&auto=format&q=90",
      description: "A fresh and aquatic fragrance for the contemporary woman"
    },
    {
      id: "189",
      name: "XERJOFF ITALICA",
      brand: "XERJOFF",
      price: "450.00",
      imageUrl: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400&h=500&fit=crop&auto=format&q=90",
      description: "A sophisticated Italian-inspired luxury fragrance"
    }
  ];

  return (
    <section className="px-0 py-0 bg-gradient-to-b from-background/30 to-background/50">
      {/* Hero Carousel - Full Banner */}
      <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden shadow-2xl group">
        {heroSlides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {typeof slide.image === 'string' ? (
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-background/85 to-background/45"></div>
                <div className="absolute inset-0 flex flex-col items-start justify-center pl-8 md:pl-16 lg:pl-24 text-left">
                  <h2 className="font-serif text-4xl md:text-6xl font-bold text-gradient-smooth max-w-lg md:max-w-2xl leading-tight mb-4 animate-fade-in">
                    {slide.title}
                  </h2>
                  <p className="text-muted-foreground text-xl md:text-2xl mt-6 max-w-lg md:max-w-2xl mb-8 animate-fade-in-delay">
                    {slide.subtitle}
                  </p>
                  <Link href={slide.ctaLink}>
                    <button className="mt-12 bg-gradient-to-r from-primary to-accent text-primary-foreground px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:shadow-primary/30 transition-all duration-500 hover:scale-105 text-lg animate-fade-in-delay-2">
                      {slide.ctaText}
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="w-full h-full relative">
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/85 to-background/45"></div>
                <div className="absolute inset-0 flex flex-col items-start justify-center pl-8 md:pl-16 lg:pl-24 text-left">
                  <h2 className="font-serif text-4xl md:text-6xl font-bold text-gradient-smooth max-w-lg md:max-w-2xl leading-tight mb-4 animate-fade-in">
                    {slide.title}
                  </h2>
                  <p className="text-muted-foreground text-xl md:text-2xl mt-6 max-w-lg md:max-w-2xl mb-8 animate-fade-in-delay">
                    {slide.subtitle}
                  </p>
                  <Link href={slide.ctaLink}>
                    <button className="mt-12 bg-gradient-to-r from-primary to-accent text-primary-foreground px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:shadow-primary/30 transition-all duration-500 hover:scale-105 text-lg animate-fade-in-delay-2">
                      {slide.ctaText}
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}
          
          {/* Navigation Arrows - Hidden by default, visible on hover */}
          <button
            onClick={() => setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-card/80 backdrop-blur-lg border border-primary/30 rounded-full p-4 shadow-lg hover:bg-card/90 transition-all duration-300 opacity-0 group-hover:opacity-100 z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-8 h-8 text-primary" />
          </button>
          
          <button
            onClick={() => setCurrentSlide(prev => (prev + 1) % heroSlides.length)}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-card/80 backdrop-blur-lg border border-primary/30 rounded-full p-4 shadow-lg hover:bg-card/90 transition-all duration-300 opacity-0 group-hover:opacity-100 z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="w-8 h-8 text-primary" />
          </button>
          
          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-primary w-8' 
                    : 'bg-card/50 hover:bg-card'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center mb-16 px-6 py-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gradient-smooth mb-6">
            Explore Our Wide Range
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover luxury fragrances from the world's most prestigious brands
          </p>
        </div>

        {/* Best-Loved Fragrances Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-gradient-smooth mb-4">
              Best-Loved Fragrances
            </h3>
            <p className="text-muted-foreground">
              Our most popular and trusted luxury fragrance brands
            </p>
          </div>
          
          {/* Scrollable container for Best-Loved Brands */}
          <div 
            className="relative group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <button 
              onClick={scrollBestLovedLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-card/80 backdrop-blur-lg border border-primary/30 rounded-full p-3 shadow-lg hover:bg-card/90 transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-primary" />
            </button>
            
            <div 
              ref={bestLovedRef}
              className="flex overflow-x-scroll scroll-smooth space-x-4 md:space-x-6"
            >
              {featuredBrands.map(brand => (
                <div key={brand.id} className="w-48 md:w-64 flex-shrink-0">
                  <div className="relative w-full h-48 md:h-64 bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${getPerfumeBottleBackground(brand.name)})` }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-background/0 to-background/40"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <img src={brand.logo} alt={brand.name} className="w-12 h-12 md:w-16 md:h-16" />
                      <p className="text-sm md:text-base font-semibold text-primary-foreground mt-2">
                        {brand.name}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {brand.productCount} products
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={scrollBestLovedRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-card/80 backdrop-blur-lg border border-primary/30 rounded-full p-3 shadow-lg hover:bg-card/90 transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-primary" />
            </button>
          </div>
        </div>

        {/* Latest Additions Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-gradient-smooth mb-4">
              Latest Additions
            </h3>
            <p className="text-muted-foreground">
              Discover the newest arrivals in our collection
            </p>
          </div>
          
          {/* Scrollable container for Latest Additions */}
          <div 
            className="relative group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <button 
              onClick={scrollLatestLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-card/80 backdrop-blur-lg border border-primary/30 rounded-full p-3 shadow-lg hover:bg-card/90 transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-primary" />
            </button>
            
            <div 
              ref={latestAdditionsRef}
              className="flex overflow-x-scroll scroll-smooth space-x-4 md:space-x-6"
            >
              {latestBrands.map(brand => (
                <div key={brand.id} className="w-48 md:w-64 flex-shrink-0">
                  <div className="relative w-full h-48 md:h-64 bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${getPerfumeBottleBackground(brand.name)})` }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-background/0 to-background/40"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <img src={brand.logo} alt={brand.name} className="w-12 h-12 md:w-16 md:h-16" />
                      <p className="text-sm md:text-base font-semibold text-primary-foreground mt-2">
                        {brand.name}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {brand.productCount} products
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={scrollLatestRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-card/80 backdrop-blur-lg border border-primary/30 rounded-full p-3 shadow-lg hover:bg-card/90 transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-primary" />
            </button>
          </div>
        </div>

        {/* Exclusive Collections Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-gradient-smooth mb-4">
              Exclusive Collections
            </h3>
            <p className="text-muted-foreground">
              Discover our exclusive perfume collections
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {exclusivePerfumes.map(perfume => (
              <div key={perfume.id} className="relative w-full h-64 bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${perfume.imageUrl})` }}>
                <div className="absolute inset-0 bg-gradient-to-b from-background/0 to-background/40"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <p className="text-sm md:text-base font-semibold text-primary-foreground mt-2">
                    {perfume.name}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {perfume.brand}
                  </p>
                  <p className="text-sm md:text-base font-semibold text-primary-foreground mt-2">
                    ${perfume.price}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {perfume.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
              ref={bestLovedRef}
              className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide brand-card-container px-10"
            >
              {featuredBrands.map((brand) => (
                <div key={brand.id} className="flex-shrink-0 w-[calc(33.333%-16px)] md:w-[calc(33.333%-24px)]">
                  <Link href={`/catalog?brand=${brand.id}`}>
                    <div
                      className="group cursor-pointer text-center transition-all duration-500 hover:-translate-y-2"
                    >
                      <div className="mb-16">
                        <div className="w-full h-96 mx-auto bg-gradient-to-br from-card/75 via-background/55 to-card/65 backdrop-blur-sm border border-primary/25 rounded-3xl flex items-center justify-center product-card-enhanced group-hover:shadow-2xl group-hover:border-primary/45 group-hover:bg-gradient-to-br group-hover:from-card/90 group-hover:via-background/75 group-hover:to-card/80 transition-all duration-500 relative overflow-hidden">
                          {/* High-resolution perfume bottle background */}
                          <img 
                            src={getPerfumeBottleBackground(brand.name)} 
                            alt={`${brand.name} perfume bottle background`} 
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-all duration-700 scale-105 group-hover:scale-100"
                            loading="lazy"
                            onError={(e) => {
                              // Fallback to generic luxury perfume image on error
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=700&h=1200&fit=crop&auto=format&q=90';
                            }}
                          />
                          
                          {/* Enhanced gradient overlays for better contrast */}
                          <div className="absolute inset-0 bg-gradient-to-t from-background/99 via-background/10 to-background/90 z-5"></div>
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/18 via-transparent to-accent/18 opacity-90 group-hover:opacity-100 transition-opacity duration-500 z-5"></div>
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_95%,rgba(212,175,55,0.35),transparent_75%)] opacity-75 group-hover:opacity-100 transition-opacity duration-500 z-5"></div>
                          
                          {/* Brand logo with enhanced positioning */}
                          <img 
                            src={brand.logo} 
                            alt={`${brand.name} logo`}
                            className="w-64 h-40 object-contain group-hover:scale-110 transition-transform duration-500 relative z-10 filter drop-shadow-2xl"
                            loading="lazy"
                          />
                          
                          {/* Click indicator */}
                          <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-primary/90 backdrop-blur-sm text-primary-foreground rounded-full p-2 shadow-lg">
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="relative z-10">
                        <h4 className="font-serif font-bold text-foreground group-hover:text-gradient transition-all duration-300 text-lg mb-2">
                          {brand.name}
                        </h4>
                        <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                          {brand.productCount} products
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            
            <button 
              onClick={scrollBestLovedRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-card/80 backdrop-blur-lg border border-primary/30 rounded-full p-3 shadow-lg hover:bg-card/90 transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-primary" />
            </button>
          </div>
        </div>

        {/* Latest Additions Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-gradient-smooth mb-4">
              See What's New - Latest Additions
            </h3>
            <p className="text-muted-foreground">
              Fresh arrivals and newest fragrance collections
            </p>
          </div>
          
          {/* Scrollable container for Latest Additions */}
          <div className="relative group">
            <button 
              onClick={scrollLatestLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-card/80 backdrop-blur-lg border border-primary/30 rounded-full p-3 shadow-lg hover:bg-card/90 transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-primary" />
            </button>
            
            <div 
              ref={latestAdditionsRef}
              className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide brand-card-container px-10"
            >
              {latestBrands.map((brand) => (
                <div key={brand.id} className="flex-shrink-0 w-[calc(33.333%-16px)] md:w-[calc(33.333%-24px)]">
                  <Link href={`/catalog?brand=${brand.id}`}>
                    <div
                      className="group cursor-pointer text-center transition-all duration-500 hover:-translate-y-2"
                    >
                      <div className="mb-16">
                        <div className="w-full h-96 mx-auto bg-gradient-to-br from-card/75 via-background/55 to-card/65 backdrop-blur-sm border border-primary/25 rounded-3xl flex items-center justify-center product-card-enhanced group-hover:shadow-2xl group-hover:border-primary/45 group-hover:bg-gradient-to-br group-hover:from-card/90 group-hover:via-background/75 group-hover:to-card/80 transition-all duration-500 relative overflow-hidden">
                          {/* High-resolution perfume bottle background */}
                          <img 
                            src={getPerfumeBottleBackground(brand.name)} 
                            alt={`${brand.name} perfume bottle background`} 
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-all duration-700 scale-105 group-hover:scale-100"
                            loading="lazy"
                            onError={(e) => {
                              // Fallback to generic luxury perfume image on error
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=700&h=1200&fit=crop&auto=format&q=90';
                            }}
                          />
                          
                          {/* Enhanced gradient overlays for better contrast */}
                          <div className="absolute inset-0 bg-gradient-to-t from-background/99 via-background/10 to-background/90 z-5"></div>
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/18 via-transparent to-accent/18 opacity-90 group-hover:opacity-100 transition-opacity duration-500 z-5"></div>
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_95%,rgba(212,175,55,0.35),transparent_75%)] opacity-75 group-hover:opacity-100 transition-opacity duration-500 z-5"></div>
                          
                          {/* Brand logo with enhanced positioning */}
                          <img 
                            src={brand.logo} 
                            alt={`${brand.name} logo`}
                            className="w-64 h-40 object-contain group-hover:scale-110 transition-transform duration-500 relative z-10 filter drop-shadow-2xl"
                            loading="lazy"
                          />
                          
                          {/* Click indicator */}
                          <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-primary/90 backdrop-blur-sm text-primary-foreground rounded-full p-2 shadow-lg">
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="relative z-10">
                        <h4 className="font-serif font-bold text-foreground group-hover:text-gradient transition-all duration-300 text-lg mb-2">
                          {brand.name}
                        </h4>
                        <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300 mb-3">
                          {brand.productCount} products
                        </p>
                        <span className="inline-block bg-gradient-to-r from-green-600 to-green-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
                          New
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            
            <button 
              onClick={scrollLatestRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-card/80 backdrop-blur-lg border border-primary/30 rounded-full p-3 shadow-lg hover:bg-card/90 transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-primary" />
            </button>
          </div>
        </div>

        {/* Exclusive Collections Section */}
        <div>
          <div className="text-center mb-16">
            <h3 className="font-serif text-3xl md:text-4xl font-bold text-gradient-smooth mb-6">
              Exclusive Collections
            </h3>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              Discover our most prestigious and carefully curated fragrance collections, featuring rare gems, limited editions, and bespoke luxury experiences
            </p>
          </div>
          
          {/* Exclusive Perfumes Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Ultra Premium Collection - Large Feature Card */}
            <div className="lg:col-span-1 group cursor-pointer transition-all duration-700 hover:-translate-y-4">
              <div className="relative h-96 bg-gradient-to-br from-primary/20 via-card/70 to-accent/20 backdrop-blur-lg border-2 border-primary/30 rounded-3xl overflow-hidden group-hover:shadow-2xl group-hover:shadow-primary/25 group-hover:border-primary/50 transition-all duration-700">
                {/* Premium Background Image */}
                <img 
                  src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=600&fit=crop&auto=format&q=90" 
                  alt="Ultra Premium Collection" 
                  className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-all duration-700 scale-105 group-hover:scale-100"
                />
                
                {/* Enhanced Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-background/60 z-5"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-accent/25 opacity-80 group-hover:opacity-100 transition-opacity duration-700 z-5"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(212,175,55,0.4),transparent_75%)] opacity-60 group-hover:opacity-80 transition-opacity duration-700 z-5"></div>
                
                {/* Content */}
                <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                        <span className="text-xl">👑</span>
                      </div>
                      <span className="bg-gradient-to-r from-primary/80 to-accent/80 text-white text-xs px-3 py-1.5 rounded-full font-semibold backdrop-blur-sm border border-primary/30 shadow-lg">
                        ULTRA EXCLUSIVE
                      </span>
                    </div>
                    
                    <h4 className="font-serif text-2xl md:text-3xl font-bold text-gradient mb-4 group-hover:scale-105 transition-transform duration-500 origin-left">
                      Ultra Premium Collection
                    </h4>
                    
                    <p className="text-foreground/90 mb-6 group-hover:text-foreground transition-colors duration-500 text-lg leading-relaxed">
                      The pinnacle of luxury fragrances featuring rare ingredients, master perfumer signatures, and centuries-old craftsmanship. Limited to 50 pieces worldwide.
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-foreground/70">
                      <div className="font-semibold text-primary">12 Exclusive Fragrances</div>
                      <div>Starting from د.إ 2,500</div>
                    </div>
                    <button className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-8 py-3 rounded-full font-semibold hover:shadow-xl hover:shadow-primary/30 transition-all duration-500 hover:scale-105 group-hover:-translate-y-1">
                      <Link href="/ultra-premium" className="text-decoration-none">
                        Explore Collection
                      </Link>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Limited Editions */}
            <div className="group cursor-pointer transition-all duration-700 hover:-translate-y-4">
              <div className="relative h-96 bg-gradient-to-br from-accent/20 via-card/70 to-primary/20 backdrop-blur-lg border-2 border-accent/30 rounded-3xl overflow-hidden group-hover:shadow-2xl group-hover:shadow-accent/25 group-hover:border-accent/50 transition-all duration-700">
                {/* Limited Edition Background */}
                <img 
                  src="https://images.unsplash.com/photo-1588405748880-12d1d2a59db9?w=800&h=600&fit=crop&auto=format&q=90" 
                  alt="Limited Editions" 
                  className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-all duration-700 scale-105 group-hover:scale-100"
                />
                
                {/* Enhanced Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-background/60 z-5"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-accent/25 via-transparent to-primary/25 opacity-80 group-hover:opacity-100 transition-opacity duration-700 z-5"></div>
                
                {/* Content */}
                <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                        <span className="text-xl">⭐</span>
                      </div>
                      <span className="bg-gradient-to-r from-red-500/80 to-red-600/80 text-white text-xs px-3 py-1.5 rounded-full font-semibold backdrop-blur-sm border border-red-400/30 shadow-lg animate-pulse">
                        LIMITED TIME
                      </span>
                    </div>
                    
                    <h4 className="font-serif text-2xl md:text-3xl font-bold text-gradient mb-4 group-hover:scale-105 transition-transform duration-500 origin-left">
                      Limited Editions
                    </h4>
                    
                    <p className="text-foreground/90 mb-6 group-hover:text-foreground transition-colors duration-500 text-lg leading-relaxed">
                      Seasonal releases and exclusive collaborations with renowned perfume houses. Each bottle tells a unique story.
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-foreground/70">
                      <div className="font-semibold text-accent">8 Limited Releases</div>
                      <div>Starting from د.إ 850</div>
                    </div>
                    <button className="bg-gradient-to-r from-accent to-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:shadow-xl hover:shadow-accent/30 transition-all duration-500 hover:scale-105 group-hover:-translate-y-1">
                      <Link href="/limited-editions" className="text-decoration-none">
                        View Limited
                      </Link>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Secondary Collections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Gift Sets & Collections */}
            <Link href="/exclusive-collections">
              <div className="group cursor-pointer transition-all duration-500 hover:-translate-y-3">
                <div className="relative h-80 bg-gradient-to-br from-primary/15 via-card/70 to-accent/15 backdrop-blur-lg border border-primary/25 rounded-2xl overflow-hidden group-hover:shadow-xl group-hover:border-primary/40 transition-all duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&h=400&fit=crop&auto=format&q=90" 
                  alt="Gift Sets" 
                  className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-35 transition-all duration-500 scale-105 group-hover:scale-100"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-background/70 z-5"></div>
                
                <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                      <span className="text-lg">🎁</span>
                    </div>
                    <h4 className="font-serif text-xl font-bold text-gradient mb-3 text-center">Gift Sets</h4>
                    <p className="text-muted-foreground mb-4 group-hover:text-foreground transition-colors duration-300 text-center text-sm">
                      Elegantly curated gift sets perfect for special occasions and celebrations
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xs text-foreground/60 mb-3">
                      <div className="font-semibold text-primary">25+ Gift Sets</div>
                    </div>
                    <button className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-2.5 rounded-full font-semibold hover:shadow-lg transition-all duration-300 text-sm hover:scale-105">
                      Discover Sets
                    </button>
                  </div>
                </div>
              </div>
            </div>
            </Link>
            
            {/* Vintage Collection */}
            <Link href="/exclusive-collections">
              <div className="group cursor-pointer transition-all duration-500 hover:-translate-y-3">
                <div className="relative h-80 bg-gradient-to-br from-amber-500/15 via-card/70 to-yellow-600/15 backdrop-blur-lg border border-amber-400/25 rounded-2xl overflow-hidden group-hover:shadow-xl group-hover:border-amber-400/40 transition-all duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&h=400&fit=crop&auto=format&q=90" 
                  alt="Vintage Collection" 
                  className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-35 transition-all duration-500 scale-105 group-hover:scale-100"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-background/70 z-5"></div>
                
                <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                      <span className="text-lg">🏛️</span>
                    </div>
                    <h4 className="font-serif text-xl font-bold text-gradient mb-3 text-center">Vintage Collection</h4>
                    <p className="text-muted-foreground mb-4 group-hover:text-foreground transition-colors duration-300 text-center text-sm">
                      Timeless classics and discontinued treasures from legendary fragrance houses
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xs text-foreground/60 mb-3">
                      <div className="font-semibold text-amber-500">15+ Vintage Finds</div>
                    </div>
                    <button className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg transition-all duration-300 text-sm hover:scale-105">
                      Explore Vintage
                    </button>
                  </div>
                </div>
              </div>
            </div>
            </Link>
            
            {/* Artisan Collection */}
            <Link href="/exclusive-collections">
              <div className="group cursor-pointer transition-all duration-500 hover:-translate-y-3">
                <div className="relative h-80 bg-gradient-to-br from-purple-500/15 via-card/70 to-indigo-600/15 backdrop-blur-lg border border-purple-400/25 rounded-2xl overflow-hidden group-hover:shadow-xl group-hover:border-purple-400/40 transition-all duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=400&fit=crop&auto=format&q=90" 
                  alt="Artisan Collection" 
                  className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-35 transition-all duration-500 scale-105 group-hover:scale-100"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-background/70 z-5"></div>
                
                <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                      <span className="text-lg">🎨</span>
                    </div>
                    <h4 className="font-serif text-xl font-bold text-gradient mb-3 text-center">Artisan Collection</h4>
                    <p className="text-muted-foreground mb-4 group-hover:text-foreground transition-colors duration-300 text-center text-sm">
                      Handcrafted fragrances from independent perfumers and niche ateliers
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xs text-foreground/60 mb-3">
                      <div className="font-semibold text-purple-500">20+ Artisan Pieces</div>
                    </div>
                    <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg transition-all duration-300 text-sm hover:scale-105">
                      View Artisan
                    </button>
                  </div>
                </div>
              </div>
            </div>
            </Link>
          </div>
          
          {/* Call-to-Action Banner */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-primary/10 via-card/50 to-accent/10 backdrop-blur-lg border border-primary/20 rounded-3xl p-8 mx-auto max-w-4xl">
              <h4 className="font-serif text-2xl md:text-3xl font-bold text-gradient-smooth mb-4">
                Can't Find What You're Looking For?
              </h4>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                Our fragrance experts are here to help you discover your perfect scent or source exclusive pieces from our private collection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-1">
                  <Link href="/exclusive-collections" className="text-decoration-none">
                    View All Collections
                  </Link>
                </button>
                <button className="border border-primary text-primary px-8 py-3 rounded-full font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-1">
                  <Link href="/catalog" className="text-decoration-none">
                    Browse Full Catalog
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
