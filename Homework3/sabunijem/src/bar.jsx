import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { SatisfactionTitle } from "./App";

const yBuffer = 33;
const yBufferTop = 33;
const xBuffer = 60;

function processData(rawData, column, colorFn) {
  const dataPoint = rawData.data.filter((d) => d["column"] === column)[0];
  const columnData = dataPoint ? dataPoint.groups : [];
  const yRange = d3.extent(
    rawData.data
      .map(({ groups }) => groups.map(({ data }) => data))
      .flat()
      .flat()
  );

  const data = [{}, {}, {}, {}, {}, {}];
  columnData.forEach((columnD) =>
    columnD.data.forEach((value, idx) => {
      data[idx][columnD.group] = value;
    })
  );

  return {
    data: data.map((d) =>
      Object.entries(d)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, d]) => ({
          name,
          d,
          color: colorFn(name),
        }))
    ),
    groups: rawData.groups,
    yRange,
  };
}

export const BarChart = ({
  groupedData,
  column,
  colorFn,
  filters,
  setFilters,
}) => {
  const svgRef = useRef(null);

  const [barData, setBarData] = useState();
  useEffect(() => {
    if (!groupedData.data) return;
    setBarData(processData(groupedData, column, colorFn));
  }, [groupedData, column, colorFn]);

  useEffect(() => {
    if (!svgRef.current || !barData) return;
    const filter = filters[column];
    const svg = d3.select(svgRef.current);
    const { width, height } = svg.node().getBoundingClientRect();

    const yScale = d3
      .scaleLinear()
      .domain(barData.yRange)
      .range([height - yBuffer - yBufferTop, 0]);

    const cellWidth = (width - xBuffer) / 6;
    const xScale = d3
      .scaleBand()
      .range([xBuffer, width])
      .padding([0.15])
      .domain([0, 1, 2, 3, 4, 5]);
    xScale.invert = (p) => Math.round((p - xBuffer) / cellWidth);

    const groupScale = d3
      .scaleBand()
      .domain(barData.groups)
      .range([0, xScale.bandwidth()])
      .padding([0.2]);

    const opacity = d3.scaleLinear().range([0.25, 1]).domain([0, 5]);

    const brushToLoc = (p) => xBuffer + p * cellWidth;
    const brush = d3
      .brushX()
      .extent([
        [xBuffer, yBufferTop],
        [width, height - yBuffer],
      ])
      .on("brush", function (event) {
        if (!event.sourceEvent) return;
        const range = event.selection.map(xScale.invert);
        if (range[0] >= range[1]) {
          range[1]++;
        }

        d3.select(this).call(brush.move, range.map(brushToLoc));
      })
      .on("end", function (event) {
        if (!event.sourceEvent) return;
        if (!event.selection)
          return setFilters((f) => {
            f = { ...f };
            delete f[column];
            return f;
          });

        const range = event.selection.map(xScale.invert);
        if (range[0] >= range[1]) {
          range[1]++;
        }

        d3.select(this).call(brush.move, range.map(brushToLoc));

        function filter(d) {
          return range[0] <= d[column] && d[column] < range[1];
        }
        filter.range = range;

        setFilters((f) => ({
          ...f,
          [column]: filter,
        }));
      });

    svg
      .selectAll(".bar-groups")
      .data(barData.data)
      .join((enter) => enter.append("g").attr("class", "bar-groups"))
      .attr("transform", (_, i) => `translate(${xScale(i)},0)`)
      .attr("fill-opacity", (_, i) => (i === 0 ? 1 : opacity(i)))
      .selectAll("rect")
      .data((d) => d)
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("opacity", 0)
            .attr("fill", ({ color }) => color)
            .attr("x", ({ name }) => groupScale(name))
            .attr("y", ({ d }) => yScale(d) + yBufferTop)
            .attr(
              "height",
              ({ d }) => height - yScale(d) - yBuffer - yBufferTop
            )
            .attr("width", groupScale.bandwidth()),
        (update) => update,
        (exit) => exit.transition().attr("opacity", 0)
      )
      .transition()
      .attr("opacity", 1)
      .attr("fill", ({ color }) => color)
      .attr("x", ({ name }) => groupScale(name))
      .attr("y", ({ d }) => yScale(d) + yBufferTop)
      .attr("height", ({ d }) => height - yScale(d) - yBuffer - yBufferTop)
      .attr("width", groupScale.bandwidth());

    if (!svg.select(".title").node()) {
      svg.append("g").attr("class", "brush");

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

    const brushOverlay = svg.select(".brush").call(brush);
    if (filter) brushOverlay.call(brush.move, filter.range.map(brushToLoc));
    else brushOverlay.call(brush.move, null);

    svg
      .select(".title")
      .attr("x", (width + xBuffer) / 2)
      .attr("y", 20)
      .text(column);

    svg
      .select(".x-unanswered")
      .attr("x1", xScale(1) - 28)
      .attr("x2", xScale(1) - 28)
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
      .transition()
      .call(d3.axisLeft(yScale));

    svg.select(".y-title").attr("x", -height / 2 + yBufferTop / 2);
  }, [barData, svgRef, column, colorFn, filters, setFilters]);

  return <svg className="bar" ref={svgRef} />;
};
