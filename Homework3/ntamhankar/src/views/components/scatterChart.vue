<template>
    <meta charset="utf-8">
    <h1> Instrumentalness vs Liveness </h1>
    <!-- Initialize a Button -->
    <button type="button" id="reset">Reset</button>

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
                generalColor: ["#808080"],

                // making these part of data as they are accessed by other functions
                svg: null, // the svg that we are trying to draw
                color: null, // function used to assign color to the dots
                x: null, // function used to determine the x-coordinate
                y: null, // function used to determine the y-coordinate

                annotations: null,

                zoom: null,

            }
        },
        props:{
            myData: Array, // original data received from CSV
            brushedData: Array, // the brushed data received when event is triggered by parallel Set
        },
        watch:{
            brushedData: function(value){
                console.log("Got the updated brushed Data in scatter watch");
                console.log(value);

                let currentArtists = this.getTopArtists(value, 10);

                let currentArtistsNames = [];
                for(let i = 0; i < currentArtists.length; i++){
                    currentArtistsNames.push(currentArtists[i].artist)
                }

                this.updateChart(value, currentArtistsNames);

            }
        },
        mounted(){

            this.getFilteredData()
            this.topArtists = this.getTopArtists(this.filteredData, 10)

            for(let i = 0; i < this.topArtists.length; i++){
                this.artistNames.push(this.topArtists[i].artist)
            }
            this.topSongs = this.getSongs(this.filteredData, this.topArtists);

            this.init("#reset", "#my_datavizScatter");

            
            
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
            init(button, viz){
                let margin = {top : 10, right : 150, bottom : 60, left : 40};

                let width = 500 - margin.left - margin.right;
                let height = 200 - margin.top - margin.bottom;


                // process topArtists into artistNames to just keep names
                let artistNames = [];

                for(let i = 0; i < this.topArtists.length; i++){
                    artistNames.push(this.topArtists[i].artist);
                }


                this.color = d3.scaleOrdinal().domain([this.generalName].concat(artistNames)).range(this.generalColor.concat(this.colorsBySinger));


                // Needed for svg
                let line = null;

                this.svg = d3.select(viz)
                        .append("svg")
                            .attr("preserveAspectRatio", "xMidYMid meet")
                            .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
                            .classed("svg-content-responsive", true)
                        .append("g")
                            .attr("transform", `translate(${margin.left},${margin.top})`);

                // annotation layer to keep labels on top of data
                this.annotations = this.svg.append("g").attr("id", "annotation");

                // add X-axis
                this.x = d3.scaleLinear()
                    .domain([0, 1.0])
                    .range([margin.left, width]);

                let xAxis = (g, x) => g
                    .attr("transform", `translate(0, ${height})`)
                    .call(d3.axisBottom(x))

                // add Y-axis
                this.y = d3.scaleLinear()
                    .domain([0, 1.0])
                    .range([height, 0]);

                let yAxis = (g, y) => g
                    .attr("transform", `translate(${margin.left}, 0)`)
                    .call(d3.axisLeft(y));


                // add the lines using the x and y scale linear functions
                line = d3.line()
                    .x((d) => {return this.x(d.instrumentalness);})
                    .y((d) => {return this.y(d.liveness);})


                // create a clipping region so that dots don't go past the axes
                // use def tags
                this.svg.append("defs").append("clipPath")
                    .attr("id", "clip")
                    .append("rect")
                    .attr("width", width - 30) //slight adjustment to get proper window
                    .attr("height", height)
                    .attr("transform", `translate(${margin.left - 10}, 0)`) //so that points do not go into y-axis


                let plotArea = this.svg.append("g") // we don't want to clip the axes.
                        .attr("clip-path","url(#clip)")
                        .attr("id", "scatterClip")

                // add dots
                let dots = this.svg.select("#scatterClip").selectAll("#dots")
                    .data(this.topSongs)
                    .join("circle")
                    .attr("cx", d => this.x(d.instrumentalness))
                    .attr("cy", d => this.y(d.liveness))
                    .attr("id", "dots")
                    .style("fill", (d) => {return this.color(this.getArtists(d.artists)[0]);})
                    .attr("r", 4)
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
                this.annotations.insert("text")
                    .attr("x", width / 2)
                    .attr("y", height + margin.bottom / 2)
                    .attr("text-anchor", "middle")
                    .text("Instrumentalness")
                    .attr("font-weight", "bold");

                // y - axis label
                this.annotations.insert("text")
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
                this.annotations.selectAll("#labels")
                    .data(artistNames)
                    .join("text")
                    .attr("id", "labels")
                    .attr("x", 325)
                    .attr("y", function(d,i){ return 5 + i*10})
                    .style("fill", (d, i) => { return this.color(d)})
                    .style("font", "10px times")
                    .text(function(d){ return d})
                    .attr("text-anchor", "left")
                    .style("alignment-baseline", "middle")

                // Listen to the button
                d3.select(button).on("click", (d) => {
                    this.resetChart();
                })


                // added in zoom functionality
                const gx = this.svg.append("g");

                const gy = this.svg.append("g");

                const zoomed = ({transform}) => {
                    const zx = transform.rescaleX(this.x).interpolate(d3.interpolateRound);
                    const zy = transform.rescaleY(this.y).interpolate(d3.interpolateRound);
                    this.svg.select("#scatterClip").selectAll("#dots").attr("transform", transform).attr("stroke-width", 5);
                    gx.call(xAxis, zx);
                    gy.call(yAxis, zy);
                }

                this.zoom = d3.zoom()
                    .scaleExtent([1, 4])
                    .on("zoom", zoomed);
                

                this.svg.call(this.zoom).call(this.zoom.transform, d3.zoomIdentity);
                
            },
            updateChart(data, currentArtistsNames){
                /*
                if(this.opacityFlag == 0){
                    this.svg.selectAll("#dots")
                        .attr("opacity", 1.0)

                    this.opacityFlag = 1;
                }else{
                    this.svg.selectAll("#dots")
                        .attr("opacity", 0.5)
                    this.opacityFlag = 0;
                }*/

                this.resetChart();

                console.log("trying to update scatter chart")

                // select the group and then select the elements
                let dots = this.svg.select("#scatterClip").selectAll("#dots")
                    .data(data)
                    .join("circle")


                dots
                    .transition()
                    .duration(1000)
                    .attr("cx", d => this.x(d.instrumentalness))
                    .attr("cy", d => this.y(d.liveness))
                    .attr("id", "dots")
                    .style("fill", (d) => {return this.color(this.getArtists(d.artists)[0]);})
                    .attr("r", 4)

                dots
                    .on("mouseover.highlight", function(event, d){
                        d3.select(this)
                        .raise() // bring to front
                        .style("stroke", "black")
                        .style("stroke-width", 2);


                    })
                    .on("mouseout.highlight", function(event, d) {
                        d3.select(this).style("stroke", null);
                    })

                // where to start the legend from
                let start_y = 50 - 10 * (currentArtistsNames.length / 2)

                // Add in the legend for each name.
                this.annotations.selectAll("#labels")
                    .data(currentArtistsNames)
                    .join("text")
                    .attr("id", "labels")
                    .attr("x", 325)
                    .attr("y", function(d,i){ return start_y + i*10})
                    .style("fill", (d, i) => { return this.color(d)})
                    .style("font", "10px times")
                    .text(function(d){ return d})
                    .attr("text-anchor", "left")
                    .style("alignment-baseline", "middle")


            },
            resetChart(){
                console.log("resetting data");
                this.svg.call(this.zoom).call(this.zoom.transform, d3.zoomIdentity);
            }
        }

    }


</script>