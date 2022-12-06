<template>
    <h2>Scatter plot of all projects</h2>
    <div class="card" :id="myChartID">
        <svg></svg>
    </div>
</template>
<script>
import * as d3 from "d3";
import testData from "../../assets/data/test.json";
export default{
    name : "ScatterPlot",
    data(){
        return{
            margin : {top: 10, right: 30, bottom: 30, left: 60},
            width : 460 - margin.left - margin.right,
            height : 400 - margin.top - margin.bottom,
        }
    },
    props:{
        myPlotData : Array,
        myChartID : String,
    },
    created(){

    },
    mounted(){
        let localData = this.myPlotData;
        this.init(localData);
        this.drawplot(localData);
    },
    watch:{
        myPlotData(newval, oldval){
            this.drawplot(newval);
        }
    },
    methods:{
        init(data){
            let id= '#'+this.myChartID;
            const svg = d3.select(id).select("svg")
                        .attr("viewbox",[0,0, this.width, this.height])
                        .append("g")
                        .attr("transform",
                            "translate(" + this.margin.left + "," + this.margin.top + ")");
            this.x = d3.scaleLinear()
                        .domain([0, 8000])
                        .range([ 0, this.width ]);

                    svg.append("g")
                        .attr("transform", "translate(0," + this.height + ")")
                        .call(d3.axisBottom(this.x));

                    // Add Y axis
            this.y = d3.scaleLinear()
                        .domain([0, 100])
                        .range([ this.height, 0]);

                    svg.append("g")
                        .call(d3.axisLeft(this.y));
        },
        drawplot(data){
            let id= '#'+this.myChartID;
            const svg = d3.select(id).select("svg");

            // Add dots
            svg.append('g')
                .selectAll("dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return this.x(d.x); } )
                .attr("cy", function (d) { return this.y(d.y); } )
                .attr("r", 1.5)
                .style("fill", "#69b3a2")

        }
    }
}

</script>

<style scoped>
.card{
    width: 100%;
    height: 100%;
}
</style>