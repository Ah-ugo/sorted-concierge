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
  convertPrice: (
    price: number,
    fromCurrency?: string,
    toCurrency?: string
  ) => number; // Add this line
  isLoading: boolean;
  lastUpdated: Date | null;
  refreshRates: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch exchange rates from your backend
  const fetchExchangeRates = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://naija-concierge-api.onrender.com/exchange-rates"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch exchange rates");
      }

      const data = await response.json();
      const rates = data.rates;

      // Update currencies with new rates
      const updatedCurrencies = currencies.map((currency) => ({
        ...currency,
        rate: rates[currency.code] || currency.rate,
      }));

      setCurrencies(updatedCurrencies);

      // Update current currency rate if it exists in the new rates
      const updatedCurrentCurrency = updatedCurrencies.find(
        (c) => c.code === currentCurrency.code
      );
      if (updatedCurrentCurrency) {
        setCurrentCurrency(updatedCurrentCurrency);
      }

      setLastUpdated(new Date());

      // Cache the rates in localStorage with timestamp
      localStorage.setItem(
        "exchangeRates",
        JSON.stringify({
          rates: updatedCurrencies,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error("Error fetching exchange rates:", error);

      // Try to load cached rates if available
      const cached = localStorage.getItem("exchangeRates");
      if (cached) {
        try {
          const { rates, timestamp } = JSON.parse(cached);
          const cacheAge = Date.now() - timestamp;

          // Use cached rates if they're less than 1 hour old
          if (cacheAge < 60 * 60 * 1000) {
            setCurrencies(rates);
            setLastUpdated(new Date(timestamp));
          }
        } catch (e) {
          console.error("Error loading cached rates:", e);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh rates manually
  const refreshRates = async () => {
    await fetchExchangeRates();
  };

  useEffect(() => {
    // Load saved currency preference from localStorage
    const savedCurrency = localStorage.getItem("currency");
    if (savedCurrency) {
      const currency = currencies.find((c) => c.code === savedCurrency);
      if (currency) {
        setCurrentCurrency(currency);
      }
    }

    // Initial fetch of exchange rates
    fetchExchangeRates();

    // Set up automatic refresh every 30 minutes
    const interval = setInterval(fetchExchangeRates, 30 * 60 * 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
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

    // Convert price if needed
    let convertedPrice = price;
    if (
      currencyCode &&
      currencyCode !== "NGN" &&
      targetCurrency.code !== "NGN"
    ) {
      // Convert from NGN to target currency
      convertedPrice = price * targetCurrency.rate;
    } else if (!currencyCode && currentCurrency.code !== "NGN") {
      // Convert from NGN to current currency
      convertedPrice = price * currentCurrency.rate;
    }

    // Ensure minimum price display
    convertedPrice = Math.max(convertedPrice, 0.01);

    // Use Intl.NumberFormat for proper formatting
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: targetCurrency.code,
      minimumFractionDigits: targetCurrency.code === "NGN" ? 0 : 2,
      maximumFractionDigits: targetCurrency.code === "NGN" ? 0 : 2,
    }).format(convertedPrice);
  };

  // Add a convertPrice function to the context
  const convertPrice = (
    price: number,
    fromCurrency = "NGN",
    toCurrency = "NGN"
  ): number => {
    if (fromCurrency === toCurrency) return price;

    const fromRate = currencies.find((c) => c.code === fromCurrency)?.rate || 1;
    const toRate = currencies.find((c) => c.code === toCurrency)?.rate || 1;

    // Convert to NGN first, then to target currency
    const ngnAmount = fromCurrency === "NGN" ? price : price / fromRate;
    const convertedAmount =
      toCurrency === "NGN" ? ngnAmount : ngnAmount * toRate;

    return Math.max(convertedAmount, 0.01); // Ensure minimum price
  };

  // Update the context value to include convertPrice
  return (
    <CurrencyContext.Provider
      value={{
        currencies,
        currentCurrency,
        changeCurrency,
        formatPrice,
        convertPrice, // Add this line
        isLoading,
        lastUpdated,
        refreshRates,
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
