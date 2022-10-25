<template>
    <div id="bar"></div>
</template>

<script>
    import * as d3 from "d3";
    import barData from "../../assets/data/bar_data.csv";

    export default {
        name: 'BarChart',
        data() {
            return {
                namea: 'Hello',
                someLocalValues: [1, 2, 3, 4, 5],

            }
        },
        props:{
            myBarChartData: Array,
        },
        mounted(){
            console.log(barData);
            this.drawBarChart(barData, "#bar")
            console.log("Data Passed down as a Prop  ", this.myBarChartData)
        },
        methods: {
            drawBarChart(data, id) {

                const margin = { top: 0, right: 0, bottom: 0, left: 0 };
                const height = 300;
                const width = 400;

                var svg = d3.select(id).append("svg")
                    .attr("viewBox", [0, 0, width, height])
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

                const yearfield = ["1990","1991","1992","1993","1994","1995","1996","1997","1998","1999","2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019"]

                var x = d3.scaleBand()
                .range([ 0, width ])
                .domain(yearfield)
                .padding(0.2);
                svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                    .attr("transform", "translate(-10,0)rotate(-45)")
                    .style("text-anchor", "end");

                var y = d3.scaleLinear()
                .domain([0, 20])
                .range([ height, 0]);
                svg.append("g")
                .call(d3.axisLeft(y));

                var barPlot = svg.selectAll("rect")
                    .data(data)
                    .join("rect")
                    .attr("x", d => x(0))
                    .attr("y", d => y(0))
                    .attr("width", d => x(d.fire_Totalsize))
                    .attr("height", y.bandwidth())
                    .attr("fill", d => color(d.STAT_CAUSE));

                d3.select("#BarYaxis").on("change",function(d){
                    // recover the option that has been chosen
                    var selectedOption = d3.select(this).property("value")
                    console.log(selectedOption)
                    if (selectedOption=="avgSize"){
                        var stringVar="fire_avgSize"
                        var xTitle="Avg Acres burned \n per fire event"
                        var widthAdj=0
                    } else if (selectedOption=="totalSize"){
                        var stringVar="fire_Totalsize"
                        var xTitle="Total Acres burned"
                        var widthAdj=-margin.left/2
                    } else {
                        var stringVar="fire_count"
                        var xTitle="Number of fire events"
                        var widthAdj=-margin.left/2
                    }
                    // Update linear scale for x axis
                    x
                        .domain([0, d3.max(data, d => d[stringVar])]).nice()
                        .range([0,width]);
                        
                        // Update values on the plot based on the new scale
                    barPlot
                        .attr("width", d => x(d[stringVar]))
                        
                    // Remove previous y Axis and create a new one identical but with new linear Y scale
                    svg.selectAll("#xAxisBarNumber").remove();
                    svg.selectAll("#xAxisBar").remove();
                    // update x axis
                    svg.append("g")
                        .attr("id","xAxisBarNumber")
                        .attr("transform", "translate(0," + height + ")")
                        .call(d3.axisBottom(x))
                            .selectAll("text")
                            .attr("transform", "translate(-10,0)rotate(-45)")
                            .style("text-anchor", "end")
                            .style("font-size", "15px")
                    svg.append("text")
                        .attr("id","xAxisBar")
                        .attr("x",widthAdj )
                        .attr("y",  height + margin.bottom/4*3)
                        .style("text-anchor", "middle")
                        .style("font-size", "15px")
                        .text(xTitle);
                    })
            },
        }
    }

</script>


<style>

</style>