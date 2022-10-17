import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { SatisfactionTitle } from "./App";

const yBuffer = 33;
const yBufferTop = 33;
const xBuffer = 60;

function processData(rawData, column, config) {
  const data = [{}, {}, {}, {}, {}, {}];

  for (let d of rawData) {
    const group = data[d[column]];
    const groupKey = d[config.column];

    if (group[groupKey] === undefined) group[groupKey] = 0;
    group[groupKey] += 1;
  }

  return {
    data: data.map((d) => Object.entries(d)),
    yRange: d3.extent(data.map(Object.values).flat()),
    groups: [...new Set(data.map(Object.keys).flat())].sort(),
  };
}

export const BarChart = ({ data, column, config }) => {
  const svgRef = useRef(null);

  const [barData, setBarData] = useState();
  useEffect(() => {
    setBarData(processData(data, column, config));
  }, [data, column, config]);

  useEffect(() => {
    if (!svgRef.current || !barData) return;
    const svg = d3.select(svgRef.current);
    const { width, height } = svg.node().getBoundingClientRect();

    const yScale = d3
      .scaleLinear()
      .domain(barData.yRange)
      .range([height - yBuffer - yBufferTop, 0]);

    const xScale = d3
      .scaleBand()
      .range([xBuffer, width])
      .padding([0.15])
      .domain([0, 1, 2, 3, 4, 5]);

    const groupScale = d3
      .scaleBand()
      .domain(barData.groups)
      .range([0, xScale.bandwidth()])
      .padding([0.2]);

    const opacity = d3.scaleLinear().range([0.25, 1]).domain([0, 5]);

    svg
      .selectAll(".bar-groups")
      .data(barData.data)
      .join((enter) => enter.append("g").attr("class", "bar-groups"))
      .attr("transform", (_, i) => `translate(${xScale(i)},0)`)
      .attr("fill-opacity", (_, i) => (i === 0 ? 1 : opacity(i)))
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("fill", ([x, _]) => config.color(x))
      .attr("x", ([x, _]) => groupScale(x))
      .attr("y", ([_, y]) => yScale(y) + yBufferTop)
      .attr("height", ([_, y]) => height - yScale(y) - yBuffer - yBufferTop)
      .attr("width", groupScale.bandwidth());

    if (!svg.select(".title").node()) {
      svg
        .append("text")
        .attr("class", "title")
        .attr("text-anchor", "middle")
        .attr("font-size", 18)
        .attr("font-weight", "bold");
      svg
        .append("text")
        .attr("class", "x-title")
        .attr("text-anchor", "middle")
        .attr("font-size", 13)
        .attr("font-weight", "bold");

      svg
        .append("line")
        .attr("class", "x-unanswered")
        .attr("stroke", "black")
        .attr("stroke-width", 2);
      svg.append("g").attr("class", "y-axis");
      svg.append("g").attr("class", "x-axis");

      svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("class", "y-title")
        .attr("font-size", 13)
        .attr("font-weight", "bold")
        .attr("y", 10)
        .text("Frequency");
    }

    svg
      .select(".title")
      .attr("x", (width + xBuffer) / 2)
      .attr("y", 20)
      .text(column);

    svg
      .select(".x-unanswered")
      .attr("x1", xScale(1) - 15)
      .attr("x2", xScale(1) - 15)
      .attr("y1", yBufferTop)
      .attr("y2", height - yBuffer / 2);

    svg
      .select(".x-title")
      .attr("x", (width + xBuffer) / 2)
      .attr("y", height)
      .text("Satisfaction");

    svg
      .select(".x-axis")
      .attr("transform", `translate(0, ${height - yBuffer})`)
      .call(d3.axisBottom(xScale).tickFormat((i) => SatisfactionTitle[i]));

    svg
      .select(".y-axis")
      .attr("transform", `translate(${xBuffer}, ${yBufferTop})`)
      .call(d3.axisLeft(yScale));

    svg.select(".y-title").attr("x", -height / 2 + yBufferTop / 2);
  }, [barData, svgRef, column, config]);

  return <svg className="bar" ref={svgRef} />;
};
