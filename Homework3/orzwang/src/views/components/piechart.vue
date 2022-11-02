<template>
    <div id="pie-chart-container">
    </div>
</template>


<script>
import { defineComponent } from 'vue';
import * as d3 from "d3";
import testData from "../../assets/data/test.json";
//const data = await d3.csv(".csv");
//console.log(data);
export default {
    name: "PieChart",
    mounted() {
        console.log(testData);
        let localData = testData['data'];
        this.DrawPieChart(testData, {
            name: d => d.y,
            value: d => d.x,
            width: 640 ,
            height: 400
        })
    },
    methods:{
        DrawPieChart(data, {
            name = ([y]) => y,
            value = ([, x]) => x,
            title,
            width = 640,
            height = 400,
            innerRadius = 0,
            outerRadius = Math.min(width, height) / 2,
            labelRadius = (innerRadius * 0.2 + outerRadius * 0.8),
            format = '',
            names,
            colors,
            stroke = innerRadius > 0 ? "none" : "white",
            strokeWidth = 1,
            strokeLinejoin = "round",
            padAngle = stroke === "none" ? 1 / outerRadius : 0,
        } = {}) {
            const N = d3.map(data, name).slice(0, 15);
            const V = d3.map(data, value).slice(0, 15);
            const I = d3.range(N.length).filter(i => !isNaN(V[i]));
 
            if (names === undefined) names = N;
            names = new d3.InternSet(names);
 
            if (colors === undefined) colors = d3.schemeSpectral[names.size];
            if (colors === undefined) colors = d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), names.size);
 
            const color = d3.scaleOrdinal(names, colors);
 
            if (title === undefined) {
                const formatValue = d3.format(format);
                title = i => `${N[i]}\n${formatValue(V[i])}万亿`;
            } else {
                const O = d3.map(data, d => d);
                const T = title;
                title = i => T(O[i], i, data);
            }
 
            const arcs = d3.pie().padAngle(padAngle).sort(null).value(i => V[i])(I);
            const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
            const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);
  
            const svg = d3.selectAll("#pie-chart-container")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [-width / 2, -height / 2, width, height])
                .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
 
            svg.append("g")
                .attr("stroke", stroke)
                .attr("stroke-width", strokeWidth)
                .attr("stroke-linejoin", strokeLinejoin)
                .selectAll("path")
                .data(arcs)
                .join("path")
                .attr("fill", d => color(N[d.data]))
                .attr("d", arc)
                .append("title")
                .text(d => title(d.data));
 
            svg.append("g")
                .attr("font-family", "sans-serif")
                .attr("font-size", 10)
                .attr("text-anchor", "middle")
                .selectAll("text")
                .data(arcs)
                .join("text")
                .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
                .selectAll("tspan")
                .data(d => {
                    const lines = `${title(d.data)}`.split(/\n/);
                    return (d.endAngle - d.startAngle) > 0.20 ? lines : lines.slice(0, 1);
                })
                .join("tspan")
                .attr("x", 0)
                .attr("y", (_, i) => `${i * 1.1}em`)
                .attr("font-weight", (_, i) => i ? null : "bold")
                .text(d => d);
        }
    }
}
</script>