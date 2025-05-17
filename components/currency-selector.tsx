"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCurrency } from "@/lib/currency-context"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function CurrencySelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { currencies, currentCurrency, changeCurrency } = useCurrency()

  return (
    <div className="currency-selector fixed bottom-20 left-4 z-40">
      <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="bg-white dark:bg-gray-800 shadow-md">
        {currentCurrency.code}{" "}
        {isOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
      </Button>

      {isOpen && (
        <div className="currency-dropdown">
          {currencies.map((currency) => (
            <div
              key={currency.code}
              className={`currency-option ${
                currency.code === currentCurrency.code ? "bg-gray-100 dark:bg-gray-700" : ""
              }`}
              onClick={() => {
                changeCurrency(currency.code)
                setIsOpen(false)
              }}
            >
              <span className="mr-2">{currency.symbol}</span>
              {currency.code}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
