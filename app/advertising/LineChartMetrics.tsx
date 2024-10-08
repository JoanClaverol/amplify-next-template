import React, { useState, useEffect } from "react";
import LineChart from "@cloudscape-design/components/line-chart";
import Box from "@cloudscape-design/components/box";
import Select, { SelectProps } from "@cloudscape-design/components/select";
import { LineChartProps } from "@cloudscape-design/components/line-chart";
import { StoreData } from "../types/advertisingTypes";

interface TransformedStoreData {
  x: Date;
  y: number;
}

interface LineChartWithMetricsProps {
  storesData: StoreData[];
  selectedStore: string | null;
  selectedStartDate: string | null;
}

// Metrics for daily difference calculation
const metricsForDailyDifference: (keyof StoreData)[] = [
  "gross_sales",
  "orders",
  "clicks",
  "impressions",
  "remaining_budget",
  "total_spend",
];

// Metrics for raw value display (like ROAS, CPO, CPC, etc.)
const metricsForRawValues: (keyof StoreData)[] = [
  "ROAS",
  "CPO",
  "CPC",
  "CPM",
  "CR_GMO",
  "facturacion_gmo",
];

// Type for metric options
type MetricOption = {
  label: string;
  value: keyof StoreData;
};

// Mapping of metrics to human-readable labels
const metricOptions: MetricOption[] = [
  { label: "Gross Sales (Daily Difference)", value: "gross_sales" },
  { label: "Orders (Daily Difference)", value: "orders" },
  { label: "Clicks (Daily Difference)", value: "clicks" },
  { label: "Impressions (Daily Difference)", value: "impressions" },
  { label: "Remaining Budget (Daily Difference)", value: "remaining_budget" },
  { label: "Total Spend (Daily Difference)", value: "total_spend" },
  { label: "ROAS", value: "ROAS" },
  { label: "CPO", value: "CPO" },
  { label: "CPC", value: "CPC" },
  { label: "CPM", value: "CPM" },
  { label: "CR_GMO", value: "CR_GMO" },
  { label: "Facturacion GMO", value: "facturacion_gmo" },
];

// Function to calculate daily differences
const calculateDailyDifferenceForMetric = (
  data: StoreData[],
  metric: keyof StoreData
): TransformedStoreData[] => {
  const sortedData = [...data].sort((a, b) => a.date - b.date);

  return sortedData
    .map((entry, index) => {
      if (index === 0) {
        return { x: new Date(entry.date), y: 0 }; // No previous data for first entry
      }

      const dailyDifference =
        (entry[metric] as number) - (sortedData[index - 1][metric] as number);

      return {
        x: new Date(entry.date),
        y: dailyDifference,
      };
    })
    .filter((entry) => !isNaN(entry.y) && entry.y !== null);
};

// Function to get raw values for metrics
const transformDataToRawValues = (
  data: StoreData[],
  metric: keyof StoreData
): TransformedStoreData[] => {
  return data
    .filter((entry) => entry[metric] !== null)
    .map((entry) => ({
      x: new Date(entry.date),
      y: entry[metric] as number,
    }));
};

const LineChartWithMetrics: React.FC<LineChartWithMetricsProps> = ({
  storesData,
  selectedStore,
  selectedStartDate,
}) => {
  console.log(storesData);
  console.log(selectedStore);
  console.log(selectedStartDate);

  const [selectedMetric, setSelectedMetric] =
    useState<keyof StoreData>("gross_sales");
  // Filter data based on selected store and start date
  const filteredData = storesData.filter(
    (store) =>
      store.store_name_scraped === selectedStore &&
      store.start_date === selectedStartDate
  );

  // Only transform data if filteredData exists
  const transformedData = metricsForDailyDifference.includes(selectedMetric)
    ? calculateDailyDifferenceForMetric(filteredData, selectedMetric)
    : transformDataToRawValues(filteredData, selectedMetric);

  const handleMetricChange = (event: SelectProps.ChangeDetail) => {
    setSelectedMetric(event.selectedOption.value as keyof StoreData);
  };

  // sort by date the transformedData
  transformedData.sort((a, b) => a.x.getTime() - b.x.getTime());

  const chartProps: LineChartProps<any> = {
    series: [
      {
        title: selectedMetric,
        type: "line",
        data: transformedData,
      },
    ],
    xScaleType: "time",
    yScaleType: "linear",
    hideFilter: true,
    hideLegend: true,
    i18nStrings: {
      xTickFormatter: (e: Date) =>
        `${e.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          weekday: "short",
        })}`,
      yTickFormatter: (e: number) =>
        e.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }),
    },
    detailPopoverSeriesContent: ({ series, x, y }) => ({
      key: series.title,
      value: y.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
    }),
    yTitle: selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1),
    // ariaLabel: "Metric Time Series Chart",
    // height: 300,
    // hideFilter: true,
    // hideLegend: true,
    // yTitle: selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1),
    // statusType: "finished",
  };
  return (
    <Box>
      <Select
        selectedOption={
          metricOptions.find((option) => option.value === selectedMetric) ||
          null
        }
        onChange={(event) => handleMetricChange(event.detail)}
        options={metricOptions}
        selectedAriaLabel="Selected"
        placeholder="Choose a metric"
      />
      <Box margin={{ top: "l" }} />
      {transformedData.length > 0 ? (
        <LineChart {...chartProps} />
      ) : (
        <Box margin={{ top: "m" }}>
          No data available for the selected store and date.
        </Box>
      )}
    </Box>
  );
};

export default LineChartWithMetrics;
