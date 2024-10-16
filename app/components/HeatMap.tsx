import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

interface DataPoint {
  weekday: string;
  hour: string;
  value: number;
}

interface HeatMapProps {
  data: DataPoint[];
}

const WeeklyHourHeatMap: React.FC<HeatMapProps> = ({ data }) => {
  const ref = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle resize and update dimensions based on container size
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        setDimensions({
          width: containerWidth,
          height: Math.max(containerWidth * 0.75, 300), // Maintain a minimum height of 300px
        });
      }
    };

    // Initialize dimensions and listen to resize
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (
      ref.current &&
      data.length > 0 &&
      dimensions.width > 0 &&
      dimensions.height > 0
    ) {
      drawHeatmap();
    }
  }, [data, dimensions]);

  const drawHeatmap = () => {
    const margin = { top: 30, right: 10, bottom: 50, left: 70 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Clear previous content

    const chart = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const weekdays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

    // Scales
    const x = d3.scaleBand().range([0, width]).domain(weekdays).padding(0.01);
    const y = d3.scaleBand().range([0, height]).domain(hours).padding(0.01);

    const colorScale = d3
      .scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(data, (d) => d.value) || 0]);

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

    // Draw cells
    chart
      .selectAll()
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.weekday) || 0)
      .attr("y", (d) => y(d.hour) || 0)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", (d) => colorScale(d.value))
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(
            `Weekday: ${d.weekday}<br/>Hour: ${d.hour}<br/>Value: ${d.value}`
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    // Add X-axis
    chart
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickSize(0))
      .selectAll("text")
      .style("text-anchor", "middle")
      .style("font-size", "12px");

    // Add Y-axis
    chart
      .append("g")
      .call(
        d3
          .axisLeft(y)
          .tickSize(0)
          .tickFormat((d) => d.toString())
      )
      .selectAll("text")
      .style("font-size", "12px");
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

export default WeeklyHourHeatMap;
