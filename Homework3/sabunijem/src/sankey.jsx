import * as d3 from "d3";
import { sankey, sankeyLinkHorizontal, sankeyJustify } from "d3-sankey";
import tip from "d3-tip-2021";
import { useEffect, useRef, useState } from "react";
import { isNumber } from "underscore";
import { SatisfactionTitle } from "./App";

const VIEW_PADDING = 35;
const PADDING = 15;
const NODE_WIDTH = 6;

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function processData(rawData, columns, config) {
  const colorOn = config.column;
  const cols = [];
  for (let i = 1; i < columns.length; i++)
    cols.push([columns[i - 1], columns[i], colorOn]);

  const data = {};
  for (const srcDest of cols) {
    for (const d of rawData) {
      const key = srcDest.map((col) =>
        typeof d[col] == "string" ? d[col] : `${d[col]}, ${col}`
      );

      if (!data[key])
        data[key] = {
          source: [key[0], srcDest[0]],
          target: [key[1], srcDest[1]],
          value: 0,
          colorOn: d[colorOn],
          color: config.color(d[colorOn]),
        };
      data[key].value++;
    }
  }

  // Compute tool tip info
  let tooltips = {};
  for (let categoryKey of columns) {
    const category = {};
    for (const d of rawData) {
      const key = d[categoryKey];

      if (!category[key]) {
        category[key] = {
          count: 0,
          subCount: {},
        };
      }

      category[key].count += 1;

      category[key].subCount[d[colorOn]] =
        (category[key].subCount[d[colorOn]] ?? 0) + 1;
    }

    let sum = 0;
    for (let c of Object.values(category)) {
      sum += c.count;
      c.sub = Object.entries(c.subCount)
        .map(([title, value]) => ({
          title: formatTitle(title),
          percentage: value / c.count,
          color: config.color(title),
        }))
        .sort((a, b) => a.title.localeCompare(b.title));

      delete c.subCount;
    }

    for (let c of Object.values(category)) {
      c.percentage = c.count / sum;
      delete c.count;
    }

    tooltips[categoryKey] = category;
  }

  const links = Object.values(data);
  const nodes = {};
  for (let link of links) {
    nodes[link.target[0]] = link.target[1];
    nodes[link.source[0]] = link.source[1];
    link.target = link.target[0];
    link.source = link.source[0];
  }

  return {
    links,
    nodes: Object.entries(nodes).map(([name, category]) => {
      const rawName = rawValue(name);
      return {
        category,
        name,
        rawName,
        color: config.color(name, "#000"),
        active: category === config.column,
        toolTip: tooltips[category][rawName],
      };
    }),
  };
}

const PercentageFormatter = d3.format(",.1%");

const rawValue = (title) => {
  const parts = title.split(",");
  if (parts.length > 1) return Number(parts[0]);
  return title;
};

const formatTitle = (title) => {
  const raw = rawValue(title);
  if (isNumber(raw)) return SatisfactionTitle[raw];
  return capitalize(raw);
};

const toolTip = tip()
  .attr("class", "d3-tip")
  .html(
    (_, e) => `
      <h5>${formatTitle(e.name)} - ${PercentageFormatter(
      e.toolTip.percentage
    )}</h5>
      ${e.toolTip.sub
        .map(
          (d) =>
            `<div><span class="tooltip-legend-color" style="background: ${
              d.color
            }"></span><b>${d.title}</b> - ${PercentageFormatter(
              d.percentage
            )}</div>`
        )
        .join("")}
    `
  )
  .direction("e");

export const Sankey = ({ data, columns, config, filters, setFilters }) => {
  const svgRef = useRef(null);

  const [sankeyData, setSankeyData] = useState();
  useEffect(() => {
    setSankeyData(processData(data, columns, config));
  }, [data, columns, config]);

  useEffect(() => {
    if (!svgRef.current || !sankeyData) return;
    const svg = d3.select(svgRef.current);
    const { width, height } = svg.node().getBoundingClientRect();

    svg.call(toolTip);

    const { nodes, links } =
      sankeyData.nodes.length === 0
        ? { nodes: [], links: [] }
        : sankey()
            .nodeId(({ name }) => name)
            .nodeAlign(sankeyJustify)
            .linkSort((a, b) => {
              let order = a.colorOn.localeCompare(b.colorOn);
              if (!order) order = a.source.name.localeCompare(b.source.name);
              if (!order) order = a.target.name.localeCompare(b.target.name);
              return order;
            })
            .nodeSort((a, b) => a.name.localeCompare(b.name))
            .nodePadding(PADDING)
            .nodeWidth(NODE_WIDTH)
            .extent([
              [0, VIEW_PADDING],
              [width, height - VIEW_PADDING],
            ])(sankeyData);

    svg
      .selectAll("path")
      .data(links)
      .join((enter) =>
        enter
          .append("path")
          .attr("class", "sankey-path")
          .attr("fill", "none")
          .attr("stroke", "#000")
          .attr("stroke-opacity", 0.3)
      )
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke-width", ({ width }) => width)
      .attr("stroke", (d) => d.color);

    svg.on("click", () => {
      setFilters((f) => {
        f = { ...f };
        for (let key of Object.keys(f)) if (f[key]["sankey"]) delete f[key];
        return f;
      });
    });

    svg
      .selectAll("rect")
      .data(nodes)
      .join((enter) =>
        enter
          .append("rect")
          .attr("class", "sankey-nodes")
          .attr("fill", "#000")
          .attr("stroke-width", 3)
      )
      .attr("fill", (d) => d.color)
      .attr("x", (d) => (d.active ? d.x0 - NODE_WIDTH : d.x0))
      .attr("y", (d) => d.y0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("width", (d) => (d.active ? 2 * NODE_WIDTH : NODE_WIDTH))
      .attr("stroke", ({ category, name }) => {
        if (filters[category] && filters[category].sankey === name)
          return "orange";
        return "transparent";
      })
      .on("mouseover", toolTip.show)
      .on("mouseout", toolTip.hide)
      .on("click", (event, { category, name, rawName }) => {
        event.stopPropagation();

        function filter(d) {
          return d[category] === rawName;
        }

        if (isNumber(rawName)) {
          filter.range = [rawName, rawName + 1];
        }

        filter.sankey = name;

        setFilters((f) => {
          f = { ...f };
          if (!f[category]) f[category] = filter;
          else delete f[category];
          return f;
        });
      });

    svg
      .selectAll(".node_label")
      .data(nodes)
      .join((enter) =>
        enter
          .append("text")
          .attr("class", "node_label")
          .attr("fill", "#000")
          .attr("text-anchor", "end")
          .attr("font-size", 14)
      )
      .text((d) => formatTitle(d.name))
      .attr("y", (d) => (d.y0 + d.y1) / 2)
      .attr("text-anchor", (d) => (d.x0 <= 10 ? "start" : "end"))
      .attr("x", (d) => (d.x0 <= 10 ? d.x0 + NODE_WIDTH + 14 : d.x0 - 14));

    const labels = Object.entries(
      nodes.reduce((r, d) => {
        r[d.x0] = d.category;
        return r;
      }, {})
    );

    svg
      .selectAll(".column_title")
      .data(labels)
      .join((enter) =>
        enter
          .append("text")
          .attr("class", "column_title")
          .attr("fill", "#000")
          .attr("text-anchor", "end")
          .attr("font-weight", "bold")
          .attr("text-anchor", "middle")
          .attr("font-size", 11)
      )
      .attr("x", ([x]) => Number(x))
      .attr("y", VIEW_PADDING - 15)
      .text(([_, title]) => title)
      .filter(([x]) => Number(x) <= 10)
      .attr("text-anchor", "start");

    svg
      .selectAll(".column_title")
      .filter(([x]) => Number(x) >= width - 10)
      .attr("text-anchor", "end");
  }, [sankeyData, svgRef, filters, setFilters]);

  return <svg className="sankey" ref={svgRef} />;
};
