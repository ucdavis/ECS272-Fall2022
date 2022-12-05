<template>
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
                start: 1990,
                end: 2022
            }
        },
        props:{
            myBarchartData: Array,
            myChartID: String,
        },
        mounted(){
            let localData = [];
            Object.keys(this.myBarchartData).forEach(item=>{
                let thiskey = parseInt(this.myBarchartData[item].y);
                if ((thiskey>this.start) & (thiskey<this.end)){
                    localData.push(this.myBarchartData[item]);
                }
                console.log(item, thiskey, this.start, this.end)
                console.log(this.myBarchartData[item])
            });
            //let localData = testData['data'];
            this.drawBarChart(localData, this.myChartID) 
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
                console.log()
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
                const margin = { top: 20, right: 20, bottom: 30, left: 60 };
                const height = 200;
                const width = 1000;
                const focusHeight = 100;

                const x = d3.scaleBand().domain(data.map(d => d.y))
                    .rangeRound([margin.left, width - margin.right])
                    .padding(0.1);

                const y = d3.scaleLinear().domain([0, d3.max(data, d => d.x)]).nice()
                    .rangeRound([height - margin.bottom, margin.top]);
                

                d3.select(id).select("svg").remove();
                const svg = d3.select(id).append("svg")
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
                    .attr("fill", "steelblue");

                let curve = d3.curveLinear
                let line = d3.line()
                    .curve(curve)
                    .x(d => x(d.y))
                    .y(d => y(d.x))

                svg.append("path")
                .datum(data)
                .attr('d', line(data))
                .attr("fill", "none")
                .attr("stroke","steelblue")
                .attr('stroke-width', 3)
                .attr('stroke', 'red');
                
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
                        .attr("font-weight", "bold"));

                ///////////////////////Brush//////////////////////////////////////
                const area = (x, y) => d3.area()
                    .defined(d => !isNaN(d.value))
                    .x(d => x(d.date))
                    .y0(y(0))
                    .y1(d => y(d.value))

                //const x = d3.scaleUtc()
                //    .domain(d3.extent(data, d => d.date))
                //    .range([margin.left, width - margin.right])

                //const y = d3.scaleLinear()
                    //.domain([0, d3.max(data, d => d.value)])
                    //.range([height - margin.bottom, margin.top])

                //const xAxis = (g, x, height) => g
                //    .attr("transform", `translate(0,${height - margin.bottom})`)
                //    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

                //const yAxis = (g, y, title) => g
                //    .attr("transform", `translate(${margin.left},0)`)
                //    .call(d3.axisLeft(y))
                //    .call(g => g.select(".domain").remove())
                //    .call(g => g.selectAll(".title").data([title]).join("text")
                //        .attr("class", "title")
                //        .attr("x", -margin.left)
                //        .attr("y", 10)
                //        .attr("fill", "currentColor")
                //        .attr("text-anchor", "start")
                //       .text(title))

                //svg.append("g")
                //    .call(xAxis, x, focusHeight);

                //svg.append("path")
                //    .datum(data)
                //    .attr("fill", "steelblue")
                //    .attr("d", area(x, y.copy().range([focusHeight - margin.bottom, 4])));
                const vueThis = this;

                const brush = d3.brushX()
                    .extent([[margin.left, 0.5], [width - margin.right, height - margin.bottom + 0.5]])
                    //.attr("transform", `translate(0,${height - margin.bottom})`)
                    .on("brush", brushed)
                    .on("end", brushended);

                const defaultSelection = [x(2000), x(2010)];

                const gb = svg.append("g")
                    .call(brush)
                    .call(brush.move, defaultSelection);
                
                function brushed({selection}) {
                    //console.log(selection);
                    let select_start = 0
                    let select_end = 0
                    if (selection) {
                        console.log(selection[0],x(2000))
                        for (let year=1990; year<=2020; year++){
                            if (selection[0]<=x(year) & select_start == 0) { select_start = year}
                            if (selection[1]>=x(year)) { select_end = year}
                        }
                    let selecteddata = [select_start, select_end]
                    vueThis.$emit("selectedyear", selecteddata)
                    //svg.property("value", selection.map(x.invert, x).map(d3.utcDay.round));
                    //svg.dispatch("input");
                    console.log("Selected", select_start, select_end)
                    }
                }

                function brushended({selection}) {
                    //console.log(selection);
                    if (!selection) {
                    gb.call(brush.move, defaultSelection);
                    }
                }
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