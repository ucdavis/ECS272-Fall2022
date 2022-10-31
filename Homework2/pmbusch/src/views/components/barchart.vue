<template>
    <div id="bar"></div>
</template>

<script>
    import * as d3 from "d3";
    import fireData from "../../assets/data/fire_bar.json"; /* Example of reading in data direct from file*/
    import fireDataSeason from "../../assets/data/fire_bar_season.json";

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
            let localDataSeason = fireDataSeason['data'];
            this.drawBarChart(localData, "#bar",localDataSeason) /* Example of reading data from a json file */
            // this.drawBarChart(this.myBarchartData, "#bar")
            console.log("Data Passed down as a Prop  ", this.myBarchartData)
        },
        methods: {
            drawBarChart(dataCause, id, dataSeason) {
                
                const margin = { top: 20, right: 50, bottom: 60, left: 210 };
                const width = 800-margin.left-margin.right;
                const height = 300-margin.top-margin.bottom;
                
                // variables to update
                var data=dataCause;
                var xTitle="Total Acres burned"
                var widthAdj=-margin.left/2
                
                
                data.sort((a, b) => d3.descending(a.fire_Totalsize, b.fire_Totalsize));
                dataSeason.sort((a, b) => d3.descending(a.fire_Totalsize, b.fire_Totalsize));

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
                    .attr("x",widthAdj )
                    .attr("y",  height + margin.bottom/4*3)
                    .style("text-anchor", "middle")
                    .style("font-size", "15px")
                    .text(xTitle);

                var y = d3.scaleBand()
                    .domain(data.map(d => d.STAT_CAUSE))
                    .range([0,height])
                    .padding(0.1);

                svg.append("g")
                    .attr("id","yAxisNames")
                    .call(d3.axisLeft(y))
                    .style("font-size", "12px")


                //color scale - COPY/PASTE FROM SCATTER: ABSTRACT IT LATTER
                const causes = ["Miscellaneous","Lightning","Debris Burning","Campfire/Children/Smoking/Fireworks",
                            "Equipment Use","Arson","Powerline/Railroad/Structure","Missing/Undefined"]
                const colorCause = d3.scaleOrdinal()
                    .domain(causes)
                    .range(["#1b9e77","#e6ab02","#a6761d","#e7298a",
                            "#d95f02","#66a61e","#7570b3","#666666"]) 

                const season = ["Summer","Fall","Spring","Winter",]
                const colorSeason=d3.scaleOrdinal()
                    .domain(season)
                    .range(["#e31a1c","#543005","#78c679","#2b8cbe"])


                var color=colorCause;

                var barPlot=svg.selectAll("rect")
                    .data(data)
                    .join("rect")
                    .attr("x", d => x(0))
                    .attr("y", d => y(d.STAT_CAUSE))
                    .attr("width", d => x(d.fire_Totalsize))
                    .attr("height", y.bandwidth())
                    .attr("fill", d => color(d.STAT_CAUSE));

                
                function UpdateBarChart(metricVar,dimensionCategory,xTitle,widthAdj){
                    // sort data
                    data.sort((a, b) => d3.descending(a[metricVar], b[metricVar]));
                    
                    console.log("debuG")
                    console.log(data)
                    
                    // update Y
                    y
                    .domain(data.map(d => d[dimensionCategory]))
                    .range([0,height])
                    .padding(0.1);

                    // Update linear scale for x axis
                    x
                    .domain([0, d3.max(data, d => d[metricVar])]).nice()
                    .range([0,width]);
                    
                    // Update values on the plot based on the new scale
                    // source: https://stackoverflow.com/questions/46205118/how-to-sort-a-d3-bar-chart-based-on-an-array-of-objects-by-value-or-key
                    

                    // did not work: https://stackoverflow.com/questions/63249124/how-to-update-d3-chart-when-receiving-new-data
                    // let t = svg.transition().duration(500);
                    // barPlot
                    //     .data(data) // problem occurs when changing the data set
                    //     .join(
                    //         enter => enter
                    //             .append("rect")
                    //             .attr("width", d => x(d[metricVar]))
                    //             // .transition("sort")
                    //             // .duration(500)
                    //             .attr("y", d => y(d[dimensionCategory]))
                    //             .attr("height", y.bandwidth())
                    //             .attr("x", d => x(0))
                    //             .attr("fill", d => color(d[dimensionCategory])),
                    //         update => update.call(update => update.transition(t)
                    //             .attr("width", d => x(d[metricVar]))
                    //             .attr("y", d => y(d[dimensionCategory]))
                    //             .attr("fill", d => color(d[dimensionCategory]))),
                    //         exit => exit.call(exit => exit.transition(t)
                    //             .attr("x", 0)
                    //             .attr("y", 0)
                    //             .attr("height", 0)
                    //             .attr("width", 0)
                    //             .remove()))

                    svg.selectAll("rect").remove();
                    
                    barPlot
                    .data(data, d => d)
                    .join('rect')
                    .attr("width", d => x(d[metricVar]))
                    .attr("y", d => y(d[dimensionCategory]))
                    .transition("sort")
                    .duration(500)
                    .attr("height", y.bandwidth())
                    .attr("x", d => x(0))
                    .attr("fill", d => color(d[dimensionCategory]))


                    // Remove previous y Axis and create a new one identical but with new linear Y scale
                    svg.selectAll("#xAxisBarNumber").remove();
                    svg.selectAll("#xAxisBar").remove();
                    svg.selectAll("#yAxisNames").remove();
                    

                       // update y axis on new sort
                    svg.append("g")
                        .attr("id","yAxisNames")
                        .call(d3.axisLeft(y))
                        .style("font-size", "12px")

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

                }

                
                // INTERACTION - CHANGE X AXIS VARIABLE
                d3.select("#BarYaxis").on("change",function(d){

                    // recover the option that has been chosen
                    var selectedOption = d3.select(this).property("value")
                    console.log(selectedOption)

                    var dimensionCategory=d3.select("#BarCauseSeason").property("value")
                    console.log(dimensionCategory)
                    
                    if (selectedOption=="fire_avgSize"){
                        xTitle="Avg Acres burned \n per fire event"
                        widthAdj=0
                    } else if (selectedOption=="fire_Totalsize"){
                        xTitle="Total Acres burned"
                        widthAdj=-margin.left/2
                    } else {
                        xTitle="Number of fire events"
                        widthAdj=-margin.left/2
                    }

                    // Call function to update bar chart
                    UpdateBarChart(selectedOption,dimensionCategory,xTitle,widthAdj);

                    })

                // INTERACTION - CHANGE Y AXIS VARIABLE
                d3.select("#BarCauseSeason").on("change",function(d){
                    // recover the option that has been chosen
                    var selectedOption = d3.select(this).property("value")
                    console.log(selectedOption)
                    
                    var metricVar = d3.select("#BarYaxis").property("value")
                    console.log(metricVar)


                    if (selectedOption=="STAT_CAUSE"){
                        data=dataCause;
                        color=colorCause;
                    } else {
                        data=dataSeason;
                        color=colorSeason;
                    }

                    // Call function to update bar chart
                    UpdateBarChart(metricVar,selectedOption,xTitle,widthAdj);

                })
                       
            },
        }
    }

</script>


<style>

</style>