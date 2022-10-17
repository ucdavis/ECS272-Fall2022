import * as d3 from "d3";
import { sankey, sankeyLinkHorizontal, sankeyJustify } from "d3-sankey";
import { useEffect, useRef, useState } from "react";
import { SatisfactionTitle } from "./App";

const VIEW_PADDING = 35;
const PADDING = 15;
const NODE_WIDTH = 2;

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
        };
      data[key].value++;
    }
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
    nodes: Object.entries(nodes).map(([name, category]) => ({
      category,
      name,
      color: config.color(name, "#000"),
      active: category === config.column,
    })),
  };
}

export const Sankey = ({ data, columns, config }) => {
  const svgRef = useRef(null);

  const [sankeyData, setSankeyData] = useState();
  useEffect(() => {
    setSankeyData(processData(data, columns, config));
  }, [data, columns, config]);

  useEffect(() => {
    if (!svgRef.current || !sankeyData) return;
    const svg = d3.select(svgRef.current);
    const { width, height } = svg.node().getBoundingClientRect();

    const { nodes, links } = sankey()
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
          .attr("fill", "none")
          .attr("stroke", "#000")
          .attr("stroke-opacity", 0.3)
      )
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke-width", ({ width }) => width)
      .attr("stroke", (d) => config.color(d.colorOn));

    svg
      .selectAll("rect")
      .data(nodes)
      .join((enter) => enter.append("rect").attr("fill", "#000"))
      .attr("fill", (d) => d.color)
      .attr("x", (d) => (d.active ? d.x0 - NODE_WIDTH * 5 : d.x0))
      .attr("y", (d) => d.y0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("width", (d) => (d.active ? 10 * NODE_WIDTH : NODE_WIDTH));

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
      .text((d) => {
        const parts = d.name.split(",");
        if (parts.length > 1) return SatisfactionTitle[Number(parts[0])];
        return capitalize(d.name);
      })
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
  }, [sankeyData, svgRef, config]);

  return <svg className="sankey" ref={svgRef} />;
};
