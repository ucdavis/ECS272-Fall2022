<template>
    <div id="bar" class="row mx-auto"></div>
</template>

<script>
import * as d3 from "d3";

export default {
    name: 'BarChart',
    data() {
        let processed_data = []
        return {
            name: 'Hello',
        }
    },
    props: {
        myBarchartData: Array,
        selected_country_code: String,
        selected_country_name: String,
        curr_year: Number,
        top_n: Number,
        x_key: String,
    },
    mounted() {
        console.log("Mounted: My bar chart data")
        this.initialize_barchart("#bar")
        this.processed_data = this.process_data()
        this.draw_barchart(this.processed_data[this.curr_year], "#bar", this.curr_year, this.x_key, this.selected_country_code)
    },

    updated() {
        console.log("Updated: My bar chart data")
        this.processed_data = this.process_data()
        this.draw_barchart(this.processed_data[this.curr_year], "#bar", this.curr_year, this.x_key, this.selected_country_code, this.selected_country_name)
    },
    methods: {
        process_data() {
            const year_min = 1990
            const year_max = 2019
            let data = this.myBarchartData
            let new_data = {}
            for (let year = year_min; year < year_max + 1; year++) {
                data.sort((d1, d2) => {
                    let a = toNumber(d1[year])
                    let b = toNumber(d2[year])
                    return d3.descending(a, b)
                })

                let temp = data.slice(0, this.top_n)
                if (!temp.some((e) => {
                    return e["country_code"] == this.selected_country_code
                }) && this.selected_country_code != "no country selected") {
                    temp.push(data.find((d) => {
                        return d["country_code"] == this.selected_country_code
                    }))
                }
                // If the country name is too long
                // we will use country code instead
                temp.forEach(country => {
                    if (country[this.x_key].split(' ').length > 2) {
                        country[this.x_key] = country["country_code"]
                    }
                });
                new_data[year] = temp
            }
            return new_data
        },
        draw_barchart(data, id, year, x_key, country_code, country_name) {
            const margin = { top: 15, right: 40, bottom: 40, left: 40 };
            const height = 260;
            const width = 600;
            const bar_color = "#b3754d"
            const selected_color = "green"
            const max_emission = 50
            const color = d3.interpolateHsl("#ffa366", "#000000")

            let svg = d3.select(id).select("svg")
                .attr("viewBox", [0, 0, width, height])
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            const x = d3.scaleBand().domain(data.map(d => d[x_key]))
                .rangeRound([margin.left, width - margin.right])
                .padding(0.1);

            const y = d3.scaleLinear().domain([0, d3.max(data, d => parseFloat(d[year]))]).nice()
                .rangeRound([height - margin.bottom, margin.top]);

            let bars = svg.select("#b1_bars").selectAll("rect")
                .data(data)
                .join("rect")
                .attr("width", x.bandwidth())
                .attr("fill", (d) => {
                    if (d["country_code"] == country_code) {
                        return selected_color
                    }
                    return color(d[year] / max_emission)
                })
                ;
            bars.transition()
                .ease(d3.easeLinear)
                .duration(500)
                .attr("x", d => x(d[x_key]))
                .attr("y", d => y(d[year]))
                .attr("height", d => y(0) - y(d[year]))

            // Create a bar_mouse_handler
            const bar_mouse_handler = d3.select("#bar_mouse_handler")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px")


            const mouse_over = function (event, d) {
                d3.select(this).attr("opacity", "0.6")
                bar_mouse_handler
                    .html(d[x_key]+ ": " + parseFloat(d[year]).toFixed(3))
                    .style("opacity", 1)
                    .attr("x", x(d[x_key]))
                    .attr("y", y(d[year]))

            }
            const mouse_move = function (event, d) {
                bar_mouse_handler
                    .style("left", (event.offsetX) - 50 + "px")
                    .style("top", (event.offsetY) -20 + "px")
            }
            const mouse_leave = function (event, d) {
                d3.select(this).attr("opacity", "1")
                bar_mouse_handler
                    .style("opacity", 0)
            }
            bars.on("mouseover", mouse_over)
                .on("mousemove", mouse_move)
                .on("mouseleave", mouse_leave)
            const xAxis = g => g
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x))

            const yAxis = g => g
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y))

            svg.select("#b1_x")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .transition()
                .selectAll("text")
                .style("text-anchor", "middle")
                .attr("dx", "0")
                .attr("dy", "1em")
                .attr("font-weight", "bold")
                .attr("font-size", d => {
                    if (d.length <= 9)
                        return 9.5
                    else if (d.length > 9 && d.length <= 14)
                        return 8.5
                    else if (d.length > 14)
                        return 7.2
                })

            svg.select("#b1_y")
                .call(yAxis)
                .call(g => g.select(".tick:last-of-type text")
                    .clone()
                    .attr("text-anchor", "start")
                    .attr("x", -20)
                    .attr("y", -20)
                    .attr("font-weight", "bold")
                    .attr("font-size", "15px")
                )

            // Add tags to axis
            svg.select("#b1_x_tag")
                .attr("x", width / 2)
                .attr("y", height)
                .text("Countries")
                .attr("text-anchor", "middle")
                .attr("font-weight", "bold")
                .attr("font-size", "15px")

            svg.select("#b1_y_tag")
                .attr("x", 20)
                .attr("y", 5)
                .text("Emission: ton per capita")
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .attr("font-size", "15px")

            // Add legends to axis
            const legend_width = 20
            const legend_height = 20
            const legend_coord = [width - 200, 20]
            const padding = 30
            svg.select("#b1_legend_rect")
                .attr('width', legend_width)
                .attr('height', legend_height)
                .style('fill', bar_color)
                .attr("x", legend_coord[0])
                .attr("y", legend_coord[1])

            svg.select("#b1_legend_text")
                .attr("x", legend_coord[0] + padding)
                .attr("y", legend_coord[1] + legend_width * 2 / 3)
                .text("CO2 Emission by country")


            if (country_code == "no country selected") {
                svg.select("#b1_legend2_rect")
                    .attr("display", "none")
                svg.select("#b1_legend2_text")
                    .attr("display", "none")
                return
            }
            svg.select("#b1_legend2_rect")
                .attr('width', legend_width)
                .attr('height', legend_height)
                .style('fill', selected_color)
                .attr("x", legend_coord[0])
                .attr("y", legend_coord[1] + 25)
                .attr("display", null)

            svg.select("#b1_legend2_text")
                .attr("x", legend_coord[0] + padding)
                .attr("y", legend_coord[1] + legend_width * 2 / 3 + 25)
                .text("Selected Country")
                .attr("display", null)
        },

        initialize_barchart(id) {
            d3.select(id)
                .append("div")
                .attr("id","bar_mouse_handler")
            let svg = d3.select(id).append("svg")

            svg.append("g")
                .attr("id", "b1_bars")
            svg.append("g")
                .attr("id", "b1_x")

            svg.append("g")
                .attr("id", "b1_y")

            svg.append("rect").attr("id", "b1_legend_rect")
            svg.append("text").attr("id", "b1_legend_text")

            svg.append("rect").attr("id", "b1_legend2_rect")
            svg.append("text").attr("id", "b1_legend2_text")

            svg.append("text")
                .attr("id", "b1_x_tag")

            svg.append("text")
                .attr("id", "b1_y_tag")
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