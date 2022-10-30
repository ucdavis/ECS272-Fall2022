import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { SatisfactionTitle } from "./App";
import { BsArrowsExpand } from "react-icons/bs";
import { FcClearFilters } from "react-icons/fc";

const yBuffer = 0;
const yBufferTop = 30;
const xPadding = 20;
const opacity = d3.scaleLinear().range([0.3, 1]).domain([1, 5]);

function diverge(data) {
  const mid = data[3] / 2;
  let priorEnd = mid;
  for (let index = 4; index < data.length; index++) {
    data[index] = {
      key: index,
      x: priorEnd,
      width: data[index],
    };
    priorEnd += data[index].width;
  }

  priorEnd = -mid;
  for (let index = 2; index > 0; index--) {
    data[index] = {
      key: index,
      x: priorEnd - data[index],
      width: data[index],
    };
    priorEnd -= data[index].width;
  }

  data[3] = {
    key: 3,
    x: -mid,
    width: data[3],
  };
  return data;
}

function sumPercentages(data) {
  let prior = 0;
  return data.map((width, key) => {
    const result = {
      key,
      x: prior,
      width,
    };

    prior += width;
    return result;
  });
}

function normalize(data, isDiverge) {
  data = [0, ...data.slice(1)];
  let sum = d3.sum(data);
  data = data.map((d) => (sum === 0 ? 0 : d / sum));
  data = isDiverge ? diverge(data) : sumPercentages(data);
  return data.splice(1);
}

const processData = (data, isDiverge) =>
  data.map((d) => ({
    ...d,
    groups: d.groups.map((d) => ({
      ...d,
      data: normalize(d.data, isDiverge),
    })),
  }));

export const SatisfactionContext = ({
  data: { data, groups },
  colorFn,
  columns,
  selected,
  onSelect,
  filters,
  setFilters,
}) => {
  const svgRef = useRef(null);
  const [isDiverge, setDiverge] = useState(true);
  const [_data, setData] = useState();

  useEffect(() => {
    if (!data) return;
    setData(processData(data, isDiverge));
  }, [data, isDiverge, groups]);

  useEffect(() => {
    if (!svgRef.current || !_data) return;
    const svg = d3.select(svgRef.current);
    const { width, height } = svg.node().getBoundingClientRect();

    const xScale = d3
      .scaleLinear()
      .domain([isDiverge ? -1 : 0, 1])
      .range([xPadding, width - xPadding]);

    const yScale = d3
      .scaleBand()
      .range([yBufferTop, height - yBuffer])
      .domain(columns);

    const groupScale = d3
      .scaleBand()
      .domain(groups)
      .range([0, yScale.bandwidth()])
      .paddingInner(0.1)
      .paddingOuter(groups.length === 2 ? 1 : 1.15);

    const contextGroup = svg
      .selectAll(".context-groups")
      .data(_data)
      .join((enter) =>
        enter
          .append("g")
          .attr("class", "context-groups")
          .attr("transform", ({ column }) => `translate(0,${yScale(column)})`)
      )
      .attr("transform", ({ column }) => `translate(0,${yScale(column)})`)
      .selectAll("g")
      .data((d) => d.groups)
      .join((enter) =>
        enter
          .append("g")
          .attr(
            "transform",
            ({ group }) => `translate(0,${groupScale(group) ?? 0})`
          )
          .attr("fill", ({ color }) => color)
      );

    contextGroup
      .transition()
      .attr(
        "transform",
        ({ group }) => `translate(0,${groupScale(group) ?? 0})`
      )
      .attr("fill", ({ color }) => color);

    contextGroup
      .selectAll("rect")
      .data((d) => d.data)
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("fill-opacity", ({ key }) => opacity(key))
            .attr("x", ({ x }) => xScale(x))
            .attr("opacity", 0)
            .attr(
              "width",
              ({ width }) => xScale((isDiverge ? -1 : 0) + width) - xPadding
            )
            .attr("height", groupScale.bandwidth()),
        (update) => update,
        (exit) => exit.transition().attr("opacity", 0)
      )
      .transition()
      .attr("fill-opacity", ({ key }) => opacity(key))
      .attr("opacity", 1)
      .attr("x", ({ x }) => xScale(x))
      .attr(
        "width",
        ({ width }) => xScale((isDiverge ? -1 : 0) + width) - xPadding
      )
      .attr("height", groupScale.bandwidth());

    const center = xScale(isDiverge ? 0 : 0.5);

    if (!svg.select(".x-axis-center").node()) {
      svg
        .append("line")
        .attr("class", "x-axis-center")
        .attr("stroke", "white")
        .attr("x1", isDiverge ? center : 0)
        .attr("x2", isDiverge ? center : 0)
        .attr("y1", yBufferTop - 5)
        .attr("y2", height - yBuffer)
        .attr("opacity", isDiverge ? 1 : 0)
        .attr("stroke-width", 2);
      svg.append("g").attr("class", "x-axis");
    }

    svg
      .select(".x-axis-center")
      .raise()
      .transition()
      .attr("x1", isDiverge ? center : 0)
      .attr("x2", isDiverge ? center : 0)
      .attr("y1", yBufferTop - 5)
      .attr("y2", height - yBuffer)
      .attr("opacity", isDiverge ? 1 : 0);

    svg
      .selectAll(".y-axis-title")
      .data(columns)
      .join((entry) =>
        entry
          .append("text")
          .attr("class", "y-axis-title")
          .attr("font-size", 11)
          .attr("font-weight", "bold")
          .attr("text-anchor", "middle")
      )
      .attr("y", (d) => yScale(d) + 7)
      .attr("x", center)
      .text((d) => d)
      .raise();

    svg
      .select(".x-axis")
      .attr("transform", "translate(0, 20)")
      .transition()
      .call(d3.axisTop(xScale).tickFormat(d3.format("+~%")).ticks(3))
      .selectAll("line")
      .attr("stroke", "lightgray");
    svg.select(".x-axis").selectAll(".domain").attr("stroke", "lightgray");
    svg.select(".x-axis").selectAll("text").attr("font-weight", "bold");

    svg
      .selectAll(".selector")
      .data(columns)
      .join((enter) =>
        enter
          .append("rect")
          .attr("class", "selector")
          .attr("fill", "transparent")
          .attr("rx", 4)
          .attr("stroke-width", 1)
      )
      .attr("height", yScale.bandwidth())
      .attr("width", width - 2)
      .attr("x", 1)
      .attr("y", (column) => yScale(column) - 5)
      .attr("stroke", (column) =>
        column === selected ? "#179bf3" : "transparent"
      )
      .attr("cursor", (column) => (column === selected ? "default" : "pointer"))
      .on("click", (_, column) => {
        onSelect(column);
      })
      .raise();

    svg
      .selectAll(".filters")
      .data(columns)
      .join((enter) =>
        enter
          .append("rect")
          .attr("class", "filters")
          .attr("fill", (d) => (filters[d.column] ? "orange" : "transparent"))
          .attr("fill-opacity", 0.15)
          .attr("rx", 0)
      )
      .attr("height", yScale.bandwidth())
      .attr("width", width - 2)
      .attr("fill", (column) => (filters[column] ? "orange" : "transparent"))
      .attr("x", 1)
      .attr("y", (column) => yScale(column) - 5)
      .lower();

    // eslint-disable-next-line
  }, [_data, svgRef, selected, onSelect, isDiverge, columns, filters]);

  return (
    <>
      <div className="survey-title">
        <h5>Survey Responses</h5>
        <div
          onClick={() => setDiverge((d) => !d)}
          className={`toggle ${isDiverge ? "inactive" : "active"}`}
        >
          <BsArrowsExpand />
        </div>
        <div
          onClick={() => setFilters({})}
          className={`clear-filters ${
            Object.keys(filters).length === 0 ? "disabled" : "enabled"
          }`}
        >
          <FcClearFilters />
        </div>
      </div>
      <svg ref={svgRef} />
      <div className="legend">
        <h6>Legend</h6>
        {SatisfactionTitle.slice(1).map((name, idx) => (
          <div key={idx} className="legend-entry">
            {(groups ?? []).map((col, gIdx) => {
              const backgroundColor = d3.color(colorFn(col));
              backgroundColor.opacity = opacity(idx + 1);
              return (
                <div
                  className="legend-color"
                  style={{ backgroundColor }}
                  key={`${idx}-${gIdx}`}
                />
              );
            })}
            <span className="legend-title">{name}</span>
          </div>
        ))}
      </div>
    </>
  );
};
