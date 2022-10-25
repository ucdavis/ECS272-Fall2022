<template>
    <div id="line"></div>
</template>

<script>
    import * as d3 from "d3";
    import lineData from "../../assets/data/line_data.json";

    export default {
        name: 'LineChart',
        data() {
            return {
                namea: 'Hello',
                someLocalValues: [1, 2, 3, 4, 5],

            }
        },
        props:{
            myLineChartData: Array,
        },
        mounted(){
            console.log(lineData);
            this.drawLineChart(lineData, "#line")
            console.log("Data Passed down as a Prop  ", this.myLineChartData)
        },
        methods: {
            drawLineChart(data, id) {

                const margin = { top: 0, right: 0, bottom: 0, left: 0 };
                const height = 150;
                const width = 200;

                var svg = d3.select(id).append("svg")
                    .attr("viewBox", [0, 0, width, height])
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

                d3.json(data, function(data) {
                    var allGroup = data.map(function(d){return d["country_name"]})

                    d3.select("#selectButton")
                    .selectAll('myOptions')
                        .data(allGroup)
                    .enter()
                        .append('option')
                    .text(function (d) { return d; })
                    .attr("value", function (d) { return d; })

                    var x = d3.scaleLinear()
                    .domain([1990,2019])
                    .range([ 0, width ]);
                    svg.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x));

                    var y = d3.scaleLinear()
                    .domain( [0,20])
                    .range([ height, 0 ]);
                    svg.append("g")
                    .call(d3.axisLeft(y));

                    var line = svg
                    .append('g')
                    .append("path")
                        .datum(data)
                        .attr("d", d3.line()([[1990, d.year[0]],[1991, d.year[1]],[1992, d.year[2]],[1993, d.year[3]],[1994, d.year[4]],
                        [1991, d.year[1]],[1991, d.year[1]],[1991, d.year[1]],[1991, d.year[1]],[1991, d.year[1]],
                        [1991, d.year[1]],[1991, d.year[1]],[1991, d.year[1]],[1991, d.year[1]],[1991, d.year[1]],
                        [1991, d.year[1]],[1991, d.year[1]],[1991, d.year[1]],[1991, d.year[1]],[1991, d.year[1]],
                        [1991, d.year[1]],[1991, d.year[1]],[1991, d.year[1]],[1991, d.year[1]],[1991, d.year[1]],
                        [1991, d.year[1]],[1991, d.year[1]],[1991, d.year[1]],[1991, d.year[1]],[1991, d.year[1]]]))
                        .attr("stroke", "black")
                        .style("stroke-width", 4)
                        .style("fill", "none")

                    var dot = svg
                    .selectAll('circle')
                    .data(data)
                    .enter()
                    .append('circle')
                        .attr("cx", _.range(1990, 2020, 1))
                        .attr("cy", function(d) { return d.year })
                        .attr("r", 7)
                        .style("fill", "#69b3a2")

                    function update(selectedGroup) {

                    var dataFilter = data.map(function(d){return {year:d[selectedGroup]} })

                    // Give these new data to update line
                    line
                        .datum(dataFilter)
                        .transition()
                        .duration(1000)
                        .attr("d", d3.line()
                            .x(_.range(1990, 2020, 1))
                            .y(function(d) { return d.year })
                        )
                    dot
                        .data(dataFilter)
                        .transition()
                        .duration(1000)
                        .attr("cx", _.range(1990, 2020, 1))
                        .attr("cy", function(d) { return d.year })
                    }

                    d3.select("#selectButton").on("change", function(d) {
                        var selectedOption = d3.select(this).property("value")
                        update(selectedOption)
                    })

                })
            },
        }
    }

</script>


<style>

</style>