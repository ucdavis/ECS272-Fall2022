<template>
    <div id="line"></div>
</template>

<script>
    import * as d3 from "d3";

    export default {
        name: 'LineChart',
        data() {
            return {
                country: 'Aruba',
                country_list: ["Qatar", "United Arab Emirates", "Bahrain", "Luxembourg", "Kuwait", 
                               "United States", "Australia", "Brunei Darussalam", "Canada", "Saudi Arabia"],
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
            drawLineChart(line_data, id) {
                const margin = { top: 20, right: 20, bottom: 20, left: 20 };
                const height = 200;
                const width = 300;

                var svg = d3.select(id).append("svg")
                    .attr("viewBox", [0, 0, width, height])
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")

                // let x_data = [1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019];
                // let y_data = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 1, 4, 9, 16, 25, 36, 49, 64, 81, 100];
                // let y_data = data[0].year;
                var xdata = d3.range(0, 20);
                var ydata = [1, 4, 5, 9, 10, 14, 15, 15, 11, 10, 5, 5, 4, 8, 7, 5, 5, 5, 8, 10];
                var xy = [];
                for(var i=0;i<xdata.length;i++){
                    xy.push({x:xdata[i],y:ydata[i]});
                }
               
                d3.json(xy, function(data) {
                    var allGroup = data.map(function(d){return d["country_name"]})
                    let y_data = data[0].year;

                    d3.select("#selectButton")
                    .selectAll('myOptions')
                        .data(allGroup)
                    .enter()
                        .append('option')
                    .text(function (d) { return d; })
                    .attr("value", function (d) { return d; })

                    var x = d3.scaleLinear()
                    .domain([0, 20])
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
                        .attr("d", d3.line()
                            .x(function(d, i) {
                                return x(x_data[i]);
                            })
                            .y(function(d, i) {
                                return y(y_data[i]);
                            }))
                        .attr("stroke", "black")
                        .style("stroke-width", 4)
                        .style("fill", "none")

                    var dot = svg
                        .selectAll('circle')
                        .data(data)
                        .enter()
                        .append('circle')
                            .attr("cx", (function(d, i) {
                                    return x(x_data[i]);
                            }))
                            .attr("cy", function(d, i) {
                                return y(y_data[i]);
                            })
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