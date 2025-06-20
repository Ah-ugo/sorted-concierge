"use client";

import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/lib/currency-context";

interface PriceDisplayProps {
  price: number;
  originalCurrency?: string;
  className?: string;
  showOriginal?: boolean;
  size?: "sm" | "md" | "lg";
}

export function PriceDisplay({
  price,
  originalCurrency = "NGN",
  className = "",
  showOriginal = true,
  size = "md",
}: PriceDisplayProps) {
  const { formatPrice, currentCurrency, convertPrice } = useCurrency();

  // Ensure price is a valid number
  const validPrice = isNaN(price) || price < 0 ? 0 : price;
  const convertedPrice = convertPrice(
    validPrice,
    originalCurrency,
    currentCurrency.code
  );
  const isConverted = originalCurrency !== currentCurrency.code;

  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className={`font-bold text-secondary ${sizeClasses[size]}`}>
        {formatPrice(convertedPrice, currentCurrency.code)}
      </div>

      {isConverted && showOriginal && validPrice > 0 && (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs text-muted-foreground">
            Originally {formatPrice(validPrice, originalCurrency)}
          </Badge>
          <span className="text-xs text-muted-foreground">
            (converted from {originalCurrency})
          </span>
        </div>
      )}
    </div>
  );
}
