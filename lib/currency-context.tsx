"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface Currency {
  code: string;
  symbol: string;
}

interface CurrencyContextType {
  currencies: Currency[];
  currentCurrency: Currency;
  changeCurrency: (code: string) => void;
  formatPrice: (price: number, currencyCode?: string) => string;
  isLoading: boolean;
}

// Remove the 'readonly' assertion and type it as Currency[]
const defaultCurrencies: Currency[] = [
  { code: "NGN", symbol: "₦" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
];

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // Now this will work since defaultCurrencies is mutable
  const [currencies] = useState<Currency[]>(defaultCurrencies);
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(
    defaultCurrencies[0]
  );
  const [isLoading] = useState(false);

  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency");
    if (savedCurrency) {
      const currency = currencies.find((c) => c.code === savedCurrency);
      if (currency) {
        setCurrentCurrency(currency);
      }
    }
  }, [currencies]);

  const changeCurrency = (code: string) => {
    const currency = currencies.find((c) => c.code === code);
    if (currency) {
      setCurrentCurrency(currency);
      localStorage.setItem("currency", code);
    }
  };

  const formatPrice = (price: number, currencyCode: string): string => {
    const targetCurrency =
      currencies.find((c) => c.code === currencyCode) || currentCurrency;

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: targetCurrency.code,
      minimumFractionDigits: targetCurrency.code === "NGN" ? 0 : 2,
      maximumFractionDigits: targetCurrency.code === "NGN" ? 0 : 2,
    }).format(price);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currencies,
        currentCurrency,
        changeCurrency,
        formatPrice,
        isLoading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
