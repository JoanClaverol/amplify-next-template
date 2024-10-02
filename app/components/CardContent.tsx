import Box from "@cloudscape-design/components/box";
import { CurrencyCode } from "../types/currency";
import { formatCurrency } from "../utils/formatCurrency";

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

