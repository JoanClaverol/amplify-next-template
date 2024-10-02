import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { formatCurrency } from '../utils/formatCurrency'; // Adjust the import path as needed
import { CurrencyCode } from '../types/currency'; // Adjust the import path as needed

interface HeatMapProps {
  data: {
    order_weekday: string;
    order_hour: number;
    total_unique_orders: number;
    total_after_refund: number;
  }[];
  currency: CurrencyCode;
}

const HeatMap: React.FC<HeatMapProps> = ({ data, currency }) => {
  const ref = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientWidth * 0.75, // Maintaining a 4:3 aspect ratio
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (data && ref.current && dimensions.width > 0 && dimensions.height > 0) {
      drawHeatmap();
    }
  }, [data, dimensions, currency]);

  const drawHeatmap = () => {
    const margin = { top: 30, right: 30, bottom: 70, left: 70 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Clear existing content

    const chart = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const hours = Array.from({ length: 24 }, (_, i) => i); // 0 to 23

    const x = d3.scaleBand()
      .range([0, width])
      .domain(days)
      .padding(0.01);

    const y = d3.scaleBand()
      .range([0, height])
      .domain(hours.map(d => d.toString()))
      .padding(0.01);

    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(data, d => d.total_unique_orders) || 0]);

    // Create a tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");

    chart.selectAll()
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => x(d.order_weekday) || 0)
      .attr('y', d => y(d.order_hour.toString()) || 0)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .style('fill', d => colorScale(d.total_unique_orders))
      .on("mouseover", (event, d) => {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(`Day: ${d.order_weekday}<br/>Hour: ${d.order_hour}<br/>Orders: ${d.total_unique_orders}<br/>Total After Refund: ${formatCurrency(d.total_after_refund, currency)}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

    // X-axis
    chart.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(0))
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)")
        .style("font-size", "12px")
        .style("font-weight", "bold");

    // Y-axis
    chart.append('g')
      .call(d3.axisLeft(y).tickSize(0)
        .tickFormat(d => {
          const hour = parseInt(d.toString());
          if (hour === 0) return '12AM';
          if (hour === 12) return '12PM';
          return (hour % 12 || 12) + (hour < 12 ? 'AM' : 'PM');
        })
      )
      .selectAll("text")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .attr("dx", "-0.5em");

    // Remove axis lines
    chart.selectAll(".domain").remove();

    // Add title
    svg.append('text')
      .attr('x', width / 2 + margin.left)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .text('Orders Heatmap');
  };

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <svg ref={ref} style={{ width: '100%', height: '100%' }}></svg>
    </div>
  );
};

export default HeatMap;
