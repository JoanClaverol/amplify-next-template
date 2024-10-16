import React from "react";
import LineChart from "@cloudscape-design/components/line-chart";

// Define the types for the series
type DataPoint = {
  x: Date;
  y: number;
};

type Series = {
  title: string;
  type: "line";
  data: DataPoint[];
};

interface CompanyLineChartProps {
  series: Series[]; // The data for the line chart
}

const PreviousPeriodComparisonLineChart: React.FC<CompanyLineChartProps> = ({
  series,
}) => {
  // Date formatting function in Spanish
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "short", // Short day of the week (e.g., "lun")
      day: "numeric", // Day of the month (e.g., "18")
      month: "short", // Short month (e.g., "oct")
    });
  };

  // Get unique dates to prevent repeating ticks
  const uniqueDates = Array.from(
    new Set(
      series.flatMap((item) => item.data.map((point) => point.x.getTime()))
    )
  ).map((time) => new Date(time));

  const xDomain = [
    new Date(Math.min(...uniqueDates.map((date) => date.getTime()))),
    new Date(Math.max(...uniqueDates.map((date) => date.getTime()))),
  ];

  return (
    <LineChart
      series={series.map((item) => ({
        ...item,
        color: item.title === "Periodo anterior" ? "#D3D3D3" : "#1f77b4",
      }))}
      xScaleType="time"
      xTitle=""
      ariaLabel="Datos publicitarios a lo largo del tiempo"
      hideLegend={true}
      hideFilter={true}
      xDomain={xDomain}
      xTickFormatter={(value: Date) => formatDate(new Date(value))}
    />
  );
};

export default PreviousPeriodComparisonLineChart;
