"use client";
import React, { useEffect, useState, useCallback } from "react";
import Box from "@cloudscape-design/components/box";
import { Spinner, Header } from "@cloudscape-design/components";
import { useWindowSize } from "../../hooks/useWindowSize";

// Update the OrderData type
import { SummaryCards } from "../../components/OrdersSummaryCards";
import { API_URL } from "app/constants/apiConfig";
import CompanySearchBar from "app/components/filters/CompanySearchBar";

import DateRangeSelector from "app/components/filters/DateRangePicker";

// Update the OrderData type
// Update the OrderData interface
interface OrderData {
  "Unique Orders": number;
  "Average Ticket": number;
  "Total Refund Amount": number;
  Reimbursements: number;
  "Number of Orders with Promotions": number;
  "Spending in Promotions": number;
  "Sells in Promotions": number;
  "Effort Rate": number;
  "ROAS in Promotions": number;
}

// Update the CompanySearchBar component import or definition to include the onSelectCompany prop
interface CompanySearchBarProps {
  selectedCompany: string | null;
  onSelectCompany: (newCompany: string) => void;
}

// Update the API function
const fetchOrderData = async (
  companyName: string,
  startDate: string,
  endDate: string
): Promise<OrderData> => {
  const url = `${API_URL}get-order-history-info?company_name=${encodeURIComponent(
    companyName
  )}&start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(
    endDate
  )}`;

  console.log("Fetching data from:", url);
  const response = await fetch(url);

  const data = await response.json();
  return data;
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

  const handleCompanyChange = (newCompany: string) => {
    setSelectedCompany(newCompany);
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
        <SummaryCards summary={orderData} />
        {/* Remove or update OrderChart and HeatMap components as they're no longer applicable */}
      </>
    );
  };

  return (
    <Box>
      <Box padding="l">
        <Header variant="h1">Order history reports</Header>
        <CompanySearchBar
          selectedCompany={selectedCompany}
          onSelect={handleCompanyChange} // Change this line
        />
        <DateRangeSelector
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
