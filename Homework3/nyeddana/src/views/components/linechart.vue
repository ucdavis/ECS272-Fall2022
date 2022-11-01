<template>
  <div class="line-dd">
    Choose Parameter:
    <select class="linenew">
      <option value="inflightWifi" selected>In-flight Wifi</option>
      <option value="Dept_Arr_Time_Convenience">
        Departure/Arrival time Convenience
      </option>
      <option value="onlineBooking_ease">Ease of Online Booking</option>
      <option value="gateLocation">Gate Location</option>
      <option value="foodandDrinks">Food and Drinks</option>
      <option value="onlineBoarding">Online Boarding</option>
      <option value="seatComfort">Seat Comfort</option>
      <option value="inflightEntertainment">In-flight Entertainment</option>
      <option value="onboardService">Onboard Service</option>
      <option value="legroomService">Legroom Service</option>
      <option value="baggageHandling">Baggage Handling</option>
      <option value="checkinService">Check-in Service</option>
      <option value="inflightService">In-flight Service</option>
      <option value="Cleanliness">Cleanliness</option>
    </select>
  </div>

  <div id="line"></div>
</template>

<script>
import * as d3 from "d3";
import genderData from "../../assets/data/genderFlight.csv";
import customerData from "../../assets/data/customerFlight.csv";
import classData from "../../assets/data/classFlight.csv";
import travelData from "../../assets/data/travelFlight.csv";

var localData = genderData;
var yaxis = "inflightWifi";
const margin = { top: 30, right: 40, bottom: 180, left: 200 },
  width = 350,
  height = 198;

export default {
  name: "LineChart",

  props: {
    testData: String,
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
    this.drawLineChart("#line", localData);
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
      this.drawLineChart("#line", localData);
    },
  },

  methods: {
    drawLineChart(id, localData) {
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
          .attr("height", height + 80)
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);

        // Add X axis
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
          .style("font-weight", "bold")
          .text("Flight Distance (miles)");

        //Add Y axis
        const y = d3.scaleLinear().domain([0, 4]).range([height, 0]);
        svg.append("g").call(d3.axisLeft(y));

        svg
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - 50)
          .attr("x", 0 - height / 2)
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .style("font-weight", "bold")
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

        var filter = svg.append("defs").append("filter").attr("id", "glow"),
          feGaussianBlur = filter
            .append("feGaussianBlur")
            .attr("stdDeviation", "5")
            .attr("result", "coloredBlur"),
          feMerge = filter.append("feMerge"),
          feMergeNode_1 = feMerge
            .append("feMergeNode")
            .attr("in", "coloredBlur"),
          feMergeNode_2 = feMerge
            .append("feMergeNode")
            .attr("in", "SourceGraphic");

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
        d3.select(".linenew").on("change", update);
        update();
        function update() {
          yaxis = d3.select(".linenew").property("value");

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
            console.log(d);
            tooltip
              .html(`${d[yaxis]}`)
              .style("left", event.x + "px")
              .style("top", event.y + "px");
          };
          const mouseleave = function (event, d) {
            tooltip.transition().duration(200).style("opacity", 0);
          };

          //Draw line

          const lines = svg
            .selectAll(".line")
            .data(sumstat)
            .join("path")
            .attr("fill", "none")
            .attr("opacity", 0.3)
            .attr("class", "line")
            .attr("stroke", function (d) {
              return color(d[0]);
            })
            .attr("stroke-width", 1.5)
            .on("click", function (d) {
              // console.log(d.target.__data__[0]);
              // console.log(dots._groups[0]);

              if (d3.select(this).attr("opacity") == 1) {
                d3.select(this).attr("opacity", 0.3);
              } else {
                d3.select(this).attr("filter", "url(#glow)").attr("opacity", 1);
              }
            })
            .transition()
            .duration(2000)
            .attr("d", function (d) {
              return d3
                .line()
                .x(function (d) {
                  // console.log(d.distanceRange)
                  return x(d.distanceRange);
                })
                .y(function (d) {
                  // console.log(d, yaxis)
                  return y(+d[yaxis]);
                })(d[1]);
            });

          //Draw dots
          const dots = svg
            .selectAll(".dot")
            .data(data)
            .join("circle")
            .attr("fill", function (d) {
              return color(d.Grouping);
            })
            .attr("class", "dot")
            .attr("r", 5)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .transition()
            .duration(2000)
            .attr("cx", function (d) {
              return x(d.distanceRange);
            })
            .attr("cy", function (d) {
              return y(+d[yaxis]);
            });
        }
      });
    },
  },
};
</script>

<style>
.dot {
  cursor: pointer;
}
.line {
  cursor: pointer;
}
.linenew {
  background: white;
  border-color: #d9d9d9;
  border-radius: 2px;
  font-size: 14px;
  padding: 4px 8px;
  height: 32px;
  touch-action: manipulation;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  cursor: pointer;
  white-space: nowrap;
  text-align: center;
  line-height: 1.5715;
  position: relative;
  display: inline-block;
  font-family: "Open Sans", sans-serif;
}
.linenew:hover {
  border-color: #1890ff;
  border-right-width: 1px;
}
.linenew::selection {
  color: #fff;
  background: #1890ff;
}
</style>
