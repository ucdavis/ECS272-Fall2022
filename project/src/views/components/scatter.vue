<template>
    <div class="card" :id="myChartID">
        <svg></svg>
    </div>
</template>
<script>
import * as d3 from "d3";
import testData from "../../assets/data/test.json";
export default {
    name: "ScatterPlot",
    data() {
        return {
            datatest: [{ "x": 1084, "y": 15 }]
        }
    },
    props: {
        myPlotData: Array,
        myChartID: String,
    },
    created() {

    },
    mounted() {
        //let localData = this.myPlotData;
        let localData = this.myPlotData;
        this.init(localData);
        this.drawplot(localData);
    },
    watch: {
        myPlotData(newval, oldval) {
            this.init(newval);
            this.drawplot(newval);
        }
    },
    methods: {
        init(data) {
            let id = '#' + this.myChartID;
            var margin = { top: 10, right: 30, bottom: 20, left: 60 },
                width = 1000 - margin.left - margin.right,
                height = 380 - margin.top - margin.bottom;

                d3.select(id).select("svg").remove();
            const svg = d3.select(id).append("svg")
                .attr("viewbox", [0, 0, width, height])
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
            this.xs = d3.scaleLinear()
                .domain([50, 2000])
                .range([0, width]);

            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(this.xs));

            // Add Y axis
            this.ys = d3.scaleLinear()
                .domain([0, 100])
                .range([height, 0]);

            svg.append("g")
                .call(d3.axisLeft(this.ys));

            this.dots = svg.append('g').attr("id", this.myChartID + "scatter")
        },
        drawplot(data) {
            let id = '#' + this.myChartID;
            let vueThis = this;
            //const svg = d3.select(id).select("svg");

            // Add dots
            var t = d3.transition()
                .duration(1000);
                data = data.filter((p) => p.x>50)
            let selection = d3.select(id+"scatter").selectAll("dot")
                .data(data, function (d) { return d.id; })
            
                selection.enter()
                .append("circle")
                .attr("cx", function (d) { return vueThis.xs(d.x); })
                .attr("cy", function (d) { return vueThis.ys(d.y); })
                .attr("r", 2)
                .style("fill", "#69b3a2")
                selection.exit().remove();

        }
    }
}

</script>

<style scoped>
.card {
    width: 100%;
    height: 100%;
}
</style>