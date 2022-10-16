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
            const margin = { top: 20, right: 20, bottom: 20, left: 20 };
            const height = 300;
            const width = 600;

            let svg = d3.select(id).select("svg")
                .attr("viewBox", [0, 0, width, height])
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            const x = d3.scaleBand().domain(data.map(d => d[x_key]))
                .rangeRound([margin.left, width - margin.right])
                .padding(0.1);

            const y = d3.scaleLinear().domain([0, d3.max(data, d => d[year])]).nice()
                .rangeRound([height - margin.bottom, margin.top]);

            svg.selectAll("rect")
                .data(data)
                .join("rect")
                .attr("x", d => x(d[x_key]))
                .attr("y", d => y(d[year]))
                .attr("width", x.bandwidth())
                .attr("height", d => y(0) - y(d[year]))
                .attr("fill", "#949494");

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
                .selectAll("text")
                .style("text-anchor", "middle")
                .attr("dx", "0em")
                .attr("dy", "1em")
                .attr("font-weight", "bold");

            svg.select("#b1_y")
                .call(yAxis)
                .call(g => g.select(".tick:last-of-type text")
                    .clone()
                    .attr("transform", `rotate(-90)`)
                    .attr("text-anchor", "middle")
                    .attr("x", -(15 - margin.top - margin.bottom) / 2)
                    .attr("y", -80)
                    .attr("font-weight", "bold"))
        },

        initialize_barchart(id) {
            let svg = d3.select(id).append("svg")

            svg.append("g")
                .attr("id", "b1_x")

            svg.append("g")
                .attr("id", "b1_y")
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