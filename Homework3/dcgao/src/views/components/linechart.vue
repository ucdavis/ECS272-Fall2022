<template>
    <h4>Zoom in and out: Select number of countries to plot their change in production number</h4>
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
            let renderData = this.getYearCounts(this.csvData)
            let { selectCountries, yearCounts, colorMap } = renderData;
            let [marginLeft, marginRight, marginTop, marginBottom] = [30, 20, 10, 10]
            let [height, width] = [400 - marginTop - marginBottom, 640 - marginLeft - marginRight];

            // Only consider productions after 2000 since too few movies before 2000
            let xDomain = [new Date("2000"), new Date("2022")];
            let yDomain = [0, 320];

            let xScale = d3.scaleTime(xDomain, [0, width]);
            var shadowScale = xScale.copy();
            let xAxis = d3.axisBottom(xScale).ticks(width / 40).tickSizeOuter(0).tickFormat(d3.timeFormat("%Y"));
            let yScale = d3.scaleLinear(yDomain, [height, 0]);
            let yAxis = d3.axisLeft(yScale).ticks(height / 40);

            d3.select("#linechart").select("svg").remove();
            const svg = d3.select("#linechart")
                .append("svg")
                .attr("width", width + marginLeft + marginRight)
                .attr("height", height + marginTop + marginBottom)

            var clip = svg.append("defs").append("svg:clipPath")
                .attr("id", "clip")
                .append("svg:rect")
                .attr("width", width)
                .attr("height", height)
                .attr("x", 0)
                .attr("y", 0);

            // Axis legends
            xAxis = svg.append("g")
                .attr("transform", `translate(${marginLeft},${height})`)
                .call(xAxis)
                .call(g => g.append("text")
                    .attr("x", width)
                    .attr("y", marginBottom)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .text("Years"));
            svg.append("g")
                .attr("transform", `translate(${marginLeft},0)`)
                .call(yAxis)
                .call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick line").clone()
                    .attr("x2", width + marginLeft + marginRight)
                    .attr("stroke-opacity", 0.1))
                .call(g => g.append("text")
                    .attr("x", -marginLeft)
                    .attr("y", 10)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .text("Number of Movies"));

            // Construct a line with annual data
            let lines = []

            var zoom = d3.zoom()
                .scaleExtent([1, 2])
                .extent([[0, 0], [width, height]])
                .on("zoom", ({ transform }) => {
                    xScale.domain(transform.rescaleX(shadowScale).domain());
                    xAxis
                        .transition()
                        .duration(1000)
                        .call(d3.axisBottom(xScale))
                    lines.forEach(line => {
                        line
                            .transition()
                            .duration(1000)
                            .attr("d", d3.line()
                                .curve(d3.curveLinear)
                                .x(i => xScale(new Date(i[0])))
                                .y(i => yScale(i[1]))
                            )
                    })
                });

            svg.append("rect")
                .attr("width", width)
                .attr("height", height)
                .style("fill", "none")
                .style("pointer-events", "all")
                .attr('transform', `translate(${marginLeft}, ${marginTop})`)
                .call(zoom);

            let drawLine = (data, color) =>
                svg.append("path")
                    .datum(data)
                    .attr("class", 'lineSeg')
                    .attr("clip-path", "url(#clip)")
                    .attr("transform", `translate(${marginLeft},0)`)
                    .attr("fill", "none")
                    .attr("stroke", color)
                    .attr("stroke-width", 1.5)
                    .attr("stroke-linecap", "round")
                    .attr("stroke-linejoin", "round")
                    .attr("stroke-opacity", 0.9)
                    .attr("d", d3.line()
                        .x(i => xScale(new Date(i[0])))
                        .y(i => yScale(i[1]))
                    )
                    .attr("class", "line")

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
                .attr("y", function (_, i) { return 90 + i * 25 })
                .style("fill", d => colorMap[d])
                .text(d => d)
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle");

            lines = selectCountries.map((country, i) =>
                drawLine(yearCounts[i], colorMap[country])
            )

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