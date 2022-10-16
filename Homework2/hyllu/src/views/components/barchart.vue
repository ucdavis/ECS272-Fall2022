<template>
    <div id="bar"></div>
</template>

<script>
    import * as d3 from "d3";
    import testData from "../../assets/data/test.json"; /* Example of reading in data direct from file*/

    export default {
        name: 'BarChart',
        data() { // pass data to others
            return {
                name: 'Hello',
                someLocalValues: [1, 2, 3, 4, 5],
                prepared_data: {},
            }
        },
        props:{ // received data from others
            myBarchartData: Array,
            mySelection: String
        },
        watch: { 
            mySelection: function(newVal, oldVal) { // watch it
                console.log('Prop changed: ', newVal, ' | was: ', oldVal)
                this.prepareData(this.myBarchartData, this.mySelection);
            }
        },
        mounted(){ // actually drawing
            // console.log(testData);
            let localData = testData['data'];
            this.prepareData(this.myBarchartData, this.mySelection);
            this.drawBarChart(localData, "#bar") /* Example of reading data from a json file */
            // this.drawBarChart(this.myBarchartData, "#bar") // draw data passed from others.
            // console.log("Data Passed down as a Prop  ", this.myBarchartData)
        },
        methods: {
            prepareData(data, selection) {
                console.log("prepareData: ", selection);
                let sorted_data = [];
                data.forEach(element => {
                    let artist = element.artists.split('\'');
                    // console.log(artist);
                    // if (artist.length>5){
                    //     console.log(artist);
                        
                    // }
                    let musician_log = [];
                    let flag = false;
                    for (let i=0; i<artist.length; i++){
                        if (artist[i][0]!='[' && artist[i][0]!=']' && artist[i][0]!=','){
                            musician_log.push(artist[i]);
                        }
                        if (artist[i]=="Vladimir Horowitz"){
                            flag = true;
                            // if (artist[i] in sorted_data);
                            // else {
                            //     sorted_data[artist[i]] = 0;
                            // }
                        }
                    }
                    if (flag == true){
                        // console.log(musician_log);
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
                        sorted_data.push(piano_tmp);
                    }
                });
                console.log(sorted_data.length, sorted_data); //614
            },

            drawBarChart(data, id) {

                const margin = { top: 40, right: 40, bottom: 120, left: 100 };
                const height = 300;
                const width = 500;

                const x = d3.scaleBand().domain(data.map(d => d.y))
                    .rangeRound([margin.left, width - margin.right])
                    .padding(0.1);

                const y = d3.scaleLinear().domain([0, d3.max(data, d => d.x)]).nice()
                    .rangeRound([height - margin.bottom, margin.top]);

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

</style>