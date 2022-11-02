<template>
    <h3>The title:</h3>{{ this.showTitle }}
    <div class="card" :id="myChartID">
        <svg></svg>
    </div>
</template>
<script>
import * as d3 from "d3";

export default{
    name :"RadarChart",
    data(){
        return {
            showTitle : String,
            movie : "Girlfriends",
            year : 2020,
            testData : [
                [
                //iPhone
                { axis: "Battery Life", value: 0.22 },
                { axis: "Brand", value: 0.28 },
                { axis: "Contract Cost", value: 0.29 },
                { axis: "Design And Quality", value: 0.17 },
                //{ axis: "Have Internet Connectivity", value: 0.22 },
                //{ axis: "Large Screen", value: 0.02 },
                //{ axis: "Price Of Device", value: 0.21 },
                //{ axis: "To Be A Smartphone", value: 0.5 }
                ],
                [
                //Samsung
                { axis: "Battery Life", value: 0.27 },
                { axis: "Brand", value: 0.16 },
                { axis: "Contract Cost", value: 0.35 },
                { axis: "Design And Quality", value: 0.13 },
                //{ axis: "Have Internet Connectivity", value: 0.2 },
                //{ axis: "Large Screen", value: 0.13 },
                //{ axis: "Price Of Device", value: 0.35 },
                //{ axis: "To Be A Smartphone", value: 0.38 }
                ],
                [
                //Nokia Smartphone
                { axis: "Battery Life", value: 0.26 },
                { axis: "Brand", value: 0.1 },
                { axis: "Contract Cost", value: 0.3 },
                { axis: "Design And Quality", value: 0.14 },
                //{ axis: "Have Internet Connectivity", value: 0.22 },
                //{ axis: "Large Screen", value: 0.04 },
                //{ axis: "Price Of Device", value: 0.41 },
                //{ axis: "To Be A Smartphone", value: 0.3 }
                ]
            ],
        }
    },
    props:{
        myRadarData : Array,
        myChartID : String,
        showID : String,
    },
    created(){
        console.log("Radar data passed:")
        console.log(this.myRadarData)
        console.log(this.showID)
        this.showTitle = this.myRadarData[this.showID][0].name;
    },
    mounted(){
        //let localData = this.testData;
        let localData = this.processData(this.myRadarData[this.showID]);
        console.log("Data Passed down as a Prop  ", localData)
        console.log(this.myChartID)
        this.drawRadarChart(localData, this.myChartID)
    },
    watch:{
        showID(newval, oldval){
            let localData = this.processData(this.myRadarData[newval]);
            console.log("Data Changed! ", localData)
            this.drawRadarChart(localData, this.myChartID)
            this.showTitle = this.myRadarData[newval][0].name;
        }
    },
    methods:{
        formatdata(data){   
            let formattedData = [];
            Object.keys(data).forEach(key => {
                let thisele = {
                    axis : key,
                    value : data[key]
                }
                formattedData.push(thisele);
            });
            return [formattedData];
        },
        processData(data){
            console.log("Process Radar Data:",data[0])
            console.log(data[0].imscore);
            let infos = {
                IMDB_SCORE : parseFloat(data[0].imscore),
                TMDB_SCORE : parseFloat(data[0].tmscore),
                //STAFF_NUM : parseInt(data[0].num_person),
                TMDB_popular : parseFloat(data[0].popularity)
            }
            return this.formatdata(infos);
        },
        drawRadarChart(data, id) {
  /////////////////////////////////////////////////////////
  /////////////////// Helper Function /////////////////////
  /////////////////////////////////////////////////////////
  //Wraps SVG text
            function wrap(text, width) {
                text.each(function() {
                var text = d3.select(this),
                    words = text
                    .text()
                    .split(/\s+/)
                    .reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.4, // ems
                    y = text.attr("y"),
                    x = text.attr("x"),
                    dy = parseFloat(text.attr("dy")),
                    tspan = text
                    .text(null)
                    .append("tspan")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("dy", dy + "em");

                while ((word = words.pop())) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", ++lineNumber * lineHeight + dy + "em")
                        .text(word);
                    }
                }
                });
            } //wrap

            var cfg = {
                w: 500, //Width of the circle
                h: 180, //Height of the circle
                margin: { top: 30, right: 20, bottom: 30, left: 20 }, //The margins of the SVG
                levels: 5, //How many levels or inner circles should there be drawn
                maxValue: 10.0, //What is the value that the biggest circle will represent
                labelFactor: 1.25, //How much farther than the radius of the outer circle should the labels be placed
                wrapWidth: 100, //The number of pixels after which a label needs to be given a new line
                opacityArea: 0.35, //The opacity of the area of the blob
                dotRadius: 4, //The size of the colored circles of each blog
                opacityCircles: 0.1, //The opacity of the circles of each blob
                strokeWidth: 2, //The width of the stroke around each blob
                roundStrokes: true, //If true the area and stroke will follow a round path (cardinal-closed)
                color: d3.scaleOrdinal(d3.schemeCategory10) //Color function
            };

            //Put all of the options into a variable called cfg
            //if ("undefined" !== typeof options) {
            //    for (var i in options) {
            //    if ("undefined" !== typeof options[i]) {
            //        cfg[i] = options[i];
            //    }
            //    } //for i
            //} //if

            //If the supplied maxValue is smaller than the actual one, replace by the max in the data
            var maxValue = Math.max(
                cfg.maxValue,
                d3.max(data, function(i) {
                return d3.max(
                    i.map(function(o) {
                    return o.value;
                    })
                );
                })
            );

            var allAxis = data[0].map(function(i, j) {
                return i.axis;
                }), //Names of each axis
                total = allAxis.length, //The number of different axes
                radius = Math.min(cfg.w / 2, cfg.h / 2), //Radius of the outermost circle
                Format = d3.format(".0%"), //Percentage formatting
                angleSlice = (Math.PI * 2) / total; //The width in radians of each "slice"

            //Scale for the radius
            var rScale = d3
                .scaleLinear()
                .range([0, radius])
                .domain([0, maxValue]);

            /////////////////////////////////////////////////////////
            //////////// Create the container SVG and g /////////////
            /////////////////////////////////////////////////////////

            //Calculate width and height
            var height = cfg.h + cfg.margin.top + cfg.margin.bottom;
            var width = cfg.w + cfg.margin.left + cfg.margin.right;
            
            id = '#'+id;
            d3.select(id).select('svg').remove();
            //Initiate the radar chart SVG
            const svg = d3.select(id).append("svg")
                .attr("viewBox", [0, 0, width, height]);//.attr("class", +new Date());
            //console.log("the selected is:", id, svg);
            //Append a g element
            var g = svg
                .append("g")
                .attr(
                "transform",
                "translate(" +
                    (cfg.w / 2 + cfg.margin.left) +
                    "," +
                    (cfg.h / 2 + cfg.margin.top) +
                    ")"
                );

            /////////////////////////////////////////////////////////
            ////////// Glow filter for some extra pizzazz ///////////
            /////////////////////////////////////////////////////////

            //Filter for the outside glow
            var filter = g
                .append("defs")
                .append("filter")
                .attr("id", "glow"),
                feGaussianBlur = filter
                .append("feGaussianBlur")
                .attr("stdDeviation", "2.5")
                .attr("result", "coloredBlur"),
                feMerge = filter.append("feMerge"),
                feMergeNode_1 = feMerge.append("feMergeNode").attr("in", "coloredBlur"),
                feMergeNode_2 = feMerge.append("feMergeNode").attr("in", "SourceGraphic");

            /////////////////////////////////////////////////////////
            /////////////// Draw the Circular grid //////////////////
            /////////////////////////////////////////////////////////

            //Wrapper for the grid & axes
            var axisGrid = g.append("g").attr("class", "axisWrapper");

            //Draw the background circles
            axisGrid
                .selectAll(".levels")
                .data(d3.range(1, cfg.levels + 1).reverse())
                .enter()
                .append("circle")
                .attr("class", "gridCircle")
                .attr("r", function(d, i) {
                return (radius / cfg.levels) * d;
                })
                .style("fill", "#CDCDCD")
                .style("stroke", "#CDCDCD")
                .style("fill-opacity", cfg.opacityCircles)
                .style("filter", "url(#glow)");

            //Text indicating at what % each level is
            axisGrid
                .selectAll(".axisLabel")
                .data(d3.range(1, cfg.levels + 1).reverse())
                .enter()
                .append("text")
                .attr("class", "axisLabel")
                .attr("x", 4)
                .attr("y", function(d) {
                return (-d * radius) / cfg.levels;
                })
                .attr("dy", "0.4em")
                .style("font-size", "10px")
                .attr("fill", "#737373")
                .text(function(d, i) {
                return Format((maxValue/maxValue * d) / cfg.levels);
                });

            /////////////////////////////////////////////////////////
            //////////////////// Draw the axes //////////////////////
            /////////////////////////////////////////////////////////

            //Create the straight lines radiating outward from the center
            var axis = axisGrid
                .selectAll(".axis")
                .data(allAxis)
                .enter()
                .append("g")
                .attr("class", "axis");

            //Append the lines
            axis
                .append("line")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", function(d, i) {
                return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2);
                })
                .attr("y2", function(d, i) {
                return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2);
                })
                .attr("class", "line")
                .style("stroke", "white")
                .style("stroke-width", "2px");

            //Append the labels at each axis
            axis
                .append("text")
                .attr("class", "legend")
                .style("font-size", "11px")
                .attr("text-anchor", "middle")
                .attr("dy", "0.35em")
                .attr("x", function(d, i) {
                return (
                    rScale(maxValue * cfg.labelFactor) *
                    Math.cos(angleSlice * i - Math.PI / 2)
                );
                })
                .attr("y", function(d, i) {
                return (
                    rScale(maxValue * cfg.labelFactor) *
                    Math.sin(angleSlice * i - Math.PI / 2)
                );
                })
                .text(function(d) {
                    console.log(d)
                return d;
                })
                .call(wrap, cfg.wrapWidth);

            /////////////////////////////////////////////////////////
            ///////////// Draw the radar chart blobs ////////////////
            /////////////////////////////////////////////////////////

            //The radial line function
            var radarLine = d3
                .lineRadial()
                .curve(d3.curveLinearClosed)
                .radius(function(d) {
                return rScale(d.value);
                })
                .angle(function(d, i) {
                return i * angleSlice;
                });

            if (cfg.roundStrokes) {
                radarLine.curve(d3.curveLinearClosed);
            }

            //Create a wrapper for the blobs
            var blobWrapper = g
                .selectAll(".radarWrapper")
                .data(data)
                .enter()
                .append("g")
                .attr("class", "radarWrapper");

            //Append the backgrounds
            blobWrapper
                .append("path")
                .attr("class", "radarArea")
                .attr("d", function(d, i) {
                return radarLine(d);
                })
                .style("fill", function(d, i) {
                return cfg.color(i);
                })
                .style("fill-opacity", cfg.opacityArea)
                .on("mouseover", function(d, i) {
                //Dim all blobs
                d3.selectAll(".radarArea")
                    .transition()
                    .duration(200)
                    .style("fill-opacity", 0.1);
                //Bring back the hovered over blob
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("fill-opacity", 0.7);
                })
                .on("mouseout", function() {
                //Bring back all blobs
                d3.selectAll(".radarArea")
                    .transition()
                    .duration(200)
                    .style("fill-opacity", cfg.opacityArea);
                });

            //Create the outlines
            blobWrapper
                .append("path")
                .attr("class", "radarStroke")
                .attr("d", function(d, i) {
                return radarLine(d);
                })
                .style("stroke-width", cfg.strokeWidth + "px")
                .style("stroke", function(d, i) {
                return cfg.color(i);
                })
                .style("fill", "none")
                .style("filter", "url(#glow)");

            //Append the circles
            blobWrapper
                .selectAll(".radarCircle")
                .data(function(d, i) {
                return d;
                })
                .enter()
                .append("circle")
                .attr("class", "radarCircle")
                .attr("r", cfg.dotRadius)
                .attr("cx", function(d, i) {
                return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
                })
                .attr("cy", function(d, i) {
                return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
                })
                .style("fill", function(d) {
                return "#737373";
                })
                .style("fill-opacity", 0.8);

            /////////////////////////////////////////////////////////
            //////// Append invisible circles for tooltip ///////////
            /////////////////////////////////////////////////////////

            //Wrapper for the invisible circles on top
            var blobCircleWrapper = g
                .selectAll(".radarCircleWrapper")
                .data(data)
                .enter()
                .append("g")
                .attr("class", "radarCircleWrapper");

            //Append a set of invisible circles on top for the mouseover pop-up
            blobCircleWrapper
                .selectAll(".radarInvisibleCircle")
                .data(function(d, i) {
                return d;
                })
                .enter()
                .append("circle")
                .attr("class", "radarInvisibleCircle")
                .attr("r", cfg.dotRadius * 1.5)
                .attr("cx", function(d, i) {
                return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
                })
                .attr("cy", function(d, i) {
                return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
                })
                .style("fill", "none")
                .style("pointer-events", "all")
                .on("mouseover", function(d, i) {
                var newX = parseFloat(d3.select(this).attr("cx")) - 10;
                var newY = parseFloat(d3.select(this).attr("cy")) - 10;

                tooltip
                    .attr("x", newX)
                    .attr("y", newY)
                    .text(Format(d.value))
                    .transition()
                    .duration(200)
                    .style("opacity", 1);
                })
                .on("mouseout", function() {
                tooltip
                    .transition()
                    .duration(200)
                    .style("opacity", 0);
                });

            //Set up the small tooltip for when you hover over a circle
            var tooltip = g
                .append("text")
                .attr("class", "tooltip")
                .style("opacity", 0);

            return svg.node();
            } //RadarChart
    }
}

</script>
<style scoped>
.card{
    width: 100%;
    height: 100%;
}
</style>