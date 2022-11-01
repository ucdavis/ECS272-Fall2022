<template>
    <a-row type="flex">
        <a-col :flex="2" style="width: 65%">
            <a-row type="flex">
            <a-col :flex="1">
                <a-image
                    :width="150"
                    :height="150"
                    :src=pokedexImg
                    fallback="data:image/png;base64,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"
                />
            </a-col>
            <a-col :flex="4">
                <a-card size="small" :title="infoTitle" style="width: 320px">
                    <template #extra><a :href="pokedexUrl" target="_blank">more on Pokedex</a></template>
                    <p><strong>Type:</strong> {{selectedPokemon.Type_1}} {{selectedPokemon.Type_2?' / ':''}} {{selectedPokemon.Type_2}}</p>
                    <p><strong>Total Stats:</strong> {{selectedPokemon.Total}}</p>
                    <p><strong>Catch Rate:</strong> {{selectedPokemon.Catch_Rate}}</p>
                    <p><strong>Height/Weight:</strong> {{selectedPokemon.Height_m}}m / {{selectedPokemon.Weight_kg}}kg</p>
                    <p><strong>Body Style: </strong> {{selectedPokemon.Body_Style}}</p>
                    <p><strong>Egg Group:</strong> {{selectedPokemon.Egg_Group_1}} {{selectedPokemon.Egg_Group_2?' / ':''}} {{selectedPokemon.Egg_Group_2}}</p>
                </a-card>
            </a-col>
            </a-row>
        </a-col>
        <a-col :flex="1" style="width: 30%">
            <div>
                <div id="radar"></div>
            </div>
        </a-col>
    </a-row>
</template>

<script>
import * as d3 from "d3";

export default {
    name: 'RadarChart',
    data() {
        return {
            pokedexImg: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/'+this.selectedPokemon.Number.padStart(3,'0')+'.png',
            infoTitle: 'No. ' + this.selectedPokemon.Number.padStart(3, '0') + ': ' + this.selectedPokemon.Name + ' (Gen' + this.selectedPokemon.Generation + ')',
            pokedexUrl: 'https://www.pokemon.com/us/pokedex/' + this.selectedPokemon.Name.toLowerCase()
        }
    },
    props:{
        selectedPokemon: Object,
    },
    watch: { 
      	selectedPokemon: function(newVal, oldVal) { // watch it
            this.pokedexImg = 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/'+newVal.Number.padStart(3,'0')+'.png';
            this.infoTitle = 'No. ' + newVal.Number.padStart(3, '0') + ': ' + newVal.Name + ' (Gen' + newVal.Generation + ')';
            this.pokedexUrl = 'https://www.pokemon.com/us/pokedex/' + newVal.Name.toLowerCase();
            var radarChartOptions = {
                w: 175,
                h: 175,
                maxValue: 230,
                levels: 5,
                roundStrokes: true,
            };
            //Call function to draw the Radar chart
            this.RadarChart("#radar", newVal, radarChartOptions);
            console.log(oldVal);
        }
    },
    mounted(){
        console.log("Data Passed down as a Prop  ", this.selectedPokemon);
        var radarChartOptions = {
			w: 175,
			h: 175,
			maxValue: 230,
			levels: 5,
			roundStrokes: true,
		};
		//Call function to draw the Radar chart
		this.RadarChart("#radar", this.selectedPokemon, radarChartOptions);
    },
    methods: {
        // referenced from: http://bl.ocks.org/nbremer/21746a9668ffdf6d8242
        RadarChart(id, selectedPokemon, options) {
            var pokemon = [];
            pokemon.push({"axis":"HP", "value": selectedPokemon.HP});
            pokemon.push({"axis":"Defense", "value": selectedPokemon.Defense});
            pokemon.push({"axis":"Sp_Def", "value": selectedPokemon.Sp_Def});
            pokemon.push({"axis":"Speed", "value": selectedPokemon.Speed});
            pokemon.push({"axis":"Sp_Atk", "value": selectedPokemon.Sp_Atk});
            pokemon.push({"axis":"Attack", "value": selectedPokemon.Attack}); 
            var data = [pokemon];
            
            var cfg = {
                w: 600,				//Width of the circle
                h: 600,				//Height of the circle
                margin: {top: 30, right: 30, bottom: 30, left: 30}, //The margins of the SVG
                levels: 3,				//How many levels or inner circles should there be drawn
                maxValue: 0, 			//What is the value that the biggest circle will represent
                labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
                wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
                opacityArea: 0.35, 	//The opacity of the area of the blob
                dotRadius: 3, 			//The size of the colored circles of each blog
                opacityCircles: 0.1, 	//The opacity of the circles of each blob
                strokeWidth: 2, 		//The width of the stroke around each blob
                roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
                color: d3.schemeTableau10	//Color function
            };
	
        //Put all of the options into a variable called cfg
        if('undefined' !== typeof options){
        for(var i in options){
            if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
        }//for i
        }//if
        
        //If the supplied maxValue is smaller than the actual one, replace by the max in the data
        var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
            
        var allAxis = (data[0].map(function(i, j){return i.axis})),	//Names of each axis
            total = allAxis.length,					//The number of different axes
            radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
            Format = d3.format('.1f'),			 	//Percentage formatting
            angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
        
        //Scale for the radius
        var rScale = d3.scaleLinear()
            .range([0, radius])
            .domain([0, maxValue]);
            
        /////////////////////////////////////////////////////////
        //////////// Create the container SVG and g /////////////
        /////////////////////////////////////////////////////////

        //Remove whatever chart with the same id/class was present before
        d3.select(id).select("svg").remove();
        
        //Initiate the radar chart SVG
        var svg = d3.select(id).append("svg")
                .attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
                .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
                .attr("class", "radar"+id);
        //Append a g element		
        var g = svg.append("g")
                .attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");
        
        /////////////////////////////////////////////////////////
        ////////// Glow filter for some extra pizzazz ///////////
        /////////////////////////////////////////////////////////
        
        //Filter for the outside glow
        var filter = g.append('defs').append('filter').attr('id','glow'),
            feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
            feMerge = filter.append('feMerge'),
            feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
            feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

        /////////////////////////////////////////////////////////
        /////////////// Draw the Circular grid //////////////////
        /////////////////////////////////////////////////////////
        
        //Wrapper for the grid & axes
        var axisGrid = g.append("g").attr("class", "axisWrapper");
        
        //Draw the background circles
        axisGrid.selectAll(".levels")
        .data(d3.range(1,(cfg.levels+1)).reverse())
        .enter()
            .append("circle")
            .attr("class", "gridCircle")
            .attr("r", function(d, i){return radius/cfg.levels*d;})
            .style("fill", "#CDCDCD")
            .style("stroke", "#CDCDCD")
            .style("fill-opacity", cfg.opacityCircles)
            .style("filter" , "url(#glow)");

        //Text indicating at what % each level is
        axisGrid.selectAll(".axisLabel")
        .data(d3.range(1,(cfg.levels+1)).reverse())
        .enter().append("text")
        .attr("class", "axisLabel")
        .attr("x", 4)
        .attr("y", function(d){return -d*radius/cfg.levels;})
        .attr("dy", "0.4em")
        .style("font-size", "10px")
        .attr("fill", "#737373")
        .text(function(d,i) { return Format(maxValue * d/cfg.levels); });

        /////////////////////////////////////////////////////////
        //////////////////// Draw the axes //////////////////////
        /////////////////////////////////////////////////////////
        
        //Create the straight lines radiating outward from the center
        var axis = axisGrid.selectAll(".axis")
            .data(allAxis)
            .enter()
            .append("g")
            .attr("class", "axis");
        //Append the lines
        axis.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
            .attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
            .attr("class", "line")
            .style("stroke", "white")
            .style("stroke-width", "2px");

        //Append the labels at each axis
        axis.append("text")
            .attr("class", "legend")
            .style("font-size", "11px")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
            .attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
            .text(function(d){return d})
            .call(wrap, cfg.wrapWidth);

        /////////////////////////////////////////////////////////
        ///////////// Draw the radar chart blobs ////////////////
        /////////////////////////////////////////////////////////
        
        //The radial line function
        var radarLine = d3.lineRadial()
            .curve(d3.curveLinearClosed)
            .radius(function(d) { return rScale(d.value); })
            .angle(function(d,i) {	return i*angleSlice; });
            
        if(cfg.roundStrokes) {
            radarLine.curve(d3.curveCardinalClosed);
        }
                    
        //Create a wrapper for the blobs	
        var blobWrapper = g.selectAll(".radarWrapper")
            .data(data)
            .enter().append("g")
            .attr("class", "radarWrapper");
                
        //Append the backgrounds	
        blobWrapper
            .append("path")
            .attr("class", "radarArea")
            .attr("d", function(d,i) { return radarLine(d); })
            .style("fill", function(d,i) { return cfg.color[i]; })
            .style("fill-opacity", cfg.opacityArea)
            .on('mouseover', function (d,i){
                //Dim all blobs
                d3.selectAll(".radarArea")
                    .transition().duration(200)
                    .style("fill-opacity", 0.1); 
                //Bring back the hovered over blob
                d3.select(this)
                    .transition().duration(200)
                    .style("fill-opacity", 0.7);	
            })
            .on('mouseout', function(){
                //Bring back all blobs
                d3.selectAll(".radarArea")
                    .transition().duration(200)
                    .style("fill-opacity", cfg.opacityArea);
            });
            
        //Create the outlines	
        blobWrapper.append("path")
            .attr("class", "radarStroke")
            .attr("d", function(d,i) { return radarLine(d); })
            .style("stroke-width", cfg.strokeWidth + "px")
            .style("stroke", function(d,i) { return cfg.color[i]; })
            .style("fill", "none")
            .style("filter" , "url(#glow)");		
        
        //Append the circles
        blobWrapper.selectAll(".radarCircle")
            .data(function(d,i) { return d; })
            .enter().append("circle")
            .attr("class", "radarCircle")
            .attr("r", cfg.dotRadius)
            .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
            .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
            .style("fill", function(d,i,j) { return cfg.color[j]; })
            .style("fill-opacity", 0.8)

        /////////////////////////////////////////////////////////
        //////// Append invisible circles for tooltip ///////////
        /////////////////////////////////////////////////////////
        
        //Wrapper for the invisible circles on top
        var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
            .data(data)
            .enter().append("g")
            .attr("class", "radarCircleWrapper");
            
        //Append a set of invisible circles on top for the mouseover pop-up
        blobCircleWrapper.selectAll(".radarInvisibleCircle")
            .data(function(d,i) { return d; })
            .enter().append("circle")
            .attr("class", "radarInvisibleCircle")
            .attr("r", cfg.dotRadius*1.5)
            .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
            .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", function(e, d) {
                var newX =  parseFloat(d3.select(this).attr('cx')) - 10;
                var newY =  parseFloat(d3.select(this).attr('cy')) - 10;
                        
                tooltip
                    .attr('x', newX)
                    .attr('y', newY)
                    .text(Format(d.value))
                    .transition().duration(200)
                    .style('opacity', 1);
            })
            .on("mouseout", function(){
                tooltip.transition().duration(200)
                    .style("opacity", 0);
            });
            
        //Set up the small tooltip for when you hover over a circle
        var tooltip = g.append("text")
            .attr("class", "tooltip")
            .style("opacity", 0);
	
        /////////////////////////////////////////////////////////
        /////////////////// Helper Function /////////////////////
        /////////////////////////////////////////////////////////

        //Taken from http://bl.ocks.org/mbostock/7555321
        //Wraps SVG text	
        function wrap(text, width) {
        text.each(function() {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.4, // ems
                y = text.attr("y"),
                x = text.attr("x"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
                
            while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
            }
        });
        }//wrap	
    },//RadarChart
}}
</script>

<style>
a {
    color: #1890ff
}
</style>
