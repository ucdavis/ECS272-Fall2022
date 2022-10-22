<template>
    <meta charset="utf-8">
    <h1> Median of Important Features for All 2020 Songs by Artist </h1> 
    <!-- Initialize a select button -->
    <select id="selectButtonSpider"></select>

    <!-- Create a div where the graph will take place -->
    <div id="my_datavizSpider"></div>
</template>

<script>
    import * as d3 from "d3";

    export default {
        name: 'SpiderChart',
        data() {
            return {
                filteredData: [],
                topArtists: [],
                artistNames: [],
                topSongs: [],
                generalName: "Top 10 Artists of 2020",
                spiderData1: [],
                container1: null,
                container2: null,
                spiderData2: [],
                svg: null,
                //maroon, red, purple, fuschia, green, navy, blue, teal, darkorange, darkgoldenrod
                colorsBySinger: ['#800000','#FF0000','#800080','#FF00FF','#008000','#000080','#0000FF', '#008080', '#ff8c00', '#b8860b'],
                // grey
                generalColor: ["#808080"],

                // functions and data used by both vis charts
                dotRadius: 4,


            }
        },
        props:{
            myData: Array,
        },

        mounted(){

            this.getFilteredData()
            this.topArtists = this.getTopArtists(this.filteredData, 10)

            // get artistNames just for names from topArtist
            // makes processing easier
            for(let i = 0; i < this.topArtists.length; i++){
                this.artistNames.push(this.topArtists[i].artist)
            }
            this.topSongs = this.getSongs(this.filteredData, this.topArtists)

            this.spiderData1 = this.processSpider(this.topSongs, ["acousticness", "instrumentalness", "liveness", "speechiness"]);
            this.spiderData2 = this.processSpider(this.topSongs, ["danceability", "energy", "loudness"]);

            // creating svg here so both spider charts can access
            this.svg = d3.select("#my_datavizSpider").append("svg")
                    .attr("preserveAspectRatio", "xMidYMid meet")
                    .attr("viewBox", [0, 0, 700, 800])
                    .classed("svg-content-responsive", true)


            this.createbutton("#selectButtonSpider")
            this.initSpiderChart1("#selectButtonSpider", "#my_datavizSpider")
            this.initSpiderChart2("#selectButtonSpider", "#my_datavizSpider")

            
        },
        methods: {
            getFilteredData(){
                this.filteredData = this.myData.filter(function (d) {return d.year >= 2020});
            },

            getArtists(s){
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
            sortAndGetMedian(arr){
                arr.sort();

                return arr[Math.floor(arr.length / 2)];

            },
            processSpider(arr, features){

                // have a map of maps 
                // first level will be singer
                // second level of maps will be for the values that we need
                let map = new Map();

                for(let i = 0; i < features.length; i++){
                    let feature = features[i];

                    for(let j = 0; j < arr.length; j++){
                    let singer = this.getArtists(arr[j].artists)[0]; // just want first artist

                    let value = parseFloat(arr[j][feature]);

                    // scale loudness and convert back to power from dB
                    if(feature == "loudness"){
                        value = 10 ** (value/10);
                    }

                    if(map.has(singer)){
                        let singerMap = map.get(singer);

                        // add it to that array for that feature
                        if(singerMap.has(feature)){
                            singerMap.get(feature).push(value);
                        }else{
                            let tempArr = [value];
                            singerMap.set(feature, tempArr);
                        }
                    }else{
                        let singerMap = new Map();

                        let tempArr = [value];
                        singerMap.set(feature, tempArr);

                        map.set(singer, singerMap);

                    }

                    }
                }

                let data = [];
                let singers = [];
                // now get the medians for each of the singers and the values
                map.forEach((value, key) => {
                    // singer is key, value is other map
                    let singerData = [];
                    value.forEach((innerValue, innerKey) => {
                        let med = this.sortAndGetMedian(innerValue);
                        singerData.push({axis: innerKey, value: med});
                    });

                    singers.push(key);

                    data.push(singerData);

                });

                // return data and singers as two arrays
                // singers will be reference for index in data
                return [data, singers];


            },
            createbutton(button){
                // create button
                d3.select(button).selectAll('myOptions').remove()

                // add the options to the button
                d3.select(button)
                    .selectAll('myOptions')
                    .data([this.generalName].concat(this.artistNames))
                    .enter()
                    .append('option')
                    .text(function (d) { return d; }) // text showed in the menu
                    .attr("value", function (d) { return d; }) // corresponding value returned by the button
            },
            initSpiderChart1(button, viz){
                // set the dimensions and margins of the graph
                const margin = {top: 20, right: 5, bottom: 5, left: 0};
                let width = 350 - margin.left - margin.right;
                let height = 400 - margin.top - margin.bottom;

                const axisCircles = 3;
                const radius = 120;
                const dotRadius = 4;
                const maxValue = 0.4;
                const axesLength = 4;
                const axisLabelFactor = 1.12;
                const angleSlice = Math.PI * 2 / axesLength;

                // origSingers will be reference for index in data
                let origData = (this.spiderData1[0])
                let origSingers = (this.spiderData1[1])

                let axesDomain = ["acousticness", "instrumentalness", "liveness", "speechiness"];

                // concact this.artistNames to keep same ordering as parallelSetChart
                let color = d3.scaleOrdinal().domain([this.generalName].concat(this.artistNames)).range(this.generalColor.concat(this.colorsBySinger));

                let annotations = null;
                let rScale = null;
                let radarLine = null;
                let axis = null;
                let axisGrid = null;
                let plots = null;


                this.container1 = this.svg.append("g")
                        .attr("id", "spider1")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .attr('transform', `translate(${(width/2)+margin.left}, ${(height/2)-margin.top})`);

                // annotation layer to keep labels on top of data
                annotations = this.svg.append("g").attr("id", "annotations");


                rScale = d3.scaleLinear()
                    .domain([0, maxValue])
                    .range([0, radius])

                radarLine = d3.lineRadial()
                    .curve(d3["curveCardinalClosed"])
                    .radius(d => rScale(d))
                    .angle((d, i) => i * angleSlice)
        
    
                axisGrid = this.container1.append("g")
                    .attr("class", "axisWrapper");
    
                axisGrid.selectAll(".levels")
                    .data(d3.range(1,(axisCircles+1)).reverse())
                    .enter()
                    .append("circle")
                    .attr("class", "gridCircle")
                    .attr("r", (d, i) => radius/axisCircles*d)
                    .style("fill", "#CDCDCD")
                    .style("stroke", "#CDCDCD")
                    .style("fill-opacity", 0.1);
    
                axis = axisGrid.selectAll(".axis")
                    .data(axesDomain)
                    .enter()
                    .append("g")
                    .attr("class", "axis");

                //labels for inner circles
                axisGrid.selectAll(".axisLabel")
                    .data(d3.range(1,(axisCircles+1)).reverse())
                    .enter().append("text")
                    .attr("class", "axisLabel")
                    .attr("x", 4)
                    .attr("y", function(d){return -d*radius/axisCircles;})
                    .attr("dx", 7)
                    .attr("dy", 7)
                    .style("font-size", "13px")
                    .style("font-weight", "bold")
                    .attr("fill", "#737373")
                    .text(function(d,i) { return (maxValue * d/axisCircles).toFixed(3); })

                axis.append("line")
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2", (d, i) => rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2))
                    .attr("y2", (d, i) => rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2))
                    .attr("class", "line")
                    .style("stroke", "white")
                    .style("stroke-width", "2px");

                axis.append("text")
                    .attr("class", "legend")
                    .style("font-size", "11px")
                    .attr("text-anchor", "middle")
                .attr("font-family", "monospace")
                .attr("dy", "0.35em")
                    .attr("x", (d, i) => rScale(maxValue * axisLabelFactor) * Math.cos(angleSlice*i - Math.PI/2))
                    .attr("y", (d, i) => rScale(maxValue * axisLabelFactor) * Math.sin(angleSlice*i - Math.PI/2))
                    .attr("transform", function(d,i) {
                        if(i == 1)
                            return "rotate(" + (i * 282.5) / Math.PI + ", 130, 7)"
                        else if (i == 3)
                            return "rotate(" + (i * -95) / Math.PI + ", -130, 6)"
                    })
                    .text(d => d);
    
                plots = this.container1.append('g').attr("id", "plot1")
                    .selectAll('#spider1')
                    .data(origData)
                    .attr("id", "spider1")
                    .join('g')
                    .attr("data-name", (d, i) => origSingers[i])
                    .attr("fill", "none")
                    .attr("stroke", "steelblue")

                plots.append('path')
                    .attr("d", d => radarLine(d.map(v => v.value)))
                    .attr("fill", (d, i) => color(origSingers[i]))
                    .attr("fill-opacity", 0.1)
                    .attr("stroke", (d, i) => color(origSingers[i]))
                    .attr("stroke-width", 2)
                    .attr("id", "path1")

                /*
                plots.selectAll("#circles1")
                    .data(d => d)
                    .join("circle")
                    .attr("r", dotRadius)
                    .attr("cx", (d,i) => rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2))
                    .attr("cy", (d,i) => rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2))
                    .style("fill-opacity", 0.8)
                    .attr("id", "circles1")*/


                // if we are viewing all singers create a legend
                // add a legend
                console.log("Trying to add legend")
                // Add in the legend for each name.
                annotations.selectAll("labels")
                    .data(this.artistNames)
                    .enter()
                    .append("text")
                    .attr("x", 300)
                    .attr("y", function(d,i){ return 15 + i*10})
                    .style("fill", function(d, i){ return color(d)})
                    .style("font", "10px times")
                    .text(function(d){ return d})
                    .attr("text-anchor", "left")
                    .style("alignment-baseline", "middle")

                // initialize caller to updateChart1FromButton
                this.updateChart1FromButton(button, radarLine, color, rScale, angleSlice)



            },
            updateChart1FromButton(button, radarLine, color, rScale, angleSlice){
                // Listen to the slider?
                let selectedSinger = null
                d3.select(button).on("change.1", (event, d) => {
                    selectedSinger = event.currentTarget.value
                    this.updateSpiderChart1(selectedSinger, radarLine, color, rScale, angleSlice)
                })



            },
            updateSpiderChart1(selectedSinger, radarLine, color, rScale, angleSlice){
                let data = (this.spiderData1[0])
                let singers = (this.spiderData1[1])

                let currentData = null;
                let currentSinger = null;

                if(selectedSinger != this.generalName){
                    let index = singers.indexOf(selectedSinger);

                    currentData = [data[index]];
                    currentSinger = [selectedSinger];

                }else{
                    currentData = data;
                    currentSinger = singers;
                }


                let plots = this.container1.select("#plot1")

                console.log(currentData)

                plots.selectAll('#spider1')
                    .data(currentData)
                    .attr("id", "spider1")
                    .join('g')
                    .attr("data-name", (d, i) => currentSinger[i])
                    .attr("fill", "none")
                    .attr("stroke", "steelblue")

                plots.selectAll("#path1")
                    .data(currentData)
                    .join()
                    .transition()
                    .duration(1000)
                    .attr("d", d => radarLine(d.map(v => v.value)))
                    .attr("fill", (d, i) => color(currentSinger[i]))
                    .attr("fill-opacity", 0.1)
                    .attr("stroke", (d, i) => color(currentSinger[i]))
                    .attr("stroke-width", 2)
                    .attr("id", "path1")

                /*
                plots.selectAll("#circles1")
                    .data(currentData)
                    .join()
                    .attr("r", this.dotRadius)
                    .attr("cx", (d,i) => rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2))
                    .attr("cy", (d,i) => rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2))
                    .style("fill-opacity", 0.8);*/

            },
            initSpiderChart2(button, viz){
                // set the dimensions and margins of the graph
                const margin = {top: 20, right: 5, bottom: 5, left: 10};
                let width = 350 - margin.left - margin.right;
                let height = 400 - margin.top - margin.bottom;

                const axisCircles = 3;
                const radius = 120;
                const dotRadius = 4;
                const maxValue = 1.0;
                const axesLength = 3;
                const axisLabelFactor = 1.12;
                const angleSlice = Math.PI * 2 / axesLength;
                

                // keeping origData which contains all artists
                // using for dropdown toggle back to all artists
                let origData = (this.spiderData2[0])
                let origSingers = (this.spiderData2[1])

                let axesDomain = ["danceability", "energy", "loudness"];

                // concact this.artistNames to keep same ordering as parallelSetChart
                let color = d3.scaleOrdinal().domain([this.generalName].concat(this.artistNames)).range(this.generalColor.concat(this.colorsBySinger));

                let rScale = null;
                let radarLine = null;
                let axis = null;
                let axisGrid = null;
                let plots = null;

                this.container2 = this.svg.append("g")
                    .attr("id", "spider2")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .attr('transform', `translate(${width + (width/2) + margin.left}, ${(height/2)-margin.top})`);

                rScale = d3.scaleLinear()
                    .domain([0, maxValue])
                    .range([0, radius])

                radarLine = d3.lineRadial()
                    .curve(d3["curveCardinalClosed"])
                    .radius(d => rScale(d))
                    .angle((d, i) => i * angleSlice)
    

                axisGrid = this.container2.append("g")
                    .attr("class", "axisWrapper");
    
                axisGrid.selectAll(".levels")
                    .data(d3.range(1,(axisCircles+1)).reverse())
                    .enter()
                    .append("circle")
                    .attr("class", "gridCircle")
                    .attr("r", (d, i) => radius/axisCircles*d)
                    .style("fill", "#CDCDCD")
                    .style("stroke", "#CDCDCD")
                    .style("fill-opacity", 0.1);

                axis = axisGrid.selectAll(".axis")
                    .data(axesDomain)
                    .enter()
                    .append("g")
                    .attr("class", "axis");
                
                //labels for inner circles
                axisGrid.selectAll(".axisLabel")
                    .data(d3.range(1,(axisCircles+1)).reverse())
                    .enter().append("text")
                    .attr("class", "axisLabel")
                    .attr("x", 4)
                    .attr("y", function(d){return -d*radius/axisCircles;})
                    .attr("dx", 7)
                    .attr("dy", 7)
                    .style("font-size", "13px")
                    .style("font-weight", "bold")
                    .attr("fill", "#737373")
                    .text(function(d,i) { return (maxValue * d/axisCircles).toFixed(3); })

                axis.append("line")
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2", (d, i) => rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2))
                    .attr("y2", (d, i) => rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2))
                    .attr("class", "line")
                    .style("stroke", "white")
                    .style("stroke-width", "2px");

                axis.append("text")
                    .attr("class", "legend")
                    .style("font-size", "11px")
                    .attr("text-anchor", "middle")
                    .attr("font-family", "monospace")
                    .attr("dy", "0.35em")
                    .attr("x", (d, i) => rScale(maxValue * axisLabelFactor) * Math.cos(angleSlice*i - Math.PI/2))
                    .attr("y", (d, i) => rScale(maxValue * axisLabelFactor) * Math.sin(angleSlice*i - Math.PI/2))
                    .text(d => d);


                plots = this.container2.append('g').attr("id", "plot2")
                    .selectAll("#spider2")
                    .data(origData)
                    .attr("id", "spider2")
                    .join('g')
                    .attr("data-name", (d, i) => origSingers[i])
                    .attr("fill", "none")
                    .attr("stroke", "steelblue");

                plots.append('path')
                    .attr("d", d => radarLine(d.map(v => v.value)))
                    .attr("fill", (d, i) => color(origSingers[i]))
                    .attr("fill-opacity", 0.1)
                    .attr("stroke", (d, i) => color(origSingers[i]))
                    .attr("stroke-width", 2)
                    .attr("id", "path2")

                /*
                plots.selectAll("circle")
                    .data(d => d)
                .join("circle")
                    .attr("r", dotRadius)
                    .attr("cx", (d,i) => rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2))
                    .attr("cy", (d,i) => rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2))
                    .style("fill-opacity", 0.8);*/

                
                // initialize caller to updateChart2FromButton
                this.updateChart2FromButton(button, radarLine, color, rScale, angleSlice)

            },
            updateChart2FromButton(button, radarLine, color, rScale, angleSlice){
                // Listen to the slider?
                let selectedSinger = null
                d3.select(button).on("change.2", (event, d) => {
                    selectedSinger = event.currentTarget.value
                    this.updateSpiderChart2(selectedSinger, radarLine, color, rScale, angleSlice)
                })
            },
            updateSpiderChart2(selectedSinger, radarLine, color, rScale, angleSlice){

                let data = (this.spiderData2[0])
                let singers = (this.spiderData2[1])

                let currentData = null;
                let currentSinger = null;

                if(selectedSinger != this.generalName){
                    let index = singers.indexOf(selectedSinger);

                    currentData = [data[index]];
                    currentSinger = [selectedSinger];

                }else{
                    currentData = data;
                    currentSinger = singers;
                }


                let plots = this.container2.select("#plot2")

                console.log("updating 2")

                plots.selectAll('#spider2')
                    .data(currentData)
                    .attr("id", "spider2")
                    .join('g')
                    .attr("data-name", (d, i) => currentSinger[i])
                    .attr("fill", "none")
                    .attr("stroke", "steelblue")

                plots.selectAll("#path2")
                    .data(currentData)
                    .join()
                    .transition()
                    .duration(1000)
                    .attr("d", d => radarLine(d.map(v => v.value)))
                    .attr("fill", (d, i) => color(currentSinger[i]))
                    .attr("fill-opacity", 0.1)
                    .attr("stroke", (d, i) => color(currentSinger[i]))
                    .attr("stroke-width", 2)
                    .attr("id", "path2")

                /*
                plots.selectAll("#circles1")
                    .data(currentData)
                    .join()
                    .attr("r", this.dotRadius)
                    .attr("cx", (d,i) => rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2))
                    .attr("cy", (d,i) => rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2))
                    .style("fill-opacity", 0.8);*/
            },

        }
    }



</script>
