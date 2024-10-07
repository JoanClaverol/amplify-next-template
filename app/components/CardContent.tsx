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
  color?: BoxProps.Color;
  isBold?: boolean; // New prop to control boldness
}

export const CardContent: React.FC<CardContentProps> = ({
  title,
  value,
  currency,
  formatAsPercentage,
  changeIndicator,
  size = "medium",
  color,
  isBold = false, // Default to false (not bold)
}) => {
  const formattedValue = formatAsPercentage
    ? `${(Number(value) * 100).toFixed(0)}%`
    : currency
    ? formatCurrency(Number(value), currency)
    : value;

  const getChangeColor = (value: number): BoxProps.Color => {
    if (value > 0) return "text-status-success";
    if (value < 0) return "text-status-error";
    return "inherit";
  };

  // Determine the color to use
  const finalColor =
    color || (changeIndicator ? getChangeColor(Number(value)) : undefined);

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
        color={finalColor} // Use finalColor here
        fontWeight={isBold ? "bold" : "normal"} // Apply bold if isBold is true
      >
        {changeIndicator &&
          (Number(value) > 0 ? "↑" : Number(value) < 0 ? "↓" : "")}
        {formattedValue}
      </Box>
    </Box>
  );
};
