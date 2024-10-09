import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
// import { formatCurrency } from "../utils/formatCurrency"; // Adjust the import path as needed
import { CurrencyCode } from "../types/currency"; // Adjust the import path as needed

interface DataPoint {
  order_weekday: string;
  order_hour: number;
  total_spend: number;
  clicks: number;
  impressions: number;
  remaining_budget: number;
  average_daily_budget: number;
  CR_GMO: number;
  facturacion_gmo: number;
  ROAS: number;
  CPO: number;
  CPC: number;
  CPM: number;
  pedidos_gmo: number;
  gross_sales: number;
  orders: number;
}

interface HeatMapProps {
  data: DataPoint[];
  currency?: CurrencyCode;
  selectedMetric: string;
}

const HeatMap: React.FC<HeatMapProps> = ({
  data,
  currency,
  selectedMetric,
}) => {
  const ref = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [aggregatedData, setAggregatedData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        setDimensions({
          width: containerWidth,
          height: Math.max(containerWidth * 0.75, 300), // Minimum height of 300px
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Aggregate data based on the selected metric
    const aggregated = d3.rollup(
      data,
      (v) => ({
        total_spend: d3.mean(v, (d) => d.total_spend) || 0,
        clicks: d3.mean(v, (d) => d.clicks) || 0,
        impressions: d3.mean(v, (d) => d.impressions) || 0,
        remaining_budget: d3.mean(v, (d) => d.remaining_budget) || 0,
        average_daily_budget: d3.mean(v, (d) => d.average_daily_budget) || 0,
        CR_GMO: d3.mean(v, (d) => d.CR_GMO) || 0,
        facturacion_gmo: d3.mean(v, (d) => d.facturacion_gmo) || 0,
        ROAS: d3.mean(v, (d) => d.ROAS) || 0,
        CPO: d3.mean(v, (d) => d.CPO) || 0,
        CPC: d3.mean(v, (d) => d.CPC) || 0,
        CPM: d3.mean(v, (d) => d.CPM) || 0,
        pedidos_gmo: d3.mean(v, (d) => d.pedidos_gmo) || 0,
        gross_sales: d3.mean(v, (d) => d.gross_sales) || 0,
        orders: d3.mean(v, (d) => d.orders) || 0,
      }),
      (d) => d.order_weekday,
      (d) => d.order_hour
    );

    const newAggregatedData: DataPoint[] = [];
    aggregated.forEach((hourMap, weekday) => {
      hourMap.forEach((values, hour) => {
        newAggregatedData.push({
          order_weekday: weekday,
          order_hour: +hour,
          total_spend: values.total_spend,
          clicks: values.clicks,
          impressions: values.impressions,
          remaining_budget: values.remaining_budget,
          average_daily_budget: values.average_daily_budget,
          CR_GMO: values.CR_GMO,
          facturacion_gmo: values.facturacion_gmo,
          ROAS: values.ROAS,
          CPO: values.CPO,
          CPC: values.CPC,
          CPM: values.CPM,
          pedidos_gmo: values.pedidos_gmo,
          gross_sales: values.gross_sales,
          orders: values.orders,
        });
      });
    });

    setAggregatedData(newAggregatedData);
  }, [data]);

  useEffect(() => {
    if (
      aggregatedData.length > 0 &&
      ref.current &&
      dimensions.width > 0 &&
      dimensions.height > 0
    ) {
      drawHeatmap();
    }
  }, [aggregatedData, dimensions, currency, selectedMetric]);

  const drawHeatmap = () => {
    const margin = { top: 30, right: 10, bottom: 50, left: 70 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Clear existing content

    const chart = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const hours = Array.from({ length: 24 }, (_, i) => i + 1); // 1 to 24

    const x = d3.scaleBand().range([0, width]).domain(days).padding(0.01);
    const y = d3
      .scaleBand()
      .range([0, height])
      .domain(hours.map((d) => d.toString()))
      .padding(0.01);

    const colorScale = d3
      .scaleSequential(d3.interpolateBlues)
      .domain([
        0,
        d3.max(
          aggregatedData,
          (d) => d[selectedMetric as keyof DataPoint] as number
        ) || 0,
      ]);

    // Create a tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");

    chart
      .selectAll()
      .data(aggregatedData)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.order_weekday) || 0)
      .attr("y", (d) => y(d.order_hour.toString()) || 0)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", (d) =>
        colorScale(d[selectedMetric as keyof DataPoint] as number)
      )
      .on("mouseover", (event, d) => {
        const metricValue = formatMetricValue(
          d[selectedMetric as keyof DataPoint],
          selectedMetric
        );

        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(
            `Day: ${d.order_weekday}<br>` +
              `Hour: ${d.order_hour}<br>` +
              `${selectedMetric.replace(/_/g, " ")}: ${metricValue}`
          )
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`);
      });

    // Update the formatMetricValue function:

    function formatMetricValue(value: any, metric: string): string {
      if (value === undefined || value === null) return "N/A";

      if (typeof value !== "number") return String(value);

      if (["clicks", "orders", "impressions"].includes(metric)) {
        return Math.round(value).toLocaleString();
      }

      if (["CR_GMO", "ROAS"].includes(metric)) {
        return value.toFixed(2);
      }

      if (
        [
          "total_spend",
          "remaining_budget",
          "average_daily_budget",
          "facturacion_gmo",
          "CPO",
          "CPC",
          "CPM",
          "gross_sales",
        ].includes(metric)
      ) {
        return value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      }

      return value.toString();
    }

    // X-axis
    chart
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(0))
      .selectAll("text")
      .style("text-anchor", "middle")
      .attr("dy", "1em")
      .style("font-size", "12px");

    // Y-axis
    chart
      .append("g")
      .call(
        d3
          .axisLeft(y)
          .tickSize(0)
          .tickFormat((d) => {
            const hour = parseInt(d.toString());
            if (hour === 0) return "12AM";
            if (hour === 12) return "12PM";
            return (hour % 12 || 12) + (hour < 12 ? "AM" : "PM");
          })
      )
      .selectAll("text")
      .style("font-size", "12px")
      .attr("dx", "-0.5em");

    // Remove axis lines
    chart.selectAll(".domain").remove();

    // Add title
    svg
      .append("text")
      .attr("x", width / 2 + margin.left)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .text(`${selectedMetric.replace(/_/g, " ")} Heatmap`);
  };

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", maxWidth: "100%", overflowX: "hidden" }}
    >
      <svg
        ref={ref}
        style={{ width: "100%", height: "100%", display: "block" }}
      ></svg>
    </div>
  );
};

// export default HeatMap;

import { StoreData } from "../types/advertisingTypes";
import { Select } from "@cloudscape-design/components";

// Utility function to get the weekday from the timestamp
const getWeekdayFromTimestamp = (timestamp: number) => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return daysOfWeek[new Date(timestamp).getDay()];
};

// Filtering function
const filterData = (
  hourlyData: any[],
  selectedStore: string | null,
  selectedStartDate: string | null
) => {
  return hourlyData.filter((store) => {
    const matchesStore = selectedStore
      ? store.store_name_scraped === selectedStore
      : true;
    const matchesStartDate = selectedStartDate
      ? store.start_date === selectedStartDate
      : true;
    return matchesStore && matchesStartDate;
  });
};

const DataTransformer: React.FC<{
  hourlyData: StoreData[];
  selectedStore: string | null;
  selectedStartDate: string | null;
}> = ({ hourlyData, selectedStore, selectedStartDate }) => {
  const [selectedMetric, setSelectedMetric] = useState<string>("total_spend");
  // Filter the data by store and start date
  const filteredData = filterData(hourlyData, selectedStore, selectedStartDate);

  // Extend the transformation to include all metrics
  // Extend the transformation to include all metrics
  const transformedData = filteredData.map((hourlyData) => ({
    order_weekday: getWeekdayFromTimestamp(hourlyData.date),
    order_hour: hourlyData.hour,
    total_spend: hourlyData.total_spend_diff,
    clicks: hourlyData.clicks_diff,
    impressions: hourlyData.impressions_diff,
    remaining_budget: hourlyData.remaining_budget_diff,
    average_daily_budget: hourlyData.average_daily_budget_diff,
    CR_GMO: hourlyData.CR_GMO,
    facturacion_gmo: hourlyData.facturacion_gmo,
    ROAS: hourlyData.ROAS,
    CPO: hourlyData.CPO,
    CPC: hourlyData.CPC,
    CPM: hourlyData.CPM,
    pedidos_gmo: hourlyData.pedidos_gmo,
    gross_sales: hourlyData.gross_sales_diff,
    orders: hourlyData.orders_diff,
  }));

  // Extend the metric options to include all new metrics
  // Extend the metric options to include all new metrics and difference metrics
  const metricOptions = [
    { label: "Total Spend", value: "total_spend" },
    { label: "Clicks", value: "clicks" },
    { label: "Impressions", value: "impressions" },
    { label: "Remaining Budget", value: "remaining_budget" },
    { label: "Average Daily Budget", value: "average_daily_budget" },
    { label: "CR GMO", value: "CR_GMO" },
    { label: "Facturación GMO", value: "facturacion_gmo" },
    { label: "ROAS", value: "ROAS" },
    { label: "CPO", value: "CPO" },
    { label: "CPC", value: "CPC" },
    { label: "CPM", value: "CPM" },
    { label: "Pedidos GMO", value: "pedidos_gmo" },
    { label: "Gross Sales", value: "gross_sales" },
    { label: "Orders", value: "orders" },
  ];

  return (
    <>
      <Select
        selectedOption={
          metricOptions.find((option) => option.value === selectedMetric) ||
          metricOptions[0]
        }
        onChange={({ detail }) =>
          setSelectedMetric(detail.selectedOption.value as string)
        }
        options={metricOptions}
        placeholder="Choose a metric"
      />

      <HeatMap data={transformedData} selectedMetric={selectedMetric} />
    </>
  );
};

export default DataTransformer;
