import { currencyConfig } from "../constants/currencyConfig";
import { CurrencyCode } from "../types/currency";

export const formatCurrency = (value: number, currency: CurrencyCode): string => {
    const config = currencyConfig[currency] || currencyConfig.EUR; // Default to EUR if currency not found
    return new Intl.NumberFormat(config.locale, { style: 'currency', currency: config.currency }).format(value);
  };
