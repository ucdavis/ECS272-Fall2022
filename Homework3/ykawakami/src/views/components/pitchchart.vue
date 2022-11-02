<template>
    <div id="pitchChartTitle">
    <info>Pitch final location from catcher's perspective and results from at-bat id - {{ getABid() }}</info>
    </div> 
    <div id="legend2">
    </div>
    <div id="chart"></div>
</template>


<script>
import * as d3 from "d3";

import { pitch_result_color, pitch_label_color, pitch_type_dict, pitch_type_result_dict  } from './constants.js'

export default {
    name: 'PitchChart',
    data() {
        return {
        };
    },
    props: {
        myData: Object
    },
    mounted() {
        console.log("pitchart: Data Passed down as a Prop  ", this.myData);
        this.drawPitchChart(this.myData, "#chart");
        //this.$emit('selected', [0]);
    },
    methods: {
        selectedSubset(target){
            this.$emit('selected', target);
        },
        resetOpacity(){
            d3.selectAll("circle").style("opacity", 1);
        },
        getABid(){
            return parseInt(this.myData[0]['ab_id'])
        },
        getTooltipText(data){
            console.log(data)
            return `<ul>
                <li><b>Pitch Type</b>: ${pitch_type_dict[data['pitch_type']]}</li>
                <li><b>Result</b>: ${pitch_type_result_dict[data['type']]}</li>
                <li><b>Speed</b>: ${data['start_speed']} MPH</li>
                <li><b>Spin Rate</b>: ${parseInt(data['spin_rate'])} RPM</li>
                <li><b>Count (Ball-Strike)</b>: ${parseInt(data['b_count'])}-${parseInt(data['s_count'])}</li>
                <li><b>Batter Stands</b>: ${data['stand'] == 'L' ? 'Left' : 'Right'}</li>
                <li><b>Pitcher Throws</b>: ${data['p_throws'] == 'L' ? 'Left' : 'Right'}</li>
                </ul>`
        },
        drawPitchChart(data, id){
            const margin = {top: 60, right: 60, bottom: 60, left: 60};
            let container = document.getElementById('chart');

            let containerWidth = Math.min(container.clientWidth, container.clientHeight);
            let containerHeight = containerWidth;

            const x = d3.scaleLinear()
                .domain([-2, 2])
                .range([margin.left, containerWidth - margin.right]);

            const y = d3.scaleLinear()
                .domain([0, 4])
                .range([containerHeight - margin.bottom, margin.top]);

            let svg = d3.select(id)
                .append("svg")
                .attr("viewBox", [0, 0, containerWidth, containerHeight])
                .attr("width", containerWidth )
                .attr("height", containerHeight)
                .style("margin", "auto")
                .style("height", "100%");

            //////// MAKE THE STRIKE ZONE!

            // Strike zone 
            let top = [], bot = [];

            data.forEach(x => top.push(x['sz_top']));
            data.forEach(x => bot.push(x['sz_bot']));

            top = top.reduce((a,b) => parseFloat(a) + parseFloat(b)) / top.length;
            bot = bot.reduce((a,b) => parseFloat(a) + parseFloat(b)) / bot.length;

            // bottom of strike zone is at -2
            let points = [
                {x: x(-17/24),y: y(bot) },
                {x: x(17/24),y: y(bot) },
                {x: x(17/24),y: y(top) },
                {x: x(-17/24),y:  y(top) },
            ];
            // let strikeZonePath = d3.line(points);
            let strikeZonePath = d3.line()
                .x(d => d.x)
                .y(d => d.y);

            svg.selectAll("rect")
                .data([0])
                .join("rect")
                .attr('x', x(-17/24))
                .attr('y', y(top))
                .attr('width', x(17/24)-x(-17/24))
                .attr('height', y(bot)-y(top))
                .style('fill', '#69b3a2')
                .style("opacity", 0.3);
            //////////////// END


            //////// MAKE THE ACTUAL DOTS!

            // create a tooltip
            let tooltip = d3.select("#chart")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "4px")
                .style("border-radius", "5px")
                .style("padding", "5px")
                .style("position", "absolute")

            svg.selectAll("dot")
                .data(data)
                .join("circle")
                .attr("cx", d => x(d.px))
                .attr("cy", d => y(d.pz))
                .attr("r", 8)
                .style("fill", d => pitch_result_color[d['type']])
                .on('click', (e) => {
                    this.selectedSubset(e.currentTarget.__data__[""])
                    d3.selectAll("circle").style("opacity", 0.3);
                    d3.select(e.target).style("opacity", 1);
                })
                .on('mouseover', function(event){
                    tooltip.style("opacity", 1);
                    d3.select(this)
                        .style("stroke", "black")
                        .style("stroke-width", 4)
                })
                .on('mousemove', (event,data) => {
                    let pointer = d3.pointer(event, container)
                    let x = document.getElementById('chart').getBoundingClientRect()
                    console.log(pointer, x.x, x.y, pointer[0]+x.x, pointer[1]+x.y)
                    tooltip.html(this.getTooltipText(data))
                        .style("left", pointer[0] + document.getElementById('chart').getBoundingClientRect().x + "px")
                        .style("top", pointer[1] + document.getElementById('chart').getBoundingClientRect().y + "px")
                })
                .on('mouseleave', function(event){
                    tooltip.style("opacity", 0)
                        .html('')
                        .style("left","0px")
                        .style("top", "0px")
                    d3.select(this)
                        .style("stroke", "none")
                })
                ;

            svg.selectAll("text")
                .data(data)
                .join("text")
                .attr("x", d => x(d.px)+10)
                .attr("y", d => y(d.pz)+15)
                .text(d=>parseInt(d['pitch_num']))

            //////////////// END


            //////// MAKE THE LEGEND!

            // Add one dot in the legend for each name.
            let size = 20;
            let keys = ['Strike', 'Ball', 'In Play'];

            let svg2 = d3.select('#legend2')
                .append("svg")
                .attr("viewBox", [0, 0, 200, 200])
                .attr("width", 200 )
                .attr("height", 200)
                .style("margin", "auto")
                .style("height", "100%");

            svg2.selectAll("mydots")
                .data(keys)
                .enter()
                .append("rect")
                .attr("x", 10)
                .attr("y", function(d,i){ return 0 + i*(size+5) }) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("width", size)
                .attr("height", size)
                .style("fill", d => pitch_label_color[d]);

            // Add one dot in the legend for each name.
            svg2.selectAll("mylabels")
                .data(keys)
                .enter()
                .append("text")
                .attr("x", 10 + size*1.2)
                .attr("y", function(d,i){ return 0 + i*(size+5) + (size/2) }) // 100 is where the first dot appears. 25 is the distance between dots
                .text(function(d){ return d })
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")

            //////////////// END

            //////// MAKE THE AXIS!
            const x_axis = g => g
                .attr("transform", `translate(0, ${containerHeight - margin.bottom})`)
                .call(d3.axisBottom(x))

            const y_axis = g => g
                .attr("transform", `translate(${margin.left}, 0)`)
                .call(d3.axisLeft(y))

            svg.append("g")
                .call(x_axis)
                .call( g=>g.select(".tick:last-of-type text")
                    .clone()
                    .attr("text-anchor", "middle")
                    .attr("x", -(containerWidth - margin.left - margin.right) / 2)
                    .attr("y", margin.bottom + 10)
                    .attr("font-weight", "bold")
                    .style("font-size",11)
                    .text("Pitch final location the across the plate horizontally. 0 signifies the middle of the homeplate. In feet.")
                );

            svg.append("g")
                .call(y_axis)
                .call( g=>g.select(".tick:last-of-type text")
                    .clone()
                    .attr("transform", `rotate(-90)`)
                    .attr("text-anchor", "middle")
                    .attr("x", -containerHeight/2 + 70)
                    .attr("y", -40)
                    .attr("font-weight", "bold")
                    .style("font-size",11)
                    .text("Pitch final location the across the plate vertically. -2 signifies ground level. In feet.")
                );

            //////////////// END
        }
    }
}
</script>
