<template>
    <div id="radar"></div>
</template>

<script>
import * as d3 from "d3";
import radar_data from "../../assets/data/radar_data.csv"

export default {
    name: 'RadarChart',
    data() {
        return {
            name: 'Hello',
            someLocalValues: [1, 2, 3, 4, 5],

        }
    },
    props: {
        myRadarChartData: Array,
    },
    mounted() {
        console.log(radar_data);
        this.initialize_radarchart("#radar")
        this.draw_radarchart(radar_data, "#radar")
    },

    updated() {
        console.log("Update radar data");
        this.draw_radarchart(radar_data, "#radar")
    },
    methods: {
        initialize_radarchart(id) {
            let svg = d3.select(id).append("svg")
            svg.append("g").attr("id", "radar_panel");
            svg.append("g").attr("id", "radar_number");
            svg.append("g").attr("id", "radar_axis");
            svg.append("path").attr("id", "radar_path")
            svg.append("path").attr("id", "radar_legend_path");
            svg.append("text").attr("id", "radar_legend_text")
        },

        draw_radarchart(data, id) {
            const margin = { top: 60, right: 30, bottom: 50, left: 30 };
            const height = 250;
            const width = 450;

            let svg = d3.select(id).select("svg")
                .attr("viewBox", [0, 0, width, height])
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            const circle_num = 4

            let radialScale = d3.scaleLinear()
                .domain([0,4000])
                .range([0, height / 2]);

            let panel = svg.select("#radar_panel");
            let nums = svg.select("#radar_number");
            let interval = [0, 1000, 2000, 3000, 4000];
            let features = ["1990~1999", "2000~2009", "2010~2019"];

            panel.selectAll("circle")
                .data(interval)
                .join("circle")
                .attr("cx", width / 2)
                .attr("cy", height / 2)
                .attr("fill", "none")
                .attr("stroke", "#808080")
                .attr("r", d => radialScale(d))

            nums.selectAll("text")
                .data(interval)
                .join("text")
                .attr("x", width / 2 + 5)
                .attr("y", d => {
                    return height / 2 - radialScale(d) - 1
                })
                .text(d => {
                    if (d == interval[interval.length - 1]) {
                        return d.toString() + " ton per capita"
                    } else {
                        return d.toString()
                    }
                }
                )

            function angleToCoordinate(angle, value) {
                let x = Math.cos(angle) * radialScale(value);
                let y = Math.sin(angle) * radialScale(value);
                return { "x": width / 2 + x, "y": height / 2 - y };
            }

            const line = d3.line()
                .x(d => d.x)
                .y(d => d.y);

            const color = "red"

            let axis = svg.select("#radar_axis");
            let legend_path_positions = []
            let positions = []
            let line_coords = []
            let label_coords = []
            let label_names = []
            let attrs = ["first", "second", "third"];
            for (let i = 0; i < features.length; i++) {
                let angle = Math.PI / 2 + 2 * Math.PI * i / features.length;
                let idx = attrs[i];
                label_names.push(features[i])
                line_coords.push(angleToCoordinate(angle, interval[interval.length - 1]));
                label_coords.push(angleToCoordinate(angle, interval[interval.length - 1] * 1.1));            
            }

            function getPathCoordinates(data_point){
                let attrs = ["first", "second", "third"];
                let coordinates = [];
                for (var i = 0; i < features.length; i++){
                    let idx = attrs[i];
                    let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
                    coordinates.push(angleToCoordinate(angle, data_point[idx]));
                }
                return coordinates;
            }

            let colors = ["darkorange", "gray", "navy"];
            for (var i = 0; i < data.length; i ++){
                    let d = data[i];
                    let color = colors[i];
                    let coordinates = getPathCoordinates(d);

                    //draw the path element
                    svg.append("path")
                    .datum(coordinates)
                    .attr("d",line)
                    .attr("stroke-width", 3)
                    .attr("stroke", color)
                    .attr("fill", color)
                    .attr("stroke-opacity", 1)
                    .attr("opacity", 0.5);
            }

            // Draw Axis
            axis.selectAll("line").data(line_coords)
                .join("line")
                .attr("x1", width / 2)
                .attr("y1", height / 2)
                .attr("x2", d => d.x)
                .attr("y2", d => d.y)
                .attr("stroke", "black");

            // Draw Labels
            axis.selectAll("text").data(label_coords)
                .join("text")
                .attr("x", d => d.x)
                .attr("y", d => d.y)
                .attr("class", "font-weight-bold")
                .attr("text-anchor", d => {
                    if (d.x > width / 2) {
                        return "start"
                    } else if (d.x < width / 2) {
                        return "end"
                    }
                    return "middle"
                })
                .text((d, i) => {
                    return label_names[i]
                });
        },
    }
}
</script>


<style>

</style>