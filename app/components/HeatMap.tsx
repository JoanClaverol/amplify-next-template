import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { formatCurrency } from "../utils/formatCurrency"; // Adjust the import path as needed
import { CurrencyCode } from "../types/currency"; // Adjust the import path as needed

interface DataPoint {
  order_weekday: string;
  order_hour: number;
  total_unique_orders: number;
  total_after_refund: number;
}

interface HeatMapProps {
  data: DataPoint[];
  currency: CurrencyCode;
}

const HeatMap: React.FC<HeatMapProps> = ({ data, currency }) => {
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
    // Aggregate data
    const aggregated = d3.rollup(
      data,
      (v) => ({
        total_unique_orders: d3.mean(v, (d) => d.total_unique_orders) || 0,
        total_after_refund: d3.mean(v, (d) => d.total_after_refund) || 0,
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
          total_unique_orders: values.total_unique_orders,
          total_after_refund: values.total_after_refund,
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
  }, [aggregatedData, dimensions, currency]);

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
      .domain([0, d3.max(aggregatedData, (d) => d.total_unique_orders) || 0]);

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
      .style("fill", (d) => colorScale(d.total_unique_orders))
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(
            `Day: ${d.order_weekday}<br/>Hour: ${
              d.order_hour
            }<br/>Average Orders on the given period: ${d.total_unique_orders.toFixed(
              0
            )}<br/>Average Total After Refund on the given period: ${formatCurrency(
              d.total_after_refund,
              currency
            )}`
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });

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
      .text("Orders Heatmap");
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

export default HeatMap;
