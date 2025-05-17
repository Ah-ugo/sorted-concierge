"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Currency {
  code: string
  symbol: string
  rate: number
}

interface CurrencyContextType {
  currencies: Currency[]
  currentCurrency: Currency
  changeCurrency: (code: string) => void
  formatPrice: (price: string | number) => string
}

const defaultCurrencies: Currency[] = [
  { code: "NGN", symbol: "₦", rate: 1 },
  { code: "USD", symbol: "$", rate: 0.00065 },
  { code: "EUR", symbol: "€", rate: 0.0006 },
  { code: "GBP", symbol: "£", rate: 0.00052 },
]

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currencies, setCurrencies] = useState<Currency[]>(defaultCurrencies)
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(defaultCurrencies[0])

  useEffect(() => {
    // Load saved currency preference from localStorage
    const savedCurrency = localStorage.getItem("currency")
    if (savedCurrency) {
      const currency = currencies.find((c) => c.code === savedCurrency)
      if (currency) {
        setCurrentCurrency(currency)
      }
    }

    // Fetch latest exchange rates (in a real app)
    // This is a placeholder for demonstration
    const fetchExchangeRates = async () => {
      try {
        // In a real app, you would fetch from an API
        // const response = await fetch('https://api.exchangerate-api.com/v4/latest/NGN')
        // const data = await response.json()
        // Update currencies with latest rates
      } catch (error) {
        console.error("Error fetching exchange rates:", error)
      }
    }

    fetchExchangeRates()
  }, [])

  const changeCurrency = (code: string) => {
    const currency = currencies.find((c) => c.code === code)
    if (currency) {
      setCurrentCurrency(currency)
      localStorage.setItem("currency", code)
    }
  }

  const formatPrice = (price: string | number): string => {
    // Convert price to number if it's a string
    const numericPrice = typeof price === "string" ? Number.parseFloat(price.replace(/[^\d.-]/g, "")) : price

    // If price is not a valid number, return original
    if (isNaN(numericPrice)) {
      return typeof price === "string" ? price : String(price)
    }

    // Convert price to current currency
    const convertedPrice = numericPrice * currentCurrency.rate

    // Format the price with the currency symbol
    return `${currentCurrency.symbol}${convertedPrice.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

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
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
