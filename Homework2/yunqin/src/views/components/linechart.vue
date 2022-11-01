<template>
    <div class="lineChartContainer">
        <div class="optionBar">
            <label>Top 10 Countries: </label>
            <a-select v-model:value="country" style="width: 170px" @change="drawLine">
                <a-select-option :value="item" v-for="item in country_list">
                    {{item}}
                </a-select-option>
            </a-select>
        </div>
        <div id="lineWrapper" class="lineChart">
            <svg id="line" :height="height" :width="width"></svg>
        </div>
    </div>
</template>

<script>
    import * as d3 from "d3";

    export default {
        name: 'LineChart',
        data() {
            return {
                country: 'Australia',
                country_list: ["Australia", "Bahrain", "Brunei Darussalam", "Canada", "Kuwait", 
                                "Luxembourg", "Qatar", "Saudi Arabia",
                                "United Arab Emirates", "United States"],
                localData: [],
                tooltip: null,
                margin: {},
                width: 500,
                height: 500,
            }
        },
        props:{
            myLineChartData: Array,
        },
        mounted(){
            console.log("Data Passed down as a Prop  ", this.myLineChartData);
            this.localData = this.convertDataFormat(this.myLineChartData, this.country);
            this.init('#line');
            this.drawLine();
        },
        methods: {
            convertDataFormat(d, country_name){
                var new_data = [];
                for (var i = 0; i < d.length; i++){
                    new_data.push({date: d[i].year, value: d[i][country_name]});
                }
                return new_data
            },

            init(id){
                this.margin = { top: 10, right: 20, bottom: 40, left: 20 };
                this.width = document.getElementById("lineWrapper").clientWidth ;
                this.height = document.getElementById("lineWrapper").clientHeight;

                let svg = d3.select(id);
                svg.append("path").attr("id", "lineGroup");
                svg.append("g").attr("id", "lineXAxisGroup");
                svg.append("g").attr("id", "lineYAxisGroup");
                svg.append("g").attr("id", "circleGroup");
                
                this.tooltip = d3.select("#lineWrapper").append("div")
                    .style("opacity", 0)
                    .attr("class", "tooltip")
                    .style("background-color", "white")
                    .style("border", "solid")
                    .style("border-width", "1px")
                    .style("border-radius", "5px")
                    .style("width", "fit-content")
                    .style("padding", "4px")
                    .style("position", "relative")
            },

            drawLine() {
                this.localData = this.convertDataFormat(this.myLineChartData, this.country);
                let data = this.localData;
                let vueThis = this;

                let x_axis = d3.scalePoint()
                    .domain(["1990","1991","1992","1993","1994",
                             "1995","1996","1997","1998","1999",
                             "2000","2001","2002","2003","2004",
                             "2005","2006","2007","2008","2009",
                             "2010","2011","2012","2013","2014",
                             "2015","2016","2017","2018","2019"])
                    // .domain(d3.extent(data, function(d){ return d.date;}))
                    .range([this.margin.left, this.width - this.margin.right]);
                let y_axis = d3.scaleLinear()
                    .domain( [0, Math.ceil(d3.max(data, function(d){ return d.value;})/5)*5])
                    .range([ this.height - this.margin.bottom, this.margin.top ]);

                let line = d3.line()
                    .x(d => x_axis(d.date))
                    .y(d => y_axis(d.value));

                d3.select("#lineGroup")
                    .datum(data)
                    .attr("d", line)
                    .attr("fill", "none")
                    .attr("stroke", "steelblue")
                    .attr("stroke-width", 1.5)
                    .style("stroke-miterlimit", 1);

                d3.select("#lineXAxisGroup")
                    .attr("class", "x-axis")
                    .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
                    .call(d3.axisBottom(x_axis))
                    .selectAll("text")
                    .attr("transform", "rotate(-45)")
                    .style("text-anchor", "end")
                    .style("font-size", 12)
                    .style("fill", "black");

                d3.select("#lineYAxisGroup")
                    .attr("class", "y-axis")
                    .attr("transform", `translate(${this.margin.left},0)`)
                    .call(d3.axisLeft(y_axis).ticks(5));
                
                let mouseOver = function(d){
                        d3.select(this)
                            .transition()
                            .duration(200)
                            .style("opacity", 1)
                            .style("stroke", "black")
                            .style("stroke-width", 4)
                        vueThis.tooltip.style("opacity", 1)
                            .html("CO2 emission at "+d.date +"<br>is "+d3.format(",.2f")(d.value)+" tons per capita")
                            .style("left", (d3.mouse(this)[0] -120) + "px")
                            .style("top", (d3.mouse(this)[1] - 200) + "px")
                }

                let mouseLeave = function(d){
                    vueThis.tooltip.style("opacity", 0)
                    d3.selectAll("circle")
                        .transition()
                        .duration(200)
                        .style("opacity", 0.9)
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .style("stroke", "none")
                }

                // Initialize dots with group a
                d3.select("#circleGroup")
                    .selectAll('circle')
                    .data(data)
                    .join(
                        enter => {enter.append("circle")
                                        .attr("cx", function(d) { return x_axis(+d.date) })
                                        .attr("cy", function(d) { return y_axis(+d.value) })
                                        .attr("r", 4)
                                        .attr("fill", "#1962a0")
                                        .on("mouseover", mouseOver)
                                        .on("mouseleave", mouseLeave)},
                        update => {update.attr("cx", function(d) { return x_axis(+d.date) })
                                        .attr("cy", function(d) { return y_axis(+d.value) })},
                        exit => exit.remove()
                    );                    
            },
        }
    }

</script>


<style scoped>
    .lineChartContainer{
        height: 88%;
        background-color: #ffffff;
    }
    .lineChart{
        height: 88%;
        font-size: 15px;
        background-color: #ffffff;
    }
    .optionBar{
        height: 12%;
        font-size: 16px;
        font-weight: 500;
        background-color: #ffffff;
    }
</style>