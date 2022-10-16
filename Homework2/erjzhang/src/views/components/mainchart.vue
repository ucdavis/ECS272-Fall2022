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
        },
        draw_map(geoData, chartData, year, id) {
            const margin = { top: 20, right: 20, bottom: 20, left: 20 };
            const height = 500 * 0.65;
            const width = 960 * 0.65;

            const max_emission = this.history_max

            let svg = d3.select(id).select("svg")
                .attr("viewBox", [0, 0, width, height])
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)


            let g = svg.select("#map_group");

            // Let's have different color...
            const color = d3.interpolateYlOrRd
            // d3.scaleLinear()
            //     .domain([0, max_emission])
            //     .range(["#ffddcc", "#993300"]);

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
                            return color(country[year] / max_emission * 2 / 3 + 1 / 3)
                        }
                    }

                    return "#949494" // unknown data color
                })
                .attr("class", "countries")
                .attr("d", path)
        },


    }
}

</script>


<style>

</style>