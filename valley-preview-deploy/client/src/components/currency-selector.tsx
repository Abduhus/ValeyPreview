import { useState } from "react";
import { ChevronDown } from "lucide-react";
import aedLogoUrl from "@assets/UAE_Dirham_Symbol.svg.png";

interface CurrencySelectorProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
}

const currencies = [
  { code: "AED", name: "UAE Dirham", symbol: "AED", logoUrl: aedLogoUrl },
  { code: "USD", name: "US Dollar", symbol: "$", logoUrl: null },
  { code: "SAR", name: "Saudi Riyal", symbol: "SAR", logoUrl: null },
  { code: "BHD", name: "Bahraini Dinar", symbol: "د.ب", logoUrl: null },
  { code: "OMR", name: "Omani Rial", symbol: "ر.ع", logoUrl: null },
  { code: "GBP", name: "British Pound", symbol: "£", logoUrl: null }
];

export default function CurrencySelector({ selectedCurrency, onCurrencyChange }: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency) || currencies[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-card/80 backdrop-blur-glass border border-primary/30 text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/25"
        style={{
          color: '#D4AF37',
          backgroundColor: 'rgba(33, 33, 33, 0.85)'
        }}
      >
        {selectedCurrencyData.logoUrl ? (
          <img 
            src={selectedCurrencyData.logoUrl} 
            alt={`${selectedCurrencyData.code} logo`} 
            className="w-5 h-5 object-contain"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        ) : (
          <span>{selectedCurrencyData.symbol}</span>
        )}
        <span>{selectedCurrencyData.code}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-2 w-48 bg-card/95 backdrop-blur-glass border border-primary/30 rounded-lg shadow-2xl z-50 overflow-hidden">
            {currencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => {
                  onCurrencyChange(currency.code);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors duration-200 flex items-center gap-3 ${
                  selectedCurrency === currency.code ? 'bg-primary/20 text-primary' : 'text-foreground'
                }`}
                style={selectedCurrency === currency.code ? { color: '#D4AF37' } : {}}
              >
                {currency.logoUrl ? (
                  <img 
                    src={currency.logoUrl} 
                    alt={`${currency.code} logo`} 
                    className="w-6 h-6 object-contain"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                ) : (
                  <span className="font-semibold text-lg">{currency.symbol}</span>
                )}
                <div>
                  <div className="font-semibold">{currency.code}</div>
                  <div className="text-xs text-muted-foreground">{currency.name}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}