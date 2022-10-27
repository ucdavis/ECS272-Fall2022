<template>
    <meta charset="utf-8">
    <h2> Features of Songs for Top 10 Artists of 2020 </h2>
    <!-- Initialize a select button -->
    <select id="selectButtonParallel"></select>

    <!-- Create a div where the graph will take place -->
    <div id="my_datavizParallel"></div>
</template>


<script>
    import * as d3 from "d3";

    export default {
        name: 'ParallelSetChart',
        data() {
            return {
                name: 'Hello',
                someLocalValues: [1, 2, 3, 4, 5],
                filteredData: [],
                topArtists: [],
                topSongs: [],
                g1Dimensions: [],
                generalName: "Top 10 Artists of 2020",
                //maroon, red, purple, fuschia, green, navy, blue, teal, darkorange, darkgoldenrod
                colorsBySinger: ['#800000','#FF0000','#800080','#FF00FF','#008000','#000080','#0000FF', '#008080', '#ff8c00', '#b8860b'],
                // grey
                generalColor: ["#808080"],

                // svg that will be created in init and updated
                svg: null,

                // map of each singer and their songs
                map: null,

                axes: null,
                lines: null,

                brushes: null,
                brush: null,
                dblclicked: null,

            }
        },
        props:{
            myData: Array,
        },

        mounted(){

            this.getFilteredData()
            this.topArtists = this.getTopArtists(this.filteredData, 10)
            this.topSongs = this.getSongs(this.filteredData, this.topArtists)
            this.g1Dimensions = Object.keys(this.topSongs[0]).filter(function(d) { return d == "acousticness" || d == "danceability" || d == "energy" || d == "instrumentalness" ||  d == "valence" || d == "tempo" || d == "liveness" || d == "loudness" || d == "speechiness" || d == "key"})
            this.init("#selectButtonParallel", "#my_datavizParallel")

            
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
                // set the dimensions and margins of the graph
                const margin = {top: 60, right: 10, bottom: 10, left: 0};
                let width = 700 - margin.left - margin.right;
                let height = 600 - margin.top - margin.bottom;

                this.svg = d3.select(viz)
                .append("svg")
                    .attr("preserveAspectRatio", "xMidYMid meet")
                    .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
                    .classed("svg-content-responsive", true)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

                // set the style of hidden data items
                // Don't need this anymore as instead dealing with each DOM element
                /*
                this.svg
                    .append("style")
                    .text("#lines.hidden { stroke: #000; stroke-opacity: 0.01;}");*/

                // a map that holds any active brush per attribute
                let activeBrushes = new Map();


                // group by artist Name
                // this will be used to determine the color for each artist
                let groups = []

                groups.push(this.generalName);

                for(let i = 0; i < this.topArtists.length; i++){
                    groups.push(this.topArtists[i].artist);

                }

                // create a map of all of the singers
                this.map = new Map();
                this.map.set(this.generalName, this.topSongs);

                for(let i = 0; i < groups.length; i++){
                    if(!this.map.has(groups[i])){
                        this.map.set(groups[i], this.getSongs(this.topSongs, [{artist: groups[i]}]));
                    }

                }

                console.log(this.map)


                d3.select(button).selectAll('myOptions').remove()

                // add the options to the button
                d3.select(button)
                    .selectAll('myOptions')
                    .data(groups)
                    .enter()
                    .append('option')
                    .text(function (d) { return d; }) // text showed in the menu
                    .attr("value", function (d) { return d; }) // corresponding value returned by the button


                // For each dimension, I build a linear scale. I store all in a y object
                const y = {}
                for (let i in this.g1Dimensions) {
                    let name = this.g1Dimensions[i]
                    y[name] = d3.scaleLinear()
                        .domain( d3.extent(this.topSongs, function(d) { return +d[name]; }) )
                        .range([height, 0])
                }
                // Build the X scale -> it find the best position for each Y axis
                const x = d3.scalePoint()
                    .range([0, width])
                    .padding(1)
                    .domain(this.g1Dimensions);


                // The path function take a row of the csv as input, and return x and y coordinates of the line to    draw for this raw.
                const path = (d) => {
                    return d3.line()(this.g1Dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
                }

                let color = d3.scaleOrdinal().domain(groups).range(this.generalColor.concat(this.colorsBySinger));



                // Draw the initial set of lines
                this.lines = this.svg
                    .selectAll("#lines")
                    .append("g")
                    .data(this.map.get(this.generalName))
                    .join("path")
                    .attr("fill", "none")
                    .attr("opacity", 0.5)
                    .attr("id", "lines")
                    .attr("d", path)
                    .style("stroke", color(this.generalName))
                    


                // Draw the axis:
                this.axes = this.svg
                    .append('g')
                    .selectAll('g')
                    // For each dimension of the dataset I add a 'g' element:
                    .data(this.g1Dimensions)
                    .join("g")
                    // I translate this element to its right position on the x axis
                    .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
                    // And I build the axis with the call function
                    .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
                    // Add axis title
                    .call(g => g.append("text")
                        .style("text-anchor", "middle")
                        .attr("y", -10)
                        .text(function(d) { return d; })
                        .style("fill", "black")
                        .attr("font-weight", 500))



                // Functionality for brushing
                function updateBrushing(myLines) {
                    console.log("Trying brushing");

                    let number_brushes = activeBrushes.size;

                    if (number_brushes == 0) {
                        // myLines.classed("hidden", d => {return false}); // replaced with the following functionality instead
                        // https://api.jquery.com/each/
                        myLines.each(function(d){
                            d3.select(this).attr("opacity", 0.5);
                        });
                    }
                    else {
                        myLines.each(function(d){
                        //this.svg.selectAll("#lines").classed("hidden", d => {
                            let is_valid = true;  // this flag checks that data is within range for all brushes
                            //iterate over Map and get y-values
                            activeBrushes.forEach((value, key) => {
                                // Need to add this here because when deleting a brush this function gets called on a null entry
                                if(value == null){
                                    // do nothing
                                }else{
                                    var y0 = value[0];
                                    var y1 = value[1];
                                    //check if car value is inside an active brush
                                    var value_y = y[key](d[key]);
                                    if (value_y <= y1 && value_y >= y0 && is_valid) {
                                        d3.select(this).attr("opacity", 0.5);
                                    }
                                    else {
                                        is_valid=false;
                                        d3.select(this).attr("opacity", 0.0);
                                    }
                            }
                            });
                            //variable to see the active polylines in this scope
                            //return return_value;
                        });
                    }
                }

                const brushed = (event, attribute) => {
                    console.log("brushed");
                    console.log(attribute);
                    console.log(event);
                    activeBrushes.set(attribute, event.selection);

                    console.log("finished selection")
                    console.log(event.selection);
                    updateBrushing(this.lines);
                }

                const brushEnd = (event, attribute) => {
                    console.log("brush end");
                    if (event.selection !== null){
                        updateBrushing(this.lines);

                        // this is where we can update data
                        console.log("END")
                        console.log(event);
                        return
                    }
                    activeBrushes.delete(attribute);
                    updateBrushing(this.lines);
                }


                this.brush = d3
                            .brushY()
                            .extent([[-10, -5], [10, height]])
                            .on("brush", brushed)
                            .on("end", brushEnd)

                this.dblclicked = (event, attribute) => {
                    const selection = null
                    d3.select(event.srcElement).call(this.brush.move, selection);
                    console.log("deleting attribute")
                    console.log(attribute);
                    activeBrushes.delete(attribute);
                    console.log(activeBrushes);
                    console.log("Finished deleting");
                    //updateBrushing(); //Deleting the key from activeBrushes, so no need to update
                    console.log(this.brush);
                }

                this.brushes = this.axes.append("g").call(
                    this.brush
                ).on("dblclick", this.dblclicked)



                // Initialize updateFromButton Function to get changes
                this.updateFromButton(button, viz, color, path)
                
            },
            updateFromButton(button, viz, color, path){

                // Listen to the slider?
                d3.select(button).on("change", (event, d) =>
                {
                    let selectedSinger = event.currentTarget.value

                    this.updateChart(selectedSinger, color, path)
                })


            },
            updateChart(selectedSinger, color, path){

                // filter out songs based on artist
                const filtered_songs = this.map.get(selectedSinger);

                console.log("Trying to update chart")
                console.log(selectedSinger)
                
                if(selectedSinger == this.generalName){
                    console.log(filtered_songs)
                }
                
                this.lines = this.svg.selectAll("#lines")
                    .data(filtered_songs)
                    .join("path")
                    .transition()
                    .duration(1000)
                    .attr("d", path)
                    .attr("id", "lines")
                    .style("fill", "none")
                    //.style("opacity", 0.5)   // FIXME: for some reason commenting this out fixed issue where brush wasn't working
                    .style("stroke", d => color(selectedSinger))

                console.log(this.lines)



            },
            

        }
    }


</script>

