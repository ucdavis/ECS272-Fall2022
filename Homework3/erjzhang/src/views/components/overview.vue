<template>
    <div id="overview" class="border mx-auto"></div>
</template>

<script>

import * as d3 from "d3";
import { html, svg } from 'htl';
// import * as topojson from "topojson"
// import getCountryISO3 from "country-iso-2-to-3"

class Mouse_handler {
    constructor() {
        // let svg = d3.select(id).select("svg").append()
        this._x = svg`<text y="-22"></text>`;
        this._y = svg`<text y="-12"></text>`;
        this.node = svg`<g pointer-events="none" display="none" font-family="sans-serif" font-size="10" text-anchor="middle">
      <rect x="-40" width="80" y="-32.5" height="25" fill="white" stroke="black" stroke-width="1"></rect>
      ${this._x}
      ${this._y}
      <circle r="2.5"></circle>
    </g>`;

    }

    display(d, x, y) {
        // console.log(x(d["year"]))
        const format_X = d3.format("")
        const format_Y = d3.format("")
        this.node.removeAttribute("display");
        this.node.setAttribute("transform", `translate(${x(d["year"]) + 20},${y(d["emission"])})`);
        this._x.textContent = "Year: " + format_X(d["year"]);
        this._y.textContent = "Emission: " + format_Y(d["emission"]);
    }
    hide() {
        // console.log("hover effect is hidden")
        this.node.setAttribute("display", "none");
    }
}

export default {
    name: 'LineChart',
    data() {
        return {
            name: 'this is LineChart',
        }
    },
    props: {
        myLineChartData: Array,
        curr_x: Number,
        history_max: Number,
    },
    mounted() {
        console.log("Mounted: My line chart data")
        let data = this.process_data()
        this.initialize_linechart("#overview")
        this.draw_linechart(data, "#overview")

    },
    updated() {
        console.log("Updated: My line chart data")
        let data = this.process_data()
        // this.draw_linechart(data, "#overview")
    },
    methods: {
        process_data() {
            let data = this.myLineChartData
            let rt = []
            for (let year = 1990; year < 2019 + 1; year++) {
                let sum = 0.0
                let count = 0.0
                data.forEach(element => {
                    if (element[year]) {
                        sum += parseFloat(element[year])
                        count += 1
                    }
                });
                let average = sum / count
                // console.log(year)
                rt.push({
                    year: year,
                    emission: average.toFixed(3)
                })
            }
            // console.log(rt)
            return rt
        },
        initialize_linechart(id) {
            let svg = d3.select(id).append("svg")
            svg.append("g").attr("id", "line_x");
            svg.append("g").attr("id", "line_y");
            svg.append("path").attr("id", "line_path")

            // Add a legend
            svg.append("line").attr("id", "line_legend")
            svg.append("text").attr("id", "line_legend_text")

            const mouse_handler = new Mouse_handler();
            svg.append("g").attr("id", "line_mouse_handler")
        },
        draw_linechart(chartData, id) {
            const margin = ({ top: 20, right: 55, bottom: 30, left: 40 })
            const height = 240
            const width = 570
            let svg = d3.select(id).select("svg")
                .attr("viewBox", [0, 0, width, height])
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            const min_year = 1990
            const max_year = 2019
            const y_max = d3.max(chartData, d => {
                return d["emission"]
            })
            const y_min = d3.min(chartData, d => {
                return d["emission"]
            })
            const x = d3.scaleLinear()
                .domain(d3.extent(chartData, d => d["year"]))
                .range([margin.left, width - margin.right]);
            // .range([0, width]);

            const y = d3.scaleLinear()
                .domain([y_min, y_max])
                .range([height - margin.bottom, margin.top]);

            // Initialize the position of X and Y Axis
            const xAxis = g => g
                .attr("transform", `translate(${margin.left * 0.5},${height - margin.bottom})`)
                .call(d3.axisBottom(x))

            const yAxis = g => g
                .attr("transform", `translate(${margin.left * 1.5},0)`)
                // .attr("width", "100%")
                .call(d3.axisLeft(y))


            const line = d3.line()
                .x(d => x(d["year"]))
                .y(d => y(d["emission"]))

            svg.select("#line_path")

                .attr("d", line(chartData))
                // .transition()
                .attr("transform", `translate(${margin.left * 0.5},0)`)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", "1.5")
                .attr("stroke-miterlimit", "1")
                .transition()
                .duration(5000)
                .ease(d3.easeLinear)
                .attrTween("stroke-dasharray", function () {
                    const length = this.getTotalLength();
                    return d3.interpolate(`0,${length}`, `${length},${length}`);
                })

            svg.select("#line_x").call(xAxis)
                .call(g =>
                    g.select(".tick:last-of-type text")
                        .clone()
                        .attr("text-anchor", "middle")
                        .attr("x", -(width - margin.left - margin.right) / 2)
                        .attr("y", 20)
                        .attr("font-weight", "bold")
                        .attr("font-size", "15px")
                        .text("Year")
                );
            svg.select("#line_y").call(yAxis)
                .call(g =>
                    g.select(".tick:last-of-type text")
                        .clone()
                        .attr("text-anchor", "middle")
                        .attr("x", -30)
                        .attr("y", -40)
                        .attr("transform", `rotate(-90)`)
                        .attr("font-weight", "bold")
                        .attr("font-size", "15px")
                        .text("Emission")
                );
            // Adding legend
            const legend_x = width * 3 / 4 - 25
            const legend_y = 20
            svg.select("#line_legend").attr("x1", legend_x).attr("x2", legend_x + 25).attr("y1", legend_y).attr("y2", legend_y).attr("stroke", "steelblue")
                .attr("stroke-width", "1.5")
            svg.select("#line_legend_text").attr("x", legend_x + 30).attr("y", legend_y).text("World Average emission").style("font-size", "12px").attr("alignment-baseline", "middle")

            // Add hovering effect
            const mouse_handler = new Mouse_handler();
            svg.select("#line_mouse_handler").attr("fill", "none")
                .attr("pointer-events", "all")
                .selectAll("rect")
                .data(chartData)
                .join("rect")
                .attr("x", (a) => x(a.year))
                .attr("height", height)
                .attr("width", x(max_year) - x(min_year))
                .on("mouseover", (event, a) => mouse_handler.display(a, x, y))
                .on("mouseout", () => mouse_handler.hide());

            svg.append(() => mouse_handler.node);
        },


    }
}
// Utility functions
// Covert to number
function toNumber(item) {
    if (typeof item === 'number') {
        return item
    }
    return item ? parseFloat(item) : 0.0
}
</script>


<style>

</style>