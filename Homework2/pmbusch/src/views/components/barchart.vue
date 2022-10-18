<template>
    <div id="bar"></div>
</template>

<script>
    import * as d3 from "d3";
    import fireData from "../../assets/data/fire_bar.json"; /* Example of reading in data direct from file*/
    // import fireDataSeason from "../../assets/data/fire_bar_season.json";

    export default {
        name: 'BarChart',
        data() {
            return {
                //name: 'Hello',
                //someLocalValues: [1, 2, 3, 4, 5],

            }
        },
        props:{
            myBarchartData: Array,
        },
        mounted(){
            console.log(fireData);
            let localData = fireData['data'];
            this.drawBarChart(localData, "#bar") /* Example of reading data from a json file */
            // this.drawBarChart(this.myBarchartData, "#bar")
            console.log("Data Passed down as a Prop  ", this.myBarchartData)
        },
        methods: {
            drawBarChart(data, id) {
                
                const margin = { top: 20, right: 50, bottom: 60, left: 210 };
                const width = 800-margin.left-margin.right;
                const height = 300-margin.top-margin.bottom;
                
                let svg = d3.select(id).append("svg")
                    .attr("viewBox", [0, 0,  width + margin.left + margin.right, height + margin.top + margin.bottom])
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

                var x = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d.fire_Totalsize)]).nice()
                    .range([0,width]);
                
                svg.append("g")
                    .attr("id","xAxisBarNumber")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x))
                    .selectAll("text")
                    .attr("transform", "translate(-10,0)rotate(-45)")
                    .style("text-anchor", "end")
                    .style("font-size", "15px")
                  
                //Create X axis label   
                svg.append("text")
                    .attr("id","xAxisBar")
                    .attr("x",-margin.left/2 )
                    .attr("y",  height + margin.bottom/4*3)
                    .style("text-anchor", "middle")
                    .style("font-size", "15px")
                    .text("Avg Acres burned per fire event");

                const y = d3.scaleBand()
                    .domain(data.map(d => d.STAT_CAUSE))
                    .range([0,height])
                    .padding(0.1);
                svg.append("g")
                    .call(d3.axisLeft(y))
                    .style("font-size", "12px")


                //color scale - COPY/PASTE FROM SCATTER: ABSTRACT IT LATTER
                const causes = ["Miscellaneous","Lightning","Debris Burning","Campfire/Children/Smoking/Fireworks",
                            "Equipment Use","Arson","Powerline/Railroad/Structure","Missing/Undefined"]
                const color = d3.scaleOrdinal()
                    .domain(causes)
                    .range(["#1b9e77","#e6ab02","#a6761d","#e7298a",
                            "#d95f02","#66a61e","#7570b3","#666666"]) 

                var barPlot=svg.selectAll("rect")
                    .data(data)
                    .join("rect")
                    .attr("x", d => x(0))
                    .attr("y", d => y(d.STAT_CAUSE))
                    .attr("width", d => x(d.fire_Totalsize))
                    .attr("height", y.bandwidth())
                    .attr("fill", d => color(d.STAT_CAUSE));


                // INTERACTION - CHANGE X AXIS VARIABLE
                d3.select("#BarYaxis").on("change",function(d){

                    // recover the option that has been chosen
                    var selectedOption = d3.select(this).property("value")
                    console.log(selectedOption)

                    if (selectedOption=="avgSize"){
                        var stringVar="fire_avgSize"
                        var xTitle="Avg Acres burned \n per fire event"
                        var widthAdj=0
                    } else if (selectedOption=="totalSize"){
                        var stringVar="fire_Totalsize"
                        var xTitle="Total Acres burned"
                        var widthAdj=-margin.left/2
                    } else {
                        var stringVar="fire_count"
                        var xTitle="Number of fire events"
                        var widthAdj=-margin.left/2
                    }

                    // Update linear scale for x axis
                    x
                        .domain([0, d3.max(data, d => d[stringVar])]).nice()
                        .range([0,width]);
                        
                        // Update values on the plot based on the new scale
                    barPlot
                        .attr("width", d => x(d[stringVar]))
                        
                    // Remove previous y Axis and create a new one identical but with new linear Y scale
                    svg.selectAll("#xAxisBarNumber").remove();
                    svg.selectAll("#xAxisBar").remove();
                    // update x axis
                    svg.append("g")
                        .attr("id","xAxisBarNumber")
                        .attr("transform", "translate(0," + height + ")")
                        .call(d3.axisBottom(x))
                            .selectAll("text")
                            .attr("transform", "translate(-10,0)rotate(-45)")
                            .style("text-anchor", "end")
                            .style("font-size", "15px")

                    svg.append("text")
                        .attr("id","xAxisBar")
                        .attr("x",widthAdj )
                        .attr("y",  height + margin.bottom/4*3)
                        .style("text-anchor", "middle")
                        .style("font-size", "15px")
                        .text(xTitle);
                    })
                       
            },
        }
    }

</script>


<style>

</style>