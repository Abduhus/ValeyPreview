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
import diorImage from '../assets/dior-sauvage.webp';
import versaceImage from '../assets/versace-eros.jpg';

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
      image: versaceImage,
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
      image: diorImage,
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
      return chanelImage;
    } else if (name.includes('dior')) {
      // Dior - Please add your Dior image to assets folder and update this path
      // Using external image as fallback until local Dior image is added
      return diorImage;
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
      return armaniImage;
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
      return versaceImage;
    } else if (name.includes('xerjoff')) {
      // Xerjoff - Premium niche fragrance with elegant bottle design
      return xerjoffImage;
    } else {
      // Generic luxury perfume bottle
      return 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=700&h=1200&fit=crop&auto=format&q=90';
    }
  };



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
                  <h2 className="luxury-heading font-serif text-4xl md:text-6xl font-bold text-gradient-smooth max-w-lg md:max-w-2xl leading-tight mb-4 animate-fade-in">
                    {slide.title}
                  </h2>
                  <div className="luxury-divider"></div>
                  <p className="text-muted-foreground text-xl md:text-2xl mt-6 max-w-lg md:max-w-2xl mb-8 animate-fade-in-delay glass-effect rounded-xl p-4">
                    {slide.subtitle}
                  </p>
                  <Link href={slide.ctaLink}>
                    <button className="mt-12 luxury-button px-8 py-4 rounded-full font-semibold text-lg animate-fade-in-delay-2">
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
                  <h2 className="luxury-heading font-serif text-4xl md:text-6xl font-bold text-gradient-smooth max-w-lg md:max-w-2xl leading-tight mb-4 animate-fade-in">
                    {slide.title}
                  </h2>
                  <div className="luxury-divider"></div>
                  <p className="text-muted-foreground text-xl md:text-2xl mt-6 max-w-lg md:max-w-2xl mb-8 animate-fade-in-delay glass-effect rounded-xl p-4">
                    {slide.subtitle}
                  </p>
                  <Link href={slide.ctaLink}>
                    <button className="mt-12 luxury-button px-8 py-4 rounded-full font-semibold text-lg animate-fade-in-delay-2">
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
            className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10 bg-card/80 backdrop-blur-lg border border-primary/30 rounded-full p-4 shadow-lg hover:bg-card/90 transition-all duration-300 opacity-100 group-hover:opacity-100 z-20 luxury-button"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-8 h-8 text-primary" />
          </button>
          
          <button
            onClick={() => setCurrentSlide(prev => (prev + 1) % heroSlides.length)}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10 bg-card/80 backdrop-blur-lg border border-primary/30 rounded-full p-4 shadow-lg hover:bg-card/90 transition-all duration-300 opacity-100 group-hover:opacity-100 z-20 luxury-button"
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
                    ? 'bg-primary w-8 luxury-button' 
                    : 'bg-card/50 hover:bg-card'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center mb-16 px-6 py-16 luxury-card glass-effect">
          <h2 className="luxury-heading font-serif text-4xl md:text-5xl font-bold text-gradient-smooth mb-6">
            Explore Our Wide Range
          </h2>
          <div className="luxury-divider mx-auto max-w-xs"></div>
          <p className="text-primary text-lg max-w-2xl mx-auto">
            Discover luxury fragrances from the world's most prestigious brands
          </p>
        </div>

        {/* Best-Loved Fragrances Section */}
        <div className="mb-20 luxury-card glass-effect p-8">
          <div className="text-center mb-12">
            <h3 className="luxury-heading font-serif text-2xl md:text-3xl font-bold text-gradient-smooth mb-4">
              Best-Loved Fragrances
            </h3>
            <div className="luxury-divider mx-auto max-w-xs"></div>
            <p className="text-primary">
              Our most popular and trusted luxury fragrance brands
            </p>
          </div>
          
          {/* Scrollable container for Best-Loved Brands */}
          <div 
            className="relative group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div 
              ref={bestLovedRef}
              className="flex overflow-x-auto space-x-4 md:space-x-6 px-4 py-4 scrollbar-thin scrollbar-thumb-primary scrollbar-track-background scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
              style={{ scrollbarColor: "#D4AF37 #1a1a1a", scrollbarWidth: "thin" }}
            >
              {featuredBrands.map(brand => (
                <div key={brand.id} className="w-48 md:w-64 flex-shrink-0 luxury-card glass-effect">
                  <div className="relative w-full h-48 md:h-64 bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${getPerfumeBottleBackground(brand.name)})` }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-background/0 to-background/40"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <img src={brand.logo} alt={brand.name} className="w-24 h-24 md:w-32 md:h-32 object-contain" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Latest Additions Section */}
        <div className="mb-20 luxury-card glass-effect p-8">
          <div className="text-center mb-12">
            <h3 className="luxury-heading font-serif text-2xl md:text-3xl font-bold text-gradient-smooth mb-4">
              Latest Additions
            </h3>
            <div className="luxury-divider mx-auto max-w-xs"></div>
            <p className="text-primary">
              Discover the newest arrivals in our collection
            </p>
          </div>
          
          {/* Scrollable container for Latest Additions */}
          <div 
            className="relative group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div 
              ref={latestAdditionsRef}
              className="flex overflow-x-auto space-x-4 md:space-x-6 px-4 py-4 scrollbar-thin scrollbar-thumb-primary scrollbar-track-background scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
              style={{ scrollbarColor: "#D4AF37 #1a1a1a", scrollbarWidth: "thin" }}
            >
              {latestBrands.map(brand => (
                <div key={brand.id} className="w-48 md:w-64 flex-shrink-0 luxury-card glass-effect">
                  <div className="relative w-full h-48 md:h-64 bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${getPerfumeBottleBackground(brand.name)})` }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-background/0 to-background/40"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <img src={brand.logo} alt={brand.name} className="w-24 h-24 md:w-32 md:h-32 object-contain" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>


      </section>
  );
}