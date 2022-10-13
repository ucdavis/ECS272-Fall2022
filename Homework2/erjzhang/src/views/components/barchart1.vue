<template>
    <div id="bar1" class="border mx-auto"></div>
</template>

<script>
    import * as d3 from "d3";
import { integer } from "vue-types";
    import testData from "../../assets/data/test.json"; /* Example of reading in data direct from file*/

    export default {
        name: 'BarChart1',
        data() {
            return {
                name: 'Hello',
            }
        },
        props:{
            myBarchartData: Array,
            curr_year: Number,
            top_n:Number,
            x_key: String,
        },
        mounted(){
            this.myBarchartData.sort((d1, d2) => {
                        let a = this.toNumber(d1[this.curr_year])
                        let b = this.toNumber(d2[this.curr_year])
                        return d3.descending(a, b)
                    })
            console.log("Mounted: My chart 1 data  ")
            this.drawBarChart(this.myBarchartData, "#bar1", this.curr_year, this.x_key, this.top_n) /* Example of reading data from a json file */

        },

        updated() {
            this.myBarchartData.sort((d1, d2) => {
                        let a = this.toNumber(d1[this.curr_year])
                        let b = this.toNumber(d2[this.curr_year])
                        return d3.descending(a, b)
                    })
            console.log("Updated: My chart 1 data  ")
            this.updateBarChart(this.myBarchartData, "#bar1", this.curr_year, this.x_key, this.top_n)
        },
        methods: {
            updateBarChart(data, id, year ,x_key, top_n) {
                data = data.slice(0,top_n)
                console.log(data);
                const margin = { top: 20, right: 20, bottom: 20, left: 20 };
                const height = 300;
                const width = 600;

                const x = d3.scaleBand().domain(data.map(d => d[x_key]))
                    .rangeRound([margin.left, width - margin.right])
                    .padding(0.1);

                const y = d3.scaleLinear().domain([0, d3.max(data, d => d[year])]).nice()
                    .rangeRound([height - margin.bottom, margin.top]);

                let svg = d3.select(id).select("svg")

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
            },

            drawBarChart(data, id, year ,x_key, top_n) {
                data = data.slice(0,top_n)
                console.log(data);
                const margin = { top: 20, right: 20, bottom: 20, left: 20 };
                const height = 300;
                const width = 600;

                const x = d3.scaleBand().domain(data.map(d => d[x_key]))
                    .rangeRound([margin.left, width - margin.right])
                    .padding(0.1);

                const y = d3.scaleLinear().domain([0, d3.max(data, d => d[year])]).nice()
                    .rangeRound([height - margin.bottom, margin.top]);

                let svg = d3.select(id).append("svg")
                    .attr("viewBox", [0, 0, width, height])
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);

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

                svg.append("g")
                    .attr("id", "b1_x")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .selectAll("text")
                    .style("text-anchor", "middle")
                    .attr("dx", "0em")
                    .attr("dy", "1em")
                    .attr("font-weight", "bold");

                svg.append("g")
                    .attr("id", "b1_y")
                    .call(yAxis)
                    .call(g => g.select(".tick:last-of-type text")
                        .clone()
                        .attr("transform", `rotate(-90)`)
                        .attr("text-anchor", "middle")
                        .attr("x", -(15 - margin.top - margin.bottom) / 2)
                        .attr("y", -80)
                        .attr("font-weight", "bold"))
            },
            toNumber(item) {

            if (typeof item === 'number') {
                return item
            }
            return item ? parseFloat(item) : 0.0
        },
        }
    }

</script>


<style>

</style>