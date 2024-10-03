import Box, { BoxProps } from "@cloudscape-design/components/box";
import { CurrencyCode } from "../types/currency";
import { formatCurrency } from "../utils/formatCurrency";

interface CardContentProps {
  title: string;
  value: number | string;
  currency?: CurrencyCode;
  formatAsPercentage?: boolean;
  changeIndicator?: boolean;
  size?: "small" | "medium" | "large";
}

export const CardContent: React.FC<CardContentProps> = ({
  title,
  value,
  currency,
  formatAsPercentage,
  changeIndicator,
  size = "medium",
}) => {
  const formattedValue = formatAsPercentage
    ? `${(Number(value) * 100).toFixed(2)}%`
    : currency
    ? formatCurrency(Number(value), currency)
    : value;

  const getChangeColor = (value: number): BoxProps.Color => {
    if (value > 0) return "text-status-success";
    if (value < 0) return "text-status-error";
    return "inherit";
  };

  return (
    <Box padding="xs" textAlign="left">
      <Box
        variant="awsui-key-label"
        fontSize={size === "small" ? "body-s" : "body-m"}
      >
        {title}
      </Box>
      <Box
        variant="awsui-value-large"
        fontSize={size === "small" ? "heading-s" : "heading-m"}
        color={changeIndicator ? getChangeColor(Number(value)) : undefined}
      >
        {changeIndicator &&
          (Number(value) > 0 ? "↑" : Number(value) < 0 ? "↓" : "")}
        {formattedValue}
      </Box>
    </Box>
  );
};
