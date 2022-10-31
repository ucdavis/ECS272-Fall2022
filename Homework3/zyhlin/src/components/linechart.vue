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
            let localData = testData;
            this.pick_data(localData, '#line', this.drawLineChart)
            // this.drawLineChart(localData, "#line") /* Example of reading data from a json file */
            // this.drawLineChart(this.myLinechartData, "#line")
            console.log("Data Passed down as a Prop  ", this.myLinechartData)
        },
        methods: {
            drawLineChart(dset, id, select_year) {

                const margin = { top: 40, right: 160, bottom: 120, left: 10 };
                const height = 400;
                const width = 700;

                const data = dset[select_year]
                const year_group = dset['years']
                const group = ['Middle East & North Africa', 'South America', "Australasia & Oceania",
                    "East Asia", "Southeast Asia", "Western Europe", "Central America & Caribbean", 
                    "Eastern Europe", "North America", "South Asia", "Sub-Saharan Africa"
                    ]
                console.log(data)

                const x = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d.kill)])
                    .range([margin.left, width - margin.right]);

                const y = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d.wound)]).nice()
                    .range([height - margin.bottom, margin.top]);

                var colors = d3.scaleOrdinal()
                    .domain(group)
                    .range(d3.schemeCategory10)

                let svg = d3.select(id)
                    .attr("viewBox", [0, 0, width, height])
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .call(zoom);

                var tooltip = svg
                    .append("text")
                    .style("position", "absolute")
                    .attr('x', width / 2)
                    .attr('y', height - height / 6)
                    .style("visibility", "hidden")
                    .style("background", "#fff")
                    .attr('font-size', 12)
                    .text("a simple tooltip");

                const dots = svg.append('g')
                    .selectAll('dot')
                    .data(data)
                    .join('circle')
                    .attr('class', 'dot')
                    .attr('cx', d => x(d.kill))
                    .attr('cy', d => y(d.wound))
                    .attr('r', 5)
                    .attr('fill', d => colors(d.region))
                    .attr('opacity', 0.6)
                    .attr('stroke', 'white')
                    .attr('stroke-width', 0.1)
                    .on('mouseover', (e, d) => {
                        d3.select(e.currentTarget)
                            .attr('opacity', 0.3)
                        tooltip.text(d.country + ', ' + d.wound + ', ' + d.kill)
                            .style('visibility', 'visible')
                    })
                    .on('mouseleave', (e, d) => {
                        d3.select(e.currentTarget)
                            .attr('opacity', 0.6)
                        tooltip.style('visibility', 'hidden')
                    })

                const xAxis = g => g
                    .attr("transform", `translate(0,${height - margin.bottom})`)
                    .call(d3.axisBottom(x))

                const yAxis = g => g
                    .attr("transform", `translate(${margin.left},0)`)
                    .call(d3.axisLeft(y))

                const gx = svg.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .call(g => g.select('.tick:last-of-type text')
                        .clone()
                        .attr("transform", "rotate(-65)")
                        .style("text-anchor", "end")
                        .selectAll("text")
                        .attr("dx", "-.8em")
                        .attr("dy", ".15em")
                        .attr("font-weight", "bold")
                    )
                    

                const gy = svg.append("g")
                    .attr("class", "y-axis")
                    .call(yAxis)
                    .call(g => g.select(".tick:last-of-type text")
                        .clone()
                        .attr("transform", `rotate(-90)`)
                        .attr("text-anchor", "middle")
                        .attr("x", -(15 - margin.top - margin.bottom) / 2)
                        .attr("y", -80)
                        .attr("font-weight", "bold"))

                const title_txt = svg.append('text')
                    
                title_txt.text('wound / kill in ' + select_year)
                    .attr('y', 10)
                    .attr('x', 10)
                    .attr('font-size', 9)

                const legend = svg.selectAll('legend')
                    .data(group)
                    .enter()
                    .append('g')
                    .attr('class', 'legend')
                    .attr('transform', (d, i) => 'translate(0,' + i * 20 + ')')
                    
                const legend_circle = legend.append('circle')
                    .attr('cx', width - 18)
                    .attr('cy', 7)
                    .attr('r', 4)
                    .attr('width', 18)
                    .attr('height', 18)
                    .attr('fill', d => colors(d))
                    
                const legend_text = legend.append('text')
                    .attr('x', width - 24)
                    .attr('y', 9)
                    .attr('dy', '.35em')
                    .style('text-anchor', 'end')
                    .attr('font-size', 9)
                    .text(d => d)

                function zoom(svg) {
                    svg.call(d3.zoom()
                        .scaleExtent([0.8, 8])
                        .extent([[0, 0], [width, height]])
                        .on('zoom', updatechart))

                    function updatechart(ev) {
                        console.log(ev);
                        var newx = ev.transform.rescaleX(x)
                        var newy = ev.transform.rescaleY(y)
                        console.log(newx)
                        gx.transition().duration(1000).call(d3.axisBottom(newx))
                        gy.transition().duration(1000).call(d3.axisLeft(newy))
                        svg.selectAll('.dot')
                            .transition()
                            .duration(800)
                            .attr('transform', ev.transform)
                            .attr('cx', d => newx(d.kill))
                            .attr('cy', d => newy(d.wound))
                            .attr('r', 5)
                    }
                }

            },

            pick_data(dset, id, cb) {
                var option = '1970'

                const select_button = d3.select('#selectButton_chart2')
                    .selectAll('myOptions')
                    .data(dset.years)
                    .enter()
                    .append('option')
                    .text(d => d)
                    .attr('value', d => d)
                
                d3.selectAll('#selectButton_chart2').on("change", function(e, d) {
                    const selectedOption = d3.select(this).property("value")
                    update(selectedOption)
                })

                function update(option) {
                    d3.select(id).selectAll('g').remove()
                    d3.select(id).selectAll('text').remove()
                    cb(dset, id, option)
                    
                }
                cb(dset, id, option)
            }


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