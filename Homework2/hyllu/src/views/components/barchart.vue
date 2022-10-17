<template>
    <div id="bar"></div>
</template>

<script>
    import * as d3 from "d3";
import { object } from "vue-types";
    import testData from "../../assets/data/test.json"; /* Example of reading in data direct from file*/

    export default {
        name: 'BarChart',
        data() { // pass data to others
            return {
                name: 'Hello',
                someLocalValues: [1, 2, 3, 4, 5],
                prepared_data: undefined,
                colorScale: undefined
            }
        },
        props:{ // received data from others
            myBarchartData: Array,
            mySelection: Object
        },
        watch: { 
            mySelection: function(newVal, oldVal) { // watch it
                console.log('Prop changed: ', newVal, ' | was: ', oldVal)
                this.prepareData(this.myBarchartData, this.mySelection);
                if (this.mySelection.id===1 || this.mySelection.id===2 || this.mySelection.id===3){
                    console.log(this.mySelection.id, "bar");
                    this.drawBarChart(this.prepared_data, "#bar")
                }
                else{
                    console.log(this.mySelection.id, "stacked");
                    this.drawStackedBarChart(this.prepared_data, "#bar")
                }
                // this.drawStackedBarChart(this.prepared_data, "#bar") /* Example of reading data from a json file */
            }
        },
        mounted(){ // actually drawing
            // console.log(testData);
            let localData = testData['data'];
            this.prepareData(this.myBarchartData, this.mySelection);
            if (this.mySelection.id===1 || this.mySelection.id===2 || this.mySelection.id===3){
                console.log(this.mySelection.id, "bar");
                this.drawBarChart(this.prepared_data, "#bar")
            }
            else{
                console.log(this.mySelection.id, "stacked");
                this.drawStackedBarChart(this.prepared_data, "#bar")
            }
            // this.drawBarChart(localData, "#bar") /* Example of reading data from a json file */
            // this.drawBarChart(this.myBarchartData, "#bar") // draw data passed from others.
            // console.log("Data Passed down as a Prop  ", this.myBarchartData)
        },
        methods: {
            prepareData(data, selection) {
                console.log("prepareData: ", selection.id);
                let year_composer = {
                    A: {A:0, B:0, C:0, D:0, E:0},
                    B: {A:0, B:0, C:0, D:0, E:0},
                    C: {A:0, B:0, C:0, D:0, E:0},
                    D: {A:0, B:0, C:0, D:0, E:0},
                    E: {A:0, B:0, C:0, D:0, E:0},
                    F: {A:0, B:0, C:0, D:0, E:0},
                    G: {A:0, B:0, C:0, D:0, E:0}
                };
                data.forEach(element => {
                    let artist = element.artists.split('\'');
                    let musician_log = [];
                    let flag = false;
                    for (let i=0; i<artist.length; i++){
                        if (artist[i][0]!='[' && artist[i][0]!=']' && artist[i][0]!=','){
                            musician_log.push(artist[i]);
                        }
                        if (artist[i]=="Taylor Swift"){
                            flag = true;
                        }
                    }
                    if (flag == true){
                        let piano_tmp = {
                            acousticness: element.acousticness,
                            danceability: element.danceability,
                            energy: element.energy,
                            instrumentalness: element.instrumentalness,
                            liveness: element.liveness,
                            speechiness: element.speechiness,
                            valence: element.valence,
                            name: element.name,
                            year: element.year,
                            artists: musician_log,
                            popularity: element.popularity
                        };
                        if (element.year < 2008){
                            if (element.popularity < 20){
                                year_composer["A"]["A"] += 1;
                            }
                            else if (element.popularity < 40){
                                year_composer["A"]["B"] += 1;
                            }
                            else if (element.popularity < 60){
                                year_composer["A"]["C"] += 1;
                            }
                            else if (element.popularity < 80){
                                year_composer["A"]["D"] += 1;
                            }
                            else if (element.popularity < 101){
                                year_composer["A"]["E"] += 1;
                            }
                        }
                        else if (element.year < 2010){
                            if (element.popularity < 20){
                                year_composer["B"]["A"] += 1;
                            }
                            else if (element.popularity < 40){
                                year_composer["B"]["B"] += 1;
                            }
                            else if (element.popularity < 60){
                                year_composer["B"]["C"] += 1;
                            }
                            else if (element.popularity < 80){
                                year_composer["B"]["D"] += 1;
                            }
                            else if (element.popularity < 101){
                                year_composer["B"]["E"] += 1;
                            }
                        }
                        else if (element.year < 2012){
                            if (element.popularity < 20){
                                year_composer["C"]["A"] += 1;
                            }
                            else if (element.popularity < 40){
                                year_composer["C"]["B"] += 1;
                            }
                            else if (element.popularity < 60){
                                year_composer["C"]["C"] += 1;
                            }
                            else if (element.popularity < 80){
                                year_composer["C"]["D"] += 1;
                            }
                            else if (element.popularity < 101){
                                year_composer["C"]["E"] += 1;
                            }
                        }
                        else if (element.year < 2014){
                            if (element.popularity < 20){
                                year_composer["D"]["A"] += 1;
                            }
                            else if (element.popularity < 40){
                                year_composer["D"]["B"] += 1;
                            }
                            else if (element.popularity < 60){
                                year_composer["D"]["C"] += 1;
                            }
                            else if (element.popularity < 80){
                                year_composer["D"]["D"] += 1;
                            }
                            else if (element.popularity < 101){
                                year_composer["D"]["E"] += 1;
                            }
                        }
                        else if (element.year < 2017){
                            if (element.popularity < 20){
                                year_composer["E"]["A"] += 1;
                            }
                            else if (element.popularity < 40){
                                year_composer["E"]["B"] += 1;
                            }
                            else if (element.popularity < 60){
                                year_composer["E"]["C"] += 1;
                            }
                            else if (element.popularity < 80){
                                year_composer["E"]["D"] += 1;
                            }
                            else if (element.popularity < 101){
                                year_composer["E"]["E"] += 1;
                            }
                        }
                        else if (element.year < 2019){
                            if (element.popularity < 20){
                                year_composer["F"]["A"] += 1;
                            }
                            else if (element.popularity < 40){
                                year_composer["F"]["B"] += 1;
                            }
                            else if (element.popularity < 60){
                                year_composer["F"]["C"] += 1;
                            }
                            else if (element.popularity < 80){
                                year_composer["F"]["D"] += 1;
                            }
                            else if (element.popularity < 101){
                                year_composer["F"]["E"] += 1;
                            }
                        }
                        else if (element.year < 2020){
                            if (element.popularity < 20){
                                year_composer["G"]["A"] += 1;
                            }
                            else if (element.popularity < 40){
                                year_composer["G"]["B"] += 1;
                            }
                            else if (element.popularity < 60){
                                year_composer["G"]["C"] += 1;
                            }
                            else if (element.popularity < 80){
                                year_composer["G"]["D"] += 1;
                            }
                            else if (element.popularity < 101){
                                year_composer["G"]["E"] += 1;
                            }
                        }
                    }
                });
                let year_popularity = [];
                let year_popularity_C = [];
                let year_popularity_D = [];
                let year_popularity_E = [];
                Object.keys(year_composer).forEach(key => {
                    Object.keys(year_composer[key]).forEach(k => {
                        if (key=='A'){
                            if (k=='C'){
                                let pop_tmp = {
                                    album: "Taylor Swift (2006)",
                                    popularity: "popularity 40-60",
                                    songs: year_composer[key][k]
                                };
                                year_popularity.push(pop_tmp);
                                year_popularity_C.push(pop_tmp);
                            }
                            else if (k=='D'){
                                let pop_tmp = {
                                    album: "Taylor Swift (2006)",
                                    popularity: "popularity 60-80",
                                    songs: year_composer[key][k]
                                };
                                year_popularity.push(pop_tmp);
                                year_popularity_D.push(pop_tmp);
                            }
                            else if (k=='E'){
                                let pop_tmp = {
                                    album: "Taylor Swift (2006)",
                                    popularity: "popularity 80-100",
                                    songs: year_composer[key][k]
                                };
                                year_popularity.push(pop_tmp);
                                year_popularity_E.push(pop_tmp);
                            }
                        }
                        else if (key=='B'){
                            if (k=='C'){
                                let pop_tmp = {
                                    album: "Fearless (2008)",
                                    popularity: "popularity 40-60",
                                    songs: year_composer[key][k]
                                };
                                year_popularity.push(pop_tmp);
                                year_popularity_C.push(pop_tmp);
                            }
                            else if (k=='D'){
                                let pop_tmp = {
                                    album: "Fearless (2008)",
                                    popularity: "popularity 60-80",
                                    songs: year_composer[key][k]
                                };
                                year_popularity.push(pop_tmp);
                                year_popularity_D.push(pop_tmp);
                            }
                            else if (k=='E'){
                                let pop_tmp = {
                                    album: "Fearless (2008)",
                                    popularity: "popularity 80-100",
                                    songs: year_composer[key][k]
                                };
                                year_popularity.push(pop_tmp);
                                year_popularity_E.push(pop_tmp);
                            }
                        }
                        else if (key=='C'){
                            if (k=='C'){
                                let pop_tmp = {
                                    album: "Speak Now (2010)",
                                    popularity: "popularity 40-60",
                                    songs: year_composer[key][k]
                                };
                                year_popularity.push(pop_tmp);
                                year_popularity_C.push(pop_tmp);
                            }
                            else if (k=='D'){
                                let pop_tmp = {
                                    album: "Speak Now (2010)",
                                    popularity: "popularity 60-80",
                                    songs: year_composer[key][k]
                                };
                                year_popularity.push(pop_tmp);
                                year_popularity_D.push(pop_tmp);
                            }
                            else if (k=='E'){
                                let pop_tmp = {
                                    album: "Speak Now (2010)",
                                    popularity: "popularity 80-100",
                                    songs: year_composer[key][k]
                                };
                                year_popularity.push(pop_tmp);
                                year_popularity_E.push(pop_tmp);
                            }
                        }
                        else if (key=='D'){
                            if (k=='C'){
                                let pop_tmp = {
                                    album: "Red (2012)",
                                    popularity: "popularity 40-60",
                                    songs: year_composer[key][k]
                                };
                                year_popularity.push(pop_tmp);
                                year_popularity_C.push(pop_tmp);
                            }
                            else if (k=='D'){
                                let pop_tmp = {
                                    album: "Red (2012)",
                                    popularity: "popularity 60-80",
                                    songs: year_composer[key][k]
                                };
                                year_popularity.push(pop_tmp);
                                year_popularity_D.push(pop_tmp);
                            }
                            else if (k=='E'){
                                let pop_tmp = {
                                    album: "Red (2012)",
                                    popularity: "popularity 80-100",
                                    songs: year_composer[key][k]
                                };
                                year_popularity.push(pop_tmp);
                                year_popularity_E.push(pop_tmp);
                            }
                        }
                        else if (key=='E'){
                            if (k=='C'){
                                let pop_tmp = {
                                    album: "1989 (2014)",
                                    popularity: "popularity 40-60",
                                    songs: year_composer[key][k]
                                };
                                year_popularity.push(pop_tmp);
                                year_popularity_C.push(pop_tmp);
                            }
                            else if (k=='D'){
                                let pop_tmp = {
                                    album: "1989 (2014)",
                                    popularity: "popularity 60-80",
                                    songs: year_composer[key][k]
                                };
                                year_popularity.push(pop_tmp);
                                year_popularity_D.push(pop_tmp);
                            }
                            else if (k=='E'){
                                let pop_tmp = {
                                    album: "1989 (2014)",
                                    popularity: "popularity 80-100",
                                    songs: year_composer[key][k]
                                };
                                year_popularity.push(pop_tmp);
                                year_popularity_E.push(pop_tmp);
                            }
                        }
                        else if (key=='F'){
                            if (k=='C'){
                                let pop_tmp = {
                                    album: "Reputation (2017)",
                                    popularity: "popularity 40-60",
                                    songs: year_composer[key][k]
                                };
                                year_popularity.push(pop_tmp);
                                year_popularity_C.push(pop_tmp);
                            }
                            else if (k=='D'){
                                let pop_tmp = {
                                    album: "Reputation (2017)",
                                    popularity: "popularity 60-80",
                                    songs: year_composer[key][k]
                                };
                                year_popularity.push(pop_tmp);
                                year_popularity_D.push(pop_tmp);
                            }
                            else if (k=='E'){
                                let pop_tmp = {
                                    album: "Reputation (2017)",
                                    popularity: "popularity 80-100",
                                    songs: year_composer[key][k]
                                };
                                year_popularity.push(pop_tmp);
                                year_popularity_E.push(pop_tmp);
                            }
                        }
                        else if (key=='G'){
                            if (k=='C'){
                                let pop_tmp = {
                                    album: "Lover (2019)",
                                    popularity: "popularity 40-60",
                                    songs: year_composer[key][k]
                                };
                                year_popularity.push(pop_tmp);
                                year_popularity_C.push(pop_tmp);
                            }
                            else if (k=='D'){
                                let pop_tmp = {
                                    album: "Lover (2019)",
                                    popularity: "popularity 60-80",
                                    songs: year_composer[key][k]
                                };
                                year_popularity.push(pop_tmp);
                                year_popularity_D.push(pop_tmp);
                            }
                            else if (k=='E'){
                                let pop_tmp = {
                                    album: "Lover (2019)",
                                    popularity: "popularity 80-100",
                                    songs: year_composer[key][k]
                                };
                                year_popularity.push(pop_tmp);
                                year_popularity_E.push(pop_tmp);
                            }
                        }
                    });
                });
                if (selection.id === 1){
                    this.prepared_data = year_popularity_C;
                }
                else if (selection.id === 2){
                    this.prepared_data = year_popularity_D;
                }
                else if (selection.id === 3){
                    this.prepared_data = year_popularity_E;
                }
                else{
                    this.prepared_data = year_popularity;
                }
                // this.prepared_data = year_popularity;
            },

            drawBarChart(data, id) {

                const margin = { top: 40, right: 40, bottom: 120, left: 100 };
                const height = 300;
                const width = 500;

                const x = d3.scaleBand().domain(data.map(d => d.album))
                    .rangeRound([margin.left, width - margin.right])
                    .padding(0.1);

                const y = d3.scaleLinear().domain([0, d3.max(data, d => d.popularity)]).nice()
                    .rangeRound([height - margin.bottom, margin.top]);

                d3.selectAll(".barchart").remove();
                let svg = d3.select(id).append("svg")
                    .attr("class", "barchart")
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
            drawStackedBarChart(data, id) {

                const margin = { top: 20, right: 80, bottom: 30, left: 40 };
                // const height = 300;
                // const width = 500;

                let width  = 600;
                let height = 300;
                console.log(data);
                const chartData = data;
                const X = d3.map(chartData, d => d.album);
                const Y = d3.map(chartData, d => d.songs);
                const Z = d3.map(chartData, d => d.popularity);

                let xDomain = X;
                let zDomain = Z;
                xDomain = new d3.InternSet(xDomain);
                zDomain = new d3.InternSet(zDomain);
                const xRange = [margin.left, width - margin.right];
                const yRange = [height - margin.bottom, margin.top];
                const I = d3.range(X.length);

                const series = d3.stack()
                    .keys(zDomain)
                    .value(([x, I], z) => Y[I.get(z)])
                    .order(d3.stackOrderNone)
                    .offset(d3.stackOffsetDiverging)
                    (d3.rollup(I, ([i]) => i, i => X[i], i => Z[i]))
                    .map(s => s.map(d => Object.assign(d, {i: d.data[1].get(s.key)})));

                // return series;
                const yDomain = d3.extent(series.flat(2));

                // Construct scales, axes, and formats.
                const xScale = d3.scaleBand(xDomain, xRange).paddingInner(0.1);
                const yScale = d3.scaleLinear(yDomain, yRange);
                // return zDomain
                // const colors = d3.schemeSpectral[zDomain.size];
                const color = d3.scaleOrdinal(zDomain, d3.schemeSpectral[zDomain.size]);
                this.colorScale = color;
                // return color(0);
                const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
                const yAxis = d3.axisLeft(yScale).ticks(height / 25, "");

                // const svg = d3.create('svg')
                //     .attr('id', "svg_1")
                //     .attr('viewBox', [0, 0, width, height])
                
                d3.selectAll(".barchart").remove();
                let svg = d3.select(id).append("svg")
                    .attr("class", "barchart")
                    .attr("viewBox", [0, 0, width, height])
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);


                const bar = svg.append("g")
                    .selectAll("g")
                    .data(series)
                    .join("g")
                    .attr("fill", ([{i}]) => color(Z[i]))
                    .selectAll("rect")
                    .data(d => d)
                    .join("rect")
                    .attr("x", ({i}) => xScale(X[i]))
                    .attr("y", ([y1, y2]) => Math.min(yScale(y1), yScale(y2)))
                    .attr("height", ([y1, y2]) => Math.abs(yScale(y1) - yScale(y2)))
                    .attr("width", xScale.bandwidth())
                
                // add lengend for chosen colors.
                svg.append("circle")
                    .attr("cx", width-margin.right + 10)
                    .attr("cy", margin.top + 15)
                    .attr("r", 4)
                    .style("fill", color(0))
                svg.append("circle")
                    .attr("cx", width-margin.right + 10)
                    .attr("cy", margin.top + 30)
                    .attr("r", 4)
                    .style("fill", color(1))
                svg.append("circle")
                    .attr("cx", width-margin.right + 10)
                    .attr("cy", margin.top + 45)
                    .attr("r", 4)
                    .style("fill", color(2))
                
                svg.append("text")
                    .attr("x", width-margin.right)
                    .attr("y", margin.top)
                    .text("Popularity of Songs")
                    .style("font-size", "9px")
                    .attr("alignment-baseline","middle")
                svg.append("text")
                    .attr("x", width-margin.right + 15)
                    .attr("y", margin.top + 16)
                    .text("40-60")
                    .style("font-size", "9px")
                    .attr("alignment-baseline","middle")
                svg.append("text")
                    .attr("x", width-margin.right + 15)
                    .attr("y", margin.top + 31)
                    .text("60-80")
                    .style("font-size", "9px")
                    .attr("alignment-baseline","middle")
                svg.append("text")
                    .attr("x", width-margin.right + 15)
                    .attr("y", margin.top + 46)
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
                        .attr("y", margin.bottom - 8)
                        .attr("font-weight", "bold")
                        .text("Album")
                        );

                svg.append("g")
                    .attr('transform', `translate(${margin.left}, 0)`)
                    .call(yAxis)
                    .style("font-size", "8px")
                    .call(g =>
                        g
                        .select(".tick:last-of-type text")
                        .clone()
                        .attr("transform", `rotate(-90)`)
                        .attr("text-anchor", "middle")
                        .attr("y", -margin.left +10)
                        .attr("x", -((height - margin.bottom - margin.top)/2))
                        .attr("font-weight", "bold")
                        .text("#Song")
                        );

                return Object.assign(svg.node(), {scales: {color}});
            }
        }
    }

</script>


<style>

</style>