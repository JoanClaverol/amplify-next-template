"use client";
import React, { useState } from "react";
import LineChart from "@cloudscape-design/components/line-chart";
import Box from "@cloudscape-design/components/box";
import Select, { SelectProps } from "@cloudscape-design/components/select";
import { LineChartProps } from "@cloudscape-design/components/line-chart";

interface TransformedDataPoint {
  x: Date;
  y: number;
}

// Define the structure of the data
interface DataPoint {
  store_name_scraped: string;
  start_date: string;
  date: number;
  status: string[];
  gross_sales: number;
  orders: number;
  clicks: number;
  impressions: number;
  remaining_budget: number;
  average_daily_budget: number;
  total_spend: number;
  impressions_diff: number | null;
  clicks_diff: number | null;
  orders_diff: number | null;
  gross_sales_diff: number | null;
  remaining_budget_diff: number | null;
  average_daily_budget_diff: number | null;
  total_spend_diff: number | null;
  CR_GMO: number | null;
  facturacion_gmo: number | null;
  ROAS: number | null;
  CPO: number | null;
  CPC: number | null;
  CPM: number | null;
  pedidos_gmo: number | null;
  daily_budget: number | null;
  impressions_pct_change: number | null;
  clicks_pct_change: number | null;
  orders_pct_change: number | null;
  gross_sales_pct_change: number | null;
  remaining_budget_pct_change: number | null;
  average_daily_budget_pct_change: null;
  total_spend_pct_change: number | null;
  CR_GMO_pct_change: number | null;
  facturacion_gmo_pct_change: number | null;
  ROAS_pct_change: number | null;
  CPO_pct_change: number | null;
  CPC_pct_change: number | null;
  CPM_pct_change: number | null;
  pedidos_gmo_pct_change: number | null;
  daily_budget_pct_change: null;
}

// Define options for the metric selection
interface MetricOption {
  label: string;
  value: keyof DataPoint;
}
// Sample data
const data = [
  {
    store_name_scraped: "default",
    start_date: "Started 08/04/2024",
    date: 1728172800000,
    status: ["Active"],
    gross_sales: 51940.45,
    orders: 2502,
    clicks: 10265,
    impressions: 119670,
    remaining_budget: 148.3,
    average_daily_budget: 90,
    total_spend: 10809.33,
    impressions_diff: 4937,
    clicks_diff: 422,
    orders_diff: 114,
    gross_sales_diff: 2266.75,
    remaining_budget_diff: 97.46,
    average_daily_budget_diff: 5,
    total_spend_diff: 627.8,
    CR_GMO: 0.0854770103,
    facturacion_gmo: 2266.75,
    ROAS: 3.6106244027,
    CPO: 5.5070175439,
    CPC: 1.4876777251,
    CPM: 127.1622442779,
    pedidos_gmo: 114,
    daily_budget: 5,
    impressions_pct_change: 0.1570189829,
    clicks_pct_change: 0.1105263158,
    orders_pct_change: -0.088,
    gross_sales_pct_change: -0.146484272,
    remaining_budget_pct_change: 748.6923076923,
    average_daily_budget_pct_change: null,
    total_spend_pct_change: 0.0541339244,
    CR_GMO_pct_change: -0.0401831498,
    facturacion_gmo_pct_change: -0.146484272,
    ROAS_pct_change: -0.1903156627,
    CPO_pct_change: 0.1558486013,
    CPC_pct_change: -0.0507798785,
    CPM_pct_change: -0.0889225329,
    pedidos_gmo_pct_change: -0.088,
    daily_budget_pct_change: null,
  },
  {
    store_name_scraped: "default",
    start_date: "Started 08/04/2024",
    date: 1728086400000,
    status: ["Active"],
    gross_sales: 51557.55,
    orders: 2483,
    clicks: 10205,
    impressions: 118936,
    remaining_budget: 237.5,
    average_daily_budget: 90,
    total_spend: 10720.03,
    impressions_diff: 4850,
    clicks_diff: 415,
    orders_diff: 112,
    gross_sales_diff: 2244.52,
    remaining_budget_diff: 101.73,
    average_daily_budget_diff: 5,
    total_spend_diff: 623.5,
    CR_GMO: 0.0855670103,
    facturacion_gmo: 2244.52,
    ROAS: 3.5998716921,
    CPO: 5.5669642857,
    CPC: 1.5024096386,
    CPM: 128.5567010309,
    pedidos_gmo: 112,
    daily_budget: 5,
    impressions_pct_change: 0.0628972167,
    clicks_pct_change: 0.0641025641,
    orders_pct_change: -0.0967741935,
    gross_sales_pct_change: -0.1670519952,
    remaining_budget_pct_change: -509.65,
    average_daily_budget_pct_change: null,
    total_spend_pct_change: 0.0452465172,
    CR_GMO_pct_change: 0.0011340206,
    facturacion_gmo_pct_change: -0.1670519952,
    ROAS_pct_change: -0.2031085576,
    CPO_pct_change: 0.1572372155,
    CPC_pct_change: -0.0177201404,
    CPM_pct_change: -0.0166062148,
    pedidos_gmo_pct_change: -0.0967741935,
    daily_budget_pct_change: null,
  },
  {
    store_name_scraped: "default",
    start_date: "Started 08/04/2024",
    date: 1728000000000,
    status: ["Active"],
    gross_sales: 51163.07,
    orders: 2466,
    clicks: 10147,
    impressions: 118261,
    remaining_budget: 326.17,
    average_daily_budget: 90,
    total_spend: 10629.32,
    impressions_diff: 4744,
    clicks_diff: 407,
    orders_diff: 106,
    gross_sales_diff: 2082.5,
    remaining_budget_diff: 105.42,
    average_daily_budget_diff: 5,
    total_spend_diff: 619.12,
    CR_GMO: 0.0857925801,
    facturacion_gmo: 2082.5,
    ROAS: 3.3636451738,
    CPO: 5.840754717,
    CPC: 1.5211793612,
    CPM: 130.5059021922,
    pedidos_gmo: 106,
    daily_budget: 5,
    impressions_pct_change: -0.0206440958,
    clicks_pct_change: 0.0099255583,
    orders_pct_change: -0.2148148148,
    gross_sales_pct_change: -0.2838548383,
    remaining_budget_pct_change: 33.2272727273,
    average_daily_budget_pct_change: null,
    total_spend_pct_change: 0.0449988185,
    CR_GMO_pct_change: 0.0312140397,
    facturacion_gmo_pct_change: -0.2838548383,
    ROAS_pct_change: -0.3146928504,
    CPO_pct_change: 0.3308947217,
    CPC_pct_change: 0.0347285598,
    CPM_pct_change: 0.0670266182,
    pedidos_gmo_pct_change: -0.2148148148,
    daily_budget_pct_change: null,
  },
  {
    store_name_scraped: "default",
    start_date: "Started 08/04/2024",
    date: 1727913600000,
    status: ["Active"],
    gross_sales: 50730.27,
    orders: 2445,
    clicks: 10090,
    impressions: 117606,
    remaining_budget: 416.61,
    average_daily_budget: 90,
    total_spend: 10539.32,
    impressions_diff: 4307,
    clicks_diff: 367,
    orders_diff: 90,
    gross_sales_diff: 1759.26,
    remaining_budget_diff: 161.61,
    average_daily_budget_diff: 5,
    total_spend_diff: 561,
    CR_GMO: 0.0852101231,
    facturacion_gmo: 1759.26,
    ROAS: 3.1359358289,
    CPO: 6.2333333333,
    CPC: 1.5286103542,
    CPM: 130.2530763873,
    pedidos_gmo: 90,
    daily_budget: 5,
    impressions_pct_change: -0.1925384327,
    clicks_pct_change: -0.1862527716,
    orders_pct_change: -0.4078947368,
    gross_sales_pct_change: -0.4514774247,
    remaining_budget_pct_change: -4.2569528416,
    average_daily_budget_pct_change: null,
    total_spend_pct_change: -0.1329211747,
    CR_GMO_pct_change: 0.0077844709,
    facturacion_gmo_pct_change: -0.4514774247,
    ROAS_pct_change: -0.367390185,
    CPO_pct_change: 0.4643997939,
    CPC_pct_change: 0.065538284,
    CPM_pct_change: 0.0738329358,
    pedidos_gmo_pct_change: -0.4078947368,
    daily_budget_pct_change: null,
  },
  {
    store_name_scraped: "default",
    start_date: "Started 08/04/2024",
    date: 1727827200000,
    status: ["Active"],
    gross_sales: 50409.95,
    orders: 2429,
    clicks: 10030,
    impressions: 117008,
    remaining_budget: 506.04,
    average_daily_budget: 90,
    total_spend: 10449.32,
    impressions_diff: 9308,
    clicks_diff: 782,
    orders_diff: 235,
    gross_sales_diff: 4799.2,
    remaining_budget_diff: 165.69,
    average_daily_budget_diff: 5,
    total_spend_diff: 1152.12,
    CR_GMO: 0.0840137516,
    facturacion_gmo: 4799.2,
    ROAS: 4.165538312,
    CPO: 4.9026382979,
    CPC: 1.4732992327,
    CPM: 123.7773957886,
    pedidos_gmo: 235,
    daily_budget: 5,
    impressions_pct_change: null,
    clicks_pct_change: null,
    orders_pct_change: null,
    gross_sales_pct_change: null,
    remaining_budget_pct_change: null,
    average_daily_budget_pct_change: null,
    total_spend_pct_change: null,
    CR_GMO_pct_change: null,
    facturacion_gmo_pct_change: null,
    ROAS_pct_change: null,
    CPO_pct_change: null,
    CPC_pct_change: null,
    CPM_pct_change: null,
    pedidos_gmo_pct_change: null,
    daily_budget_pct_change: null,
  },
  {
    store_name_scraped: "default",
    start_date: "Started 08/04/2024",
    date: 1727740800000,
    status: ["Active"],
    gross_sales: 50099.21,
    orders: 2413,
    clicks: 9973,
    impressions: 116423,
    remaining_budget: 594.33,
    average_daily_budget: 90,
    total_spend: 10361.29,
    impressions_diff: null,
    clicks_diff: null,
    orders_diff: null,
    gross_sales_diff: null,
    remaining_budget_diff: null,
    average_daily_budget_diff: null,
    total_spend_diff: null,
    CR_GMO: null,
    facturacion_gmo: null,
    ROAS: null,
    CPO: null,
    CPC: null,
    CPM: null,
    pedidos_gmo: null,
    daily_budget: null,
    impressions_pct_change: null,
    clicks_pct_change: null,
    orders_pct_change: null,
    gross_sales_pct_change: null,
    remaining_budget_pct_change: null,
    average_daily_budget_pct_change: null,
    total_spend_pct_change: null,
    CR_GMO_pct_change: null,
    facturacion_gmo_pct_change: null,
    ROAS_pct_change: null,
    CPO_pct_change: null,
    CPC_pct_change: null,
    CPM_pct_change: null,
    pedidos_gmo_pct_change: null,
    daily_budget_pct_change: null,
  },
  {
    store_name_scraped: "default",
    start_date: "Started 08/04/2024",
    date: 1727654400000,
    status: ["Paused", "Active"],
    gross_sales: 50040.8,
    orders: 2407,
    clicks: 9910,
    impressions: 115626,
    remaining_budget: 338.88,
    average_daily_budget: 87.61,
    total_spend: 10270.43,
    impressions_diff: 4684,
    clicks_diff: 409,
    orders_diff: 130,
    gross_sales_diff: 2688.96,
    remaining_budget_diff: 338.88,
    average_daily_budget_diff: 2.61,
    total_spend_diff: 632.11,
    CR_GMO: 0.0873185312,
    facturacion_gmo: 2688.96,
    ROAS: 4.2539431428,
    CPO: 4.8623846154,
    CPC: 1.5455012225,
    CPM: 134.9508966695,
    pedidos_gmo: 130,
    daily_budget: 2.61,
    impressions_pct_change: null,
    clicks_pct_change: null,
    orders_pct_change: null,
    gross_sales_pct_change: null,
    remaining_budget_pct_change: null,
    average_daily_budget_pct_change: null,
    total_spend_pct_change: null,
    CR_GMO_pct_change: null,
    facturacion_gmo_pct_change: null,
    ROAS_pct_change: null,
    CPO_pct_change: null,
    CPC_pct_change: null,
    CPM_pct_change: null,
    pedidos_gmo_pct_change: null,
    daily_budget_pct_change: null,
  },
];

// Metrics for daily difference calculation
const metricsForDailyDifference: (keyof DataPoint)[] = [
  "gross_sales",
  "orders",
  "clicks",
  "impressions",
  "remaining_budget",
  "total_spend",
];

// Metrics for raw value display (like ROAS, CPO, CPC, etc.)
const metricsForRawValues: (keyof DataPoint)[] = [
  "ROAS",
  "CPO",
  "CPC",
  "CPM",
  "CR_GMO",
  "facturacion_gmo",
];

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
  data: DataPoint[],
  metric: keyof DataPoint
): TransformedDataPoint[] => {
  // Sort the data by date
  const sortedData = [...data].sort((a, b) => a.date - b.date);

  return sortedData
    .map((entry, index) => {
      if (index === 0) {
        return { x: new Date(entry.date), y: 0 }; // No previous data for first entry, set y to 0
      }

      const dailyDifference =
        (entry[metric] as number) - (sortedData[index - 1][metric] as number);

      return {
        x: new Date(entry.date),
        y: dailyDifference,
      };
    })
    .filter((entry) => !isNaN(entry.y) && entry.y !== null); // Filter out entries where y is NaN or null
};

// Function to get raw values for metrics
const transformDataToRawValues = (
  data: DataPoint[],
  metric: keyof DataPoint
): TransformedDataPoint[] => {
  return data
    .filter((entry) => entry[metric] !== null)
    .map((entry) => ({
      x: new Date(entry.date) as Date,
      y: entry[metric] as number,
    }));
};

const LineChartWithMetrics: React.FC = () => {
  // State for selected metric
  const [selectedMetric, setSelectedMetric] =
    useState<keyof DataPoint>("gross_sales");

  // Transformed data based on the selected metric
  const transformedData = metricsForDailyDifference.includes(selectedMetric)
    ? calculateDailyDifferenceForMetric(data, selectedMetric)
    : transformDataToRawValues(data, selectedMetric);

  // Handle metric selection change
  const handleMetricChange = (event: SelectProps.ChangeDetail) => {
    setSelectedMetric(event.selectedOption.value as keyof DataPoint);
  };

  const chartProps: LineChartProps<any> = {
    series: [
      {
        title: selectedMetric, // Display the selected metric in the chart title
        type: "line",
        data: transformedData,
      },
    ],
    xScaleType: "time", // Since we are dealing with dates
    yScaleType: "linear", // Default for numeric values
    i18nStrings: {
      xTickFormatter: (e: Date) =>
        `${e.toLocaleDateString("en-US", {
          weekday: "short", // To show the day name (e.g., Monday)
          month: "short", // To show the abbreviated month (e.g., Jan)
          day: "numeric", // To show the day number (e.g., 1)
        })}`,
      yTickFormatter: (e: number) => e.toLocaleString(), // For consistent y-axis formatting
    },
    ariaLabel: "Metric Time Series Chart",
    height: 300,
    hideFilter: true,
    hideLegend: true,
    legendTitle: "Metrics",
    xDomain: [
      new Date(Math.min(...data.map((d) => d.date))),
      new Date(Math.max(...data.map((d) => d.date))),
    ],
    yTitle: selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1), // Dynamic y-axis title
    statusType: "finished", // Loading, finished or error status
  };

  return (
    <Box>
      {/* Dropdown for selecting the metric */}
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
      {/* Chart with dynamic data */}
      <LineChart {...chartProps} />
    </Box>
  );
};

export default LineChartWithMetrics;
