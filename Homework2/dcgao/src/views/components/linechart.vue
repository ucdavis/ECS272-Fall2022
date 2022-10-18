<template>
    <h4>Select number of countries to plot their change in production number</h4>
    <a-slider id="linechart-slider" v-model:value="numSelected" :min=1 :max=7 :marks="marks" class="number-slider" />
    <div id="linechart"></div>
</template>

<script>
import * as d3 from "d3";
import config from '../../config'
import utils from '../../utils'

export default {
    name: 'LineChart',
    data() {
        return {
            numSelected: 5,
            marks: {
                1: "1",
                2: "2",
                3: "3",
                4: "4",
                5: "5",
                6: "6",
                7: "7",
            },
        }
    },
    props: {
        csvData: Object,
    },
    mounted() {
        this.drawChart()
    },
    watch: {
        numSelected: {
            handler() { this.drawChart(); }
        }
    },
    methods: {
        getYearCounts() {
            let selectedCountries = utils.selectTitleData(this.csvData, this.numSelected);
            let yearCounts = [];
            let colorMap = {};
            selectedCountries.forEach((country, i) => {
                yearCounts.push(Object.entries(this.csvData.year_counts[country]));
                colorMap[country] = config.COLOR_SCHEME[i];
            });
            return {
                selectCountries: selectedCountries,
                yearCounts: yearCounts,
                colorMap: colorMap,
            }
        },
        drawChart() {
            let [height, width] = [400, 640];
            let renderData = this.getYearCounts(this.csvData)
            let { selectCountries, yearCounts, colorMap } = renderData;
            let [marginLeft, marginRight, marginTop, marginBottom] = [30, 30, 30, 30]
            // Only consider productions after 2000 since too few movies before 2000
            let xDomain = [new Date("2000"), new Date("2022")];
            let yDomain = [0, 320];

            const xScale = d3.scaleTime(xDomain, [marginLeft, width - marginRight]);
            const yScale = d3.scaleLinear(yDomain, [height - marginBottom, marginTop]);
            const xAxis = d3.axisBottom(xScale).ticks(width / 40).tickSizeOuter(0).tickFormat(d3.timeFormat("%Y"));
            const yAxis = d3.axisLeft(yScale).ticks(height / 30);

            d3.select("#linechart").select("svg").remove();
            const svg = d3.select("#linechart")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [0, 0, width, height])

            // Axis legends
            svg.append("g")
                .attr("transform", `translate(0,${height - marginBottom})`)
                .call(xAxis)
                .call(g => g.append("text")
                    .attr("x", width - marginRight)
                    .attr("y", marginBottom - 20)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .text("Years"));
            svg.append("g")
                .attr("transform", `translate(${marginLeft},0)`)
                .call(yAxis)
                .call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick line").clone()
                    .attr("x2", width - marginLeft - marginRight)
                    .attr("stroke-opacity", 0.1))
                .call(g => g.append("text")
                    .attr("x", -marginLeft)
                    .attr("y", 10)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .text("Number of Movies"));

            // Construct a line with annual data
            let line = d3.line()
                .curve(d3.curveLinear)
                .x(i => xScale(new Date(i[0])))
                .y(i => yScale(i[1]));

            let drawLine = (data, color) => {
                svg.append("path")
                    .attr("fill", "none")
                    .attr("stroke", color)
                    .attr("stroke-width", 1.5)
                    .attr("stroke-linecap", "round")
                    .attr("stroke-linejoin", "round")
                    .attr("stroke-opacity", 0.9)
                    .attr("d", line(data));
            }

            // Dot legends
            svg.selectAll("dots")
                .data(selectCountries)
                .enter()
                .append("circle")
                .attr("cx", 70)
                .attr("cy", (_, i) => 90 + i * 25)
                .attr("r", 6)
                .style("fill", d => colorMap[d])

            svg.selectAll("countries")
                .data(selectCountries)
                .enter()
                .append("text")
                .attr("x", 90)
                .attr("y", function (d, i) { return 90 + i * 25 })
                .style("fill", d => colorMap[d])
                .text(d => d)
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle");

            selectCountries.forEach((country, i) => {
                drawLine(yearCounts[i], colorMap[country])
            })

            let hover = svg.append("g")
                .style("display", "none");

            hover.append("rect")
                .style("fill", "white")
                .style("stroke", config.COLOR_SCHEME[6])
                .style("fill-opacity", 0.9)
                .attr("width", 250)
                .attr("height", 40)
                .attr("x", 40)
                .attr("y", 20)
                .attr("rx", 4)
                .attr("ry", 4);

            hover.append("text")
                .style("font-size", "14px")
                // .style("stroke", "#333")
                .attr("x", 50)
                .attr("y", 45)
                .text("A sharp increase between 2014-2018");

            hover.append("line")
                .style("stroke", config.COLOR_SCHEME[6])
                .style("stroke-width", 3)
                .style("stroke-dasharray", 5)
                .attr("x1", height)
                .attr("x2", height)
                .attr("y1", yScale.range()[1])
                .attr("y2", yScale.range()[0])

            hover.append("line")
                .style("stroke", config.COLOR_SCHEME[6])
                .style("stroke-width", 3)
                .style("stroke-dasharray", 5)
                .attr("x1", height + 158)
                .attr("x2", height + 158)
                .attr("y1", yScale.range()[1])
                .attr("y2", yScale.range()[0])

            svg.append("rect")
                .style("fill", "none")
                .style("pointer-events", "all")
                .attr("width", width)
                .attr("height", height)
                .on("mouseover", () => hover.style("display", null))
                .on("mouseout", () => hover.style("display", "none"));

            // Plot title
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", 11)
                .attr("text-anchor", "middle")
                .style("font-size", "15px")
                .style("text-decoration", "underline")
                .text(`OVERVIEW: Annual Production Change of ${this.numSelected} Countries`);

            return svg.node();
        }
    },
}

</script>


<style scoped>
.number-slider {
    margin-right: 30px;
}
</style>