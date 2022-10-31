<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "HorizontalBarChart",
})

</script>
<script setup lang="ts">
import * as d3 from "d3"
import * as vue from "vue"
const props = defineProps({
    data: Object as () => any,
    step:Number,
})
const margin = {top: 0, right: 0, bottom: 0, left: 20}
const width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right
const height = Math.min(100, window.innerHeight - margin.top - margin.bottom - 20) - margin.top - margin.bottom;
// const height = 100
const id = "barchart"
let y: any = d3.scaleBand()
let x: any = d3.scaleLinear()
const bar_color = "#ababdd"

vue.onMounted(() => {
    init()
    updateBars()
    updateHightLight(0)
})

vue.watch(() => props.step, (new_value, old_value) => {
    updateHightLight(props.step)
})
vue.watch(() => props.data, (new_value, old_value) => {
    updateBars()
})


function init() {
    const width = 10*props.data.length
    const svg = d3.select(`#${id}`).select("svg")
                    .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("width",  width + margin.left + margin.right)
            .attr("height", "100%")
    const canvas = svg.append("g").attr("class", "canvas")
            .attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")");
    // y axis
    // const labels = props.data?.map((item, index) => `t${index}`)
    x = d3.scaleBand()
        // .domain(props.data.map((datum,i) => datum.x))
        .domain(props.data.map((datum,i) => i))
        .range([0, width])
    y = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0])

    canvas.append("g").attr("class", "y-axis-group")
        .style("font-size", "0.5rem")
        .call(d3.axisLeft(y))

    // canvas.append("g").attr("class", "x-axis-group")
    //     .attr("transform", `translate(0, ${height})`)
    //     .style("font-size", "0.8rem")
    //     .call(d3.axisBottom(x))
}

function updateBars() {
    const svg = d3.select(`#${id}`).select("svg")
    const canvas = svg.select("g.canvas")
    const bars_group = canvas.selectAll("rect.bar")
        .data(props.data)
        .join(
            enter => enter.append("rect").attr("class", "bar")
                    .attr("width", (d) => x.bandwidth())
                    .attr("x", (d:any, i) => x(i))
                    .attr("y", (d:any, i) => y(d.y))
                    .attr("height", (d) => height - y(d.y))
                    .attr("fill", bar_color)
                    .attr("stroke", "black")
                    .selection(),
            update => update
                    .attr("width", (d) => x.bandwidth())
                    .attr("x", (d:any, i) => x(i))
                    .attr("y", (d:any, i) => y(d.y))
                    .attr("height", (d) => height - y(d.y))
                    .attr("fill", bar_color)
                    .attr("stroke", "black")
                    .selection(),
            exit => exit.remove()
        )
        .on("mousemove", function(e, i) {
            const tooltip = d3.select(`#${id}`).select(".tooltip")
            tooltip.style("left", e.clientX-150 + "px")
                .style("top", e.clientY - 100 + "px")
        })
        .on("mouseover", function(e, d:any) {
            const tooltip = d3.select(`#${id}`).select(".tooltip")
                .style("opacity", 1)
                .html(`song: ${d.x} <br> value: ${d.y} <br> year: ${d.year}`)
        })
        .on("mouseout", function(e, d:any) {
            const tooltip = d3.select(`#${id}`).select(".tooltip")
                .style("opacity", 0)
        })
}
function updateHightLight(step) {
    const svg = d3.select(`#${id}`).select("svg")
    const canvas = svg.select("g.canvas")
    canvas.selectAll("rect.bar")
            .attr("fill", (d, i) => i === step? "red": bar_color)
}
</script>
<template>
   <div :id="id">
    <svg class="barchart"></svg>
      <div class="tooltip"></div>
   </div> 
</template>
<style scoped>
#barchart {
    height: 100%;
    width: 100%;
    overflow-x: auto;
    overflow-y:hidden;
    white-space: nowrap;
    padding-bottom: 10px;
}
.barchart {
  height: 100%;
}
.tooltip {
  z-index: 1;
  background: white;
  border: 1px solid black;
  position:absolute;
  padding:0.5%;
  opacity:0;
  pointer-events: none;
}
.bar {
    fill: #ababdd;;
}
</style>