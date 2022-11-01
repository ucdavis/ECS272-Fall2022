<template>
    <div id="area"></div>
</template>

<script>
import * as d3 from "d3";

export default {
    name: 'AreaChart',
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
    props:{
        myAreachartData: Array,
        mySelection: Object,
    },
    watch: {
        mySelection: function(newVal, oldVal) {
            console.log("selected")
            this.processData(this.myAreachartData, this.mySelection);
            this.drawAreachart(this.process_data, "#area", this.mySelection);
        }
    },
    mounted(){
        this.processData(this.myAreachartData, this.mySelection);
        this.drawAreachart(this.process_data, "#area", this.mySelection);
    },
    methods:{
        processData(data, selection) {
            console.log("areachart processData: ", selection.text);
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
        drawAreachart(data, id, selection) {
            const margin = { top: 30, right: 40, bottom: 60, left: 50 };
            const height = 400;
            const width = 700;

            d3.selectAll(".areachart").remove();

            const svg = d3.select(id).append("svg")
                            .attr("class", "areachart")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                            .append("g")
                            .attr("transform", `translate(${margin.left},${margin.top})`);

            const gens = data.map(d => d.Generation)

            const x = d3.scaleLinear()
                        .domain(d3.extent(data, function(d) { return d.Generation; }))
                        .range([0, width])

            svg.append("g")
                .attr("transform", `translate(0, ${height*0.8})`)
                .call(d3.axisBottom(x).tickSize(-height*.7).tickValues([1, 2, 3, 4, 5, 6]))

            svg.selectAll(".tick line").attr("stroke", "#b8b8b8")

            svg.append("text")
                .attr("text-anchor", "end")
                .attr("x", width)
                .attr("y", height - 50)
                .text("Generation")

            const y = d3.scaleLinear()
                        .range([height, 0])

            if (selection.text == 'Type_1') {
                y.domain([-160, 160])
            }
            else {
                y.domain([-80, 80])
            }

            const color = d3.scaleOrdinal()
                .domain(this.all_types)
                .range(this.color_scale)

            const stackedData = d3.stack()
                .offset(d3.stackOffsetSilhouette)
                .keys(this.all_types)(data)

            const tooltip = svg.append("text")
                                .attr("x", 0)
                                .attr("y", 0)
                                .style("opacity", 0)
                                .style("font-size", 17)

            const mouseover = function(event, d) {
                tooltip.style("opacity", 1)
                d3.selectAll(".myaArea").style("opacity", .2)
                d3.select(this)
                    .style("stroke", "black")
                    .style("opacity", 1)
            }

            const mousemove = function(event, d, i) {
                const grp = d.key
                tooltip.text(grp)
            }

            const mouseleave = function(event, d) {
                tooltip.style("opacity", 0)
                d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none")
            }

            const area = d3.area()
                            .x(function(d) { return x(d.data.Generation); })
                            .y0(function(d) { return y(d[0]); })
                            .y1(function(d) {return y(d[1]); })

            svg.selectAll("mylayers")
                .data(stackedData)
                .join("path")
                .attr("class", "myArea")
                .style("fill", function(d) { return color(d.key); })
                .attr("d", area)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
        }
    }
}
</script>


<style>

</style>