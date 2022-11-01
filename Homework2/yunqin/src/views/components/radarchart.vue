<template>
    <div class="radarChartContainer">
        <div class="optionBar">
            <label>Region 1: </label>
            <a-select v-model:value="region1" style="width: 230px" @change="drawRadar">
                <a-select-option :value="item" v-for="item in region_list">
                    {{item}}
                </a-select-option>
            </a-select>
            <label>Region 2: </label>
            <a-select v-model:value="region2" style="width: 230px" @change="drawRadar">
                <a-select-option :value="item" v-for="item in region_list">
                    {{item}}
                </a-select-option>
            </a-select>
        </div>
        <div id="radarWrapper" class="radarChart">
            <svg id="radar" :height="height" :width="width"></svg>
        </div>
    </div>
</template>

<script>
    import * as d3 from "d3";

    export default {
        name: 'RadarChart',
        data() {
            return {
                region1: 'Europe & Central Asia',
                region2: 'East Asia & Pacific',
                region_list: ['East Asia & Pacific', 'Europe & Central Asia', 'Latin America & Caribbean', 
                              'Middle East & North Africa', 'North America', 'South Asia', 'Sub-Saharan Africa'],
                features: ["1990~1994", "1995~1999", "2000~2004", "2005~2009", "2010~2014", "2015~2019"],
                margin: {},
                width: 500,
                height: 500,
            }
        },
        props: {
            myRadarChartData: Array,
        },
        mounted() {
            console.log("Data Passed down as a Prop  ", this.myRadarChartData);
            this.init("#radar");
            this.drawRadar();
        },
        methods: {
            init(id) {
                this.margin = { top: 10, right: 0, bottom: 42, left: 0 };
                this.width = document.getElementById("radarWrapper").clientWidth;
                this.height = document.getElementById("radarWrapper").clientHeight;


                let svg = d3.select(id);
                svg.append("g").attr("id", "radarPanel");
                svg.append("g").attr("id", "radarNumber");
                svg.append("g").attr("id", "radarAxis");
                svg.append("circle").attr("id", "radarCir1");
                svg.append("circle").attr("id", "radarCir2");
                svg.append("text").attr("id", "radarLabel1");
                svg.append("text").attr("id", "radarLabel2");
                svg.append("path").attr("id", "radarPath1");
                svg.append("path").attr("id", "radarPath2");
            },

            drawRadar() {
                let data = this.myRadarChartData;
                let vueThis = this;
                let interval = getinterval(this.region1, this.region2);
                let features = this.features;
                let radialScale = d3.scaleLinear()
                                    .domain([0, interval[interval.length - 1]])
                                    .range([0, (this.height - this.margin.top - this.margin.bottom) / 2]);
                
                function getinterval(name1, name2){
                    let interval = [];
                    if (name1 == "South Asia" || name2 == "South Asia"){
                        interval = [0, 15, 30, 45, 60];
                    };
                    if (name1 == "North America" || name2 == "North America"){
                        interval = [0, 50, 100, 150, 200];
                    };
                    if (name1 == "Sub-Saharan Africa" || name2 == "Sub-Saharan Africa"){
                        interval = [0, 60, 120, 180, 240];
                    };
                    if (name1 == "Latin America & Caribbean" || name2 == "Latin America & Caribbean"){
                        interval = [0, 150, 300, 450, 600];
                    };
                    if (name1 == "East Asia & Pacific" || name2 == "East Asia & Pacific"){
                        interval = [0, 200, 400, 600, 800];
                    };
                    if (name1 == "Middle East & North Africa" || name2 == "Middle East & North Africa"){
                        interval = [0, 300, 600, 900, 1200];
                    };
                    if (name1 == "Europe & Central Asia" || name2 == "Europe & Central Asia"){
                        interval = [0, 500, 1000, 1500, 2000];
                    };
                    return interval;
                }

                function getidx(array, name){
                    for(var i = 0; i < array.length; i++){
                        if (name == array[i]["region"]){
                            return i
                        }
                    }
                    return None
                }

                let region1_idx = getidx(data, this.region1);
                let region2_idx = getidx(data, this.region2);

                d3.select("#radarPanel")
                    .selectAll("circle")
                    .data(interval)
                    .join("circle")
                    .attr("cx", this.width / 2)
                    .attr("cy", this.height / 2 + this.margin.top)
                    .attr("fill", "none")
                    .attr("stroke", "#808080")
                    .attr("r", d => radialScale(d));

                d3.select("#radarNumber")
                    .selectAll("text")
                    .data(interval)
                    .join("text")
                    .attr("x", this.width / 2 + 2)
                    .attr("y", d => {
                        return this.height / 2 + this.margin.top - radialScale(d) - 3
                    })
                    .text(d => {
                        if (d == interval[interval.length - 1]) {
                            return d.toString() + " tons per capita"
                        } else {
                            return d.toString()
                        }
                    })
                    .style("font-size", "11px")
                    .style("font-weight", "800")
                    .style("fill", "#bb0505");

                function angleToCoordinate(angle, value) {
                    let x = Math.cos(angle) * radialScale(value);
                    let y = Math.sin(angle) * radialScale(value);
                    return { "x": vueThis.width / 2 + x, "y": vueThis.height / 2 + vueThis.margin.top - y };
                }

                let line = d3.line()
                    .x(d => d.x)
                    .y(d => d.y);
                let line_coords = [];
                let label_coords = [];
                let label_names = [];
                let region1_coords = [];
                let region2_coords = [];
                let attrs = ["1", "2", "3", "4", "5", "6"];
                let colors = ["darkorange", "steelblue"];
                for (let i = 0; i < features.length; i++) {
                    let angle = Math.PI / 2 + 2 * Math.PI * i / features.length;
                    label_names.push(features[i]);
                    line_coords.push(angleToCoordinate(angle, interval[interval.length - 1]));
                    label_coords.push(angleToCoordinate(angle, interval[interval.length - 1] * 1.15)); 
                    region1_coords.push(angleToCoordinate(angle, data[region1_idx][attrs[i]]));
                    region2_coords.push(angleToCoordinate(angle, data[region2_idx][attrs[i]]));         
                };

                d3.select("#radarAxis")
                    .selectAll("line")
                    .data(line_coords)
                    .join("line")
                    .attr("x1", this.width / 2)
                    .attr("y1", this.height / 2 + this.margin.top)
                    .attr("x2", d => d.x)
                    .attr("y2", d => d.y)
                    .attr("stroke", "black");
                    
                d3.select("#radarAxis")    
                    .selectAll("text")
                    .data(label_coords)
                    .join("text")
                    .attr("x", d => d.x)
                    .attr("y", d => d.y)
                    .attr("class", "radarlabels")
                    .attr("text-anchor", d => {
                        if (d.x > this.width / 2) {
                            return "start"
                        } else if (d.x < this.width / 2) {
                            return "end"
                        }
                        return "middle"
                    })
                    .text((d, i) => {
                        return label_names[i]
                    })
                    .style("font-weight", "500");

                region1_coords.push(region1_coords[0]);
                region2_coords.push(region2_coords[0]);
    
                d3.select("#radarPath1")
                    .datum(region1_coords)
                    .attr("d", line)
                    .attr("stroke-width", 3)
                    .attr("stroke", colors[0])
                    .attr("fill", colors[0])
                    .attr("stroke-opacity", 1)
                    .attr("fill-opacity", 0.5);

                d3.select("#radarPath2")
                    .datum(region2_coords)
                    .attr("d", line)
                    .attr("stroke-width", 3)
                    .attr("stroke", colors[1])
                    .attr("fill", colors[1])
                    .attr("stroke-opacity", 1)
                    .attr("fill-opacity", 0.5);

                d3.select("#radarCir1")
                    .attr("cx", this.width - 200)
                    .attr("cy", this.height - 35)
                    .attr("r", 7)
                    .style("fill", colors[0]);

                d3.select("#radarCir2")
                    .attr("cx", this.width - 200)
                    .attr("cy", this.height - 10)
                    .attr("r", 7)
                    .style("fill", colors[1]);

                d3.select("#radarLabel1")
                    .attr("x", this.width - 191)
                    .attr("y", this.height - 35)
                    .text(this.region1)
                    .attr("text-anchor", "left")
                    .style("fill", colors[0])
                    .style("alignment-baseline", "middle");

                d3.select("#radarLabel2")
                    .attr("x", this.width - 191)
                    .attr("y", this.height - 10)
                    .text(this.region2)
                    .attr("text-anchor", "left")
                    .style("fill", colors[1])
                    .style("alignment-baseline", "middle");
            },
        }
    }
</script>


<style scoped>
    .radarChartContainer{
        height: 88%;
        background-color: #ffffff;
    }
    .radarChart{
        height: 89%;
        font-size: 15px;
        background-color: #ffffff;
    }
    .optionBar{
        height: 11%;
        width: 100%;
        font-size: 16px;
        font-weight: 500;
        background-color: #ffffff;
        display: flex;
        justify-content: space-between;
    }
</style>