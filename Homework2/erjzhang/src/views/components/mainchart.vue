<template>
    <div id="map" class="border mx-auto"></div>
</template>

<script>

import * as d3 from "d3";
import * as topojson from "topojson"
import getCountryISO3 from "country-iso-2-to-3"

export default {
    name: 'MainChart',
    data() {
        return {
            name: 'Hello',
        }
    },
    props: {
        myGeoData: Object,
        myMainChartData: Array,
        curr_year: Number,
        history_max: Number
    },
    mounted() {
        console.log("Mounted: My Main map data")
        this.initialize_map("#map")
        this.draw_map(this.myGeoData, this.myMainChartData, this.curr_year, "#map")

    },
    updated() {
        console.log("Updated: My Main map data")
        this.draw_map(this.myGeoData, this.myMainChartData, this.curr_year, "#map")
    },
    methods: {
        initialize_map(id) {
            let svg = d3.select(id).append("svg")
            svg.append("g").attr("id", "map_group");
            svg.append("g").attr("id", "map_legend");

            // Add a legend
            svg.append("g").attr("id", "map_legend")
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

            // const color = (d) => {
            //     let c = d3.scaleLinear().domain([0, 1]).range(["#ffd1b3","#4d1f00"])
            //     return d3.color(c(d)).formatHex()
            // };
            //     console.log(color(23.5))

            const countries = topojson.feature(geoData, geoData.objects.countries);


            // Use regular flat projection
            const projection = d3.geoMercator()
                .scale(100)
                .translate([width / 2, height / 1.5])

            const path = d3.geoPath(projection)

            // console.log("Max emission:", max_emission)

            g.selectAll("path").data(countries.features)
                .join("path")
                .attr("fill", (d, i) => {
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
                })
                .attr("class", "countries")
                .attr("d", path)
            let legend = svg.select("#map_legend")

            const interval = []
            const legend_count = 6      // Last legend will be unknown data
            const legend_width = 10
            const legend_height = 10
            const legend_coord = [25, 220]
            const padding = 5
            for (let i = 0; i < legend_count + 1; i++) {
                interval.push(i)
            }
            
            legend.selectAll("rect").data(interval)
                .join("rect")
                .attr('width', legend_width)
                .attr('height', legend_height)
                .style('fill', d => {
                    if (d == legend_count) {
                        return unknown_color
                    }
                    return color(d / (legend_count-1))
                })
                .attr("x", legend_coord[0])
                .attr("y", d => (padding + legend_height) * d + legend_coord[1])

            legend.selectAll("text").data(interval)
                .join("text")
                .attr("x", legend_coord[0] + legend_width + padding)
                .attr("y", d => (padding + legend_height) * d + legend_coord[1] + legend_height)
                .text(d => {
                    if (d == legend_count) {
                        return "Unknown"
                    }
                    return max_emission / (legend_count-1) * d
                })
            legend.append("text").attr("id", "map_legend_unit")
                .attr("x", legend_coord[0] )
                .attr("y", legend_coord[1] - padding)
                .text("Unit: ton per capita")
                .attr("font-weight", "bold")
        },


    }
}

</script>


<style>

</style>