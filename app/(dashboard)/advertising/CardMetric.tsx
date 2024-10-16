import React from "react";
import Box from "@cloudscape-design/components/box";
import { CardContent } from "../../components/CardContent";
import { CurrencyCode } from "../../types/currency";

interface CardMetricProps {
  title: string;
  value: any;
  pctChange?: any;
  currency?: string;
  color?: string;
}

const CardMetric: React.FC<CardMetricProps> = ({
  title,
  value,
  pctChange,
  currency,
}) => (
  <div
    style={{
      position: "relative",
      padding: "8px",
      borderRadius: "8px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      width: "100%",
      height: "100px",
      boxSizing: "border-box",
    }}
  >
    <div>
      <Box fontSize="body-s" fontWeight="bold" color="text-body-secondary">
        {title}
      </Box>
      <Box fontSize="heading-xl">
        {value !== undefined
          ? currency
            ? `${currency} ${Number(value).toFixed(2)}`
            : value.toString()
          : "N/A"}
      </Box>
    </div>
    {pctChange !== null && (
      <div
        style={{
          position: "absolute",
          bottom: "8px",
          right: "8px",
          fontSize: "small",
        }}
      >
        <CardContent
          title=""
          value={pctChange !== undefined ? pctChange : "N/A"}
          formatAsPercentage
          size="small"
          changeIndicator
        />
      </div>
    )}
  </div>
);

export default CardMetric;
