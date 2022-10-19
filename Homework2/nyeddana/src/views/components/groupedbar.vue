<template>
  <div id="bar"></div>
</template>

<script>
import * as d3 from "d3";
import genderData from "../../assets/data/genderAge.csv";
import customerData from "../../assets/data/customerAge.csv";
import classData from "../../assets/data/classAge.csv";
import travelData from "../../assets/data/travelAge.csv";

var localData;

export default {
  name: "BarChart",
  props: {
    testData: String,
    bartestData: String,
    myBarchartData: Array,
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
    console.log("Data Passed down as a Prop  ", this.bartestData);
    this.drawGroupBarChart(localData, "#bar", this.bartestData);
    // console.log("Data Passed down as a Prop  ", this.myBarchartData);
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
      this.drawGroupBarChart(localData, "#bar", this.bartestData);
    },
    bartestData() {
      this.drawGroupBarChart(localData, "#bar", this.bartestData);
    },
  },
  methods: {
    drawGroupBarChart(localData, id, type) {
      const margin = { top: 40, right: 0, bottom: 120, left: 200 };
      const height = 178;
      const width = 500;

      //remove chart to recreate upon dropdown change
      d3.select(id).selectAll("div svg").remove();
      d3.select(id).selectAll("div div").remove();

      //create tooltip div
      var div = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      //create svg
      const svg = d3
        .select(id)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

        //load data from csv and create groups
      d3.csv(localData).then(function (data) {
        data = data.filter(function (d) {
          if (d["Grouping"] != type) {
            return false;
          } else {
            return true;
          }
        });
        console.log(data);
        const subgroups = [
          "inflightWifi",
          "Dept_Arr_Time_Convenience",
          "onlineBooking_ease",
          "gateLocation",
          "foodandDrinks",
          "onlineBoarding",
          "seatComfort",
          "inflightEntertainment",
          "onboardService",
          "legroomService",
          "baggageHandling",
          "checkinService",
          "inflightService",
          "Cleanliness",
        ];
        const groups = data.map((d) => d.AgeRange);
        console.log("subgroups", subgroups);
        console.log("groups", groups);
        console.log("data", data);

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

        svg
          .append("text")
          .attr(
            "transform",
            "translate(" + width / 2 + " ," + (height + 30) + ")"
          )
          .style("text-anchor", "middle")
          .text("Age Groups (years)");

        // Add Y axis
        const y = d3.scaleLinear().domain([0, 4]).range([height, 0]);
        svg.append("g").call(d3.axisLeft(y));

        svg
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - 50)
          .attr("x", 0 - height / 2)
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Survey Score");

        // Another scale for subgroup position
        const xSubgroup = d3
          .scaleBand()
          .domain(subgroups)
          .range([0, x.bandwidth()])
          .padding([0.05]);

        // color palette = one color per subgroup
        const color = d3
          .scaleOrdinal()
          .domain(subgroups)
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

        // Draw the bars
        svg
          .append("g")
          .selectAll("g")
          .data(data)
          .join("g")
          .attr("transform", (d) => `translate(${x(d.AgeRange)}, 0)`)
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
          .attr("fill", (d) => color(d.key))
          .on("mouseover", function (event, d) {
            div.transition().duration(200).style("opacity", 0.9);
            div
              .html(d.value)
              .style("left", event.pageX + "px")
              .style("top", event.pageY - 28 + "px");
          })
          .on("mouseout", function (d) {
            div.transition().duration(500).style("opacity", 0);
          });

        //Draw the legend
        const legenditems = [
          "Inflight Wifi",
          "Dept/Arr Time",
          "Online Booking",
          "Gate Location",
          "Food & Drinks",
          "Online Boarding",
          "Seat Comfort",
          "Entertainment",
          "Onboard Service",
          "Legroom",
          "Baggage Handling",
          "Check-in",
          "Inflight Service",
          "Cleanliness",
        ];

        svg
          .selectAll("mydots")
          .data(subgroups)
          .enter()
          .append("circle")
          .attr("cx", -180)
          .attr("cy", function (d, i) {
            return i * 20;
          }) 
          .attr("r", 7)
          .style("fill", function (d) {
            return color(d);
          });

        // Add one dot in the legend for each name.
        svg
          .selectAll("mylabels")
          .data(legenditems)
          .enter()
          .append("text")
          .attr("x", -160)
          .attr("y", function (d, i) {
            return i * 20;
          }) 
          .text(function (d) {
            return d;
          })
          .attr("text-anchor", "left")
          .style("alignment-baseline", "middle");
      });
    },
  },
};
</script>

<style>
.axis .domain {
  display: none;
}

div.tooltip {
  position: absolute;
  text-align: center;
  vertical-align: middle;
  width: 150px;
  height: 28px;
  padding: 2px;
  font: 12px sans-serif;
  background: white;
  border: solid 1px black;
  border-radius: 8px;
}
</style>
