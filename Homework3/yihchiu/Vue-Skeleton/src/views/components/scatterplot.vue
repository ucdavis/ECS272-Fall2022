<template>
    <div id="parallel"></div>
</template>

<script>
import * as d3 from "d3";

export default {
    name: 'ScatterPlot',
    data() {
        return {
            process_data: undefined,
            color_scale: ["#A8A77A", "#EE8130", "#6390F0", "#7AC74C", "#F7D02C", "#96D9D6",
                            "#C22E28", "#A33EA1", "#E2BF65", "#A98FF3", "#F95587", "#A6B91A",
                            "#B6A136", "#735797", "#705746", "#6F35FC", "#B7B7CE", "#D685AD"],
            all_types: ["Normal", "Fire", "Water", "Grass", "Electric", "Ice",
                        "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug",
                        "Rock", "Ghost", "Dark", "Dragon", "Steel", "Fairy"],
            dimensions: ["HP", "Attack", "Defense", "SpecialAttack", "SpecialDefense", "Speed"]
        }
    },
    props: {
        myScatterPlotData: Array,
        mySelection: Object,
    },
    watch: {
        mySelection: function(newVal, oldVal) {
            console.log("selected")
            this.processData(this.myScatterPlotData, this.mySelection);
            this.drawScatterPlotChart(this.process_data, "#parallel", this.mySelection);
        }
    },
    mounted() {
        this.processData(this.myScatterPlotData, this.mySelection)
        this.drawScatterPlotChart(this.process_data, "#parallel", this.mySelection)
    },
    methods: {
        processData(data, selection) {
            console.log("scatterplot processData: ", selection.text);
            const preData = []
            data.forEach(element => {
                const temp = {
                    number: element['Number'],
                    name: element['Name'],
                    type1: element['Type_1'],
                    type2: element['Type_2'],
                    HP: Number(element['HP']),
                    Attack: Number(element['Attack']),
                    Defense: Number(element['Defense']),
                    SpecialAttack: Number(element['Sp_Atk']),
                    SpecialDefense: Number(element['Sp_Def']),
                    Speed: Number(element['Speed']),
                    Total: Number(element['Total']),
                    gen: Number(element['Generation'])
                }
                preData.push(temp)
            })
            console.log(preData)
            this.process_data = preData
        },
        drawScatterPlotChart(data, id, selection) {
            const margin = { top: 30, right: 40, bottom: 60, left: 50 };
            const height = 400;
            const width = 700;

            d3.selectAll(".scatterplot").remove()
            
            const svg = d3.select(id).append("svg")
                            .attr("class", "scatterplot")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                            .append("g")
                            .attr("transform", `translate(${margin.left},${margin.top})`);

            const x = d3.scaleLinear()
                        .domain([150, 750])
                        .range([0, width])

            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x))

            const y = d3.scaleLinear()
                        .domain([0, 260])
                        .range([height, 0])

            svg.append("g")
                .call(d3.axisLeft(y))

            const clip = svg.append("defs").append("svg:clipPath")
                            .attr("id", "clip")
                            .append("svg:rect")
                            .attr("width", width)
                            .attr("height", height)
                            .attr("x", 0)
                            .attr("y", 0)

            const color = d3.scaleOrdinal()
                .domain(this.all_types)
                .range(this.color_scale)

            const highlight = function(event, d) {
                d3.selectAll(".dot")
                    .transition()
                    .duration(200)
                    .style("fill", "lightgrey")
                    .attr("r", 3)

                d3.selectAll("." + d.type1)
                    .transition()
                    .duration(200)
                    .style("fill", color(d.type1))
                    .attr("r", 7)
            }

            const doNotHighlight = function(event, d) {
                d3.selectAll(".dot")
                    .transition()
                    .duration(200)
                    .style("fill", d => color(d.type1))
                    .attr("r", 5)
            }

            
            if (selection.text == 'Attack') {
                svg.append("g")
                    .selectAll("dot")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("class", function (d) { return "dot " + d.type1 })
                    .attr("cx", function (d) { return x(d.Total); })
                    .attr("cy", function (d) { return y(d.Attack); })
                    .attr("r", 5)
                    .style("fill", function (d) { return color(d.type1)})
                    .on("mouseover", highlight)
                    .on("mouseleave", doNotHighlight)
            }
            else if (selection.text == 'Defense') {
                svg.append("g")
                    .selectAll("dot")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("class", function (d) { return "dot " + d.type1 })
                    .attr("cx", function (d) { return x(d.Total); })
                    .attr("cy", function (d) { return y(d.Defense); })
                    .attr("r", 5)
                    .style("fill", function (d) { return color(d.type1)})
                    .on("mouseover", highlight)
                    .on("mouseleave", doNotHighlight)
            }
            else if (selection.text == 'HP') {
                svg.append("g")
                    .selectAll("dot")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("class", function (d) { return "dot " + d.type1 })
                    .attr("cx", function (d) { return x(d.Total); })
                    .attr("cy", function (d) { return y(d.HP); })
                    .attr("r", 5)
                    .style("fill", function (d) { return color(d.type1)})
                    .on("mouseover", highlight)
                    .on("mouseleave", doNotHighlight)
            }
            else if (selection.text == 'SpecialAttack') {
                svg.append("g")
                    .selectAll("dot")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("class", function (d) { return "dot " + d.type1 })
                    .attr("cx", function (d) { return x(d.Total); })
                    .attr("cy", function (d) { return y(d.SpecialAttack); })
                    .attr("r", 5)
                    .style("fill", function (d) { return color(d.type1)})
                    .on("mouseover", highlight)
                    .on("mouseleave", doNotHighlight)
            }
            else if (selection.text == 'SpecialDefense') {
                svg.append("g")
                    .selectAll("dot")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("class", function (d) { return "dot " + d.type1 })
                    .attr("cx", function (d) { return x(d.Total); })
                    .attr("cy", function (d) { return y(d.SpecialDefense); })
                    .attr("r", 5)
                    .style("fill", function (d) { return color(d.type1)})
                    .on("mouseover", highlight)
                    .on("mouseleave", doNotHighlight)
            }
            else if (selection.text == 'Speed') {
                svg.append("g")
                    .selectAll("dot")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("class", function (d) { return "dot " + d.type1 })
                    .attr("cx", function (d) { return x(d.Total); })
                    .attr("cy", function (d) { return y(d.Speed); })
                    .attr("r", 5)
                    .style("fill", function (d) { return color(d.type1)})
                    .on("mouseover", highlight)
                    .on("mouseleave", doNotHighlight)
            } 
        }
    }
}
</script>