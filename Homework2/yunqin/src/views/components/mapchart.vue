<template>
    <div class="mapChartContainer">
        <div class="optionBar">
            <label>Select Year: </label>
            <a-select v-model:value="year" style="width: 100px" @change="drawMap">
                <a-select-option :value="item" v-for="item in year_list">
                    {{item}}
                </a-select-option>
            </a-select>
        </div>
        <div id="mapWrapper" class="mapChart">
            <svg id="map" :height="height" :width="width"></svg>
        </div>
    </div>
</template>

<script>
    import * as d3 from "d3";
    import {legendColor} from "d3-svg-legend";
    import WorldjsonPath from "../../assets/data/world.json";

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
                const margin = { top: 20, right: 40, bottom: 20, left: 0 };
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
                    .style("font-size","15px")
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

            drawMap(data) {
                data = this.myMapChartData;
                let svg = d3.select("#mapGroup")
                let vueThis = this;

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
                }) 
            }          
        }
    }

</script>


<style scoped>
    .mapChartContainer{
        height: 95%;
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
</style>