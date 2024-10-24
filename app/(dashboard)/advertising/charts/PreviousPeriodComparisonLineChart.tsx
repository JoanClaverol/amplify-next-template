"use client";

import React, { useEffect, useState } from "react";
import { Box, Spinner } from "@cloudscape-design/components";
import PreviousPeriodComparisonLineChart from "app/components/LineChart";
import { API_URL } from "app/constants/apiConfig";

// Define types for input data and transformed data
type InputData = {
  date: number; // timestamp in milliseconds
  value: number;
  pastValue: number;
};

type DataPoint = {
  x: Date;
  y: number;
};

type Series = {
  title: string;
  type: "line";
  data: DataPoint[];
};

// Function to fetch and process the line chart data
const fetchAndProcessLineChartData = async (
  companyName: string,
  startDate: string,
  endDate: string,
  store: string,
  metric: string
): Promise<InputData[]> => {
  const url = `${API_URL}get-advertising-metric-comparison?company_name=${encodeURIComponent(
    companyName
  )}&start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(
    endDate
  )}&store=${encodeURIComponent(store)}&metric=${encodeURIComponent(metric)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const data: InputData[] = await response.json();
  return data;
};

// Function to transform data for the line chart
function transformDataForLineChart(data: InputData[]): Series[] {
  const metric1Series: Series = {
    title: "Periodo seleccionado",
    type: "line",
    data: data.map((item) => ({ x: new Date(item.date), y: item.value })),
  };

  const metric2Series: Series = {
    title: "Periodo anterior",
    type: "line",
    data: data.map((item) => ({
      x: new Date(item.date),
      y: item.pastValue,
    })),
  };

  return [metric1Series, metric2Series];
}

interface CompanyAdvertisingLineChartProps {
  companyName: string;
  startDate: string;
  endDate: string;
  store: string;
  metric: string;
}

const CompanyAdvertisingLineChart: React.FC<
  CompanyAdvertisingLineChartProps
> = ({ companyName, startDate, endDate, store, metric }) => {
  const [chartData, setChartData] = useState<Series[]>([]); // State to store the transformed chart data
  const [loading, setLoading] = useState<boolean>(true); // State to track loading
  const [error, setError] = useState<string | null>(null); // State to track error

  useEffect(() => {
    setLoading(true); // Set loading to true before fetching
    setError(null); // Clear any previous errors

    // Fetch and transform data on component mount
    fetchAndProcessLineChartData(companyName, startDate, endDate, store, metric)
      .then(transformDataForLineChart)
      .then(setChartData)
      .catch((error) => {
        console.error("Error fetching or processing data:", error);
        setError("Error fetching or processing data");
      })
      .finally(() => {
        setLoading(false); // Set loading to false after the data is fetched
      });
  }, [companyName, startDate, endDate, store, metric]);

  return (
    <Box padding="l" textAlign="center" variant="h2">
      Evolución del total gastado por día de {companyName}
      {loading ? (
        <Box padding="l" textAlign="center">
          <Spinner size="large" />
        </Box>
      ) : error ? (
        <Box padding="l" textAlign="center">
          {error}
        </Box>
      ) : (
        <PreviousPeriodComparisonLineChart series={chartData} />
      )}
    </Box>
  );
};

export default CompanyAdvertisingLineChart;
