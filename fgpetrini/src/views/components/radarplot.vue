<template>
    <div id="radar"></div>
</template>

<script>
    import * as d3 from "d3";

    export default {
        name: 'RadarPlot', 
        data() {
            return {
                name: 'Hello',
                axisCircles: 5,
                dotRadius: 4,
                axesDomain : [
                    "Inflight wifi service", 
                    "Departure/Arrival time convenient", 
                    "Ease of Online booking", 
                    "Gate location", 
                    "Food and drink", 
                    "Online boarding", 
                    "Seat comfort", 
                    "Inflight entertainment", 
                    "On-board service", 
                    "Leg room service", 
                    "Baggage handling", 
                    "Checkin service", 
                    "Inflight service"
                ],
                maxValue : 5,
                rScale : d3.scaleLinear()
                            .domain([0, this.maxValue])
                            .range([0, radius]),
            }
        },
        props:{
            myRadarPlotData: Array,
        },
        mounted(){
            console.log(this.axisCircles);

            this.drawRadarPlot(this.myRadarPlotData, "#radar") /* Example of reading data from a json file */
            // this.drawBarChart(this.myBarchartData, "#bar")
            console.log("Data Passed down as a Prop  ", this.myRadarPlotData)
        },
        methods: {
            drawRadarPlot(radar_data, id) {

                const margin = { top: 40, right: 40, bottom: 120, left: 100 };
                const height = 300;
                const width = 500;
                const radius = (height-(margin*2)) / 2;

                let svg = d3.select(id).append("svg")
                    .attr("viewBox", [0, 0, width, height])
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);

                const containerWidth = width-(margin*2);
                const containerHeight = height-(margin*2);
                const container = svg.append('g')
                    .attr("width", containerWidth)
                    .attr("height", containerHeight)
                    .attr('transform', `translate(${(width/2)+margin}, ${(height/2)+margin})`);
                
                    var axisGrid = container.append("g")
                    .attr("class", "axisWrapper");
                    console.log(this.axisCircles);
                    axisGrid.selectAll(".levels")
                    .data(d3.range(1,(this.axisCircles+1)).reverse())
                    .enter()
                    .append("circle")
                        .attr("class", "gridCircle")
                        .attr("r", (d, i) => radius/this.axisCircles*d)
                        .style("fill", "#CDCDCD")
                        .style("stroke", "#CDCDCD")
                        .style("fill-opacity", 0.1);
                
                    const axis = axisGrid.selectAll(".axis")
                        .data(this.axesDomain)
                        .enter()
                            .append("g")
                            .attr("class", "axis");

                axis.append("line")
                        .attr("x1", 0)
                        .attr("y1", 0)
                        .attr("x2", (d, i) => rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2))
                        .attr("y2", (d, i) => rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2))
                        .attr("class", "line")
                        .style("stroke", "white")
                        .style("stroke-width", "2px");

                axis.append("text")
                    .attr("class", "legend")
                    .style("font-size", "11px")
                    .attr("text-anchor", "middle")
                    .attr("font-family", "monospace")
                    .attr("dy", "0.35em")
                    .attr("x", (d, i) => rScale(maxValue * axisLabelFactor) * Math.cos(angleSlice*i - Math.PI/2))
                    .attr("y", (d, i) => rScale(maxValue * axisLabelFactor) * Math.sin(angleSlice*i - Math.PI/2))
                    .text(d => d);
                
                const plots = container.append('g')
                    .selectAll('g')
                    .data(radar_data)
                    .join('g')
                        .attr("data-name", (d, i) => device(i))
                        .attr("fill", "none")
                        .attr("stroke", "steelblue");

                plots.append('path')
                    .attr("d", d => radarLine(d.map(v => v.value)))
                    .attr("fill", (d, i) => color(i))
                    .attr("fill-opacity", 0.1)
                    .attr("stroke", (d, i) => color(i))
                    .attr("stroke-width", 2);

                plots.selectAll("circle")
                    .data(d => d)
                    .join("circle")
                        .attr("r", dotRadius)
                        .attr("cx", (d,i) => rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2))
                        .attr("cy", (d,i) => rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2))
                        .style("fill-opacity", 0.8);
            },
        }
    }

</script>


<style>

</style>