<template>
    <div id="radar"></div>
</template>

<script>
import * as d3 from "d3";
import summaryData from "../../assets/data/countOtherGenresOut.json"; /* Example of reading in data direct from file*/

export default {
    name: 'Radar',
    data() {
        return {
            selectedName: [],
            axisCircles: 5,
            maxValue:1


        }
    },
    props: {
        myRadarData: Array,
    },
    mounted() {
        console.log(summaryData);
        let localData = summaryData['data'];
        this.drawBarChart(localData, "#radar") /* Example of reading data from a json file */
        // this.drawBarChart(this.myBarchartData, "#bar")
        console.log("Data Passed down as a Prop  ", this.myRadarData)
    },
    methods: {
        radarchart(svg, _position, radarData) {
            var _radius = _position.height / 2
            var _axesDomain = radarData[0].map(d => d.axis)
            var _axesLength = radarData[0].length
            var _angleSlice = Math.PI * 2 / _axesLength
            var _rScale = d3.scaleLinear()
                .domain([0, maxValue])
                .range([0, _radius])

            var _radarLine = d3.lineRadial()
                .curve(d3[curveSelect])
                .radius(d => _rScale(d))
                .angle((d, i) => i * _angleSlice)


            const containerWidth = _position.width;
            const containerHeight = _position.height;

            const container = svg.append('g')
                .attr("width", containerWidth)
                .attr("height", containerHeight)
                .attr('transform', `translate(${(_position.x + _position.width / 2 + position.margin)}, ${(_position.y + _position.height / 2 + position.margin)})`)
                .attr("class", "radar-chart-container")

            /*container.append("rect")
              .attr("width", _position.width + 2 * _position.margin)
              .attr("height", _position.height + 2 * _position.margin)
              .attr("x", - _position.width / 2 - _position.margin)
              .attr("y", - _position.height / 2 - _position.margin)
              .attr("fill", "black")
              .attr("opacity", 0.05)*/

            var axisGrid = container.append("g")
                .attr("class", "axisWrapper");

            axisGrid.selectAll(".levels")
                .data(d3.range(1, (axisCircles + 1)).reverse())
                .enter()
                .append("circle")
                .attr("class", "gridCircle")
                .attr("r", (d, i) => _radius / axisCircles * d)
                .style("fill", "#CDCDCD")
                .style("stroke", "#CDCDCD")
                .style("fill-opacity", 0.1);

            var gridGraduation = container.append("g")
                .attr("class", "gridGraduation");

            gridGraduation.selectAll(".levels")
                .data(d3.range(1, (axisCircles + 1)).reverse())
                .enter()
                .append("text")
                .attr("class", "graduation")
                .style("font-size", "11px")
                .attr("text-anchor", "middle")
                .attr("font-family", "monospace")
                .attr("fill", "gray")
                .attr("dy", "0.35em")
                .attr("x", (d, i) => 0)
                .attr("y", (d, i) => 0 - _radius / axisCircles * d)
                .text(d => String(Math.round(100 * d / axisCircles)) + "%");

            const axis = axisGrid.selectAll(".axis")
                .data(_axesDomain)
                .enter()
                .append("g")
                .attr("class", "axis");

            axis.append("line")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", (d, i) => _rScale(maxValue * 1.1) * Math.cos(_angleSlice * i - Math.PI / 2))
                .attr("y2", (d, i) => _rScale(maxValue * 1.1) * Math.sin(_angleSlice * i - Math.PI / 2))
                .attr("class", "line")
                .style("stroke", "white")
                .style("stroke-width", "2px");

            axis.append("text")
                .attr("class", "legend")
                .style("font-size", "13px")
                .attr("text-anchor", "middle")
                .attr("font-family", "monospace")
                .attr("dy", "0.35em")
                .attr("x", (d, i) => _rScale(maxValue * axisLabelFactor) * Math.cos(_angleSlice * i - Math.PI / 2))
                .attr("y", (d, i) => _rScale(maxValue * axisLabelFactor) * Math.sin(_angleSlice * i - Math.PI / 2))
                .text(d => d);
        },
    }
}
</script>