<template>
    <div id="beeswarm"></div>
</template>

<script>
    import * as d3 from "d3";
    import { object } from "vue-types";

    export default {
        name: 'Beeswarm',
        data() { // pass data to others
            return {
                prepared_data: undefined,
                colorScale: undefined
            }
        },
        props:{ // received data from others
            myData: Array,
            mySelection: Object,
            mySinger: String,
            myColor: Array
        },
        watch: { 
            mySelection: function(newVal, oldVal) { // watch it
                this.prepareData(this.myData, this.mySelection);
                this.drawBeeswarm(this.prepared_data, "#beeswarm", this.mySelection);
            },
            mySinger: function(newVal, oldVal) { // watch it
                this.prepareData(this.myData, this.mySelection);
                this.drawBeeswarm(this.prepared_data, "#beeswarm", this.mySelection);
            },
            myColor: function(newVal, oldVal) { // watch it
                console.log(this.myColor);
            }
        },
        mounted(){ // actually drawing
            console.log(this.myColor);
            this.prepareData(this.myData, this.mySelection);
            this.drawBeeswarm(this.prepared_data, "#beeswarm", this.mySelection);
        },
        methods: {
            prepareData(data, selection) {
                console.log("In beeswarm: ", selection.id + selection.text);

                let sorted_data = [];
                data.forEach(element => {
                    let flag = false;
                    let artist = element.artists.split('\'');
                    for (let i=0; i<artist.length; i++){
                        if (artist[i]==this.mySinger){
                            flag = true;
                        }
                    }
                    if (flag == true){
                        let TS_tmp = {
                            acousticness: element.acousticness,
                            danceability: element.danceability,
                            energy: element.energy,
                            instrumentalness: element.instrumentalness,
                            liveness: element.liveness,
                            speechiness: element.speechiness,
                            valence: element.valence,
                            name: element.name
                        };
                        if (element.popularity<20){
                            TS_tmp.popularity = 0;
                        }
                        else if (element.popularity<40){
                            TS_tmp.popularity = 1;
                        }
                        else if (element.popularity<60){
                            TS_tmp.popularity = 2;
                        }
                        else if (element.popularity<80){
                            TS_tmp.popularity = 3;
                        }
                        else if (element.popularity<101){
                            TS_tmp.popularity = 4;
                        }
                        sorted_data.push(TS_tmp);
                    }
                });
                this.prepared_data = sorted_data;
                console.log(sorted_data);
            },

            drawBeeswarm(data, id, selection) {
                const width = d3.select(id).node().getBoundingClientRect().width;
                const margin = { top: 20, right: 40, bottom: 60, left: 60 };

                // Compute values.
                const X = d3.map(data, d => d[selection.text]);
                const G = d3.map(data, d => d.popularity);

                // Compute which data points are considered defined.
                const I = d3.range(X.length);

                // Compute default domains.
                let xDomain = d3.extent(X);
                let groups = d3.sort(G);
                groups = new d3.InternSet(groups);

                // Construct scales and axes.
                const xRange = [margin.left, width - margin.right];
                const xScale = d3.scaleLinear(xDomain, xRange);
                const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
                // const color = d3.scaleOrdinal(groups, d3.schemeSpectral[5]);
                const color = this.myColor;

                // Compute the y-positions.
                const radius = 3;
                const padding = 0.5;
                const Y = dodge(I.map(i => xScale(X[i])), radius * 2 + padding);

                // Compute the default height;
                // let height = d3.max(Y) + (radius + padding) * 2 + margin.top + margin.bottom;
                let height = d3.select(id).node().getBoundingClientRect().height;

                // Given an array of x-values and a separation radius, returns an array of y-values.
                function dodge(X, radius) {
                    const Y = new Float64Array(X.length);
                    const radius2 = radius ** 2;
                    const epsilon = 1e-3;
                    let head = null, tail = null;

                    // Returns true if circle ⟨x,y⟩ intersects with any circle in the queue.
                    function intersects(x, y) {
                    let a = head;
                    while (a) {
                        const ai = a.index;
                        if (radius2 - epsilon > (X[ai] - x) ** 2 + (Y[ai] - y) ** 2) return true;
                        a = a.next;
                    }
                    return false;
                    }

                    // Place each circle sequentially.
                    for (const bi of d3.range(X.length).sort((i, j) => X[i] - X[j])) {

                    // Remove circles from the queue that can’t intersect the new circle b.
                    while (head && X[head.index] < X[bi] - radius2) head = head.next;

                    // Choose the minimum non-intersecting tangent.
                    if (intersects(X[bi], Y[bi] = 0)) {
                        let a = head;
                        Y[bi] = Infinity;
                        do {
                        const ai = a.index;
                        let y = Y[ai] + Math.sqrt(radius2 - (X[ai] - X[bi]) ** 2);
                        if (y < Y[bi] && !intersects(X[bi], y)) Y[bi] = y;
                        a = a.next;
                        } while (a);
                    }
                
                    // Add b to the queue.
                    const b = {index: bi, next: null};
                    if (head === null) head = tail = b;
                    else tail = tail.next = b;
                    }
                
                    return Y;
                }

                d3.selectAll(".beeswarm").remove();
                let svg = d3.select(id).append("svg")
                    .attr("class", "beeswarm")
                    .attr("viewBox", [0, 0, width, height])
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);

                const dot = svg.append("g")
                    .selectAll("circle")
                    .data(I)
                    .join("circle")
                    .attr("cx", i => xScale(X[i]))
                    .attr("cy", i => height - margin.bottom - radius - padding - Y[i])
                    .attr("r", radius)
                    .attr("fill", i => this.myColor[G[i]]);

                // add lengend for chosen colors.
                svg.append("circle")
                    .attr("cx", margin.left + 95)
                    .attr("cy", height -15)
                    .attr("r", 4)
                    .style("fill", this.myColor[0])
                svg.append("circle")
                    .attr("cx", margin.left + 145)
                    .attr("cy", height -15)
                    .attr("r", 4)
                    .style("fill", this.myColor[1])
                svg.append("circle")
                    .attr("cx", margin.left + 195)
                    .attr("cy", height -15)
                    .attr("r", 4)
                    .style("fill", this.myColor[2])
                svg.append("circle")
                    .attr("cx", margin.left + 245)
                    .attr("cy", height -15)
                    .attr("r", 4)
                    .style("fill", this.myColor[3])
                svg.append("circle")
                    .attr("cx", margin.left + 295)
                    .attr("cy", height -15)
                    .attr("r", 4)
                    .style("fill", this.myColor[4])
                
                svg.append("text")
                    .attr("x", margin.left)
                    .attr("y", height -15)
                    .text("Song Popularity:")
                    .style("font-size", "9px")
                    .attr("alignment-baseline","middle")
                svg.append("text")
                    .attr("x", margin.left + 100)
                    .attr("y", height -15)
                    .text("0-20")
                    .style("font-size", "9px")
                    .attr("alignment-baseline","middle")
                svg.append("text")
                    .attr("x", margin.left + 150)
                    .attr("y", height -15)
                    .text("20-40")
                    .style("font-size", "9px")
                    .attr("alignment-baseline","middle")
                svg.append("text")
                    .attr("x", margin.left + 200)
                    .attr("y", height -15)
                    .text("40-60")
                    .style("font-size", "9px")
                    .attr("alignment-baseline","middle")
                svg.append("text")
                    .attr("x", margin.left + 250)
                    .attr("y", height -15)
                    .text("60-80")
                    .style("font-size", "9px")
                    .attr("alignment-baseline","middle")
                svg.append("text")
                    .attr("x", margin.left + 300)
                    .attr("y", height -15)
                    .text("80-100")
                    .style("font-size", "9px")
                    .attr("alignment-baseline","middle")
                    
                // add labels for axes.
                svg.append("g")
                    .attr('transform', `translate(0,${height - margin.bottom})`)
                    .call(xAxis)
                    .style("font-size", "8px")
                    .call(g =>
                        g .select(".tick:last-of-type text")
                        .clone()
                        .attr("text-anchor", "middle")
                        .attr("x", -(width - margin.left - margin.right) / 2)
                        .attr("y", margin.bottom - 35)
                        .attr("font-weight", "bold")
                        .text(selection.text)
                        );

                return svg.node();
            }
        }
    }

</script>


<style>
    #beeswarm {
        width: 100%;
        height: 80%;
        position: relative;
    }
</style>