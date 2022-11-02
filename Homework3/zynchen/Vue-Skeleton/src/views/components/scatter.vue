<template>
  <h2 class="chartname">Top {{this.selected}} most CO2 emission countries view</h2>
  <a-slider id="scatterchart-slider" v-model:value="selected" :min=1 :max=8 :marks="marks" class="scatter-slider" />
  <div id="scatter"></div>

</template>

<script>

import * as d3 from "d3";

export default {
  name: "scatter",
  data() {
    return {
      titleX: "year",
      titleY: "Emissions value",
      csvData: {},
      selected: 8,
      marks: {
        1: "QAT",
        2: "KWT",
        3: "BHR",
        4: "ARE",
        5: "BRN",
        6: "CAN",
        7: "LUX",
        8: "SAU",
      },
    }
  },
  mounted() {
    this.drawChart();
  },
  watch: {
    selected: {
      handler() { this.drawChart(); }
    }
  },
  methods: {
    getStat() {
      let colors = {};
      let stats = [];
      const COLOR_SCHEME = ["#e81010", "#24fc39", "#16b000", "#a268ec", "#0bdab9", "#050101", "#fa7602", "#0685d9"];
      stats["qatar"] = [];
      stats["kuwait"] = [];
      stats["bahrain"] = [];
      stats["united_arab_emirates"] = [];
      stats["brunei_darussalam"] = [];
      stats["canada"] = [];
      stats["Luxembourg"] = [];
      stats["Saudi Arabia"] = [];
      let year = [1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019];
      let data1 = [26.32932654,30.73741059,29.63244066,33.12202505,36.46626328,37.10217413,40.07417742,47.42957483,48.0450209,50.83385044,48.37400227,46.58438114,50.71215469,50.95403383,49.20805129,44.53380584,42.79830768,40.89652419,36.91870848,32.67180019,32.63430234,33.4944129,34.18822184,32.5989398,33.20589511,33.04351032,32.74588827,32.12798967,31.0675333,32.47446876];
      for (let i = 0; i < 30; i++) {
        stats["qatar"].push({
          year: year[i],
          data: data1[i],
        });
      }
      let data2 = [13.90221204,3.849757076,0,0,0,22.57291362,21.90111245,21.80958768,23.0077641,23.43667537,24.37017236,25.28915647,26.01321211,26.88716685,28.13454038,30.79469952,30.51404573,28.19459481,28.55410798,27.5253006,26.97965604,26.29058751,25.47440065,24.77326637,23.1838022,23.20895692,23.13702198,22.36876769,22.08921039,22.0224164];
      for (let i = 0; i < 30; i++) {
        stats["kuwait"].push({
          year: year[i],
          data: data2[i],
        });
      }
      let data3 = [21.65641314,20.30359266,23.45712527,24.37468762,24.32722575,24.01995395,24.45300444,24.23826789,25.24046883,24.27184466,23.8937121,23.49652355,23.42410876,23.03816133,21.60641891,23.26923202,23.46563028,22.20240095,22.21335064,20.8594387,20.92896507,20.35750059,20.90093256,21.93867997,22.66343283,22.29101801,21.25133118,20.42732768,19.63120569,20.26610279];
      for (let i = 0; i < 30; i++) {
        stats["bahrain"].push({
          year: year[i],
          data: data3[i],
        });
      }
      let data4 = [30.19518857,31.77849624,29.08092584,29.27567777,30.84933296,31.12501806,30.92802588,30.48633262,29.66358052,28.88710798,27.03515911,29.43026994,28.50146173,27.96926982,27.03893822,25.38238104,22.93510429,21.37028576,22.01146924,19.83234887,19.03976975,18.50945738,19.20780112,20.05564757,20.05169797,21.07764197,21.48066861,20.76902233,18.39067806,19.32956328];
      for (let i = 0; i < 30; i++) {
        stats["united_arab_emirates"].push({
          year: year[i],
          data: data4[i],
        });
      }
      let data5 = [12.60078697,12.69683856,13.10754761,13.95180415,14.75201415,15.48237702,15.85582037,16.76486239,14.16328513,13.58004255,14.16711189,13.85143381,13.32268255,15.62433655,14.18897462,13.66703853,20.30994264,19.04167531,20.847719,20.50002315,18.44923521,18.61885184,18.29587739,17.82826519,17.27764771,15.42488346,16.60349981,17.17391347,17.5773964,16.13215855];
      for (let i = 0; i < 30; i++) {
        stats["brunei_darussalam"].push({
          year: year[i],
          data: data5[i],
        });
      }
      let data6 = [15.14888987,14.74101397,15.0282342,14.71338582,15.06034534,15.29060285,15.59259037,15.94398546,16.07651198,16.25852275,16.75762643,16.33156895,16.72030149,17.20830161,16.79426996,17.02748527,16.5953499,17.38057011,16.55692294,15.50214503,15.79214123,15.9959443,15.73447396,15.83846027,15.84990541,15.64858561,15.42060171,15.54457104,15.65057904,15.43061283];
      for (let i = 0; i < 30; i++) {
        stats["canada"].push({
          year: year[i],
          data: data6[i],
        });
      }
      let data7 = [29.56658374,30.36175711,29.17065086,29.3100195,26.8288143,21.19302539,21.09964391,19.64477292,17.8243466,18.39828097,19.61952785,20.65568201,22.0093006,22.67342686,25.45323535,25.60420297,24.79704354,23.14617017,22.55192972,20.97299341,21.7574405,21.02838372,20.13387346,18.68006408,17.34616222,16.02867977,15.20582045,15.09216281,15.33020757,15.30642656];
      for (let i = 0; i < 30; i++) {
        stats["Luxembourg"].push({
          year: year[i],
          data: data7[i],
        });
      }
      let data8 = [10.55884314,11.2045202,11.69031249,11.44269558,11.32945089,10.98944728,11.4348952,11.33964215,11.82310273,11.86063692,12.08197508,11.98388163,12.48548405,12.68355031,12.96390807,13.23848219,13.69237149,14.08083313,15.05376806,15.26569182,16.26936986,16.40642066,16.89149679,16.74461002,17.48316332,17.81940147,17.29871828,16.4667833,15.46639077,15.28457873];
      for (let i = 0; i < 30; i++) {
        stats["Saudi Arabia"].push({
          year: year[i],
          data: data8[i],
        });
      }
      let countries = ["qatar", "kuwait", "bahrain", "united_arab_emirates", "brunei_darussalam", "canada", "Luxembourg", "Saudi Arabia"];
      countries = countries.slice(0, this.selected);
      let newStats = [];
      let newStats1 = [];
      countries.forEach((country, i) => {
        for (let n = 1990; n <= 2019; n++) {
          newStats1.push()
        }
        newStats.push(...stats[country].map(d => Object.assign(d, {color: COLOR_SCHEME[i]}))

        );
      });
      colors["qatar"] = [];
      colors["kuwait"] = [];
      colors["bahrain"] = [];
      colors["united_arab_emirates"] = [];
      colors["brunei_darussalam"] = [];
      colors["qatar"] = "#e81010";
      colors["kuwait"] = "#24fc39";
      colors["bahrain"] = "#16b000";
      colors["united_arab_emirates"] = "#a268ec";
      colors["brunei_darussalam"] = "#0bdab9";
      colors["canada"] = "#050101";
      colors["Luxembourg"] = "#fa7602";
      colors["Saudi Arabia"] = "#0685d9";
      console.log(stats);
      return {
        stats: newStats,
        colors: colors,
        countries: countries,
      }
    },
    drawChart() {
      let { countries, stats, colors } = this.getStat();
      //console.log(stats[0]["year"]);
      let [height, width] = [400, 600];
      let [marginLeft, marginRight, marginTop, marginBottom] = [40, 130, 40, 40];
      let X = d3.map(stats, d => d["year"]);
      let Y = d3.map(stats, d => d["data"]);
      let xDomain = d3.extent(X);
      let yDomain = d3.extent(Y);
      let [insetLeft, insetRight, insetTop, insetBottom] = [6, 6, 6, 6]
      let xRange = [marginLeft + insetLeft, width - marginRight - insetRight];
      let yRange = [height - marginBottom - insetBottom, marginTop + insetTop];
      const xScale = d3.scaleLinear(xDomain, xRange);
      const yScale = d3.scaleLinear(yDomain, yRange);
      const xAxis = d3.axisBottom(xScale).ticks(width / 80);
      const yAxis = d3.axisLeft(yScale).ticks(height / 50);

      d3.select("#scatter").select("svg").remove();

      const svg = d3.select("#scatter")
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [0, 0, width, height]);

      svg.append("g")
          .attr("transform", `translate(0,${height - marginBottom})`)
          .call(xAxis)
          .call(g => g.select(".domain").remove())
          .call(g => g.selectAll(".tick line").clone()
              .attr("y2", marginTop + marginBottom - height)
              .attr("stroke-opacity", 0.2))
          .call(g => g.append("text")
              .attr("x", width - marginRight + 20)
              .attr("y", marginBottom - 25)
              .attr("fill", "currentColor")
              .attr("text-anchor", "end")
              .text(this.titleX));

      svg.append("g")
          .attr("transform", `translate(${marginLeft},0)`)
          .call(yAxis)
          .call(g => g.select(".domain").remove())
          .call(g => g.selectAll(".tick line").clone()
              .attr("x2", width - marginLeft - marginRight)
              .attr("stroke-opacity", 0.2))
          .call(g => g.append("text")
              .attr("x", -marginLeft)
              .attr("y", 25)
              .attr("fill", "currentColor")
              .attr("text-anchor", "start")
              .text(this.titleY));

      const dot = svg.append("g")
          //.attr("stroke", "#fff")
          .attr("stroke-width", 1)
          .attr("fill", "none")
          .selectAll("circle")
          .data(stats)
          .join("circle")
          .attr("stroke", d => d.color)
          .attr("cx", d => xScale(d["year"]))
          .attr("cy", d => yScale(d["data"]))
          .attr("r", 3)


      svg.append("rect")
          .style("fill", "none")
          .style("pointer-events", "all")
          .attr("width", width)
          .attr("height", height)

      svg.append("g")
          .selectAll("dots")
          .data(countries)
          .enter()
          .append("circle")
          .attr("cx", 480)
          .attr("cy", (_, i) => 10 + i * 25)
          .attr("r", 6)
          .style("fill", d => colors[d]);

      svg.selectAll("countries")
          .data(countries)
          .enter()
          .append("text")
          .attr("x", 500)
          .attr("y", function (d, i) {
            return 10 + i * 25
          })
          .style("fill", d => colors[d])
          .text(d => d)
          .attr("text-anchor", "left")
          .style("alignment-baseline", "middle");

      svg.append("text")
          .attr("x", width / 2)
          .attr("y", 16)
          .attr("text-anchor", "middle")
          .style("font-size", "15px")
          .style("text-decoration", "underline")
          .text(`${this.titleX}-${this.titleY} Correlations in 5 Countries`);

      var brush = d3.brush()
          .on("start brush end", brushed);
      svg.call(brush);

      function brushed({selection})
      {
        let value = [];
        if (selection) {
          const [[x0, y0], [x1, y1]] = selection;
          value = dot
              .style("stroke", "gray")
              .style("fill", "none")
              .filter(d => +x0 <= +xScale(d["year"]) && +xScale(d["year"]) < +x1 && +y0 <= +yScale(d["data"]) && +yScale(d["data"]) < +y1)
              .style("stroke", "red")
              .style("fill", "red")
              .data();
        } else {
          dot.style("stroke", d => colors[d])
        }
        svg.property("value", value).dispatch("input");
      }
      console.log("finish scatter");
      return svg.node();

    },

  },
}
</script>

<style scoped>
.scatter-slider {
  margin-left: 20px;
  margin-right: 20px;
}
</style>