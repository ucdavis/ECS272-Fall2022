import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { SatisfactionTitle } from "./App";
import { BsArrowsExpand } from 'react-icons/bs';

const yBuffer = 0;
const yBufferTop = 30;
const xPadding = 20;
const UNANSWERED = 0;
const opacity = d3.scaleLinear().range([0.25, 1]).domain([1, 5]);

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
  let sum = d3.sum(data);
  data = data.map((d) => d / sum);
  data = isDiverge ? diverge(data) : sumPercentages(data);
  return data.splice(1);
}

function processData(rawData, columns, config, isDiverge) {
  const groups = new Set();
  const groupedData = {};
  for (let data of rawData) {
    for (let column of columns) {
      if (data[column] === UNANSWERED) continue;

      groupedData[column] = groupedData[column] ?? {
        column,
        groups: {},
      };

      let colData = groupedData[column].groups;
      const groupKey = data[config.column];
      groups.add(groupKey);
      colData[groupKey] = colData[groupKey] ?? {
        group: data[config.column],
        data: [0, 0, 0, 0, 0, 0],
      };

      colData[groupKey].data[data[column]] += 1;
    }
  }

  let data = Object.values(groupedData);
  data.forEach((d) => (d.groups = Object.values(d.groups)));
  data.forEach((d) =>
    d.groups.forEach((d) => {
      d.data = normalize(d.data, isDiverge);
      d.color = config.color(d.group);
    })
  );

  return {
    data,
    columns,
    groups: [...groups].sort(),
  };
}

export const SatisfactionContext = ({
  data,
  columns,
  config,
  selected,
  onSelect,
}) => {
  const svgRef = useRef(null);

  const [isDiverge, setDiverge] = useState(true);
  const [_data, setData] = useState();

  useEffect(() => {
    setData(processData(data, columns, config, isDiverge));
  }, [data, columns, config, isDiverge]);

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
      .domain(_data.columns);

    const groupScale = d3
      .scaleBand()
      .domain(_data.groups)
      .range([0, yScale.bandwidth()])
      .paddingInner(0.05)
      .paddingOuter(0.65);

    svg
      .selectAll(".context-groups")
      .data(_data.data)
      .join((enter) => enter.append("g").attr("class", "context-groups"))
      .attr("transform", ({ column }) => `translate(0,${yScale(column)})`)
      .selectAll("g")
      .data((d) => d.groups)
      .join("g")
      .attr("transform", ({ group }) => `translate(0,${groupScale(group)})`)
      .attr("fill", ({ color }) => color)
      .selectAll("rect")
      .data((d) => d.data)
      .join("rect")
      .attr("opacity", ({ key }) => opacity(key))
      .attr("x", ({ x }) => xScale(x))
      .attr(
        "width",
        ({ width }) => xScale((isDiverge ? -1 : 0) + width) - xPadding
      )
      .attr("height", groupScale.bandwidth());

    const center = xScale(isDiverge ? 0 : 0.5);

    if (!svg.select(".x-axis-center").node()) {
      svg.append("line").attr("class", "x-axis-center");
      svg.append("g").attr("class", "x-axis");
    }

    svg
      .select(".x-axis-center")
      .attr("x1", center)
      .attr("x2", center)
      .attr("y1", yBufferTop)
      .attr("y2", height - yBuffer)
      .attr("stroke", () => (isDiverge ? "white" : "transparent"))
      .attr("stroke-width", 2)
      .raise();

    svg
      .selectAll(".y-axis-title")
      .data(_data.columns)
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
      .call(d3.axisTop(xScale).tickFormat(d3.format("+~%")).ticks(3))
      .selectAll("line")
      .attr("stroke", "lightgray");
    svg.select(".x-axis").selectAll(".domain").attr("stroke", "lightgray");
    svg.select(".x-axis").selectAll("text").attr("font-weight", "bold");

    svg
      .selectAll(".selector")
      .data(
        _data.data.map((d) => {
          d.selected = d.column === selected;
          return d;
        })
      )
      .join((enter) =>
        enter
          .append("rect")
          .attr("class", "selector")
          .attr("fill", "transparent")
          .attr("rx", 4)
          .attr("stroke-width", 2)
      )
      .attr("height", yScale.bandwidth())
      .attr("width", width - 2)
      .attr("x", 1)
      .attr("y", ({ column }) => yScale(column) - 5)
      .attr("stroke", ({ selected }) => (selected ? "#179bf3" : "transparent"))
      .attr("cursor", (d) => (d.selected ? "default" : "pointer"))
      .on("click", (_, { column }) => {
        onSelect(column);
      })
      .raise();
  }, [_data, svgRef, selected, onSelect, isDiverge]);

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
      </div>
      <svg ref={svgRef} />
      <div className="legend">
        <h6>Legend</h6>
        {SatisfactionTitle.slice(1).map((name, idx) => (
          <div key={idx} className="legend-entry">
            {((_data ?? {}).groups ?? []).map((col) => {
              const background = d3.color(config.color(col));
              background.opacity = opacity(idx + 1);
              return (
                <div
                  className="legend-color"
                  style={{ background }}
                  key={col}
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
