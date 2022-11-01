<template>
  <div id="bar"></div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "GroupStackedBarChart",
  props: {
    myBarchartData: Array,
  },
  mounted() {
    this.drawGroupBarChart( "#bar");
    console.log("Data Passed down as a Prop  ", this.myBarchartData);
  },

  methods: {
    drawGroupBarChart(id) {
      const margin = { top: 10, right: 30, bottom: 20, left: 50 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

      const svg = d3
        .select(id)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
      d3.csv(
        "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_stacked.csv"
      ).then(function (data) {
        const subgroups = data.columns.slice(1);
        const groups = data.map((d) => d.group);
        console.log("subgroups", subgroups);
        console.log("groups", groups);

        // Add X axis
        const x = d3
          .scaleBand()
          .domain(groups)
          .range([0, width])
          .padding([0.2]);
        svg
          .append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(d3.axisBottom(x).tickSize(0));

        // Add Y axis
        const y = d3.scaleLinear().domain([0, 40]).range([height, 0]);
        svg.append("g").call(d3.axisLeft(y));

        // Another scale for subgroup position?
        const xSubgroup = d3
          .scaleBand()
          .domain(subgroups)
          .range([0, x.bandwidth()])
          .padding([0.05]);

        // color palette = one color per subgroup
        const color = d3
          .scaleOrdinal()
          .domain(subgroups)
          .range(["#e41a1c", "#377eb8", "#4daf4a"]);

        // Show the bars
        svg
          .append("g")
          .selectAll("g")
          // Enter in data = loop group per group
          .data(data)
          .join("g")
          .attr("transform", (d) => `translate(${x(d.group)}, 0)`)
          .selectAll("rect")
          .data(function (d) {
            return subgroups.map(function (key) {
              return { key: key, value: d[key] };
            });
          })
          .join("rect")
          .attr("x", (d) => xSubgroup(d.key))
          .attr("y", (d) => y(d.value))
          .attr("width", xSubgroup.bandwidth())
          .attr("height", (d) => height - y(d.value))
          .attr("fill", (d) => color(d.key));
      });
    },
  },
};
</script>

<style>
.axis .domain {
  display: none;
}
</style>
