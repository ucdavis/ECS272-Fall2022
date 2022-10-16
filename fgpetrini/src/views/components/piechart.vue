<template>
    <div id="pie"></div>
</template>

<script>
    import * as d3 from "d3";

    export default {
        name: 'PieChart', 
        data() {
            return {
                margin : 30,
                id : "#pie",
            }
        },
        props:{
            myPieChartData: Array,
            height : Number,
            width : Number,
        },
        mounted(){
            
            const pie_data = this.SatisfactionBreakdown(this.myPieChartData);
            console.log(pie_data);
            this.drawPieChart(pie_data);
        },
        methods: {
            drawPieChart(pie_data) {
                // Satisfaction levels when not loyal to the airline
                this.PieChart(pie_data, {
                    name: d => d.name,
                    value: d => d.value,
                    count: d => d.count,
                    lenged_titles : ["Dissatisfied Respondents", "Satisfied Respondents"],
                    width : this.width,
                    height: this.height,
                    });
            },
            PieChart(data, {
                name = ([x]) => x,  // given d in data, returns the (ordinal) label
                value = ([, y]) => y, // given d in data, returns the (quantitative) value
                count = ([, , z]) => z,
                lenged_titles,
                title, // given d in data, returns the title text
                width = this.width, // outer width, in pixels
                height = this.height, // outer height, in pixels
                innerRadius = 0, // inner radius of pie, in pixels (non-zero for donut)
                outerRadius = Math.min(width, height) / 2, // outer radius of pie, in pixels
                labelRadius = (innerRadius * 0.2 + outerRadius * 0.8), // center radius of labels
                format = ",", // a format specifier for values (in the label)
                names, // array of names (the domain of the color scale)
                colors, // array of colors for names
                stroke = innerRadius > 0 ? "none" : "white", // stroke separating widths
                strokeWidth = 1, // width of stroke separating wedges
                strokeLinejoin = "round", // line join of stroke separating wedges
                padAngle = stroke === "none" ? 1 / outerRadius : 0, // angular separation between wedges
                infoTitle,
                } = {}) {
                // Compute values.
                const N = d3.map(data, name);
                const V = d3.map(data, value);
                const Z = d3.map(data, count);
                const I = d3.range(N.length).filter(i => !isNaN(V[i]));

                // Unique the names.
                if (names === undefined) names = N;
                names = new d3.InternSet(names);

                // Chose a default color scheme based on cardinality.
                if (colors === undefined) colors = d3.schemeSpectral[names.size];
                if (colors === undefined) colors = d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), names.size);

                // Construct scales.
                //const color = d3.scaleOrdinal(names, colors);
                const color = ["orange", "blue"];

                // Compute titles.
                if (title === undefined) {
                    const formatValue = d3.format(format);
                    title = i => `${N[i]}\n${formatValue(V[i])}`;
                } else {
                    const O = d3.map(data, d => d);
                    const T = title;
                    title = i => T(O[i], i, data);
                }

                // Compute pop up titles.
                if (infoTitle === undefined) {
                    const formatValue = d3.format(format);
                    infoTitle = i => `${formatValue(Z[i])}`+" respondents";
                } else {
                    const O = d3.map(data, d => d);
                    const T = infoTitle;
                    infoTitle = i => T(O[i], i, data);
                }

                // Construct arcs.
                const arcs = d3.pie().padAngle(padAngle).sort(null).value(i => V[i])(I);
                const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
                const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);
                console.log(width);
                console.log(height);
                let svg = d3.select(this.id).append("svg")
                    .attr("viewBox", [-width*0.5, -height*0.5, width, height])
                    .attr("width", width-20)
                    .attr("height", height-20);

                svg.append("g")
                    .attr("stroke", stroke)
                    .attr("stroke-width", strokeWidth)
                    .attr("stroke-linejoin", strokeLinejoin)
                    .selectAll("path")
                    .data(arcs)
                    .join("path")
                    .attr("text", d=>console.log(d.data))
                    .attr("fill", d => color[d.data])
                    .attr("fill-opacity", 0.8)
                    .attr("d", arc)
                    .on("mouseover", function(d) {
                    d3.select(this)
                        .attr("stroke", "black")
                        .attr("stroke-width", 2)
                        .attr("transform", "scale(1.1)")
                    })
                    .on("mouseout", function(d) {
                    d3.select(this)
                        .attr("stroke", d => color[d.data])
                        .attr("stroke-width", strokeWidth)
                        .attr("transform", "scale(1.0)")
                    })
                    .append("title")
                    .text(d => infoTitle(d.data));

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
                    //return lines[1]+"%"
                    const lines = `${title(d.data)}`.split(/\n/);
                    console.log(lines)
                    lines[1] = String(Number(lines[1])*100)+"%"
                    return (d.endAngle - d.startAngle) > 0.25 ? lines : lines.slice(0, 1);
                    })
                    .join("tspan")
                    .attr("x", 0)
                    .attr("y", (_, i) => `${i * 1.1}em`)
                    .attr("font-weight", (_, i) => i ? null : "bold")
                    .text(d => d);

                // Handmade legend
                console.log(height);
                svg.append("text").attr("x", width*0.25).attr("y", -height*0.45).text("Legend").style("font-size", "15px").style("font-weight", "bold").attr("alignment-baseline","right");
                svg.append("circle").attr("cx", width*0.25).attr("cy",-height*0.42).attr("r", 4).style("fill", "orange").style("fill-opacity", 0.8);
                svg.append("circle").attr("cx", width*0.25).attr("cy",-height*0.39).attr("r", 4).style("fill", "blue").style("fill-opacity", 0.8);
                svg.append("text").attr("x", width*0.26).attr("y", -height*0.414).text(lenged_titles[0]).style("font-size", "15px").attr("alignment-baseline","right");
                svg.append("text").attr("x",width*0.26).attr("y", -height*0.384).text(lenged_titles[1]).style("font-size", "15px").attr("alignment-baseline","right");
                
            },
            groupBy(objectArray, property) {
                return objectArray.reduce(function (acc, obj) {
                    let key = obj[property];
                    if (!acc[key]) {
                        acc[key] = [];
                    }
                    acc[key].push(obj);
                    return acc;
                }, {});
            },
            SatisfactionBreakdown(data) {
                const chartdata = this.groupBy(data, "satisfaction");
                const dissatisfied = chartdata["neutral or dissatisfied"].length;
                const satisfied = chartdata["satisfied"].length;
                const dissatisfied_share = dissatisfied / (satisfied + dissatisfied);
                const satisfied_share = 1 - dissatisfied_share;

                const formatted_data = [{name: "Dissatisfied", value: dissatisfied_share, count: dissatisfied}, 
                                    {name: "Satisfied", value: satisfied_share, count: satisfied}];
                return formatted_data;
            },
        }
    }

</script>


<style>
#pie {
    background-color: white;
}
</style>