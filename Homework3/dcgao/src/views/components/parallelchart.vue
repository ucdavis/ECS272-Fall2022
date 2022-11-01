<template>
  <h4>Select number of productions to show in parallel coordinates</h4>
  <a-slider id="linechart-slider" v-model:value="numSamples" :min="10" :max="800" :marks="marks" />
  <div id="parallelchart"></div>
</template>

<script>
import { DownOutlined } from "@ant-design/icons-vue";
import * as d3 from "d3";
import config from "../../config";
import utils from "../../utils";

export default {
  name: "ParallelChart",
  data() {
    return {
      renderData: {
        countries: [],
        stats: [],
        colors: {},
      },
      numSelected: 3,
      numSamples: 1000,
      thresholds: {
        vote: 1000,
        pop: 10,
        score: 10,
        tmdb_score: 10,
        release_year: 1970,
      },
      dimensions: ["vote", "pop", "score", "tmdb_score", "release_year"],
      titles: [
        "Votes",
        "Popularity",
        "IMDB Score",
        "TMDB Score",
        "Release Year",
      ],
      marks: {
        10: "10",
        100: "100",
        200: "200",
        400: "400",
        600: "600",
        800: "800",
      },
    };
  },
  props: {
    csvData: Object,
  },
  components: {
    DownOutlined,
  },
  mounted() {
    this.drawChart();
  },
  watch: {
    numSamples: {
      handler() {
        this.drawChart();
      },
    },
  },
  methods: {
    getStats() {
      if (this.renderData && this.renderData.length) {
        return {
          ...this.renderData,
          stats: this.renderData.slice(0, this.numSamples),
        };
      }
      let selectedCountries = utils.selectTitleData(
        this.csvData,
        this.numSelected
      );
      let colors = {};
      let stats = [];

      selectedCountries.forEach((country, i) => {
        stats.push(
          ...this.csvData.stats[country]
            .filter(
              // Thresholds for different variables
              (d) =>
                d.vote < this.thresholds["vote"] &&
                d.pop < this.thresholds["pop"] &&
                d.release_year >= this.thresholds["release_year"]
            )
            .map((d) => Object.assign(d, { color: config.COLOR_SCHEME[i] }))
        );
        colors[country] = config.COLOR_SCHEME[i];
      });
      stats = stats.sort((a, b) => {
        a.release_year < b.release_year && a.score < b.score;
      });
      this.renderData = {
        countries: selectedCountries,
        stats: stats.slice(0, this.numSamples),
        colors: colors,
      };
      return this.renderData;
    },
    drawChart() {
      let { countries, stats, colors } = this.getStats();
      const margin = { top: 30, right: 10, bottom: 10, left: 10 };
      const [width, height] = [1280 - margin.left - margin.right, 500];
      const axisRange = [margin.top, height - margin.bottom];
      const brushWidth = 30;
      const unselectedColor = "#ddd";

      d3.select("#parallelchart").select("svg").remove();
      const svg = d3.select("#parallelchart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
          `translate(${margin.left},${margin.top})`);
      const axisNames = this.dimensions;

      const brush = d3
        .brushY()
        .extent([
          [-(brushWidth / 2), margin.top],
          [brushWidth / 2, height - margin.bottom],
        ])
        .on("start brush end", brushed);

      // Create x axis
      const axisSpacing = width / axisNames.length;
      const x = d3
        .scalePoint()
        .domain(axisNames)
        .range([
          margin.left + axisSpacing / 2,
          width - margin.right - axisSpacing / 2,
        ]);

      // Create each y axis
      const y = {}
      axisNames.forEach(varName => {
        y[varName] = d3.scaleLinear()
          .domain(d3.extent(stats, d => d[varName]))
          .range(axisRange)
      });
      y["vote"] = d3.scaleLinear()
        .domain([0, this.thresholds["vote"]])
        .range(axisRange)
      y["tmdb_score"] = d3.scaleLinear()
        .domain([0, this.thresholds["tmdb_score"]])
        .range(axisRange)

      // Draw lines
      const path = svg
        .append("g")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .attr("stroke-opacity", 0.4)
        .selectAll("path")
        .data(stats)
        .join("path")
        .attr("stroke", (d) => d.color)
        .attr("d", d => d3.line()(this.dimensions.map(varName => {
          return [x(varName), y[varName](d[varName])];
        })))

      // Draw parallel axis
      svg.append("g")
        .selectAll("g")
        .data(axisNames)
        .join("g")
        .attr("transform", d => `translate(${x(d)}, 0)`)
        .each(function (d) {
          d3.select(this).call(d3.axisLeft().scale(y[d]));
        })
        .call(g => g.append("text")
          .attr("y", height - 6)
          .attr("text-anchor", 'middle')
          .attr("font-weight", "bold")
          .text(d => d))
        .call(g => g.selectAll("text")
          .clone(true).lower()
          .attr("fill", "none")
          .attr("stroke-width", 7)
          .attr("stroke-linejoin", "round")
          .attr("stroke", "white"))
        .call(brush);

      const selections = new Map();

      // Brushing functions for each axis
      function brushed({ selection }, axisName) {
        if (selection === null) {
          selections.delete(axisName);
        } else {
          selections.set(axisName, selection.map(y[axisName].invert));
        }
        const selected = [];
        path.each(function (d) {
          const active = Array.from(selections).every(
            ([axisName, [min, max]]) => d[axisName] >= min && d[axisName] <= max
          );
          d3.select(this)
            .transition()
            .duration(500)
            .style(
              "stroke",
              active ? d.color : unselectedColor
            );
          if (active) {
            d3.select(this).raise();
            selected.push(d);
          }
        });
        svg.property("value", selected).dispatch("input");
      }

      // Dot legends
      svg.append("g")
        .selectAll("dots")
        .data(countries)
        .enter()
        .append("circle")
        .attr("cx", 50)
        .attr("cy", (_, i) => 50 + i * 25)
        .attr("r", 6)
        .style("fill", d => colors[d]);
      svg.selectAll("countries")
        .data(countries)
        .enter()
        .append("text")
        .attr("x", 70)
        .attr("y", function (_, i) { return 50 + i * 25 })
        .style("fill", d => colors[d])
        .text(d => d)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");

      // Plot title
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .style("font-size", "15px")
        .style("text-decoration", "underline")
        .text(`Parallel Coordinates of 5 Features of Netflix Productions in 3 Countries`)

      return svg.node();
    },
  },
};
</script>

<style>

</style>
