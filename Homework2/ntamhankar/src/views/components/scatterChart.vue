<template>
    <meta charset="utf-8">
    <h1> Instrumentalness vs Liveness </h1>
    <!-- Initialize a Switch -->
    <label class="switch">
        <input type="checkbox">
        <span class="slider round"></span>
    </label>

    <!-- Create a div where the graph will take place -->
    <div id="my_datavizScatter"></div>
</template>

<script>
    import * as d3 from "d3";

    export default{
        name: 'ScatterChart',
        data() {
            return {
                filteredData: [],
                topArtists: [],
                artistNames: [],
                topSongs: [],
                generalName: "Top 10 Artists of 2020",
                //maroon, red, purple, fuschia, green, navy, blue, teal, darkorange, darkgoldenrod
                colorsBySinger: ['#800000','#FF0000','#800080','#FF00FF','#008000','#000080','#0000FF', '#008080', '#ff8c00', '#b8860b'],
                // grey
                generalColor: ["#808080"]

            }
        },
        props:{
            myData: Array,
        },
        mounted(){

            this.getFilteredData()
            this.topArtists = this.getTopArtists(this.filteredData, 10)

            for(let i = 0; i < this.topArtists.length; i++){
                this.artistNames.push(this.topArtists[i].artist)
            }
            this.topSongs = this.getSongs(this.filteredData, this.topArtists);

            this.drawScatter(".switch", "#my_datavizScatter");

            
            
        },
        methods: {
            getFilteredData(){
                this.filteredData = this.myData.filter(function (d) {return d.year >= 2020});
            },

            getArtists(s){
                // the data is read in as string and need to process as if array
                let temp = s.replace('[','');
                temp = temp.replace(']', '');

                let artists = temp.split(", ");

                for(let i = 0; i < artists.length; i++){
                let artist = artists[i];
                artist = artist.replace("'", "");
                artist = artist.replace("'", "");

                artists[i] = artist;

                }

                return artists;
            },
            getTopArtists(array, count){
                let map = new Map();

                for(let i = 0; i < array.length; i++){

                    let artists = this.getArtists(array[i].artists);

                    // deal with just solo artist
                    if(artists.length > 1){
                        continue;
                    }
                    
                    for(let j = 0; j < artists.length; j++){
                        let artist = artists[j];
                    
                        if(map.has(artist)){
                            map.set(artist, map.get(artist) + 1);
                        }else{
                            map.set(artist, 1);
                        }
                    }

                }

                // now get top 10 artists from map
                let byArtists = [];

                map.forEach(function(value, key){
                    byArtists.push({artist: key, count: value});
                });

                byArtists.sort(function(a,b){return a.count - b.count});

                return byArtists.splice(-count);
            },

            getSongs(data, artists){

                let arr = []

                // first put top 10 artists into a set
                let set = new Set()

                for(let i = 0; i < artists.length; i++){
                    set.add(artists[i].artist);
                }

                // now get all songs for these artists
                for(let i = 0; i < data.length; i++){
                    let artists = this.getArtists(data[i].artists);

                    // just take solos
                    if(artists.length > 1){continue;}

                    for(let j = 0; j < artists.length; j++){
                    if(set.has(artists[j])){
                        arr.push(data[i]);
                        break;

                    }

                    }

                }

                return arr;
                

            },
            drawScatter(button, viz){
                let margin = {top : 10, right : 150, bottom : 60, left : 40};

                let width = 500 - margin.left - margin.right;
                let height = 200 - margin.top - margin.bottom;


                // process topArtists into artistNames to just keep names
                let artistNames = [];

                for(let i = 0; i < this.topArtists.length; i++){
                    artistNames.push(this.topArtists[i].artist);
                }


                let color = d3.scaleOrdinal().domain([this.generalName].concat(artistNames)).range(this.generalColor.concat(this.colorsBySinger));


                // Needed for svg
                let svg = null;
                let annotations = null;
                let x = null;
                let y = null;
                let line = null;

                // Needed for switch
                let opacityFlag = 1;


                const createChart = () =>{

                    svg = d3.select(viz)
                        .append("svg")
                            .attr("preserveAspectRatio", "xMidYMid meet")
                            .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
                            .classed("svg-content-responsive", true)
                        .append("g")
                            .attr("transform", `translate(${margin.left},${margin.top})`);

                    // annotation layer to keep labels on top of data
                    annotations = svg.append("g").attr("id", "annotation");
                    
                    // add X-axis
                    x = d3.scaleLinear()
                        .domain([0, 1.0])
                        .range([margin.left, width]);

                    svg.append("g")
                        .attr("transform", `translate(0, ${height})`)
                        .call(d3.axisBottom(x))

                    // add Y-axis
                    y = d3.scaleLinear()
                        .domain([0, 1.0])
                        .range([height, 0]);
                    
                    svg.append("g")
                        .attr("transform", `translate(${margin.left}, 0)`)
                        .call(d3.axisLeft(y));


                    // add the lines using the x and y scale linear functions
                    line = d3.line()
                        .x(function(d) {return x(d.instrumentalness);})
                        .y(function(d) {return y(d.liveness);})


                    // add dots
                    svg.selectAll("dots")
                        .data(this.topSongs)
                        .join("circle")
                        .attr("cx", d => x(d.instrumentalness))
                        .attr("cy", d => y(d.liveness))
                        .attr("id", "dots")
                        .style("fill", (d) => {return color(this.getArtists(d.artists)[0]);})
                        .attr("r", 4)
                        .attr("stroke", "white")
                        .on("mouseover.highlight", function(event, d){
                            d3.select(this)
                            .raise() // bring to front
                            .style("stroke", "black")
                            .style("stroke-width", 2);

                            
                        })
                        .on("mouseout.highlight", function(event, d) {
                            d3.select(this).style("stroke", null);
                        });

                        // Create legend and labels

                        // x - axis label
                        annotations.insert("text")
                            .attr("x", width / 2)
                            .attr("y", height + margin.bottom / 2)
                            .attr("text-anchor", "middle")
                            .text("Instrumentalness")
                            .attr("font-weight", "bold");

                        // y - axis label
                        annotations.insert("text")
                            .attr("x", 0)
                            .attr("y", height / 2)
                            .attr("transform", "rotate(-90)")
                            .attr("dx", -60)
                            .attr("dy", -60)
                            .attr("text-anchor", "middle")
                            .text("Liveness")
                            .attr("font-weight", "bold");

                        // add legend

                        // Add in the legend for each name.
                        annotations.selectAll("labels")
                            .data(artistNames)
                            .enter()
                            .append("text")
                            .attr("x", 325)
                            .attr("y", function(d,i){ return 5 + i*10})
                            .style("fill", function(d, i){ return color(d)})
                            .style("font", "10px times")
                            .text(function(d){ return d})
                            .attr("text-anchor", "left")
                            .style("alignment-baseline", "middle")
                    

                    }

                    
                    const updateChart = () =>{
                        if(opacityFlag == 0){
                            svg.selectAll("#dots")
                                .attr("opacity", 1.0)
                            
                            opacityFlag = 1;
                        }else{
                            svg.selectAll("#dots")
                                .attr("opacity", 0.5)
                            opacityFlag = 0;
                        }
                        
                    }

                    // create chart
                    createChart();

                    // Listen to the slider?
                    d3.select(button).on("change", function(d){
                        updateChart()
                    })

                
                
                },
        }

    }


</script>



<style>

    /* The switch - the box around the slider */
    .switch {
    position: relative;
    display: inline-block;
    width: 30px;
    height: 17px;
    }

    /* Hide default HTML checkbox */
    .switch input {
    opacity: 0;
    width: 0;
    height: 0;
    }

    /* The slider */
    .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
    }

    .slider:before {
    position: absolute;
    content: "";
    height: 13px;
    width: 13px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
    }

    input:checked + .slider {
    background-color: #2196F3;
    }

    input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
    }

    input:checked + .slider:before {
    -webkit-transform: translateX(13px);
    -ms-transform: translateX(13px);
    transform: translateX(13px);
    }

    /* Rounded sliders */
    .slider.round {
    border-radius: 17px;
    }

    .slider.round:before {
    border-radius: 50%;
    }

</style>