<template>
    <div>Start From: {{ start }}</div>
    <select v-model="start">
        <option v-for="item in myBarchartData" :value="item.y">
            {{ item.y }}
        </option>
    </select>
    <div class="card" :id="myChartID">
    </div>
</template>

<script>
    import * as d3 from "d3";
    import testData from "../../assets/data/test.json"; /* Example of reading in data direct from file*/

    export default {
        name: 'BarChart',
        data() {
            return {
                //name: 'Hello',
                //someLocalValues: [1, 2, 3, 4, 5],
                start: 1945,
                end: 2022
            }
        },
        props:{
            myBarchartData: Array,
            myChartID: String,
        },
        mounted(){
            console.log("Drawing Barchart");
            console.log(this.myChartID)
            //console.log(this.myBarchartData);
            let localData = this.myBarchartData;
            //let localData = testData['data'];
            this.drawBarChart(localData, this.myChartID) /* Example of reading data from a json file */
            //this.drawBarChart(this.myBarchartData, "#bar")
            //console.log("Data Passed down as a Prop  ", localData)
        },
        watch: {
            start(val, oldval){
                //this.start = this.lower;
                console.log("start year changed into"+this.start)
                let localData = [];
                Object.keys(this.myBarchartData).forEach(item=>{
                    let thiskey = parseInt(this.myBarchartData[item].y);
                    if ((thiskey>this.start) & (thiskey<this.end)){
                        localData.push(this.myBarchartData[item]);
                    }
                    //console.log(item, thiskey, this.start, this.end)
                    //console.log(this.myBarchartData[item])
                });
                //let localData = testData['data'];
                this.drawBarChart(localData, this.myChartID) /* Example of reading data from a json file */
                //this.drawBarChart(this.myBarchartData, "#bar")
                console.log("Data Passed down as a Prop  ", localData)
            }
        },
        methods: {
            changeData(){
                this.start = this.lower
                console.log("Data Changed!")
                console.log(this.start)
            },
            drawBarChart(data, id) {
                id = '#'+id
                const margin = { top: 40, right: 40, bottom: 60, left: 60 };
                const height = 250;
                const width = 500;

                const x = d3.scaleBand().domain(data.map(d => d.y))
                    .rangeRound([margin.left, width - margin.right])
                    .padding(0.1);

                const y = d3.scaleLinear().domain([0, d3.max(data, d => d.x)]).nice()
                    .rangeRound([height - margin.bottom, margin.top]);
                

                d3.select(id).select("svg").remove();
                let svg = d3.select(id).append("svg")
                    .attr("viewBox", [0, 0, width, height])
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);

                svg.selectAll("rect")
                    .data(data)
                    .join("rect")
                    .attr("x", d => x(d.y))
                    .attr("y", d => y(d.x))
                    .attr("width", x.bandwidth())
                    .attr("height", d => y(0) - y(d.x))
                    .attr("fill", "green");

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
            },
        }
    }

</script>


<style>
/*div.
{
    width:220px;
    padding:10px;
    border:5px solid gray;
    margin:0px;
}*/
</style>