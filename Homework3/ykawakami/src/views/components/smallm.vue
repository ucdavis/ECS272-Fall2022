<template>
    <info>Effective pitch locations for {{ getPitchType() }}s against {{ getBatterSide() }}-handed batters</info>
    <div id="chart3"></div>
</template>


<script>

import { pitch_type_dict  } from './constants.js'
import * as d3 from "d3";
import { legendColor } from 'd3-svg-legend'

export default {
    name: 'SmallMChart',
    data() {
        return {
            ab_path: [],
            data: [],
            selectedPitchType: null,
            batterSide: null
        };
    },
    props: {
        myHeatData: Object,
        selectedPitch: Object
    },
    mounted() {
        console.log("HeatChart: Data Passed down as a Prop  ", this.myHeatData);
        this.selectedPitchType = this.selectedPitch['pitch_type']
        this.batterSide = this.selectedPitch['stand']
        this.draw();
    },
    watch:{
        selectedPitch(newVal, oldVal){
            // Need to update the heatmap
            if (this.selectedPitchType && (this.selectedPitchType !== newVal['pitch_type'])){
                this.selectedPitchType = newVal['pitch_type'];

                this.batterSide = newVal['stand']
                d3.select('#heat').remove();
                //x._groups[0].forEach( x => x.remove() );
                this.draw();
            } else {
                // Still need to redrawn the new pitch
                const margin = {top: 60, right: 60, bottom: 60, left: 60};
                let container = document.getElementById('chart3');
                let boxWidth = Math.min(container.clientWidth, container.clientHeight);
                let boxHeight = boxWidth;
                let containerWidth = container.clientWidth;
                let containerHeight = container.clientHeight;

                const x = d3.scaleLinear()
                    .domain([-2, 2])
                    //.range([margin.left, containerWidth - margin.right]);
                    .range([containerWidth / 2 - boxWidth / 2, containerWidth / 2 + boxWidth / 2]);

                const y = d3.scaleLinear()
                    .domain([0.5, 4.5])
                    //.range([containerHeight - margin.bottom, margin.top]);
                    .range([containerHeight / 2 + boxHeight / 2, containerHeight / 2 - boxHeight / 2]);

                d3.select('#curpitch').remove();
                this.svg.append('circle')
                    .attr('id', 'curpitch')
                    .attr('cx', x(this.selectedPitch['px']))
                    .attr('cy', y(this.selectedPitch['pz']))
                    .attr('r', 10)
                    .attr('fill', 'black')

            }
        }
    },
    methods: {
        getBatterSide(){
            return this.batterSide == 'L' ? 'Left' : 'Right';
        },
        getPitchType(){
            return pitch_type_dict[this.selectedPitchType];
        },
        makeHeatMap(data, bins){
            let heatMap = []
            // Iterate over px and pz, px ranges from -1.5 to 1.5, and pz from 0.5 to 3.5
            for (let x = 0; x < bins; x++){
                for (let y = 0; y < bins; y++){
                    heatMap.push({
                        'px': x,
                        'pz': y,
                        'count': 0,
                        'countStrike': 0,
                        'percentage': 0
                    })
                }
            }
            data.forEach( d => { 
                let x = Math.floor( (parseFloat(d.px) + 2) / ( 4 / bins ) );
                let y = Math.floor( (parseFloat(d.pz) - 0.5) / ( 4 / bins ) );
                // Ignore pitches way outside the zone
                if ( x < 0 || x >= bins || y < 0 || y >= bins )
                    return;
                heatMap[x * bins + y].count++;
                if ( d.type === 'S' )
                    heatMap[x * bins + y].countStrike++;
            })
            heatMap.forEach( d => d['percentage'] = d['countStrike'] / d['count'] )

            return heatMap;
        },
        draw(){

            const margin = {top: 60, right: 60, bottom: 60, left: 60};
            let container = document.getElementById('chart3');

            let boxWidth = Math.min(container.clientWidth, container.clientHeight);
            let boxHeight = boxWidth;
            let containerWidth = container.clientWidth;
            let containerHeight = container.clientHeight;

            const x = d3.scaleLinear()
                .domain([-2, 2])
                //.range([margin.left, containerWidth - margin.right]);
                .range([containerWidth / 2 - boxWidth / 2, containerWidth / 2 + boxWidth / 2]);

            const y = d3.scaleLinear()
                .domain([0.5, 4.5])
                //.range([containerHeight - margin.bottom, margin.top]);
                .range([containerHeight / 2 + boxHeight / 2, containerHeight / 2 - boxHeight / 2]);

            let svg = d3.select('#chart3')
                .append("svg")
                .attr("id", "heat")
                .attr("viewBox", [0, 0, containerWidth, containerHeight])
                .attr("width", containerWidth )
                .attr("height", containerHeight)
                .style("margin", "auto")
                .style("height", "100%");

            // Save for latter calls to add new curpitch
            this.svg = svg;

            //this.data = this.myHeatData.filter(x => (x['stand'] === this.batterSide) && (x["pitch_type"] === this.selectedPitchType) && (x["code"] == 'C' || x["code"] == 'S'))
            //this.data = this.myHeatData.filter(x => (x['stand'] === this.batterSide) && (x["pitch_type"] === this.selectedPitchType) && (x["type"] == 'S'))
            this.data = this.myHeatData.filter(x => (x['stand'] === this.batterSide) && (x["pitch_type"] === this.selectedPitchType))
            //this.data = this.myHeatData.filter(x => (x["pitch_type"] === this.selectedPitchType) && (x["type"] == 'S'))
            let heatMapBins = 9; 
            let heatMap = this.makeHeatMap(this.data, heatMapBins);

            const x_heatMap = d3.scaleBand()
                //.range([margin.left, containerWidth - margin.right])
                .range([containerWidth / 2 - boxWidth / 2, containerWidth / 2 + boxWidth / 2])
                .domain([...Array(heatMapBins).keys()])
                .padding(0.1);

            const y_heatMap = d3.scaleBand()
                //.range([containerHeight - margin.bottom, margin.top])
                .range([containerHeight / 2 + boxHeight / 2, containerHeight / 2 - boxHeight / 2])
                .domain([...Array(heatMapBins).keys()])
                .padding(0.1);

            const myColor = d3.scaleSequential()
                .interpolator(d3.interpolateSpectral)
                .domain([0, 75])

            svg.selectAll("heatMapRect")
                .data(heatMap)
                .join("rect")
                .attr("x", d => x_heatMap(d.px))
                .attr("y", d => y_heatMap(d.pz))
                .attr("rx", 5)
                .attr("ry", 5)
                .attr("width", x_heatMap.bandwidth())
                .attr("height", y_heatMap.bandwidth())
                .style("fill", d => myColor(d.percentage * 100))
                .style("opacity", 0.8);

            /*
            // compute the density data
            let densityData = d3.contourDensity()
                .x(function(d) { return x(d['px']);  })
                .y(function(d) { return y(d['pz']);  })
                .weight((d) => (this.data.length) )
                .size([containerWidth, containerHeight])
                .bandwidth(15)
                .thresholds(33)
                (this.data)

            // Normalize it so that it can be interpreted as percentages
            let sum = densityData.reduce( (a,b) => a+parseFloat(b.value),0 )
            densityData.forEach( (element,index,arr) => arr[index].value = parseFloat(arr[index].value )/ sum * 100)

            // Prepare a color palette
            const color = d3.scaleLinear()
                .domain([
                    Math.min(...densityData.map( x=> x['value'] )),
                    Math.max(...densityData.map( x=> x['value'] ))
                ]) // Points per square pixel.
                .range(["rgb(255, 255, 255)", "rgb(235,64,52)"])
                */

            let legendLinear = legendColor()
                .shapeWidth(30)
                .shapeHeight(30)
                .labelOffset(10)
                .ascending(true)
                .title("Percentage of balls in each zone that resulted in a strike")
                .titleWidth(150)
                .labels(['0%', '15%', '30%', '45%', '60%', '75%'])
                .cells(6)
                .orient('vertical')
                .scale(myColor);


            svg.append("g")
                .attr("class", "legendLinear")
                .attr("transform", "translate(0,20)")

            svg.select(".legendLinear")
                .call(legendLinear);
            // Strike zone 
            let top = [], bot = [];

            this.data.forEach(x => top.push(x['sz_top']));
            this.data.forEach(x => bot.push(x['sz_bot']));

            top = top.reduce((a,b) => parseFloat(a) + parseFloat(b), 0) / top.length;
            bot = bot.reduce((a,b) => parseFloat(a) + parseFloat(b), 0) / bot.length;


            svg.selectAll("rect2")
                .data([0])
                .join("rect")
                .attr('x', x(-17/24))
                .attr('y', y(top))
                .attr('width', x(17/24)-x(-17/24))
                .attr('height', y(bot)-y(top))
                .style('fill', 'white')
                .style("fill-opacity", 0)
                .style('stroke-opacity', 1)
                .style("stroke", "black")
                .style("stroke-width", "7");

            /*
            // show the shape!
            svg.insert("g", "g")
                .selectAll("path")
                .data(densityData)
                .enter().append("path")
                .attr("d", d3.geoPath())
                .attr("fill", function(d) { return color(d.value);  })
                .style("opacity", 0.1);
                */

            svg.append('circle')
                .attr('id', 'curpitch')
                .attr('cx', x(this.selectedPitch['px']))
                .attr('cy', y(this.selectedPitch['pz']))
                .attr('r', 10)
                .attr('fill', 'black')

        },
    },
}

</script>
