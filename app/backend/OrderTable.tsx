import React, { useState, useEffect } from "react";
import BarChart from "@cloudscape-design/components/bar-chart";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";

interface Order {
  time_of_order: string;
  order_code: string;
  order_status: string;
  courier_name: string;
  store: string;
  total: number;
}

export default function OrderChart() {
  const [chartData, setChartData] = useState<{ x: Date; y: number }[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('https://y3fglnw1n3.execute-api.eu-west-3.amazonaws.com/Prod/fetch-orderlines/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const parsedOrders: Order[] = JSON.parse(data.data);
        
        // Process the data for the chart
        const dailyRevenue = parsedOrders.reduce((acc, order) => {
          const date = new Date(order.time_of_order).toDateString();
          acc[date] = (acc[date] || 0) + order.total;
          return acc;
        }, {} as Record<string, number>);

        const chartData = Object.entries(dailyRevenue).map(([date, total]) => ({
          x: new Date(date),
          y: total
        })).sort((a, b) => a.x.getTime() - b.x.getTime());

        setChartData(chartData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }

    fetchOrders();
  }, []);

  const xDomain = chartData.map(item => item.x);
  const yDomain = [0, Math.max(...chartData.map(item => item.y)) * 1.1]; // 10% higher than max value

  return (
    <BarChart
      series={[
        {
          title: "Daily Revenue",
          type: "bar",
          data: chartData,
          valueFormatter: e =>
            e.toLocaleString("es-ES", {
              style: "currency",
              currency: "EUR",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })
        }
      ]}
      xDomain={xDomain}
      yDomain={yDomain}
      i18nStrings={{
        xTickFormatter: e =>
          e.toLocaleDateString("es-ES", {
            month: "short",
            day: "numeric"
          }),
        yTickFormatter: function s(e) {
          return Math.abs(e) >= 1e6
            ? (e / 1e6).toFixed(1).replace(/\.0$/, "") + "M€"
            : Math.abs(e) >= 1e3
            ? (e / 1e3).toFixed(1).replace(/\.0$/, "") + "K€"
            : e.toFixed(2) + "€";
        }
      }}
      ariaLabel="Daily revenue bar chart"
      height={300}
      xTitle="Date"
      yTitle="Revenue (EUR)"
      empty={
        <Box textAlign="center" color="inherit">
          <b>No data available</b>
          <Box variant="p" color="inherit">
            There is no data available
          </Box>
        </Box>
      }
      noMatch={
        <Box textAlign="center" color="inherit">
          <b>No matching data</b>
          <Box variant="p" color="inherit">
            There is no matching data to display
          </Box>
          <Button>Clear filter</Button>
        </Box>
      }
    />
  );
}