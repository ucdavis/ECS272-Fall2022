<template>
  <div id="radar"></div>
</template>

<script>
import * as d3 from "d3";
import genderData from "../../assets/data/genderPassengers.json";
import customerData from "../../assets/data/customerPassengers.json";
import classData from "../../assets/data/classPassengers.json";
import travelData from "../../assets/data/travelPassengers.json";

var margin = { top: 120, right: 140, bottom: 180, left: 100 },
  legendPosition = { x: 25, y: 25 },
  width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
  height = 375;

var color = d3
  .scaleOrdinal()
  .range([
    "#a6cee3",
    "#b2df8a",
    "#1f78b4",
    "#fb9a99",
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

var labels, localData;

var options = {
  w: width,
  h: height,
  margin: margin,
  legendPosition: legendPosition,
  maxValue: 0.5,
  levels: 5,
  roundStrokes: true,
  color: color,
};

export default {
  name: "RadarChart",
  props: {
    RadartestData: String,
    myRadarchartData: Array,
  },
  mounted() {
    console.log("Data Passed down as a Prop  ", this.RadartestData);
    console.log(this.RadartestData);

    switch (this.RadartestData) {
      case "genderData":
        labels = genderData["keys"];
        localData = genderData["data"];
        break;
      case "customerData":
        labels = customerData["keys"];
        localData = customerData["data"];
        break;
      case "classData":
        labels = classData["keys"];
        localData = classData["data"];
        break;
      case "travelData":
        labels = travelData["keys"];
        localData = travelData["data"];
        break;
    }
    console.log(labels, localData);
    this.drawRadarChart(
      "#radar",
      labels,
      localData,
      options
    ); 
  },
  watch: {
    RadartestData() {
      switch (this.RadartestData) {
        case "genderData":
          labels = genderData["keys"];
          localData = genderData["data"];
          break;
        case "customerData":
          labels = customerData["keys"];
          localData = customerData["data"];
          break;
        case "classData":
          labels = classData["keys"];
          localData = classData["data"];
          break;
        case "travelData":
          labels = travelData["keys"];
          localData = travelData["data"];
          break;
      }
      console.log(labels, localData);
      this.drawRadarChart("#radar", labels, localData, options);
    },
  },
  methods: {
    drawRadarChart(id, labels, data, options) {
      var cfg = {
        w: 600, //Width of the circle
        h: 600, //Height of the circle
        margin: { top: 20, right: 20, bottom: 20, left: 20 }, //The margins of the SVG
        legendPosition: { x: 20, y: 20 }, //position of the legend
        levels: 3, //How many levels or inner circles should there be drawn
        maxValue: 0, //What is the value that the biggest circle will represent
        labelFactor: 1.25, //How much farther than the radius of the outer circle should the labels be placed
        wrapWidth: 60, //The number of pixels after which a label needs to be given a new line
        opacityArea: 0.35, //The opacity of the area of the blob
        dotRadius: 4, //The size of the colored circles of each blog
        opacityCircles: 0.1, //The opacity of the circles of each blob
        strokeWidth: 2, //The width of the stroke around each blob
        roundStrokes: false, //If true the area and stroke will follow a round path (cardinal-closed)
        color: d3.scaleOrdinal(d3.schemeCategory10), //Color function
      };
      if ("undefined" !== typeof options) {
        for (var i in options) {
          if ("undefined" !== typeof options[i]) {
            cfg[i] = options[i];
          }
        } //for i
      } //if

      //If the supplied maxValue is smaller than the actual one, replace by the max in the data
      var maxValue = Math.max(
        cfg.maxValue,
        d3.max(data, function (i) {
          return d3.max(
            i.map(function (o) {
              return o.value;
            })
          );
        })
      );

      var allAxis = data[0].map(function (i, j) {
          return i.axis;
        }), //Names of each axis
        total = allAxis.length, //The number of different axes
        radius = Math.min(cfg.w / 2, cfg.h / 2), //Radius of the outermost circle
        angleSlice = (Math.PI * 2) / total; //The width in radians of each "slice"
      console.log(data[0]);
      //Scale for the radius
      var rScale = d3.scaleLinear().range([0, radius]).domain([0, maxValue]);
      //Remove svg to create new one when dropdown value changes
      d3.select(id).select("svg").remove();
      //Initiate the radar chart SVG
      var svg = d3
        .select(id)
        .append("svg")
        .attr("width", cfg.w + 50 +cfg.margin.right)
        .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
        .attr("class", "radar" + id);
      //Append a g element
      var g = svg
        .append("g")
        .attr(
          "transform",
          "translate(" +
            (cfg.w / 2 + cfg.margin.left) +
            "," +
            (cfg.h / 2 + cfg.margin.top) +
            ")"
        );

      //Filter for the outside glow
      var filter = g.append("defs").append("filter").attr("id", "glow"),
        feGaussianBlur = filter
          .append("feGaussianBlur")
          .attr("stdDeviation", "2.5")
          .attr("result", "coloredBlur"),
        feMerge = filter.append("feMerge"),
        feMergeNode_1 = feMerge.append("feMergeNode").attr("in", "coloredBlur"),
        feMergeNode_2 = feMerge
          .append("feMergeNode")
          .attr("in", "SourceGraphic");

      //Wrapper for the grid & axes
      var axisGrid = g.append("g").attr("class", "axisWrapper");

      //Draw the background circles
      axisGrid
        .selectAll(".levels")
        .data(d3.range(1, cfg.levels + 1).reverse())
        .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", function (d, i) {
          return (radius / cfg.levels) * d;
        })
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", cfg.opacityCircles)
        .style("filter", "url(#glow)");

      //Text indicating at what % each level is
      axisGrid
        .selectAll(".axisLabel")
        .data(d3.range(1, cfg.levels + 1).reverse())
        .enter()
        .append("text")
        .attr("class", "axisLabel")
        .attr("x", 4)
        .attr("y", function (d) {
          return (-d * radius) / cfg.levels;
        })
        .attr("dy", "0.4em")
        .style("font-size", "10px")
        .attr("fill", "#737373")
        .text(function (d, i) {
          return (maxValue * d) / cfg.levels;
        });

      //Create the straight lines radiating outward from the center
      var axis = axisGrid
        .selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");
      //Append the lines
      axis
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", function (d, i) {
          return (
            rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2)
          );
        })
        .attr("y2", function (d, i) {
          return (
            rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2)
          );
        })
        .attr("class", "line")
        .style("stroke", "white")
        .style("stroke-width", "2px");

      //Append the labels at each axis
      axis
        .append("text")
        .attr("class", "legend")
        .style("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", function (d, i) {
          return (
            rScale(maxValue * cfg.labelFactor) *
            Math.cos(angleSlice * i - Math.PI / 2)
          );
        })
        .attr("y", function (d, i) {
          return (
            rScale(maxValue * cfg.labelFactor) *
            Math.sin(angleSlice * i - Math.PI / 2)
          );
        })
        .text(function (d) {
          return d;
        });

      //The radial line function
      var radarLine = d3
        .lineRadial()
        .curve(d3.curveBasisClosed)
        .radius(function (d) {
          return rScale(d.value);
        })
        .angle(function (d, i) {
          return i * angleSlice;
        });

      if (cfg.roundStrokes) {
        radarLine.curve(d3.curveCardinalClosed);
      }

      //Create a wrapper for the blobs
      var blobWrapper = g
        .selectAll(".radarWrapper")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "radarWrapper");

      //Append the backgrounds
      blobWrapper
        .append("path")
        .attr("class", "radarArea")
        .attr("d", function (d, i) {
          return radarLine(d);
        })
        .style("fill", function (d, i) {
          return cfg.color(i);
        })
        .style("fill-opacity", cfg.opacityArea)
        .on("mouseover", function (d, i) {
          //Dim all blobs
          d3.selectAll(".radarArea")
            .transition()
            .duration(200)
            .style("fill-opacity", 0.1);
          //Bring back the hovered over blob
          d3.select(this).transition().duration(200).style("fill-opacity", 0.7);
        })
        .on("mouseout", function () {
          //Bring back all blobs
          d3.selectAll(".radarArea")
            .transition()
            .duration(200)
            .style("fill-opacity", cfg.opacityArea);
        });

      //Create the outlines
      blobWrapper
        .append("path")
        .attr("class", "radarStroke")
        .attr("d", function (d, i) {
          return radarLine(d);
        })
        .style("stroke-width", cfg.strokeWidth + "px")
        .style("stroke", function (d, i) {
          return cfg.color(i);
        })
        .style("fill", "none")
        .style("filter", "url(#glow)");

      //Append the circles
      blobWrapper
        .selectAll(".radarCircle")
        .data(function (d, i) {
          return d;
        })
        .enter()
        .append("circle")
        .attr("class", "radarCircle")
        .attr("r", cfg.dotRadius)
        .attr("cx", function (d, i) {
          return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
        })
        .attr("cy", function (d, i) {
          return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
        })
        .style("fill", function (d, i, j) {
          return cfg.color(j);
        })
        .style("fill-opacity", 0.8);

      //Wrapper for the invisible circles on top
      var blobCircleWrapper = g
        .selectAll(".radarCircleWrapper")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "radarCircleWrapper");

      //Append a set of invisible circles on top for the mouseover pop-up
      blobCircleWrapper
        .selectAll(".radarInvisibleCircle")
        .data(function (d, i) {
          return d;
        })
        .enter()
        .append("circle")
        .attr("class", "radarInvisibleCircle")
        .attr("r", cfg.dotRadius * 1.5)
        .attr("cx", function (d, i) {
          return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
        })
        .attr("cy", function (d, i) {
          return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
        })
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function (d, i) {
          var newX = parseFloat(d3.select(this).attr("cx")) - 10;
          var newY = parseFloat(d3.select(this).attr("cy")) - 10;
          console.log(d);

          tooltip
            .attr("x", newX)
            .attr("y", newY)
            .text(d.value)
            .transition()
            .duration(200)
            .style("opacity", 1);
        })
        .on("mouseout", function () {
          tooltip.transition().duration(200).style("opacity", 0);
        });

      //Set up the small tooltip for when you hover over a circle
      var tooltip = g
        .append("text")
        .attr("class", "tooltip")
        .style("opacity", 0);

      const maxword = d3.max(labels, (d) => d.length);
      const r = width / 50;
      const x = -width / 2 - maxword;
      const y = -height / 1.5;
      var legend = g
        .selectAll("mydots")
        .data(labels)
        .enter()
        .append("circle")
        .attr("cx", x)
        .attr("cy", function (d, i) {
          return y + i * 25;
        })
        .attr("r", r)
        .style("fill", (d, i) => cfg.color(i));

      g.selectAll("mydots")
        .data(labels)
        .enter()
        .append("text")
        .attr("x", x + 15)
        .attr("y", function (d, i) {
          return y + i * 25;
        })
        .style("fill", cfg.textColor)
        .style("font-size", "11px")
        .text((d) => d)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
    },
  },
};
</script>

<style>
body {
  font-family: "Open Sans", sans-serif;
  font-size: 11px;
  font-weight: 300;
  fill: #242424;
  text-shadow: 0 1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff, 0 -1px 0 #fff;
  cursor: default;
}

.legend {
  font-family: "Raleway", sans-serif;
  fill: #333333;
  font-size: 100px;
}

.tooltip {
  fill: #333333;
}
</style>
