import React, { useState } from "react";
import LineChart from "@cloudscape-design/components/line-chart";

import Select from "@cloudscape-design/components/select";
import SpaceBetween from "@cloudscape-design/components/space-between";

interface OrderData {
  order_date: string;
  total_unique_orders: number;
  total_after_refund: number;
}

interface OrderChartProps {
  data: OrderData[];
}

export const OrderChart: React.FC<OrderChartProps> = ({ data }) => {
  const [metricToShow, setMetricToShow] = useState<'total_unique_orders' | 'total_after_refund'>('total_unique_orders');

  const series: any[] = [{
    title: metricToShow === 'total_unique_orders' ? "Total Unique Orders" : "Total After Refund",
    type: "line",
    data: data.map(item => ({
      x: new Date(item.order_date),
      y: item[metricToShow]
    }))
  }];

  const xDomain: [Date, Date] = [new Date(data[0].order_date), new Date(data[data.length - 1].order_date)];
  const yDomain: [number, number] = [
    0,
    Math.max(...data.map(item => item[metricToShow])) * 1.1
  ];

  const formatYValue = (value: number) =>
    metricToShow === 'total_unique_orders'
      ? value.toFixed(0)
      : value.toFixed(2);

  return (
    <SpaceBetween size="l">
      <Select
        selectedOption={{ label: metricToShow === 'total_unique_orders' ? "Total Unique Orders" : "Total After Refund", value: metricToShow }}
        onChange={({ detail }) => setMetricToShow(detail.selectedOption.value as 'total_unique_orders' | 'total_after_refund')}
        options={[
          { label: "Total Orders", value: "total_unique_orders" },
          { label: "Total Gross Sales", value: "total_after_refund" }
        ]}
      />
      <LineChart
        series={series}
        xDomain={xDomain}
        yDomain={yDomain}
        i18nStrings={{
          xTickFormatter: (e: Date) => e.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          yTickFormatter: (e: number) => formatYValue(e)
        }}
        ariaLabel={`${series[0].title} over time`}
        height={300}
        xScaleType="time"
        xTitle="Date"
        yTitle={series[0].title}
        hideLegend
        hideFilter
      />
    </SpaceBetween>
  );
}

export default OrderChart;
