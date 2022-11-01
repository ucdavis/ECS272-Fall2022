<template>
    <div id="overview" class="mx-auto pb-1"></div>
</template>

<script>

import * as d3 from "d3";
import { html, svg } from 'htl';

class Mouse_handler {
    constructor() {
        this._x = svg`<text y="-22"></text>`;
        this._y = svg`<text y="-12"></text>`;
        this.node = svg`<g pointer-events="none" display="none" font-family="sans-serif" font-size="10" text-anchor="middle">
      <rect x="-40" width="85" y="-35" rx="3" height="30" fill="white" stroke="black" stroke-width="0.7"></rect>
      ${this._x}
      ${this._y}
      <circle r="2.5"></circle>
    </g>`;
    }
    display(d, x, y) {
        const format_X = d3.format("")
        const format_Y = d3.format("")
        this.node.removeAttribute("display");
        this.node.setAttribute("transform", `translate(${x(d["year"]) + 20},${y(d["emission"])})`);
        this._x.textContent = "Year: " + format_X(d["year"]);
        this._y.textContent = "Emission: " + format_Y(d["emission"]);
    }
    hide() {
        this.node.setAttribute("display", "none");
    }
}

class Double_mouse_handler {
    constructor(country_name) {
        this._x = svg`<text y="-22"></text>`;
        this._y1 = svg`<text y="-12"></text>`;
        this._y2 = svg`<text y="-2"></text>`;
        let rect_width = Math.max((country_name.length + 8) * 5, 110)
        this._rect = svg`<rect x="${-rect_width / 2}" width="${rect_width}" y="-34" rx="3" height="38" fill="white" stroke="black" stroke-width="0.7"></rect>`
        this.node = svg`<g pointer-events="none" display="none" font-family="sans-serif" font-size="10" text-anchor="middle">
      ${this._rect}
      ${this._x}
      ${this._y1}
      ${this._y2}
    </g>`;
        this.dot2 = svg`<g pointer-events="none" display="none" font-family="sans-serif" font-size="10" text-anchor="middle">
        <circle r="2.5"></circle>
    </g>`;
        this.dot1 = svg`<g pointer-events="none" display="none" font-family="sans-serif" font-size="10" text-anchor="middle">
        <circle r="2.5"></circle>
    </g>`;
    }
    display(d, x, y, country_name) {
        const format_X = d3.format("")
        const format_Y1 = d3.format("")
        const format_Y2 = d3.format("")

        this.node.removeAttribute("display");
        this.dot1.removeAttribute("display");
        this.dot2.removeAttribute("display");

        this.node.setAttribute("transform", `translate(${x(d["year"]) + 20},${(y(d["emission1"]) + y(d["emission2"])) / 2})`);
        this.dot1.setAttribute("transform", `translate(${x(d["year"]) + 20},${y(d["emission1"])})`);
        this.dot2.setAttribute("transform", `translate(${x(d["year"]) + 20},${y(d["emission2"])})`);

        this._x.textContent = "Year: " + format_X(d["year"]);
        this._y1.textContent = "World Average: " + format_Y1(d["emission1"]);
        this._y2.textContent = country_name + ": " + format_Y2(d["emission2"]);
    }
    hide() {
        this.node.setAttribute("display", "none");
        this.dot1.setAttribute("display", "none");
        this.dot2.setAttribute("display", "none");
    }
}

export default {
    name: 'LineChart',
    data() {
        let processed_data = []
        let country_data = []
        return {
            name: 'this is LineChart',
        }
    },
    props: {
        selected_country_code: String,
        selected_country_name: String,
        myLineChartData: Array,
        curr_x: Number,
        history_max: Number,
    },
    mounted() {
        console.log("Mounted: My line chart data")
        this.processed_data = this.process_data()
        this.initialize_linechart("#overview")
        this.draw_linechart1(this.processed_data, "#overview", false)

    },
    updated() {
        console.log("Updated: My line chart data")
        this.country_data = this.process_country_data(this.selected_country_code)
        this.draw_linechart2(this.country_data, this.processed_data, "#overview", this.selected_country_code, this.selected_country_name)
    },
    methods: {
        process_country_data(country_code) {
            let data = this.myLineChartData

            let rt = []
            for (let year = 1990; year < 2019 + 1; year++) {
                let temp = {
                    year: year,
                    emission: 0.0,
                }
                data.forEach(c => {
                    if (c["country_code"] == country_code && c[year]) {
                        temp.emission = toNumber(c[year])
                    }
                })
                rt.push(temp)
            }
            return rt
        },
        process_data() {
            let data = this.myLineChartData
            let rt = []
            for (let year = 1990; year < 2019 + 1; year++) {
                let sum = 0.0
                let count = 0.0
                data.forEach(c => {
                    if (c[year]) {
                        sum += parseFloat(c[year])
                        count += 1
                    }
                });
                let average = sum / count
                rt.push({
                    year: year,
                    emission: average.toFixed(3)
                })
            }
            return rt
        },
        initialize_linechart(id) {
            let svg = d3.select(id).append("svg")
            svg.append("g").attr("id", "line_x");
            svg.append("g").attr("id", "line_y")
            svg.append("text")
                .attr("id", "line_y_text")
                .attr("text-anchor", "middle")
                .attr("transform", `rotate(-90)`)
                .attr("x", -40)
                .attr("y", 20)
                .attr("font-weight", "bold")
                .attr("font-size", "15px")
                .text("Emission");

            svg.append("path").attr("id", "line_path")
            svg.append("path").attr("id", "line_path2")

            // Add a legend
            svg.append("line").attr("id", "line_legend")
            svg.append("text").attr("id", "line_legend_text")
            svg.append("line").attr("id", "line_legend2")
            svg.append("text").attr("id", "line_legend2_text")

            svg.append("g").attr("id", "line_mouse_handler")
        },
        draw_linechart1(chartData, id, is_update) {
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
                return parseFloat(d["emission"])
            })
            const y_min = d3.min(chartData, d => {
                return parseFloat(d["emission"])
            })
            const x = d3.scaleLinear()
                .domain(d3.extent(chartData, d => d["year"]))
                .range([margin.left, width - margin.right]);

            const y = d3.scaleLinear()
                .domain([y_min, y_max])
                .range([height - margin.bottom, margin.top]);

            // Initialize the position of X and Y Axis
            const xAxis = g => g
                .attr("transform", `translate(${margin.left * 0.5},${height - margin.bottom})`)
                .call(d3.axisBottom(x))

            const yAxis = g => g
                .attr("transform", `translate(${margin.left * 1.5},0)`)
                .call(d3.axisLeft(y))


            const line = d3.line()
                .x(d => x(d["year"]))
                .y(d => y(d["emission"]))


            if (is_update) {
                svg.select("#line_path").transition().duration(200).attr("d", line(chartData))
            }

            if (!is_update) {
                svg.select("#line_path")
                    .attr("d", line(chartData))
                    .attr("transform", `translate(${margin.left * 0.5},0)`)
                    .attr("fill", "none")
                    .attr("stroke", "steelblue")
                    .attr("stroke-width", "1.5")
                    .attr("stroke-miterlimit", "1")
                    .transition()
                    .duration(2000)
                    .ease(d3.easeLinear)
                    .attrTween("stroke-dasharray", function () {
                        const length = this.getTotalLength();
                        return d3.interpolate(`0,${length}`, `${length},${length}`);
                    })
            }


            svg.select("#line_x").call(xAxis)
                .call(g =>
                    g.select(".tick:last-of-type text")
                        .attr("text-anchor", "middle")
                        .attr("x", -(width - margin.left - margin.right) / 2)
                        .attr("y", 20)
                        .attr("font-weight", "bold")
                        .attr("font-size", "15px")
                        .text("Year")
                );
            svg.select("#line_y").call(yAxis)

            // Adding legend
            const legend_x = width * 3 / 4 - 35
            const legend_y = 10
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

        // Draw two line if a country selected
        draw_linechart2(country_data, chartData, id, country_code, country_name) {
            if (country_code == "no country selected") {
                d3.select("#line_path2")
                    .transition()
                    .attr("display", "none")
                d3.select("#line_legend2").attr("display", "none")
                d3.select("#line_legend2_text").attr("display", "none")
                this.draw_linechart1(chartData, id, true)
                return
            }
            const margin = ({ top: 20, right: 55, bottom: 30, left: 40 })
            const height = 240
            const width = 570
            let svg = d3.select(id).select("svg")
                .attr("viewBox", [0, 0, width, height])
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            const min_year = 1990
            const max_year = 2019
            const y_max = Math.max(d3.max(chartData, d => {
                return parseFloat(d["emission"])
            }), d3.max(country_data, d => {
                return parseFloat(d["emission"])
            })
            )
            const y_min = Math.min(d3.min(chartData, d => {
                return d["emission"]
            }), d3.min(country_data, d => {
                return d["emission"]
            })
            )
            const x = d3.scaleLinear()
                .domain(d3.extent(chartData, d => d["year"]))
                .range([margin.left, width - margin.right]);

            const y = d3.scaleLinear()
                .domain([y_min, y_max])
                .range([height - margin.bottom, margin.top]);

            // Initialize the position of X and Y Axis
            const xAxis = g => g
                .attr("transform", `translate(${margin.left * 0.5},${height - margin.bottom})`)
                .call(d3.axisBottom(x))

            const yAxis = g => g
                .attr("transform", `translate(${margin.left * 1.5},0)`)
                .call(d3.axisLeft(y))


            const line = d3.line()
                .x(d => x(d["year"]))
                .y(d => y(d["emission"]))

            svg.select("#line_path")
                .transition()
                .attr("d", line(chartData))
                .attr("transform", `translate(${margin.left * 0.5},0)`)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", "1.5")
                .attr("stroke-miterlimit", "1")

            svg.select("#line_path2")
                .attr("d", line(country_data))
                .attr("transform", `translate(${margin.left * 0.5},0)`)
                .attr("fill", "none")
                .attr("stroke", "green")
                .attr("stroke-width", "1.5")
                .attr("stroke-miterlimit", "1")
                .attr("display", null)
                .transition()
                .duration(2000)
                .ease(d3.easeLinear)
                .attrTween("stroke-dasharray", function () {
                    const length = this.getTotalLength();
                    return d3.interpolate(`0,${length}`, `${length},${length}`);
                })

            svg.select("#line_x").call(xAxis)
                .call(g =>
                    g.select(".tick:last-of-type text")
                        .attr("text-anchor", "middle")
                        .attr("x", -(width - margin.left - margin.right) / 2)
                        .attr("y", 20)
                        .attr("font-weight", "bold")
                        .attr("font-size", "15px")
                        .text("Year")
                );
            svg.select("#line_y").call(yAxis)

            // Adding legend
            const legend_x = width * 1 / 2 - 55
            const legend_y = 10
            svg.select("#line_legend2").attr("x1", legend_x).attr("x2", legend_x + 25).attr("y1", legend_y).attr("y2", legend_y).attr("stroke", "green")
                .attr("stroke-width", "1.5").attr("display", null)
            svg.select("#line_legend2_text").attr("x", legend_x + 30).attr("y", legend_y).text(country_name).style("font-size", "12px").attr("alignment-baseline", "middle")
                .attr("display", null)
            // Add hovering effect
            const double_mouse_handler = new Double_mouse_handler(country_name);

            let group_data = []

            for (let index = 1990; index < 2019 + 1; index++) {
                group_data.push({
                    year: index,
                    emission1: chartData[index - 1990]["emission"],
                    emission2: country_data[index - 1990]["emission"],
                }
                )
            }
            svg.select("#line_mouse_handler").attr("fill", "none")
                .attr("pointer-events", "all")
                .selectAll("rect")
                .data(group_data)
                .join("rect")
                .attr("x", (d) => x(d.year))
                .attr("height", height)
                .attr("width", x(max_year) - x(min_year))
                .on("mouseover", (event, d) => {
                    double_mouse_handler.display(d, x, y, country_name)
                })
                .on("mouseout", () => {
                    double_mouse_handler.hide()
                });
            svg.append(() => double_mouse_handler.dot1);
            svg.append(() => double_mouse_handler.dot2);
            svg.append(() => double_mouse_handler.node);

        },
    }
}
// Utility functions
// Covert to number
function toNumber(item) {
    if (typeof item === 'number') {
        return item
    }
    return item ? parseFloat(item).toFixed(3) : 0.0
}
</script>


<style>

</style>