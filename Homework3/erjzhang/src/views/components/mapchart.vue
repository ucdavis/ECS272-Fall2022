<template>
    <div id="map" class="border mx-auto"></div>
</template>

<script>

import * as d3 from "d3";
import * as topojson from "topojson"
import getCountryISO3 from "country-iso-2-to-3"
import { set } from "vue-demi";

// Global Temp value
let selected_country_code = 'no country selected'

export default {
    name: 'MapChart',

    data() {
        return {
            selected_country_code: 'no country selected',
            log: 'this is a map chart',
        }
    },
    props: {
        myGeoData: Object,
        myMapChartData: Array,
        curr_year: Number,
        history_max: Number
    },
    mounted() {
        console.log("Mounted: My Main map data")
        // this.log = "whatever"
        this.initialize_map("#map")
        this.draw_map(this.myGeoData, this.myMapChartData, this.curr_year, "#map")

    },
    updated() {
        console.log("Updated: My Main map data")
        this.draw_map(this.myGeoData, this.myMapChartData, this.curr_year, "#map")
    },
    methods: {
        initialize_map(id) {
            d3.select(id)
                .append("div")
                .attr("id", "map_mouse_handler")

            let svg = d3.select(id).append("svg")
            svg.append("g").attr("id", "map_group");
            // svg.append("g").attr("id", "map_legend");

            // Add a legend
            const interval = []
            const legend_count = 6      // Last legend will be unknown data
            const legend_width = 10
            const legend_height = 10
            const legend_coord = [20, 220]
            const padding = 5
            svg.append("rect")
                .attr("id", "map_legend_box")
                .attr("x", legend_coord[0] - padding)
                .attr("y", legend_coord[1] - padding * 4)
                .attr("rx", 6)
                .attr("width", legend_width * 14)
                .attr("height", legend_height * 13)
                .attr("fill", "white")
                .attr("stroke", "black")
                .attr("stroke-width", "1")

            svg.append("g").attr("id", "map_legend")

            let legend = svg.select("#map_legend")
            for (let i = 0; i < legend_count + 1; i++) {
                interval.push(i)
            }

            const color = d3.interpolateHsl("#ffa366", "#000000")
            const unknown_color = "#949494"
            legend.selectAll("rect").data(interval)
                .join("rect")
                .attr('width', legend_width)
                .attr('height', legend_height)
                .style('fill', d => {
                    if (d == legend_count) {
                        return unknown_color
                    }
                    return color(d / (legend_count - 1))
                })
                .attr("x", legend_coord[0] + padding)
                .attr("y", d => (padding + legend_height) * d + legend_coord[1])

            legend.selectAll("text").data(interval)
                .join("text")
                .attr("x", legend_coord[0] + legend_width + padding * 2)
                .attr("y", d => (padding + legend_height) * d + legend_coord[1] + legend_height)
                .text(d => {
                    if (d == legend_count) {
                        return "Unknown"
                    }
                    return parseInt(this.history_max / (legend_count - 1) * d)
                })
            legend.append("text").attr("id", "map_legend_unit")
                .attr("x", legend_coord[0] + padding)
                .attr("y", legend_coord[1] - padding)
                .text("Unit: ton per capita")
                .attr("font-size", "13")
                .attr("font-weight", "bold")
        },
        draw_map(geoData, chartData, year, id) {
            const margin = { top: 20, right: 20, bottom: 20, left: 20 };
            const height = 500 * 0.65;
            const width = 960 * 0.65;

            const max_emission = this.history_max
            const unknown_color = "#949494"
            let svg = d3.select(id).select("svg")
                .attr("viewBox", [0, 0, width, height])
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)

            let g = svg.select("#map_group");

            // Let's have different color...
            const color = d3.interpolateHsl("#ffa366", "#000000")

            const countries = topojson.feature(geoData, geoData.objects.countries);

            // Use regular flat projection
            const projection = d3.geoMercator()
                .scale(100)
                .translate([width / 2, height / 1.5])

            const path = d3.geoPath(projection)

            const selection_width = "0.5%"
            const origin_width = "0.2%"
            const transition_duration = 100

            const map_mouse_handler = d3.select("#map_mouse_handler")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px")
            // Resource url
            // https://d3-graph-gallery.com/graph/choropleth_hover_effect.html
            let mouse_over = function (event, d) {
                let emission = "Unknown"
                let country_code = getCountryISO3(d.properties["countryCode"])
                if (country_code) {
                    let country = chartData.find(c => {
                        return c["country_code"] == country_code
                    })
                    if (country && country[year]) {
                        emission = parseFloat(country[year]).toFixed(3)
                    }
                }
                map_mouse_handler
                    .html(d.properties.name + ": " + emission)
                    .style("opacity", 1)

                g.selectAll("path")
                    .each(function () {
                        d3.select(this).transition()
                            .duration(transition_duration)
                            .style("opacity", () => {
                                if (this.id != "map_" + selected_country_code)
                                    return 0.4
                                else
                                    return 1.0
                            })
                            .style("stroke", () => {
                                if (this.id != "map_" + selected_country_code)
                                    return "transparent"
                                else
                                    return "green"
                            })
                    })
                if (this.id != "map_" + selected_country_code) {
                    // console.log("I'm not over selected country")
                    d3.select(this)
                        .transition()
                        .duration(transition_duration)
                        .style("opacity", 1)
                        .style("stroke-width", origin_width)
                        .style("stroke", "black")
                }
            }
            let mouse_move = function (event, d) {
                map_mouse_handler
                    // .style("transform", "translateX(150%)")
                    .style("left", (event.offsetX) + 50 + "px")
                    .style("top", (event.offsetY) + 400 + "px")
            }
            let mouse_leave = function (event, d) {
                map_mouse_handler
                    // .html("Emission: ")
                    .style("opacity", 0)
                
                g.selectAll("path")
                    .each(function () {
                        d3.select(this).transition()
                            .duration(transition_duration)
                            .style("opacity", 1)
                            .style("stroke-width", () => {
                                if (this.id != "map_" + selected_country_code)
                                    return origin_width
                                else
                                    return selection_width
                            })
                    })

                if (this.id != "map_" + selected_country_code) {
                    d3.select(this)
                        .transition()
                        .duration(transition_duration)
                        .style("stroke", "transparent")
                }
            }

            let set_country = () => {
                this.selected_country_code = selected_country_code
                this.$emit('country_picked', this.selected_country_code)
            }

            let mouse_click = function (event, d) {
                if (selected_country_code == getCountryISO3(d.properties.countryCode))
                    return

                    // console.log(d3.select(this).style('fill') )
                if (d3.select(this).style('fill') == "rgb(148, 148, 148)") {
                    console.log("Invalid target!")
                    return
                }
                g.select("#map_" + selected_country_code)
                    .transition()
                    .duration(transition_duration)
                    .style("stroke", "transparent")
                    .style("stroke-width", origin_width)
                    .style("opacity", "0.4")

                selected_country_code = getCountryISO3(d.properties.countryCode)
                set_country()

                d3.select(this).style("stroke", "green")
                    .style("stroke-width", selection_width)
                    .style("opacity", 1)

                const [[x0, y0], [x1, y1]] = path.bounds(d);
                event.stopPropagation();
                svg.transition().duration(750).call(
                    zoom.transform,
                    d3.zoomIdentity
                        .translate(width / 2, height / 2)
                        .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
                        .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
                    d3.pointer(event, svg.node())
                );
            }

            let set_color = (d, i) => {
                let country_code = getCountryISO3(d.properties["countryCode"])
                if (country_code) {
                    let country = chartData.find(c => {
                        return c["country_code"] == country_code
                    })
                    if (country && country[year]) {
                        return color(country[year] / max_emission)
                    }
                }

                return unknown_color // unknown data color
            }

            // Generate the map
            g.selectAll("path").data(countries.features)
                .join("path")
                .attr("class", "countries")
                .attr("d", path)
                .attr("id", d => "map_" + getCountryISO3(d.properties["countryCode"]))
                .on("mouseover", mouse_over)
                .on("mousemove", mouse_move)
                .on("click", mouse_click)
                .on("mouseleave", mouse_leave)
                .transition()
                .duration(500)
                .attr("fill", set_color)


            // Resource url
            let zoom = d3.zoom()
                .scaleExtent([1, 12])
                .on('zoom', (event) => {
                    d3.select("#map_group")
                        .attr('transform',
                            event.transform
                        );
                });


            let reset = (event, d) => {
                if (event.target.nodeName == "path") {
                    return
                }

                g.select("#map_" + selected_country_code)
                    .transition()
                    .duration(transition_duration)
                    .style("stroke", "transparent")
                    .style("stroke-width", origin_width)
                    .style("opacity", "1")

                selected_country_code = 'no country selected'
                set_country()

                svg.transition().duration(750).call(
                    zoom.transform,
                    d3.zoomIdentity,
                    d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
                );
            }
            svg.call(zoom);

            // Click to reset map
            svg.on("click", reset);
        },


    }
}

</script>


<style>

</style>