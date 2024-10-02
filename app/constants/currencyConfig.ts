import { CurrencyCode, CurrencyConfig } from "../utils/currency";

export const currencyConfig: Record<CurrencyCode, CurrencyConfig> = {
    EUR: { locale: 'de-DE', currency: 'EUR' },
    USD: { locale: 'en-US', currency: 'USD' },
    GBP: { locale: 'en-GB', currency: 'GBP' },
    // Add more currencies as needed
  };
  