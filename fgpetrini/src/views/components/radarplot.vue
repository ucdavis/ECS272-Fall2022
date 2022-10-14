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
                margin : { top: 40, right: 40, bottom: 120, left: 100 },
                height : 300,
                width : 500,
                radius : (this.height-(this.margin*2)) / 2,
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
                            .range([0, this.radius]),
                axesLength : 13, //this.axesDomain.length,
                angleSlice : Math.PI * 2 / this.axesLength,
                radarLine : d3.lineRadial()
                    .curve(d3.curveCardinalClosed)
                    .radius(d => this.rScale(d))
                    .angle((d, i) => i * this.angleSlice),
                axisLabelFactor : 1.12,
                category : d => ["Not Satisfied", "Satisfied"][d],
                color : d3.scaleOrdinal()
                    .range(["orange","blue"])
            }
        },
        props:{
            myRadarPlotData: Array,
        },
        mounted(){
            
            const satisfaction_data = this.groupBy(this.myRadarPlotData, "satisfaction");
            console.log(satisfaction_data);
            const satisfied = this.getSpiderPlotData(satisfaction_data["satisfied"]);
            const dissatisfied = this.getSpiderPlotData(satisfaction_data["neutral or dissatisfied"]);

            const parsed_data = [dissatisfied, satisfied];

            this.drawRadarPlot(parsed_data, "#radar") /* Example of reading data from a json file */
            // this.drawBarChart(this.myBarchartData, "#bar")
            console.log("Data Passed down as a Prop  ", this.myRadarPlotData)
        },
        methods: {
            drawRadarPlot(radar_data, id) {

                console.log(this.margin);
                let svg = d3.select(id).append("svg")
                    .attr("viewBox", [0, 0, this.width, this.height])
                    .attr("width", this.width + this.margin.left + this.margin.right)
                    .attr("height", this.height + this.margin.top + this.margin.bottom);

                const containerWidth = this.width-(this.margin*2);
                const containerHeight = this.height-(this.margin*2);
                const container = svg.append('g')
                    .attr("width", containerWidth)
                    .attr("height", containerHeight)
                    .attr('transform', `translate(${(this.width/2)+this.margin}, ${(this.height/2)+this.margin})`);
                
                console.log(containerWidth);
                console.log(containerHeight);
                var axisGrid = container.append("g")
                .attr("class", "axisWrapper");

                axisGrid.selectAll(".levels")
                .data(d3.range(1,(this.axisCircles+1)).reverse())
                .enter()
                .append("circle")
                    .attr("class", "gridCircle")
                    .attr("r", (d, i) => this.radius/this.axisCircles*d)
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
                        .attr("x2", (d, i) => this.rScale(this.maxValue*1.1) * Math.cos(this.angleSlice*i - Math.PI/2))
                        .attr("y2", (d, i) => this.rScale(this.maxValue*1.1) * Math.sin(this.angleSlice*i - Math.PI/2))
                        .attr("class", "line")
                        .style("stroke", "white")
                        .style("stroke-width", "2px");

                axis.append("text")
                    .attr("class", "legend")
                    .style("font-size", "11px")
                    .attr("text-anchor", "middle")
                    .attr("font-family", "monospace")
                    .attr("dy", "0.35em")
                    .attr("x", (d, i) => this.rScale(this.maxValue * this.axisLabelFactor) * Math.cos(this.angleSlice*i - Math.PI/2))
                    .attr("y", (d, i) => this.rScale(this.maxValue * this.axisLabelFactor) * Math.sin(this.angleSlice*i - Math.PI/2))
                    .text(d => d);
                
                const plots = container.append('g')
                    .selectAll('g')
                    .data(radar_data)
                    .join('g')
                        .attr("data-name", (d, i) => this.category(i))
                        .attr("fill", "none")
                        .attr("stroke", "steelblue");

                plots.append('path')
                    .attr("d", d => this.radarLine(d.map(v => v.value)))
                    .attr("fill", (d, i) => this.color(i))
                    .attr("fill-opacity", 0.1)
                    .attr("stroke", (d, i) => this.color(i))
                    .attr("stroke-width", 2);

                plots.selectAll("circle")
                    .data(d => d)
                    .join("circle")
                        .attr("r", this.dotRadius)
                        .attr("cx", (d,i) => this.rScale(d.value) * Math.cos(this.angleSlice*i - Math.PI/2))
                        .attr("cy", (d,i) => this.rScale(d.value) * Math.sin(this.angleSlice*i - Math.PI/2))
                        .style("fill-opacity", 0.8);
            },
            groupBy(objectArray, property) {
                return objectArray.reduce(function (acc, obj) {
                    let key = obj[property]
                    if (!acc[key]) {
                        acc[key] = []
                    }
                    acc[key].push(obj)
                    return acc
                }, {})
            },
            getSpiderPlotData(subset) {
                let ratings = {}
                const columns = this.myRadarPlotData.columns
                for(let i = 0; i < subset.length; i++) {
                    for (let j = 8; j < 21; j++) {
                    if(columns[j] in ratings)
                        ratings[columns[j]] += subset[i][columns[j]]
                    else
                        ratings[columns[j]] = subset[i][columns[j]]
                    }
                }
                let final = []
                for(let axis in ratings) {
                    ratings[axis] /= subset.length
                    let value = ratings[axis]
                    final.push({axis,value})
                }
                return final
            }
        }
    }

</script>


<style>

</style>