<template>
    <div id="bar" class="row border mx-auto"></div>
</template>

<script>
import * as d3 from "d3";

export default {
    name: 'BarChart',
    data() {
        return {
            name: 'Hello',
        }
    },
    props: {
        myBarchartData: Array,
        curr_year: Number,
        top_n: Number,
        x_key: String,
    },
    mounted() {
        console.log("Mounted: My bar chart data")
        this.initialize_barchart("#bar")
        this.draw_barchart(this.process_data(), "#bar", this.curr_year, this.x_key, this.top_n)
    },

    updated() {
        console.log("Updated: My bar chart data")
        this.draw_barchart(this.process_data(), "#bar", this.curr_year, this.x_key, this.top_n)
    },
    methods: {
        process_data() {
            let data = this.myBarchartData
            data.sort((d1, d2) => {
                let a = toNumber(d1[this.curr_year])
                let b = toNumber(d2[this.curr_year])
                return d3.descending(a, b)
            })
            data = data.slice(0, this.top_n)

            // If the country name is too long
            // we will use country code instead
            data.forEach(country => {
                if (country[this.x_key].split(' ').length > 2) {
                    country[this.x_key] = country["country_code"]
                }
            });
            return data
        },
        draw_barchart(data, id, year, x_key) {
            const margin = { top: 30, right: 40, bottom: 40, left: 40 };
            const height = 260;
            const width = 600;
            const bar_color = "#b3754d"

            let svg = d3.select(id).select("svg")
                .attr("viewBox", [0, 0, width, height])
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            const x = d3.scaleBand().domain(data.map(d => d[x_key]))
                .rangeRound([margin.left, width - margin.right])
                .padding(0.1);

            const y = d3.scaleLinear().domain([0, d3.max(data, d => d[year])]).nice()
                .rangeRound([height - margin.bottom, margin.top]);

            svg.select("#b1_bars").selectAll("rect")
                .data(data)
                .join("rect")
                .attr("x", d => x(d[x_key]))
                .attr("y", d => y(d[year]))
                .attr("width", x.bandwidth())
                .attr("height", d => y(0) - y(d[year]))
                .attr("fill", bar_color);

            const xAxis = g => g
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x))

            const yAxis = g => g
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y))

                const font_size = 10
            svg.select("#b1_x")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .selectAll("text")
                .style("text-anchor", "middle")
                .attr("dx", "0")
                .attr("dy", "1em")
                .attr("font-weight", "bold")
                .attr("font-size", d => {
                    if (d.length <= 12)
                        return 10
                    else 
                        return 9.4
                })
                

            svg.select("#b1_y")
                .call(yAxis)
                .call(g => g.select(".tick:last-of-type text")
                    .clone()
                    // .attr("transform", `rotate(-90)`)
                    .attr("text-anchor", "start")
                    .attr("x", -20)
                    .attr("y", -20)
                    .attr("font-weight", "bold")
                    .attr("font-size", "15px")
                    // .text("Emission: ton per capita")
                )

            // Add tags to axis
            svg.select("#b1_x_tag")
                .attr("x", width/2)
                .attr("y", height)
                .text("Countries")
                .attr("text-anchor", "middle")
                .attr("font-weight", "bold")
                .attr("font-size", "15px")

            svg.select("#b1_y_tag")
                .attr("x", 20)
                .attr("y", 20)
                .text("Emission: ton per capita")
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .attr("font-size", "15px")

            // Add legends to axis
            // let legend = svg.select("#b1_legend")

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
                // .style('fill', bar_color)
                .attr("x", legend_coord[0] + padding)
                .attr("y", legend_coord[1] + legend_width * 2 / 3)
                .text("CO2 Emission by country")
        },

        initialize_barchart(id) {
            let svg = d3.select(id).append("svg")

            svg.append("g")
                .attr("id", "b1_bars")
            svg.append("g")
                .attr("id", "b1_x")

            svg.append("g")
                .attr("id", "b1_y")

            // let legend = svg.append("g")
            //     .attr("id", "b1_legend")
            svg.append("rect").attr("id", "b1_legend_rect")
            svg.append("text").attr("id", "b1_legend_text")

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