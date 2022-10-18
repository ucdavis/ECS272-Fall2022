<template>
    <svg id="bar"></svg>
</template>

<script>
    import * as d3 from "d3";
import { forEach } from "shelljs/commands";
    import testData from "../assets/first_chart.json"; /* Example of reading in data direct from file*/

    export default {
        name: 'BarChart',
        data() {
            return {
                name: 'Hello',
                someLocalValues: [1, 2, 3, 4, 5],

            }
        },
        props:{
            myBarchartData: Array,
        },
        mounted(){
            let localData = testData;
            this.data_pick(localData, "#bar", this.drawBarChart) /* Example of reading data from a json file */
            // this.drawBarChart(this.myBarchartData, "#bar")
            console.log("Data Passed down as a Prop  ", this.myBarchartData)
        },
        methods: {
            drawBarChart(dset, id, name) {

                const margin = { top: 40, right: 100, bottom: 120, left: 40 };
                const height = 450;
                const width = 500;              
                console.log(2333333334, dset)

                const data = dset['data']

                var groups = d3.map(data, d => d.year)
                var subgroups = dset.regions
                console.log(233333, dset.regions)
                

                const x = d3.scaleBand()
                    .domain(groups)
                    .rangeRound([margin.left, width - margin.right])
                    .padding(0.1);

                const y = d3.scaleLinear().domain([0, d3.max(data, d => d.max)])
                    .rangeRound([height - margin.bottom, margin.top]);

                let svg = d3.select(id)
                    .attr("viewBox", [0, 0, width, height])
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);
                    
                var x1 = d3.scaleBand()
                    .domain(subgroups)
                    .range([0, x.bandwidth()])
                    .padding([0.05])

                var colors = d3.scaleOrdinal()
                    .domain(subgroups)
                    .range(d3.schemeCategory10)

                var tooltip = svg
                    .append("text")
                    .style("position", "absolute")
                    .attr('x', width / 2)
                    .attr('y', height / 2)
                    .style("visibility", "hidden")
                    .style("background", "#fff")
                    .attr('font-size', 12)
                    .text("a simple tooltip");

                const bars = svg.append('g')
                    .selectAll('g')
                    .data(data)
                    .enter()
                    .append('g')
                    .attr("transform", d => { return "translate(" + x(d.year) + ",0)"; })
                    .selectAll("rect")
                    .data(d => subgroups.map(k => {return {'region': k, 'count': d[k]}}))
                    .enter()
                    .append("rect")
                    .classed('bar-rect', true)
                    .attr("x", d => x1(d.region))
                    .attr("y", d => y(d.count))
                    .attr("width", x1.bandwidth())
                    .attr("height", d => y(0) - y(d.count))
                    .attr('fill', d => colors(d.region))
                    .on('mouseover', (e, d) => {
                        d3.select(e.currentTarget)
                            .attr('opacity', 0.7);
                        tooltip.text(d.region + ', ' + d.count)
                            .style('visibility', 'visible')
                    })
                    .on('mouseleave', (e) => {
                        d3.select(e.currentTarget)
                            .attr('opacity', 1)
                        tooltip.style('visibility', 'hidden')
                    })
                
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

                const legend = svg.selectAll('legend')
                    .data(subgroups)
                    .enter()
                    .append('g')
                    .attr('class', 'legend')
                    .attr('transform', (d, i) => 'translate(0,' + i * 10 + ')')
                    
                legend.append('rect')
                    .attr('x', width - 30)
                    .attr('width', 8)
                    .attr('height', 8)
                    .attr('fill', d => colors(d))
                    
                legend.append('text')
                    .attr('x', width - 35)
                    .attr('y', 5)
                    .attr('dy', '.2em')
                    .style('text-anchor', 'end')
                    .style('font-size', 7)
                    .text(d => d)

                svg.append('text')
                    .text('# of terrorist attacks / ' + name)
                    .attr('x', 10)
                    .attr('y', 10)
                    .attr('font-size', 9)



            },

            data_pick(dset, id, cb) {
                var option = 'xyear'
                var op_name = {'xyear': 'decades', 'xregion': 'region'}
                var filtered_data = dset[option]
                
                d3.selectAll('input').on("change", function(event, d) {
                    const selectedOption = d3.select(this).property("value")
                    update(selectedOption)
                })

                function update(option) {
                    filtered_data = dset[option]
                    d3.select('#bar').selectAll('g').remove()
                    d3.select('#bar').selectAll('text').remove()
                    cb(filtered_data, id, op_name[option])
                    
                }
                cb(dset[option], id, op_name[option])
            }

        }
    }

</script>


<style scoped lang="css">
#bar {
    position: inherit;
    width: 100%;
    height: 100%;
}
</style>