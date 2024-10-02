"use client";

import React, {useEffect, useState} from "react";
import ColumnLayout from "@cloudscape-design/components/column-layout";
import { CurrencyCode } from "../types/currency";
import { CardContent } from "../components/CardContent";
import Container from "@cloudscape-design/components/container";
import Box from "@cloudscape-design/components/box";
import Spinner from "@cloudscape-design/components/spinner";
import { OrderChart } from "../components/OrderChart";
import HeatMap from "../components/HeatMap";

interface CurrencyData {
  value: number;
  currency: CurrencyCode;
}

interface DashboardData {
  "Total after refund": CurrencyData;
  "Total Refund Amount": CurrencyData;
  "Unique Orders": number;
}

const data: DashboardData = {
  "Total after refund": { value: 6673.8, currency: 'EUR' },
  "Total Refund Amount": { value: 4.4, currency: 'EUR' },
  "Unique Orders": 295
};

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

interface ApiResponse {
  result: {
    order_summary: OrderSummary;
    daily_order_summary: OrderDailyData[];

    // ... other properties
  };
}


const Dashboard: React.FC = () => {
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [orderDailyData, serOrderDailyData] = useState<OrderDailyData[] | null>(null);
  const [hourlyOrderSummary, setHourlyOrderSummary] = useState<OrderDailyData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const metricToShow: 'total_unique_orders' | 'total_after_refund' = 'total_unique_orders';


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://y3fglnw1n3.execute-api.eu-west-3.amazonaws.com/Prod/get-order-history-info');
        const data: ApiResponse = await response.json();
        // console.log(data);
        setOrderSummary(data.result.order_summary);
        serOrderDailyData(data.result.daily_order_summary);
        setHourlyOrderSummary(data.result.hourly_order_summary);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  console.log(orderSummary);
  console.log(orderDailyData);
  console.log(hourlyOrderSummary);


  if (loading) {
    return (
      <Box  padding='l' textAlign='center'>
        <Spinner size="large" />
    </Box>
    );
  }

  return (
    <Box>
      <Box  padding='l' textAlign='center'>
      <ColumnLayout columns={3} variant="text-grid">
      <CardContent 
        title="Total after refund"
        value={data["Total after refund"].value}
        currency={data["Total after refund"].currency}
        />
      <CardContent 
        title="Total Refund Amount"
        value={data["Total Refund Amount"].value}
        currency={data["Total Refund Amount"].currency}
        />
      <CardContent 
        title="Unique Orders"
        value={data["Unique Orders"]}
        />
    </ColumnLayout>
      </Box>
      <Box padding='l' textAlign='center'>
      {orderDailyData && (
      <OrderChart data={orderDailyData} metricToShow="total_after_refund"/>
    )}
      </Box>
            <Box padding='l' textAlign='center'>
        {hourlyOrderSummary && (
          <HeatMap width={500} height={300} data={hourlyOrderSummary} />
        )}
      </Box>

    </Box>
    
  );
};

export default Dashboard;



