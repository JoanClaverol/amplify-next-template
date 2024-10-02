"use client";

import React, { useEffect, useState } from "react";
import ColumnLayout from "@cloudscape-design/components/column-layout";
import { CurrencyCode } from "../types/currency";
import { CardContent } from "../components/CardContent";
import Box from "@cloudscape-design/components/box";
import Spinner from "@cloudscape-design/components/spinner";
import { OrderChart } from "../components/OrderChart";
import HeatMap from "../components/HeatMap";
import CompanySearchBar from "../backend/CompanySearchBar";

interface OrderSummary {
  "Total after refund": number;
  "Total Refund Amount": number;
  "Unique Orders": number;
}

interface OrderDailyData {
  order_date: string;
  total_unique_orders: number;
  total_after_refund: number;
}

interface HourlyOrderData {
  order_weekday: string;
  order_hour: number;
  total_unique_orders: number;
  total_after_refund: number;
}


interface ApiResponse {
  result: {
    order_summary: OrderSummary;
    daily_order_summary: OrderDailyData[];
    hourly_order_summary: HourlyOrderData[];
  };
}

const Dashboard: React.FC = () => {
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [orderDailyData, setOrderDailyData] = useState<OrderDailyData[] | null>(null);
  const [hourlyOrderSummary, setHourlyOrderSummary] = useState<HourlyOrderData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const metricToShow: 'total_unique_orders' | 'total_after_refund' = 'total_unique_orders';

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCompany) return;

      setLoading(true);
      try {
        const response = await fetch(`https://y3fglnw1n3.execute-api.eu-west-3.amazonaws.com/Prod/get-order-history-info?company_name=${encodeURIComponent(selectedCompany)}`);
        const data: ApiResponse = await response.json();
        setOrderSummary(data.result.order_summary);
        setOrderDailyData(data.result.daily_order_summary);
        setHourlyOrderSummary(data.result.hourly_order_summary);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedCompany]);

  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company);
  };

  return (
    <Box>
      <Box padding="l">
        <CompanySearchBar
          selectedCompany={selectedCompany}
          isLoading={loading}
          onSelect={handleCompanySelect}
        />
      </Box>

      {!selectedCompany ? (
        <Box padding="l" textAlign="center">
          <h2>Please select a company to view the dashboard</h2>
        </Box>
      ) : loading ? (
        <Box padding='l' textAlign='center'>
          <Spinner size="large" />
        </Box>
      ) : (
        <>
          <Box padding='l' textAlign='center'>
            {orderSummary && (
              <ColumnLayout columns={3} variant="text-grid">
                <CardContent 
                  title="Total after refund"
                  value={orderSummary["Total after refund"]}
                  currency="EUR"
                />
                <CardContent 
                  title="Total Refund Amount"
                  value={orderSummary["Total Refund Amount"]}
                  currency="EUR"
                />
                <CardContent 
                  title="Unique Orders"
                  value={orderSummary["Unique Orders"]}
                />
              </ColumnLayout>
            )}
          </Box>
          <Box padding='l' textAlign='center'>
            {orderDailyData && (
              <OrderChart data={orderDailyData}/>
            )}
          </Box>
          <Box padding='l' textAlign='center'>
            {hourlyOrderSummary && (
              <HeatMap data={hourlyOrderSummary} currency="EUR" />
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default Dashboard;