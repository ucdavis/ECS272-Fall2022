<template>
    <!-- <div id="main"></div> -->
    <div id="map" class="border mx-auto"></div>
</template>

<script>

import * as d3 from "d3";
import testData from "../../assets/data/test.json"; /* Example of reading in data direct from file*/
import * as topojson from "topojson"
import getCountryISO3 from "country-iso-2-to-3"

export default {
    name: 'MainChart',
    data() {
        return {
            name: 'Hello',
            someLocalValues: [1, 2, 3, 4, 5],

        }
    },
    props: {
        myGeoData: Object,
        myMainChartData: Array,
        curr_year: Number,
        history_max: Number
    },
    mounted() {
        // console.log(testData);
        // let localData = testData['data'];
        // this.drawMainChart(localData, "#main") /* Example of reading data from a json file */
        // this.drawMainChart(this.myGeoData, "#main")
        console.log("Mounted: My Main data: ")
        this.drawMap(this.myGeoData, this.myMainChartData, this.curr_year, "#map")

    },
    updated() {
        console.log("Updated: My Main data: ")
        this.updateMap(this.myGeoData, this.myMainChartData, this.curr_year, "#map")
    },
    methods: {
        updateMap(geoData, chartData, year, id) {
            // const margin = { top: 20, right: 20, bottom: 20, left: 20 };
            const height = 500 * 0.65;
            const width = 960 * 0.65;

            let svg = d3.select(id).select("svg")

            
            let g = svg.select("g");
            // Let's have different color...
            const color = d3.interpolateYlOrRd
            // d3.scaleLinear()
            //     .domain([0, 9])
            //     .range(["#ffddcc", "#993300"]);

            const countries = topojson.feature(geoData, geoData.objects.countries);


            // Use regular flat projection
            const projection = d3.geoMercator()
                .scale(100)
                .translate([width / 2, height / 1.5])

            const path = d3.geoPath(projection)

            const max_emission = d3.max(chartData, d => {
            if (d[year]) {
                return parseFloat(d[year])
            }
            return 0.0
        })

            console.log("Max emission:", max_emission)
            // console.log(countries.features)
            g.selectAll("path").data(countries.features)
                // .enter()
                // .append("path")
                .join("path")
                .attr("fill", (d, i) => {
                    let country_code = getCountryISO3(d.properties["countryCode"])
                    // console.log(country_code)
                    if (country_code) {
                        let country = chartData.find(c => {
                            // console.log("csv country code ", c["country_code"])
                            return c["country_code"] == country_code
                        })
                        // console.log(country)
                        if (country) {
                            return color((country[year] ? country[year] : 0) / max_emission)
                        }
                    }

                    return "#949494" // unknown data color
                })
                .attr("class", "countries")
                .attr("d", path)
            // })
        },
        drawMap(geoData, chartData, year, id) {
            const margin = { top: 20, right: 20, bottom: 20, left: 20 };
            const height = 500 * 0.65;
            const width = 960 * 0.65;

            let svg = d3.select(id).append("svg")
                .attr("viewBox", [0, 0, width, height])
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)


            let g = svg.append("g");
            // Let's have different color...
            const color = d3.interpolateYlOrRd
            // d3.scaleLinear()
            //     .domain([0, 9])
            //     .range(["#ffddcc", "#993300"]);

            const countries = topojson.feature(geoData, geoData.objects.countries);


            // Use regular flat projection
            const projection = d3.geoMercator()
                .scale(100)
                .translate([width / 2, height / 1.5])

            const path = d3.geoPath(projection)

            const max_emission = parseFloat(chartData[0][year])

            console.log("Max emission:", max_emission)

            g.selectAll("path").data(countries.features)
                .join("path")
                .attr("fill", (d, i) => {
                    let country_code = getCountryISO3(d.properties["countryCode"])
                    // console.log(country_code)
                    if (country_code) {
                        let country = chartData.find(c => {
                            // console.log("csv country code ", c["country_code"])
                            return c["country_code"] == country_code
                        })
                        // console.log(country)
                        if (country) {
                            return color((country[year] ? country[year] : 0) / max_emission)
                        }
                    }

                    // if (chartData)
                    return "#949494" // unknown data color
                })
                .attr("class", "countries")
                .attr("d", path)
            // })
        },

        // drawMainChart(data, id) {
        //     const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        //     const height = 300;
        //     const width = 500;

        //     const x = d3.scaleBand().domain(data.map(d => d.y))
        //         .rangeRound([margin.left, width - margin.right])
        //         .padding(0.1);

        //     const y = d3.scaleLinear().domain([0, d3.max(data, d => d.x)]).nice()
        //         .rangeRound([height - margin.bottom, margin.top]);

        //     let svg = d3.select(id).append("svg")
        //         .attr("viewBox", [0, 0, width, height])
        //         .attr("width", width + margin.left + margin.right)
        //         .attr("height", height + margin.top + margin.bottom);

        //     svg.selectAll("rect")
        //         .data(data)
        //         .join("rect")
        //         .attr("x", d => x(d.y))
        //         .attr("y", d => y(d.x))
        //         .attr("width", x.bandwidth())
        //         .attr("height", d => y(0) - y(d.x))
        //         .attr("fill", "orange");

        //     const xAxis = g => g
        //         .attr("transform", `translate(0,${height - margin.bottom})`)
        //         .call(d3.axisBottom(x))

        //     const yAxis = g => g
        //         .attr("transform", `translate(${margin.left},0)`)
        //         .call(d3.axisLeft(y))

        //     svg.append("g")
        //         .attr("class", "x axis")
        //         .attr("transform", "translate(0," + height + ")")
        //         .call(xAxis)
        //         .selectAll("text")
        //         .style("text-anchor", "end")
        //         .attr("dx", "-.8em")
        //         .attr("dy", ".15em")
        //         .attr("transform", "rotate(-65)")
        //         .attr("font-weight", "bold");

        //     svg.append("g")
        //         .call(yAxis)
        //         .call(g => g.select(".tick:last-of-type text")
        //             .clone()
        //             .attr("transform", `rotate(-90)`)
        //             .attr("text-anchor", "middle")
        //             .attr("x", -(15 - margin.top - margin.bottom) / 2)
        //             .attr("y", -80)
        //             .attr("font-weight", "bold"))
        // },
    }
}

</script>


<style>

</style>