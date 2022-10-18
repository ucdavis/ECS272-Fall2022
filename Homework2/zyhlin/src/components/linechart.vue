<template>
    <svg id="line"></svg>
</template>

<script>
    import * as d3 from "d3";
    import testData from "../assets/second_chart.json"; /* Example of reading in data direct from file*/

    export default {
        name: 'LineChart',
        data() {
            return {
                name: 'Hello',
                someLocalValues: [1, 2, 3, 4, 5],

            }
        },
        props:{
            myLinechartData: Array,
        },
        mounted(){
            console.log(testData);
            let localData = testData;
            this.drawLineChart(localData, "#line") /* Example of reading data from a json file */
            // this.drawLineChart(this.myLinechartData, "#line")
            console.log("Data Passed down as a Prop  ", this.myLinechartData)
        },
        methods: {
            drawLineChart(dset, id) {

                const margin = { top: 40, right: 40, bottom: 120, left: 100 };
                const height = 400;
                const width = 600;

                let group = ['Middle East & North Africa', 'South America', "Australasia & Oceania",
                "East Asia", "Southeast Asia", "Western Europe", "Central America & Caribbean", 
                "Eastern Europe", "North America", "South Asia", "Sub-Saharan Africa"
                    ]

                const data = dset[group[0]]
                const dname = group[0]

                const x = d3.scaleTime()
                    .domain(d3.extent(data, d => d3.timeParse('%Y')(d.year)))
                    .rangeRound([margin.left, width - margin.right]);

                const y = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d.count)]).nice()
                    .range([height - margin.bottom, margin.top]);

                var colors = d3.scaleOrdinal()
                    .domain(group)
                    .range(d3.schemeCategory10)

                let svg = d3.select(id)
                    .attr("viewBox", [0, 0, width, height])
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);

                var tooltip = svg
                    .append("text")
                    .style("position", "absolute")
                    .attr('x', width / 2)
                    .attr('y', height - height / 6)
                    .style("visibility", "hidden")
                    .style("background", "#fff")
                    .attr('font-size', 12)
                    .text("a simple tooltip");

                const path = svg.append('path')
                    .datum(data)
                    .attr('fill', 'none')
                    .attr('stroke', colors(dname))
                    .attr('stroke-width', 2)
                    .attr('d', d3.line()
                        .x(d => x(d3.timeParse('%Y')(d.year)))
                        .y(d => y(d.count))
                    )
                    .on('mouseover', (e, d) => {
                        d3.select(e.currentTarget)
                            .attr('stroke-width', 5);
                    })
                    .on('mouseleave', (e) => {
                        d3.select(e.currentTarget)
                            .attr('stroke-width', 2)
                    });

                const xAxis = g => g
                    .attr("transform", `translate(0,${height - margin.bottom})`)
                    .call(d3.axisBottom(x))

                const yAxis = g => g
                    .attr("transform", `translate(${margin.left},0)`)
                    .call(d3.axisLeft(y))

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("transform", "rotate(-65)")
                    .attr("font-weight", "bold");

                svg.append("g")
                    .call(yAxis)
                    .call(g => g.select(".tick:last-of-type text")
                        .clone()
                        .attr("transform", `rotate(-90)`)
                        .attr("text-anchor", "middle")
                        .attr("x", -(15 - margin.top - margin.bottom) / 2)
                        .attr("y", -80)
                        .attr("font-weight", "bold"))

                const title_txt = svg.append('text')
                    
                title_txt.text('# of terrorist attacks in ' + dname)
                    .attr('y', 10)
                    .attr('x', 10)
                    .attr('font-size', 9)

                const legend = svg.selectAll('legend')
                    .data([1])
                    .enter()
                    .append('g')
                    .attr('class', 'legend')
                    .attr('transform', (d, i) => 'translate(0,' + i * 20 + ')')
                    
                const legend_rect = legend.append('rect')
                    .attr('x', width - 18)
                    .attr('width', 18)
                    .attr('height', 18)
                    .attr('fill', colors(dname))
                    
                const legend_text = legend.append('text')
                    .attr('x', width - 24)
                    .attr('y', 9)
                    .attr('dy', '.35em')
                    .style('text-anchor', 'end')
                    .text(dname)

                const select_button = d3.select('#selectButton')
                    .selectAll('myOptions')
                    .data(group)
                    .enter()
                    .append('option')
                    .text(d => d)
                    .attr('value', d => d)

                d3.select("#selectButton").on("change", function(event,d) {
                    const selectedOption = d3.select(this).property("value")
                    update(selectedOption)
                })

                function update(selectedGroup) {
                    const filtered_data = dset[selectedGroup]

                    path.datum(filtered_data)
                        .transition()
                        .duration(1000)
                        .attr("d", d3.line()
                            .x(d => x(d3.timeParse('%Y')(d.year)))
                            .y(d => y(d.count))
                        )
                        .attr("stroke", function(d){ return colors(selectedGroup) })
                    
                    legend_rect.attr('fill', colors(selectedGroup))
                    title_txt.text('# of terrorist attacks in ' + selectedGroup)
                    legend_text.text(selectedGroup)
                }
                



                

            },
        }
    }

</script>


<style>
svg {
    position: inherit;
    width: 100%;
    height: 100%;
}
</style>