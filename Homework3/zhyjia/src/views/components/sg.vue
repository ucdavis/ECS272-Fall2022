<template>
    <a-row type="flex">
        <a-col :flex="4">
            <div id="sg"></div>
        </a-col>
<!--         <a-col :flex="1">
            <div id="legend"></div>
            <div style="margin-left: 0px">
				  <input type="checkbox" class="checkbox" value="A" checked><label>group A</label>
				  <input type="checkbox" class="checkbox" value="B" checked><label>group B</label>
				  <input type="checkbox" class="checkbox" value="C" checked><label>group C</label>
            </div>
            <a-checkbox-group v-model:value="checkedList" :options="plainOptions" @change="handleChange"/>
        </a-col> -->
    </a-row>
</template>

<script>
    import * as d3 from "d3";
    import csvPath from '../../assets/data/movieInfo.csv';

    export default {
        name: 'Sg',
        data() {
            return {
                scatterData: Object,
            }
        },
        props:{
            myRadarData: Object,
        },
        mounted(){
            this.drawScatter();
        },
        methods: {
            // processData(){
            //     return new Promise((res) => {
            //         d3.csv(csvPath).then((f) => {
            //             let data = f;
            //             var distRating = [];
            //             data.forEach(d => {
            //                 distRating .push({
            //                     distance: d["Flight Distance"],
            //                     service: parseInt(d["Inflight service"]) + parseInt(d["Leg room service"]) + parseInt(d["Seat comfort"]) + parseInt(d["Food and drink"]) + parseInt(d["Cleanliness"]),
            //                     class: d['Class']
            //                 });
            //             })

            //             this.scatterData = distRating;
            //             res();
            //         });
            //     });
            // },
            // dataProcess(){
            //     const data = await d3.csv(csvPath);

            //     var eco = {"onboard" : 0, "food" : 0, "seat": 0, "entertainment" : 0, "checkin": 0, "cleanliness" : 0};
            //     var ecoCount = 0;
            //     var ecoPlus = {"onboard" : 0, "food" : 0, "seat": 0, "entertainment" : 0, "checkin": 0, "cleanliness" : 0};
            //     var ecoPlusCount = 0;
            //     var business = {"onboard" : 0, "food" : 0, "seat": 0, "entertainment" : 0, "checkin": 0, "cleanliness" : 0};
            //     var businessCount = 0;
            //     data.forEach(d => {
            //         if(d["Class"] == "Eco"){
            //             ecoCount += 1;
            //             eco["onboard"] += parseInt(d["On-board service"]);
            //             eco["food"] += parseInt(d["Food and drink"]);
            //             eco["seat"] += parseInt(d["Seat comfort"]);
            //             eco["entertainment"] += parseInt(d["Inflight entertainment"]);
            //             eco["checkin"] += parseInt(d["Checkin service"]);
            //             eco["cleanliness"] += parseInt(d["Cleanliness"]);
            //         } else if(d["Class"] == "Eco Plus"){
            //             ecoPlusCount += 1;
            //             ecoPlus["onboard"] += parseInt(d["On-board service"]);
            //             ecoPlus["food"] += parseInt(d["Food and drink"]);
            //             ecoPlus["seat"] += parseInt(d["Seat comfort"]);
            //             ecoPlus["entertainment"] += parseInt(d["Inflight entertainment"]);
            //             ecoPlus["checkin"] += parseInt(d["Checkin service"]);
            //             ecoPlus["cleanliness"] += parseInt(d["Cleanliness"]);
            //         } else if(d["Class"] == "Business"){
            //             businessCount += 1;
            //             business["onboard"] += parseInt(d["On-board service"]);
            //             business["food"] += parseInt(d["Food and drink"]);
            //             business["seat"] += parseInt(d["Seat comfort"]);
            //             business["entertainment"] += parseInt(d["Inflight entertainment"]);
            //             business["checkin"] += parseInt(d["Checkin service"]);
            //             business["cleanliness"] += parseInt(d["Cleanliness"]);
            //         }
            //     })
            //     for(var key in eco){
            //         eco[key] = eco[key] / ecoCount;
            //     }
            //     for(var key in ecoPlus){
            //         ecoPlus[key] = ecoPlus[key] / ecoPlusCount;
            //     }
            //     for(var key in business){
            //         business[key] = business[key] / businessCount;
            //     }

            //     formatData = {"Eco":eco, "Eco Plus": ecoPlus, "Business": business};
            //     this.radarData = formatData
            // },
            drawScatter(){
                const margin = {top: 20, right: 30, bottom: 0, left: 100},
                    // width = 460 - margin.left - margin.right,
                    width = 430,
                    height = 285 - margin.top - margin.bottom;

                // append the svg object to the body of the page
                const svg = d3.select("#sg")
                  .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                    .attr("transform",
                          `translate(${margin.left}, ${margin.top})`);

                // Parse the Data
                d3.csv(csvPath).then(function(data) {

                    console.log(data)

                  // List of groups = header of the csv files
                  const keys = data.columns.slice(1)

                  // Add X axis
                  const x = d3.scaleLinear()
                    .domain(d3.extent(data, function(d) { return d.year; }))
                    .range([ 0, width ]);
                  svg.append("g")
                    .attr("transform", `translate(0, ${height*0.8})`)
                    .call(d3.axisBottom(x).tickSize(-height*.7).tickValues([1940, 1965 ,1985, 2010]))
                    .select(".domain").remove()
                  // Customization
                  svg.selectAll(".tick line").attr("stroke", "#b8b8b8")

                  // Add X axis label:
                  svg.append("text")
                      .attr("text-anchor", "end")
                      .attr("x", width)
                      .attr("y", height-30 )
                      .text("Time (year)");

                  // Add Y axis
                  const y = d3.scaleLinear()
                    .domain([-680, 580])
                    .range([ height, 0 ]);

                  // color palette
                  const color = d3.scaleOrdinal()
                    .domain(keys)
                    .range(d3.schemeDark2);

                  //stack the data?
                  const stackedData = d3.stack()
                    .offset(d3.stackOffsetSilhouette)
                    .keys(keys)
                    (data)

                  // create a tooltip
                  const Tooltip = svg
                    .append("text")
                    .attr("x", 0)
                    .attr("y", 0)
                    .style("opacity", 0)
                    .style("font-size", 17)

                  // Three function that change the tooltip when user hover / move / leave a cell
                  const mouseover = function(event,d) {
                    Tooltip.style("opacity", 1)
                    d3.selectAll(".myArea").style("opacity", .2)
                    d3.select(this)
                      .style("stroke", "black")
                      .style("opacity", 1)
                  }
                  const mousemove = function(event,d,i) {
                    var grp = d.key
                    Tooltip.text(grp)
                  }
                 

                  const mouseleave = function(event,d) {
                    Tooltip.style("opacity", 0)
                    d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none")
                   }

                  // Area generator
                  const area = d3.area()
                    .x(function(d) { return x(d.data.year); })
                    .y0(function(d) { return y(d[0]); })
                    .y1(function(d) { return y(d[1]); })

                  // Show the areas
                  svg
                    .selectAll("mylayers")
                    .data(stackedData)
                    .join("path")
                      .attr("class", "myArea")
                      .style("fill", function(d) { return color(d.key); })
                      .attr("d", area)
                      .on("click", mouseover)
                      .on("mousemove", mousemove)
                      .on("mouseleave", mouseleave)

                })
            },
        }
    }

</script>


<style>
.selected {
  opacity: 1 !important;
  stroke: black;
  stroke-width: 1px;
}
</style>