"use client";
import React, { useEffect, useState } from "react";
import Box from "@cloudscape-design/components/box";
import Spinner from "@cloudscape-design/components/spinner";
import { OrderChart } from "../components/OrderChart";
import HeatMap from "../components/HeatMap";
import SearchAndFilterBar from "../components/filters/SearchAndFilterDatesBar";
import { useWindowSize } from "../hooks/useWindowSize";
import { OrderData } from "../types/orderTypes";
import { SummaryCards } from "../components/OrdersSummaryCards";

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
  const [orderData, setOrderData] = useState<OrderData>({
    summary: null,
    daily: null,
    hourly: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [dateError, setDateError] = useState<string | null>(null);
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  const handleDateRangeChange = (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  useEffect(() => {
    if (!selectedCompany || !startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to beginning of the day

    if (start >= today || end >= today) {
      setDateError("Start date and end date must be earlier than today.");
      return;
    }
    if (start > end) {
      setDateError("Start date cannot be after end date.");
      return;
    }

    setDateError(null);
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchOrderData(selectedCompany, startDate, endDate);
        setOrderData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedCompany, startDate, endDate]);

  const renderContent = () => {
    if (dateError) {
      return <h2>{dateError}</h2>;
    }
    if (!selectedCompany || !startDate || !endDate) {
      return (
        <h2>Please select a company and date range to view the dashboard</h2>
      );
    }
    if (loading) {
      return <Spinner size="large" />;
    }
    return (
      <>
        <SummaryCards summary={orderData.summary} />
        {orderData.daily && <OrderChart data={orderData.daily} />}
        {!isMobile && orderData.hourly && (
          <HeatMap data={orderData.hourly} currency="EUR" />
        )}
      </>
    );
  };

  return (
    <Box>
      <Box padding="l">
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
