<template>
    <div id="radar" class="border mx-auto"></div>
</template>

<script>
// Resources URL: https://yangdanny97.github.io/blog/2019/03/01/D3-Spider-Chart

import * as d3 from "d3";


export default {
    name: 'RadarChart',
    data() {
        let processed_data = []
        return {
            name: 'Hello',
            someLocalValues: [1, 2, 3, 4, 5],

        }
    },
    props: {
        myCsvData: Array,
        curr_year: Number,
    },
    mounted() {
        console.log("Mounted My radar data");
        this.processed_data = this.process_data()
        this.initialize_radarchart("#radar")
        this.draw_radarchart(this.processed_data[this.curr_year], "#radar")
    },

    updated() {
        console.log("Updated My radar data");
        this.draw_radarchart(this.processed_data[this.curr_year], "#radar")
    },
    methods: {
        process_data() {
            const year_min = 1990
            const year_max = 2019
            let data = this.myCsvData
            let new_data = {}
            for (let year = year_min; year < year_max + 1; year++) {

            let group_by_region = {}
            this.myCsvData.forEach(country => {
                if (!country[year]) {
                    // If no data in current year for this country
                    return;
                }
                if (country["Region"] in group_by_region) {
                    group_by_region[country["Region"]].count += 1;
                    group_by_region[country["Region"]]["emission"] += parseFloat(country[year])
                } else {
                    let new_region = {
                        region: country["Region"],
                        year: year,
                        count: 1,
                        emission: parseFloat(country[year]),
                    }
                    group_by_region[country["Region"]] = new_region
                }
            });

            let group_by_region_array = []
            Object.keys(group_by_region).forEach(key => {
                group_by_region_array.push(group_by_region[key])
            });
            // console.log("Group by region data: ", group_by_region_array)

            // Sort the array to alphabetical order
            group_by_region_array = group_by_region_array.sort((a, b) => {
                return d3.descending(a["region"], b["region"])
            })

            // console.log("Mounted My radar data", group_by_region_array);
            new_data[year] = group_by_region_array
        }
            return new_data
        },

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
            const margin = { top: 40, right: 20, bottom: 40, left: 20 };
            const height = 300;
            const width = 650;

            let svg = d3.select(id).select("svg")
                .attr("viewBox", [0, 0, width, height])
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            const circle_num = 5            // How many circles in radar chart
            let max_regional_emission = closest_divisble(d3.max(data, d => {
                return d["emission"] / d["count"]
            }), circle_num)


            let interval = [];
            for (let i = 1; i < circle_num + 1; i++) {
                interval.push(max_regional_emission * i / circle_num)

            }

            let radialScale = d3.scaleLinear()
                .domain([0,
                    interval[interval.length - 1]

                ])
                .range([0, height / 2]);

            let panel = svg.select("#radar_panel");
            let nums = svg.select("#radar_number");

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

            // Utility functions
            function angleToCoordinate(angle, value) {
                let x = Math.cos(angle) * radialScale(value);
                let y = Math.sin(angle) * radialScale(value);
                return { "x": width / 2 + x, "y": height / 2 - y };
            }

            // Draw data and axis
            const line = d3.line()
                .x(d => d.x)
                .y(d => d.y);

            const color = "orange"

            let axis = svg.select("#radar_axis");
            let legend_path_positions = []
            let positions = []      //Position array for data
            let line_coords = []
            let label_coords = []
            let label_names = []
            for (let i = 0; i < data.length; i++) {
                let angle = Math.PI / 2 + 2 * Math.PI * i / data.length
                label_names.push(data[i]["region"])
                line_coords.push(angleToCoordinate(angle, interval[interval.length - 1]));
                label_coords.push(angleToCoordinate(angle, interval[interval.length - 1] * 1.1));
                positions.push(angleToCoordinate(angle, data[i]["emission"] / data[i]["count"]))
                legend_path_positions.push(angleToCoordinate(angle, data[i]["emission"] / data[i]["count"]/5))
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

            // In addition we have to connect the head and tail of the path
            positions.push(positions[0])
            legend_path_positions.push(legend_path_positions[0])

            // Draw Radar Graph on the panel
            let radar_path = svg.select("#radar_path")
            radar_path.datum(positions)
            .transition()
                .attr("d", line)
                .attr("stroke-width", 3)
                .attr("stroke", color)
                .attr("fill", color)
                .attr("stroke-opacity", 1)
                .attr("fill-opacity", 0.5);
            
            // Add a legend
            const legend_coord = [0, 0]

            svg.select("#radar_legend_path")
                .datum(legend_path_positions)
                .attr("d", line)
                .attr("transform", `translate(${-width/2 + margin.left * 2}, ${-height/2-15})`)
                .attr("stroke-width", 3)
                .attr("stroke", color)
                .attr("fill", color)
                .attr("stroke-opacity", 1)
                .attr("fill-opacity", 0.5)
                ;

            svg.select("#radar_legend_text")
            .attr("text-anchor", "start")
                    .attr("x", 60)
                    .attr("y", 10-15)
                    .attr("font-weight", "bold")
                    .attr("font-size", "20px")
                    .text("Year " + this.curr_year)
        },
    }
}

// Utility functions
// Find closest integer to athat is divisble by b
// Answer is larger than a
function closest_divisble(a, b) {
    // get quotient
    let quotient = parseInt(a / b);

    // closest int 1
    let int1 = b * quotient + 1;

    // closest int 2
    let int2 = (a * b) > 0 ?
        (b * (quotient + 1)) : (b * (quotient - 1));

    // Return the larger one
    if (int1 > int2) {
        return int1;
    }
    return int2;
}

</script>


<style>

</style>