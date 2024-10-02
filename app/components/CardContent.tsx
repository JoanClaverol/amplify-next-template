import Box from "@cloudscape-design/components/box";
import { currencyConfig } from "../constants/currencyConfig";
import { CurrencyCode } from "../utils/currency";

const formatCurrency = (value: number, currency: CurrencyCode): string => {
    const config = currencyConfig[currency] || currencyConfig.EUR; // Default to EUR if currency not found
    return new Intl.NumberFormat(config.locale, { style: 'currency', currency: config.currency }).format(value);
  };

interface CardContentProps {
    title: string;
    value: number;
    currency?: CurrencyCode;
  }

export const CardContent: React.FC<CardContentProps> = ({ title, value, currency }) => (
    <Box padding="l" textAlign="center">
      <Box variant="h2" padding={{ bottom: 's' }}>{title}</Box>
      <Box variant="awsui-value-large">
        {currency ? formatCurrency(value, currency) : value}
      </Box>
    </Box>
  );

