<template>
    <div class="mapChartContainer">
        <div class="optionBar">
            <label>Select Year: </label>
            <a-select v-model:value="year" style="width: 100px" @change="drawMap">
                <a-select-option :value="item" v-for="item in year_list">
                    {{item}}
                </a-select-option>
            </a-select>
            <button class="resetBtn" type="button" @click="drawMap">Reset</button>
        </div>
        <div id="mapWrapper" class="mapChart">
            <svg id="map" :height="height" :width="width"></svg>
        </div>
    </div>
</template>

<script>
    import * as d3 from "d3";
    import {legendColor} from "d3-svg-legend";

    export default {
        name: 'MapChart',
        data() {
            return {
                worldMapData: d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
                year: '1990',
                year_list: ["1990","1991","1992","1993","1994",
                             "1995","1996","1997","1998","1999",
                             "2000","2001","2002","2003","2004",
                             "2005","2006","2007","2008","2009",
                             "2010","2011","2012","2013","2014",
                             "2015","2016","2017","2018","2019"],
                labels: ['0', '~ 2', '~ 5', '~ 10', '~ 20', '~ 30', '> 30'],
                color_threshold: [0.00000001, 2, 5, 10, 20, 30],
                color: null,
                path: null,
                tooltip: null,
                minZoom: 0,
                maxZoom: 0,
                width: 500,
                height: 500,  
            }
        },
        props:{
            myMapChartData: Array,
        },
        mounted(){
            console.log("This is world map: ", this.worldMapData);
            console.log("Data Passed down as a Prop  ", this.myMapChartData);
            this.init('#map');
            this.drawMap();
        },
        methods: {
            init(id){
                const margin = { top: 20, right: 20, bottom: 20, left: 0 };
                this.width = document.getElementById("mapWrapper").clientWidth - margin.left - margin.right;
                this.height = document.getElementById("mapWrapper").clientHeight - margin.top - margin.bottom;
                var colorScheme = d3.schemeReds[this.color_threshold.length];
                colorScheme.unshift('#eee')
                this.color = d3.scaleThreshold()
                    .domain(this.color_threshold)
                    .range(colorScheme);
                let projection = d3.geoMercator()
                    .scale(this.width/ 2 / Math.PI)
                    .translate([this.width / 2.1, this.height / 1.3]);
                this.path = d3.geoPath()
                    .projection(projection);

                let svg = d3.select(id);
                svg.append("g").attr("id", "mapGroup")
                svg.append("g").attr("id", "mapLegendGroup")
                    .attr("class", "legendThreshold")
                    .attr("transform", `translate(10,${margin.top + 15})`)
                    .append("text")
                    .attr("class", "caption")
                    .attr("x", 0)
                    .attr("y", -6)
                    .style("font-size","16px")
                    .text("CO2 Emission (Tons Per Capita)");
                
                this.tooltip = d3.select("#mapWrapper").append("div")
                    .style("opacity", 0)
                    .attr("class", "tooltip")
                    .style("background-color", "white")
                    .style("border", "solid")
                    .style("border-width", "1px")
                    .style("border-radius", "5px")
                    .style("width", "fit-content")
                    .style("padding", "4px")
                    .style("position", "absolute")
            },

            drawMap() {
                let data = this.myMapChartData;
                let vueThis = this;
                let svg = d3.select("#mapGroup");

                function zoomed() {
                    let t = d3.event.transform;
                    svg.attr("transform","translate(" + [t.x, t.y] + ")scale(" + t.k + ")");
                }

                let zoom = d3.zoom().on("zoom", zoomed);
                d3.select("#map").call(zoom);

                let legend = legendColor()
                    .labels(function (d) { return vueThis.labels[d.i]; })
                    .shapePadding(0)
                    .orient('horizontal')
                    .shapeWidth(60)
                    .scale(vueThis.color);

                d3.select(".legendThreshold")
                    .call(legend);

                function getCol(matrix, col){
                    var column = [];
                    for(var i = 0; i < matrix.length; i++){
                        column.push(matrix[i][col]);
                    }
                    return column
                }

                let country_code_list = getCol(data, "country_code");

                function initZoom() {
                    // Define a "minzoom" whereby the "Countries" is as small possible without leaving white space at top/bottom or sides
                    vueThis.minZoom = Math.max(document.getElementById("mapWrapper").clientWidth / vueThis.width, document.getElementById("mapWrapper").clientHeight / vueThis.height);;
                    // set max zoom to a suitable factor of this value
                    vueThis.maxZoom = 10 * vueThis.minZoom;
                    // set extent of zoom to chosen values
                    // set translate extent so that panning can't cause map to move out of viewport
                    zoom
                    .scaleExtent([vueThis.minZoom, vueThis.maxZoom])
                    .translateExtent([[0, 0], [vueThis.width, vueThis.height]])
                    ;
                    // define X and Y offset for centre of map to be shown in centre of holder
                    let midX = (document.getElementById("mapWrapper").clientWidth - vueThis.minZoom * vueThis.width) / 2;
                    let midY = (document.getElementById("mapWrapper").clientHeight - vueThis.minZoom * vueThis.height) / 2;
                    // change zoom transform to min zoom and centre offsets
                    svg.call(zoom.transform, d3.zoomIdentity.translate(midX, midY).scale(vueThis.minZoom));
                }

                 // zoom to show a bounding box, with optional additional padding as percentage of box size
                function boxZoom(box, centroid, paddingPerc) {
                    let minXY = box[0];
                    let maxXY = box[1];
                    // find size of map area defined
                    let zoomWidth = Math.abs(minXY[0] - maxXY[0]);
                    let zoomHeight = Math.abs(minXY[1] - maxXY[1]);
                    // find midpoint of map area defined
                    let zoomMidX = centroid[0];
                    let zoomMidY = centroid[1];
                    // increase map area to include padding
                    zoomWidth = zoomWidth * (1 + paddingPerc / 100);
                    zoomHeight = zoomHeight * (1 + paddingPerc / 100);
                    // find scale required for area to fill svg
                    let maxXscale = document.getElementById("map").clientWidth / zoomWidth;
                    let maxYscale = document.getElementById("map").clientHeight / zoomHeight;
                    let zoomScale = Math.min(maxXscale, maxYscale);
                    // handle some edge cases
                    // limit to max zoom (handles tiny countries)
                    zoomScale = Math.min(zoomScale, vueThis.maxZoom);
                    // limit to min zoom (handles large countries and countries that span the date line)
                    zoomScale = Math.max(zoomScale, vueThis.minZoom);
                    // Find screen pixel equivalent once scaled
                    let offsetX = zoomScale * zoomMidX;
                    let offsetY = zoomScale * zoomMidY;
                    // Find offset to centre, making sure no gap at left or top of holder
                    let dleft = Math.min(0, document.getElementById("map").clientWidth / 2 - offsetX);
                    let dtop = Math.min(0, document.getElementById("map").clientHeight / 2 - offsetY);
                    // Make sure no gap at bottom or right of holder
                    dleft = Math.max(document.getElementById("map").clientWidth - vueThis.width * zoomScale, dleft);
                    dtop = Math.max(document.getElementById("map").clientHeight - vueThis.height * zoomScale, dtop);
                    // set zoom
                    svg
                    .transition()
                    .duration(500)
                    .call(
                        zoom.transform,
                        d3.zoomIdentity.translate(dleft, dtop).scale(zoomScale)
                    );
                }


                Promise.all([this.worldMapData, data])
                    .then(function(loadData){
                    let topo = loadData[0];
                    let mouseOver = function(d){
                        // d3.selectAll(".Country")
                        //     .transition()
                        //     .duration(200)
                        //     .style("opacity", .5)
                        d3.select(this)
                            .transition()
                            .duration(200)
                            .style("opacity", 1)
                            .style("stroke", "black")
                        vueThis.tooltip.style("opacity", 1)
                            .html("CO2 emission for "+d.country_name +"<br>is "+d3.format(",.2f")(d.value)+" tons per capita")
                            .style("left", (d3.mouse(this)[0]) + "px")
                            .style("top", (d3.mouse(this)[1]) + "px")
                    }

                    let mouseLeave = function(d){
                        vueThis.tooltip.style("opacity", 0)
                        d3.selectAll(".Country")
                            .transition()
                            .duration(200)
                            .style("opacity", 0.9)
                        d3.select(this)
                            .transition()
                            .duration(200)
                            .style("stroke", "none")
                    }

                    let getValue = function(code, year){
                        let idx = country_code_list.indexOf(code);
                        if (idx == -1){
                            return 0
                        }
                        else{ return data[idx][year] }
                    }

                    let getCountry = function(code){
                        let idx = country_code_list.indexOf(code);
                        if (idx == -1){
                            return 0
                        }
                        else{ return data[idx]["Country Name"] }
                    }

                    //draw map
                    svg.selectAll("path")
                    .data(topo.features)
                    .join("path")
                    // draw each country
                    .attr("d", vueThis.path)
                    // set the color of each country
                    .attr("fill", function(d){
                        d.value = getValue(d.id, vueThis.year);
                        d.country_name = getCountry(d.id);
                        return vueThis.color(d.value);
                    })
                    .style("stroke", "transparent")
                    .attr("class", function(d){return "Country"})
                    .style("opacity", 0.9)
                    .on("mouseover", mouseOver)
                    .on("mouseleave", mouseLeave)
                    .on("click", function(d, i) {
                        d3.selectAll(".Country").classed("country-on", false);
                        d3.select(this).classed("country-on", true);
                        boxZoom(vueThis.path.bounds(d), vueThis.path.centroid(d), 20);
                        vueThis.$emit("clicked", d);
                    });
                    initZoom();
                });
            }          
        }
    }

</script>


<style scoped>
    .mapChartContainer{
        height: 94%;
        background-color: #ffffff;
    }
    .mapChart{
        height: 95%;
        font-size: 15px;
        background-color: #ffffff;
    }
    .optionBar{
        height: 5%;
        font-size: 16px;
        font-weight: 500;
        background-color: #ffffff;
    }
    .country-on{
        fill: #97af2c;
      }
</style>