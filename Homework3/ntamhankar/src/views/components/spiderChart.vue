<template>
    <meta charset="utf-8">
    <h1> Average of Important Features for All 2020 Songs by Artist </h1>

    <!-- Create a div where the graph will take place -->
    <div id="my_datavizSpider"></div>
</template>

<script>
    import * as d3 from "d3";

    export default {
        name: 'SpiderChart',
        data() {
            return {
                // data used by both plots
                filteredData: [],
                topArtists: [],
                artistNames: [],
                topSongs: [],
                generalName: "Top 10 Artists of 2020",
                svg: null,
                //maroon, red, purple, fuschia, green, navy, blue, teal, darkorange, darkgoldenrod
                colorsBySinger: ['#800000','#FF0000','#800080','#FF00FF','#008000','#000080','#0000FF', '#008080', '#ff8c00', '#b8860b'],
                // grey
                generalColor: ["#808080"],

                dotRadius: 4,

                // specific to chart 1 for updating
                spiderData1: [], // array with data for spiderChart1
                container1: null, // container which has spiderChart1
                color1: null, // function to assign color for chart1
                radarLine1: null, // function to determine radarLine for chart1

                annotations: null,

                // specific to chart 2 for updating
                container2: null, // array with data for spiderChart2
                spiderData2: [], // container which has spiderChart2
                color2: null, // function to assign color for chart2
                radarLine2: null, // function to determine radarLine for chart2



            }
        },
        props:{
            myData: Array,
            brushedData: Array,
        },
        watch:{
            brushedData: function(value){
                console.log("Got the updated brushed Data in spider watch");
                console.log(value);

                this.spiderData1 = this.processSpider(value, ["acousticness", "instrumentalness", "liveness", "speechiness"]);
                this.spiderData2 = this.processSpider(value, ["danceability", "energy", "loudness"]);

                let currentArtists = this.getTopArtists(value, 10);

                let currentArtistsNames = [];
                for(let i = 0; i < currentArtists.length; i++){
                    currentArtistsNames.push(currentArtists[i].artist)
                }


                this.updateSpiderChart1(this.radarLine1, this.color1, currentArtistsNames)
                this.updateSpiderChart2(this.radarLine2, this.color2)

            }
        },

        mounted(){

            this.getFilteredData()
            this.topArtists = this.getTopArtists(this.filteredData, 10)

            // get artistNames just for names from topArtist
            // makes processing easier
            for(let i = 0; i < this.topArtists.length; i++){
                this.artistNames.push(this.topArtists[i].artist)
            }

            console.log("Inside spider what is brushedData");

            console.log(this.brushedData)

            console.log("Inside spider what is myData");

            console.log(this.myData)



            this.topSongs = this.getSongs(this.filteredData, this.topArtists)

            this.spiderData1 = this.processSpider(this.topSongs, ["acousticness", "instrumentalness", "liveness", "speechiness"]);
            this.spiderData2 = this.processSpider(this.topSongs, ["danceability", "energy", "loudness"]);

            // creating svg here so both spider charts can access
            this.svg = d3.select("#my_datavizSpider").append("svg")
                    .attr("preserveAspectRatio", "xMidYMid meet")
                    .attr("viewBox", [0, 0, 700, 800])
                    .classed("svg-content-responsive", true)


            this.initSpiderChart1("#my_datavizSpider")
            this.initSpiderChart2("#my_datavizSpider")

            
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
                //FIXME. Trying out average instead of median
                arr.sort();


                return arr[Math.floor(arr.length / 2)];

            },
            getAverage(arr){
                if(arr == null){
                    return 0;
                }
                let sum = 0;

                arr.forEach((d) =>{
                    sum += d;
                })

                return sum / arr.length;
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
                // now get the averages for each of the singers and the values
                map.forEach((value, key) => {
                    // singer is key, value is other map
                    let singerData = [];
                    value.forEach((innerValue, innerKey) => {
                        let med = this.getAverage(innerValue);
                        singerData.push({axis: innerKey, value: med});
                    });

                    singers.push(key);

                    data.push(singerData);

                });

                // return data and singers as two arrays
                // singers will be reference for index in data
                return [data, singers];


            },

            initSpiderChart1(viz){
                // set the dimensions and margins of the graph
                const margin = {top: 20, right: 5, bottom: 5, left: 0};
                let width = 350 - margin.left - margin.right;
                let height = 400 - margin.top - margin.bottom;

                const axisCircles = 3;
                const radius = 120;
                const dotRadius = 4;
                const maxValue = 1.0;
                const axesLength = 4;
                const axisLabelFactor = 1.12;
                const angleSlice = Math.PI * 2 / axesLength;

                // origSingers will be reference for index in data
                let origData = (this.spiderData1[0])
                let origSingers = (this.spiderData1[1])

                let axesDomain = ["acousticness", "instrumentalness", "liveness", "speechiness"];

                // concact this.artistNames to keep same ordering as parallelSetChart
                this.color1 = d3.scaleOrdinal().domain([this.generalName].concat(this.artistNames)).range(this.generalColor.concat(this.colorsBySinger));

                //let annotations = null;
                let rScale = null;
                let axis = null;
                let axisGrid = null;
                let plots = null;


                this.container1 = this.svg.append("g")
                        .attr("id", "spider1")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .attr('transform', `translate(${(width/2) - 30}, ${(height/2)-margin.top})`);

                // annotation layer to keep labels on top of data
                this.annotations = this.svg.append("g").attr("id", "annotations");


                rScale = d3.scaleLinear()
                    .domain([0, maxValue])
                    .range([0, radius])

                this.radarLine1 = d3.lineRadial()
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
                    .attr("d", d => this.radarLine1(d.map(v => v.value)))
                    .attr("fill", (d, i) => this.color1(origSingers[i]))
                    .attr("fill-opacity", 0.1)
                    .attr("stroke", (d, i) => this.color1(origSingers[i]))
                    .attr("stroke-width", 2)
                    .attr("id", "path1")


                // if we are viewing all singers create a legend
                // add a legend
                console.log("Trying to add legend")
                // Add in the legend for each name.
                this.annotations.selectAll("#labels")
                    .data(this.artistNames)
                    .join("text")
                    .attr("id", "labels")
                    .attr("x", 310)
                    .attr("y", function(d,i){ return 120 + i*10})
                    .style("fill", (d, i) => this.color1(d))
                    .style("font", "10px times")
                    .text(function(d){ return d})
                    .attr("text-anchor", "left")
                    .style("alignment-baseline", "middle")




            },
            updateSpiderChart1(radarLine, color, currentArtistsNames){

                let currentData = (this.spiderData1[0])
                let currentSinger = (this.spiderData1[1])

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
                    .join('path')
                    .transition()
                    .duration(1000)
                    .attr("d", d => radarLine(d.map(v => v.value)))
                    .attr("fill", (d, i) => color(currentSinger[i]))
                    .attr("fill-opacity", 0.1)
                    .attr("stroke", (d, i) => color(currentSinger[i]))
                    .attr("stroke-width", 2)
                    .attr("id", "path1")

                // where to start the legend from
                let start_y = 170 - 10 * Math.floor(currentArtistsNames.length / 2)

                this.annotations.selectAll("#labels")
                    .data(currentArtistsNames)
                    .join("text")
                    .attr("id", "labels")
                    .attr("x", 310)
                    .attr("y", function(d,i){ return start_y + i*10})
                    .style("fill", (d, i) => this.color1(d))
                    .style("font", "10px times")
                    .text(function(d){ return d})
                    .attr("text-anchor", "left")
                    .style("alignment-baseline", "middle")

            },
            initSpiderChart2(viz){
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
                this.color2 = d3.scaleOrdinal().domain([this.generalName].concat(this.artistNames)).range(this.generalColor.concat(this.colorsBySinger));

                let rScale = null;
                let axis = null;
                let axisGrid = null;
                let plots = null;

                this.container2 = this.svg.append("g")
                    .attr("id", "spider2")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .attr('transform', `translate(${width + (width/2) + 6*margin.left}, ${(height/2)-margin.top})`);

                rScale = d3.scaleLinear()
                    .domain([0, maxValue])
                    .range([0, radius])

                this.radarLine2 = d3.lineRadial()
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
                    .attr("d", d => this.radarLine2(d.map(v => v.value)))
                    .attr("fill", (d, i) => this.color2(origSingers[i]))
                    .attr("fill-opacity", 0.1)
                    .attr("stroke", (d, i) => this.color2(origSingers[i]))
                    .attr("stroke-width", 2)
                    .attr("id", "path2")


            },
            updateSpiderChart2(radarLine, color){

                let currentData = (this.spiderData2[0]);
                let currentSinger = (this.spiderData2[1]);


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
                    .join('path')
                    .transition()
                    .duration(1000)
                    .attr("d", d => radarLine(d.map(v => v.value)))
                    .attr("fill", (d, i) => color(currentSinger[i]))
                    .attr("fill-opacity", 0.1)
                    .attr("stroke", (d, i) => color(currentSinger[i]))
                    .attr("stroke-width", 2)
                    .attr("id", "path2")
            },

        },
    }



</script>
