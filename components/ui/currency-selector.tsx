"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useCurrency } from "@/lib/currency-context";

interface CurrencySelectorProps {
  className?: string;
  showLabel?: boolean;
  variant?: "default" | "compact";
}

export function CurrencySelector({
  className = "",
  showLabel = true,
  variant = "default",
}: CurrencySelectorProps) {
  const { currencies, currentCurrency, changeCurrency, isLoading } =
    useCurrency();

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {isLoading && (
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        )}
        <Select value={currentCurrency.code} onValueChange={changeCurrency}>
          <SelectTrigger className="w-20 h-8 text-xs border-muted/50 bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                <div className="flex items-center gap-2">
                  <span className="font-mono">{currency.symbol}</span>
                  <span>{currency.code}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-white">Currency</label>
          {isLoading && (
            <Badge variant="outline" className="text-xs">
              <Loader2 className="w-3 h-3 animate-spin mr-1" />
              Updating rates
            </Badge>
          )}
        </div>
      )}
      <Select value={currentCurrency.code} onValueChange={changeCurrency}>
        <SelectTrigger className="border-muted/50 bg-card text-white focus:border-secondary-light focus:ring-secondary-light">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((currency) => (
            <SelectItem key={currency.code} value={currency.code}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg">{currency.symbol}</span>
                  <div>
                    <div className="font-medium">{currency.code}</div>
                    <div className="text-xs text-muted-foreground">
                      {currency.name}
                    </div>
                  </div>
                </div>
                {currency.code !== "NGN" && (
                  <div className="text-xs text-muted-foreground">
                    1 NGN = {currency.rate.toFixed(6)} {currency.code}
                  </div>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
