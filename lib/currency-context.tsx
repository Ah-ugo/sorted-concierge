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
  rate: number;
}

interface CurrencyContextType {
  currencies: Currency[];
  currentCurrency: Currency;
  changeCurrency: (code: string) => void;
  formatPrice: (price: number, currencyCode?: string) => string;
}

const defaultCurrencies: Currency[] = [
  { code: "NGN", symbol: "₦", rate: 1 },
  { code: "USD", symbol: "$", rate: 0.00065 },
  { code: "EUR", symbol: "€", rate: 0.0006 },
  { code: "GBP", symbol: "£", rate: 0.00052 },
];

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currencies, setCurrencies] = useState<Currency[]>(defaultCurrencies);
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(
    defaultCurrencies[0]
  );

  useEffect(() => {
    // Load saved currency preference from localStorage
    const savedCurrency = localStorage.getItem("currency");
    if (savedCurrency) {
      const currency = currencies.find((c) => c.code === savedCurrency);
      if (currency) {
        setCurrentCurrency(currency);
      }
    }

    // Placeholder for fetching exchange rates
    const fetchExchangeRates = async () => {
      try {
        // In a real app, fetch from an API like exchangerate-api.com
        // const response = await fetch('https://api.exchangerate-api.com/v4/latest/NGN');
        // const data = await response.json();
        // setCurrencies((prev) =>
        //   prev.map((c) => ({ ...c, rate: data.rates[c.code] || c.rate }))
        // );
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    fetchExchangeRates();
  }, []);

  const changeCurrency = (code: string) => {
    const currency = currencies.find((c) => c.code === code);
    if (currency) {
      setCurrentCurrency(currency);
      localStorage.setItem("currency", code);
    }
  };

  const formatPrice = (price: number, currencyCode?: string): string => {
    const targetCurrency = currencyCode
      ? currencies.find((c) => c.code === currencyCode) || currentCurrency
      : currentCurrency;

    // If price is already in the target currency, skip conversion
    const convertedPrice =
      currencyCode === "NGN" && targetCurrency.code !== "NGN"
        ? price * targetCurrency.rate
        : price;

    // Use Intl.NumberFormat for proper formatting
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: targetCurrency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(convertedPrice);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currencies,
        currentCurrency,
        changeCurrency,
        formatPrice,
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
