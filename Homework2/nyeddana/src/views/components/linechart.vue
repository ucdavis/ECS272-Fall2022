<template>
  <div id="line"></div>
</template>

<script>
import * as d3 from "d3";
import genderData from "../../assets/data/genderFlight.csv";
import customerData from "../../assets/data/customerFlight.csv";
import classData from "../../assets/data/classFlight.csv";
import travelData from "../../assets/data/travelFlight.csv";

var localData = genderData;

const margin = { top: 30, right: 10, bottom: 180, left: 200 },
  width = 350,
  height = 198;

export default {
  name: "LineChart",

  props: {
    testData: String,
    LinetestData: String,
    myLinechartData: Array,
  },
  mounted() {
    console.log("Data Passed down as a Prop  ", this.testData);
    console.log(this.testData);
    switch (this.testData) {
      case "genderData":
        localData = genderData;
        break;
      case "customerData":
        localData = customerData;
        break;
      case "classData":
        localData = classData;
        break;
      case "travelData":
        localData = travelData;
        break;
    }
    console.log("Data Passed down as a Prop  ", this.LinetestData);
    this.drawLineChart("#line", localData, this.LinetestData);
  },

  watch: {
    testData() {
      switch (this.testData) {
        case "genderData":
          localData = genderData;
          break;
        case "customerData":
          localData = customerData;
          break;
        case "classData":
          localData = classData;
          break;
        case "travelData":
          localData = travelData;
          break;
      }
      this.drawLineChart("#line", localData, this.LinetestData);
    },

    LinetestData() {
      var yaxis = this.LinetestData;
      console.log("yaxis", yaxis);
      this.drawLineChart("#line", localData, this.LinetestData);
    },
  },

  methods: {
    drawLineChart(id, localData, yaxis) {
      d3.csv(localData).then(function (data) {
        // group the data
        const sumstat = d3.group(data, (d) => d.Grouping);
        let allKeys = new Set(data.map((d) => d.Grouping));

        console.log("keys", allKeys);
        console.log("sumstat", sumstat);

        //remove chart to recreate upon dropdown change
        d3.select(id).selectAll("div svg").remove();
        d3.select(id).selectAll("div div").remove();

        //create svg
        const svg = d3
          .select(id)
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + 50)
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);

        // Add X axis --> it is a date format
        const x = d3
          .scalePoint()
          .domain(["0-1000", "1000-2000", "2000-3000", "3000-4000", "> 4000"])
          .range([0, width]);
        svg
          .append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(d3.axisBottom(x).ticks(5));

        svg
          .append("text")
          .attr(
            "transform",
            "translate(" + width / 2 + " ," + (height + 40) + ")"
          )
          .style("text-anchor", "middle")
          .text("Flight Distance (miles)");

        //Add Y axis
        const y = d3
          .scaleLinear()
          .domain([
            0,
            d3.max(data, function (d) {
              return +d[yaxis];
            }),
          ])
          .range([height, 0]);
        svg.append("g").call(d3.axisLeft(y));

        svg
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - 50)
          .attr("x", 0 - height / 2)
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Survey Score");

        // color palette
        const color = d3
          .scaleOrdinal()
          .range([
            "#a6cee3",
            "#b2df8a",
            "#fb9a99",
            "#1f78b4",
            "#33a02c",
            "#e31a1c",
            "#fdbf6f",
            "#ff7f00",
            "#cab2d6",
            "#6a3d9a",
            "#ffff99",
            "#b15928",
            "#e6ab02",
            "#999999",
          ]);

        //Draw line

        svg
          .selectAll(".line")
          .data(sumstat)
          .join("path")
          .attr("fill", "none")
          .attr("stroke", function (d) {
            return color(d[0]);
          })
          .attr("stroke-width", 1.5)
          .attr("d", function (d) {
            return d3
              .line()
              .x(function (d) {
                return x(d.distanceRange);
              })
              .y(function (d) {
                return y(+d[yaxis]);
              })(d[1]);
          });

        //Draw legend

        var legendItemSize = 12;
        var legendSpacing = 4;
        var xOffset = 0;
        var yOffset = 0;
        var legend = d3
          .select("#line")
          .append("svg")
          .attr("width", 120)
          .attr("height", 100)
          .selectAll(".legendItem")
          .data(sumstat);

        legend
          .enter()
          .append("rect")
          .attr("class", "legendItem")
          .attr("width", legendItemSize)
          .attr("height", legendItemSize)
          .style("fill", (d) => color(d[0]))
          .attr("transform", (d, i) => {
            var x = xOffset;
            var y = yOffset + (legendItemSize + legendSpacing) * i;
            return `translate(${x}, ${y})`;
          });

        //Create legend labels
        legend
          .enter()
          .append("text")
          .attr("x", xOffset + legendItemSize + 5)
          .attr(
            "y",
            (d, i) => yOffset + (legendItemSize + legendSpacing) * i + 12
          )
          .text((d) => d[0]);

        const tooltip = d3
          .select(id)
          .append("div")
          .style("opacity", 0)
          .attr("class", "tooltip")
          .style("background-color", "white")
          .style("border", "solid")
          .style("border-width", "1px")
          .style("border-radius", "5px")
          .style("padding", "5px")
          .style("position", "absolute");

        // Tooltip
        const mouseover = function (event, d) {
          tooltip.style("opacity", 1);
        };

        const mousemove = function (event, d) {
          tooltip
            .html(`${d[yaxis]}`)
            .style("left", event.x + "px")
            .style("top", event.y + "px");
        };
        const mouseleave = function (event, d) {
          tooltip.transition().duration(200).style("opacity", 0);
        };
        //Draw dots
        svg
          .append("g")
          .selectAll("dot")
          .data(data)
          .join("circle")
          .attr("cx", function (d) {
            return x(d.distanceRange);
          })
          .attr("cy", function (d) {
            return y(d[yaxis]);
          })
          .attr("r", 5)
          .style("fill", function (d) {
            return color(d.Grouping);
          })
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave);
      });
    },
  },
};
</script>

<style></style>
