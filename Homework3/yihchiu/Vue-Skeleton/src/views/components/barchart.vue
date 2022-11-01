<template>
    <div id="legend"></div>
    <div id="bar"></div>
</template>

<script>
import { AvatarGroup } from "ant-design-vue";
import * as d3 from "d3";

export default {
    name: 'BarChart',
    data() {
        return {
            process_data: undefined,
            color_scale: ["#A8A77A", "#EE8130", "#6390F0", "#7AC74C", "#F7D02C", "#96D9D6",
                           "#C22E28", "#A33EA1", "#E2BF65", "#A98FF3", "#F95587", "#A6B91A",
                           "#B6A136", "#735797", "#705746", "#6F35FC", "#B7B7CE", "#D685AD"],
            all_types: ["Normal", "Fire", "Water", "Grass", "Electric", "Ice",
                        "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug",
                        "Rock", "Ghost", "Dark", "Dragon", "Steel", "Fairy"]
        }
    },
    props: {
        myBarchartData: Array,
        mySelection: Object,
    },
    watch: {
        mySelection: function(newVal, oldVal) {
            console.log("selected")
            this.processData(this.myBarchartData, this.mySelection);
            this.drawBarChart(this.process_data, "#bar", this.mySelection)
        }
    },
    mounted(){
        this.drawLegend("#legend")
        this.processData(this.myBarchartData, this.mySelection);
        this.drawBarChart(this.process_data, "#bar", this.mySelection)
    },
    methods: {
        processData(data, selection) {
            console.log("barchart processData: ", selection.text);
            const preData = {1: { Normal: 0, Fire: 0, Water: 0, Electric: 0, Grass: 0, Ice: 0,
                             Fighting: 0, Poison: 0, Ground: 0, Flying: 0, Psychic: 0, Bug: 0,
                             Rock: 0, Ghost: 0, Dragon: 0, Dark: 0, Steel: 0, Fairy: 0},
                             2: { Normal: 0, Fire: 0, Water: 0, Electric: 0, Grass: 0, Ice: 0,
                             Fighting: 0, Poison: 0, Ground: 0, Flying: 0, Psychic: 0, Bug: 0,
                             Rock: 0, Ghost: 0, Dragon: 0, Dark: 0, Steel: 0, Fairy: 0},
                             3: { Normal: 0, Fire: 0, Water: 0, Electric: 0, Grass: 0, Ice: 0,
                             Fighting: 0, Poison: 0, Ground: 0, Flying: 0, Psychic: 0, Bug: 0,
                             Rock: 0, Ghost: 0, Dragon: 0, Dark: 0, Steel: 0, Fairy: 0},
                             4: { Normal: 0, Fire: 0, Water: 0, Electric: 0, Grass: 0, Ice: 0,
                             Fighting: 0, Poison: 0, Ground: 0, Flying: 0, Psychic: 0, Bug: 0,
                             Rock: 0, Ghost: 0, Dragon: 0, Dark: 0, Steel: 0, Fairy: 0},
                             5: { Normal: 0, Fire: 0, Water: 0, Electric: 0, Grass: 0, Ice: 0,
                             Fighting: 0, Poison: 0, Ground: 0, Flying: 0, Psychic: 0, Bug: 0,
                             Rock: 0, Ghost: 0, Dragon: 0, Dark: 0, Steel: 0, Fairy: 0},
                             6: { Normal: 0, Fire: 0, Water: 0, Electric: 0, Grass: 0, Ice: 0,
                             Fighting: 0, Poison: 0, Ground: 0, Flying: 0, Psychic: 0, Bug: 0,
                             Rock: 0, Ghost: 0, Dragon: 0, Dark: 0, Steel: 0, Fairy: 0}}
            data.forEach(element => {
                preData[element['Generation']][element[selection.text]] += 1
            });
            console.log(preData)
            const final_data = []
            Object.keys(preData).forEach(d => {
                let temp = {
                    Generation: d
                }
                temp = Object.assign(temp, preData[d])
                final_data.push(temp)
            })
            console.log(final_data)
            this.process_data = final_data
        },
        drawBarChart(data, id, selection) {
            const margin = { top: 10, right: 40, bottom: 60, left: 200 };
            const height = 300;
            const width = 600;
            d3.selectAll(".barchart").remove();
            d3.selectAll(".tooltip").remove();
            const svg = d3.select(id).append("svg")
                            .attr("class", "barchart")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                            .append("g")
                            .attr("transform", `translate(${margin.left},${margin.top})`);

            const gens = data.map(d => d.Generation)

            const x = d3.scaleBand()
                        .domain(gens)
                        .range([0, width])
                        .padding([0.2]);

            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x).tickSizeOuter(0))
                .call(g => g.append("text")
                    .attr("text-anchor", "middle")
                    .attr("fill", "currentColor")
                    .attr("x", (width - margin.right))
                    .attr("y", margin.bottom - 25)
                    .attr("font-weight", "bold")
                    .style("font-size", "16px")
                    .text("Generation"));

            const y = d3.scaleLinear()
                .range([height, 0]);

            if (selection.text == 'Type_1') {
                y.domain([0, 160])
            }
            else {
                y.domain([0, 80])
            }

            svg.append("g")
                .call(d3.axisLeft(y))
                .call(g => g.append("text")
                .attr("text-anchor", "middle")
                    .attr("fill", "currentColor")
                    .attr("transform", `rotate(-90)`)
                    .attr("x", -((height - margin.bottom - margin.top)/2))
                    .attr("y", -margin.left + 170)
                    .attr("font-weight", "bold")
                    .style("font-size", "16px")
                    .text("Pokemon Count"));

            const color = d3.scaleOrdinal()
                .domain(this.all_types)
                .range(this.color_scale)
                
            const stackedData = d3.stack()
                                    .keys(this.all_types)(data)
            //console.log("colors: " + this.color_scale)
            const tooltip = d3.select(id).append("div")
                                .style("position", "absolute")
                                .style("opacity", 0)
                                .attr("class", "tooltip")
                                .style("background-color", "white")
                                .style("border", "solid")
                                .style("border-width", "1px")
                                .style("border-radius", "5px")
                                .style("padding", "5px")
            svg.append("g")
                .selectAll("g")
                .data(stackedData)
                .join("g")
                .attr("fill", d => color(d.key))
                .attr("class", d => "myRect " + d.key ) // Add a class to each subgroup: their name
                .selectAll("rect")
                // enter a second time = loop subgroup per subgroup to add all rectangles
                .data(d => d)
                .join("rect")
                .attr("x", d => x(d.data.Generation))
                .attr("y", d => y(d[1]))
                .attr("height", d => y(d[0]) - y(d[1]))
                .attr("width",x.bandwidth())
                .attr("stroke", "grey")
                .on("mouseover", function (event, d) { // What happens when user hover a bar
                    // what subgroup are we hovering?
                    const subGroupName = d3.select(this.parentNode).datum().key
                    const subGroupVal = d.data[subGroupName]
                    tooltip.html("Type: " + subGroupName + "<br>" + "Count: " + subGroupVal)
                            .style("opacity", 1)
                    // Reduce opacity of all rect to 0.2
                    d3.selectAll(".myRect").style("opacity", 0.2)
                    // Highlight all rects of this subgroup with opacity 1. It is possible to select them since they have a specific class = their name.
                    d3.selectAll("."+subGroupName).style("opacity",1)
                })
                .on("mousemove", function(event, d) {
                    tooltip.style("transform","translateY(-55%)")
                            .style("left",(event.x)+"px")
                            .style("top",(event.y)-30+"px")
                })
                .on("mouseleave", function (event, d) { // When user do not hover anymore
                    tooltip.style("opacity", 0)
                    // Back to normal opacity: 1
                    d3.selectAll(".myRect")
                    .style("opacity",1)
                })
        },
        drawLegend(id) {
            const margin = { top: 50, right: 40, bottom: 60, left: 40 };
            const height = 1000;
            const width = 500;
            
            const svg = d3.select(id).append("svg")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                            .append("g")
                            .attr("transform", `translate(${margin.left},${margin.top})`);
            const color = d3.scaleOrdinal()
                .domain(this.all_types)
                .range(this.color_scale)
            var size = 20
            svg.selectAll("mydots")
                .data(this.all_types)
                .enter()
                .append("rect")
                .attr("x", 20)
                .attr("y", function(d,i){ return 20 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("width", size)
                .attr("height", size)
                .style("fill", function(d){ return color(d)})
            svg.selectAll("mylabels")
                .data(this.all_types)
                .enter()
                .append("text")
                .attr("x", 20 + size*1.2)
                .attr("y", function(d,i){ return 20 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
                .style("fill", function(d){ return color(d)})
                .text(function(d){ return d})
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
        }
    }
}

</script>


<style>
#legend {
    width: 100%;
    height: 30%;
}

#bar {
    width: 100%;
    height: 70%;
}
</style>