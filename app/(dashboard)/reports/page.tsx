"use client";
import React, { useEffect, useState, useCallback } from "react";
import Box from "@cloudscape-design/components/box";
import { Spinner, Header } from "@cloudscape-design/components";
import { OrderChart } from "../../components/OrderChart";
import HeatMap from "../../components/HeatMap";
import SearchAndFilterBar from "../../components/filters/SearchAndFilterDatesBar";
import { useWindowSize } from "../../hooks/useWindowSize";
import { OrderData } from "../../types/orderTypes";
import { SummaryCards } from "../../components/OrdersSummaryCards";

// API function
const fetchOrderData = async (
  companyName: string,
  startDate: string,
  endDate: string
): Promise<OrderData> => {
  const response = await fetch(
    `https://y3fglnw1n3.execute-api.eu-west-3.amazonaws.com/Prod/get-order-history-info?company_name=${encodeURIComponent(
      companyName
    )}&start_date=${startDate}&end_date=${endDate}`
  );
  const data = await response.json();
  return {
    summary: data.result.order_summary,
    daily: data.result.daily_order_summary,
    hourly: data.result.hourly_order_summary,
  };
};

const Dashboard: React.FC = () => {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  const fetchData = useCallback(async () => {
    if (!selectedCompany || !startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start >= today || end >= today) {
      setError("Start date and end date must be earlier than today.");
      setOrderData(null); // Clear previous data
      return;
    }

    if (start > end) {
      setError("Start date cannot be after end date.");
      setOrderData(null); // Clear previous data
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const data = await fetchOrderData(selectedCompany, startDate, endDate);
      setOrderData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch order data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedCompany, startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDateRangeChange = (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const renderContent = () => {
    if (error) {
      return <h2>{error}</h2>;
    }
    if (!selectedCompany || !startDate || !endDate) {
      return (
        <h2>Please select a company and date range to view the dashboard</h2>
      );
    }
    if (loading) {
      return <Spinner size="large" />;
    }
    if (!orderData) {
      return <h2>No data available for the selected dates</h2>;
    }
    return (
      <>
        <SummaryCards summary={orderData.summary} />
        {orderData.daily && <OrderChart data={orderData.daily} />}
        {/* {!isMobile && orderData.hourly && (
          // <HeatMap data={orderData.hourly} currency="EUR" />
        )} */}
      </>
    );
  };

  return (
    <Box>
      <Box padding="l">
        <Header variant="h1">Order history reports</Header>
        <SearchAndFilterBar
          selectedCompany={selectedCompany}
          isLoading={loading}
          onSelectCompany={setSelectedCompany}
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={handleDateRangeChange}
        />
      </Box>
      <Box padding="l" textAlign="center">
        {renderContent()}
      </Box>
    </Box>
  );
};

export default Dashboard;
