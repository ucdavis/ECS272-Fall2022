<template>
    <div id="map"></div>
</template>

<script>
    import * as d3 from "d3";
    import {legendColor} from "d3-svg-legend";
    import mapData from "../../assets/data/map_data.csv";

    export default {
        name: 'Map',
        data() {
            return {
                name: 'Hello',
                someLocalValues: [1, 2, 3, 4, 5],

            }
        },
        props:{
            myMapData: Array,
        },
        mounted(){
            console.log(mapData);
            this.drawMap(mapData, '#map')
            console.log("Data Passed down as a Prop  ", this.myMapData)
        },
        methods: {
            drawMap(data, id) {

                const margin = { top: 0, right: 0, bottom: 0, left: 0 };
                const height = 550;
                const width = 600;

                var svg = d3.select(id).append("svg")
                    .attr("viewBox", [0, 0, width, height])
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);

                var path = d3.geoPath();
                var projection = d3.geoMercator()
                    .scale(width/ 2 / Math.PI)
                    .translate([width / 2, height / 1.3]);
                var path = d3.geoPath().projection(projection);
                
                var ex_data = d3.map();
                var country_data = d3.map();
                var colorScheme = d3.schemeReds[7];
                colorScheme.unshift('#eee')
                var colorScale = d3.scaleThreshold()
                    .domain([0.1, 0.2, 0.4, 0.8, 1.2, 1.6, 2.0])
                    .range(colorScheme);
                
                var g = svg.append("g")
                        .attr("class", "legendThreshold")
                        .attr("transform", "translate(20,20)")
                g.append("text")
                    .attr("class", "caption")
                    .attr("x", 0)
                    .attr("y", -6)
                    .style("font-size","15px")
                    .text("CO2 Emission Percentage (1990 ~ 2019)");
                
                var labels = ['0 ~ 0.1%', '~ 0.2%', '~ 0.4%', '~ 0.8%', '~ 1.2%', '~ 1.6%', '~ 2.0%', '>2.0%'];
                var legend = legendColor()
                    .labels(function (d) { return labels[d.i]; })
                    .shapePadding(0)
                    .orient('horizontal')
                    .shapeWidth(60)
                    .scale(colorScale);

                svg.select(".legendThreshold")
                    .call(legend);

                var tooltip = d3.select(id).append("div")
                    .style("opacity", 0)
                    .attr("class", "tooltip")
                
                Promise.all([
                    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
                    d3.csv(data, function(d){
                        ex_data.set(d.country_code, +d.percentage);
                        country_data.set(d.country_code, d.country_name)})
                        ]).then(function(loadData){
                        var topo = loadData[0]
                        let mouseOver = function(d){
                            tooltip.style("opacity", 1)
                            d3.selectAll(".Country")
                                .transition()
                                .duration(200)
                                .style("opacity", .5)
                            d3.select(this)
                                .transition()
                                .duration(200)
                                .style("opacity", 1)
                                // .style("stroke", "black")
                        }

                        let mouseMove = function(d){
                            tooltip
                                .html("CO2 emission percentage of the whole world (1990 ~ 2019) for "+d.country_name +" is "+d3.format(",.2f")(d.total)+"%")
                                .style("left", (d3.mouse(this)[0]+70) + "px")
                                .style("top", (d3.mouse(this)[1]) + "px")
                        }

                        let mouseLeave = function(d){
                            tooltip.style("opacity", 0)
                            d3.selectAll(".Country")
                                .transition()
                                .duration(200)
                                .style("opacity", .8)
                            d3.select(this)
                                .transition()
                                .duration(200)
                                // .style("stroke", "transparent")
                        }

                        svg.append("g")
                        .selectAll("path")
                        .data(topo.features)
                        .join("path")
                        // draw each country
                        .attr("d", d3.geoPath()
                            .projection(projection)
                        )
                        // set the color of each country
                        .attr("fill", function(d){
                            d.total = (ex_data.get(d.id)||0);
                            d.country_name = country_data.get(d.id);
                            return colorScale(d.total);
                        })
                        .style("stroke", "transparent")
                        .attr("class", function(d){return "Country"})
                        .style("opacity", .8)
                        .on("mouseover", mouseOver)
                        .on("mouseleave", mouseLeave)
                        .on("mousemove", mouseMove)
                })

            }           
        }
    }

</script>


<style>

</style>