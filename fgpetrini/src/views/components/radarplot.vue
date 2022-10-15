<template>
    <div id="radar">
    </div>
</template>

<script>
    import * as d3 from "d3";

    export default {
        name: 'RadarPlot', 
        data() {
            return {
                name: 'Hello',
                margin : 30,
                radius : 160,
                axisCircles: 5,
                dotRadius: 4,
                axesDomain : [
                    "Inflight Wifi", 
                    "Departure/Arrival Time", 
                    "Ease of Booking", 
                    "Gate Location", 
                    "Food and Drink", 
                    "Online Boarding", 
                    "Seat Comfort", 
                    "Inflight Entertainment", 
                    "On-board Service", 
                    "Leg Room", 
                    "Baggage Handling", 
                    "Checkin", 
                    "Inflight service",
                    "Cleanliness"
                ],
                maxValue : 5,
                angleSlice : Math.PI * 2 / 14,
                axisLabelFactor : 1.12,
                category : d => ["Not Satisfied", "Satisfied"][d],
                color : d3.scaleOrdinal()
                    .range(["orange","blue"]),
                dissatisfied_v_satisfied_data : [],
                disloyal_v_loyal_data : [],
                drop_down_option : "Dis_Vs_Sat",

            }
        },
        props:{
            myRadarPlotData: Array,
            height : Number,
            width : Number,
            dd_option : String,
        },
        mounted(){
            console.log(this.dd_option);
            if(this.dd_option == "Dis_Vs_Sat") {
                const satisfaction_data = this.groupBy(this.myRadarPlotData, "satisfaction");
                const satisfied = this.getSpiderPlotData(satisfaction_data["satisfied"]);
                const dissatisfied = this.getSpiderPlotData(satisfaction_data["neutral or dissatisfied"]);
                this.dissatisfied_v_satisfied_data = [dissatisfied, satisfied];
                this.drawRadarPlot(this.dissatisfied_v_satisfied_data, "#radar");

                // Prioritize Render, then initialize other data
                const loyalty_data = this.groupBy(this.myRadarPlotData, "Customer Type");
                const disloyal = this.getSpiderPlotData(loyalty_data["disloyal Customer"]);
                const loyal = this.getSpiderPlotData(loyalty_data["Loyal Customer"]);
                this.disloyal_v_loyal_data = [disloyal, loyal];
            }
        },
        methods: {
            drawRadarPlot(radar_data, id) {

                const rScale = d3.scaleLinear()
                            .domain([0, this.maxValue])
                            .range([0, this.radius]);

                const radarLine = d3.lineRadial()
                    .curve(d3.curveCardinalClosed)
                    .radius(d => rScale(d))
                    .angle((d, i) => i * this.angleSlice);

                let svg = d3.select(id).append("svg")
                    .attr("viewBox", [0, 30, this.width, this.height])
                    .attr("width", this.width)
                    .attr("height", this.height);
                
                const containerWidth = this.width-(this.margin*2);
                const containerHeight = this.height-(this.margin*2);
                const container = svg.append('g')
                    .attr("width", containerWidth)
                    .attr("height", containerHeight)
                    .attr('transform', `translate(${(this.width/2)+this.margin}, ${(this.height/2)+this.margin})`);
                
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
                        .attr("x2", (d, i) => rScale(this.maxValue*1.1) * Math.cos(this.angleSlice*i - Math.PI/2))
                        .attr("y2", (d, i) => rScale(this.maxValue*1.1) * Math.sin(this.angleSlice*i - Math.PI/2))
                        .attr("class", "line")
                        .style("stroke", "white")
                        .style("stroke-width", "2px");
                
                axis.append("text")
                    .attr("class", "legend")
                    .style("font-size", "11px")
                    .attr("text-anchor", "middle")
                    .attr("font-family", "monospace")
                    .attr("dy", "0.35em")
                    .attr("x", (d, i) => rScale(this.maxValue * this.axisLabelFactor) * Math.cos(this.angleSlice*i - Math.PI/2))
                    .attr("y", (d, i) => rScale(this.maxValue * this.axisLabelFactor) * Math.sin(this.angleSlice*i - Math.PI/2))
                    .text(d => d);
                
                const plots = container.append('g')
                    .selectAll('g')
                    .data(radar_data)
                    .join('g')
                        .attr("data-name", (d, i) => this.category(i))
                        .attr("fill", "none")
                        .attr("stroke", "steelblue");
                
                plots.append('path')
                    .attr("d", d => radarLine(d.map(v => v.value)))
                    .attr("fill", (d, i) => this.color(i))
                    .attr("fill-opacity", 0.1)
                    .attr("stroke", (d, i) => this.color(i))
                    .attr("stroke-width", 2)
                    .on("mouseover", function(d) {
                        d3.select(this)
                        .style("transition", "fill-opacity 0.8s")
                        .attr("fill-opacity", 0.4)
                    })
                    .on("mouseout", function(d) {
                        d3.select(this)
                        .attr("fill-opacity", 0.1)
                    });
                
                plots.selectAll("circle")
                    .data(d => d)
                    .join("circle")
                        .attr("r", this.dotRadius)
                        .attr("cx", (d,i) => rScale(d.value) * Math.cos(this.angleSlice*i - Math.PI/2))
                        .attr("cy", (d,i) => rScale(d.value) * Math.sin(this.angleSlice*i - Math.PI/2))
                        .style("fill-opacity", 0.8)
                    .on("mouseover", function(d) {
                        d3.select(this)
                        .attr("r", dotRadius+2)
                    })
                    .on("mouseout", function(d) {
                        d3.select(this)
                        .attr("r", dotRadius)
                    });
            },
            groupBy(objectArray, property) {
                return objectArray.reduce(function (acc, obj) {
                    let key = obj[property];
                    if (!acc[key]) {
                        acc[key] = [];
                    }
                    acc[key].push(obj);
                    return acc;
                }, {});
            },
            getSpiderPlotData(subset) {
                let ratings = {};
                const columns = this.myRadarPlotData.columns;
                for(let i = 0; i < subset.length; i++) {
                    for (let j = 8; j < 22; j++) {
                    if(columns[j] in ratings)
                        ratings[columns[j]] += Number(subset[i][columns[j]]);
                    else
                        ratings[columns[j]] = Number(subset[i][columns[j]]);
                    }
                }
                let final = [];
                for(let axis in ratings) {
                    ratings[axis] /= subset.length;
                    let value = ratings[axis];
                    final.push({axis,value});
                }
                return final;
            },
            updatePlot() {
                d3.selectAll("#radar svg").remove();
                console.log(this.dd_option);
                if(this.dd_option == "Dis_Vs_Sat") {
                    this.drawRadarPlot(this.dissatisfied_v_satisfied_data, "#radar")
                }
                else {
                    this.drawRadarPlot(this.disloyal_v_loyal_data, "#radar")
                }
            }
        }
    }

</script>


<style>
#radar {
    background-color: white;
}
</style>