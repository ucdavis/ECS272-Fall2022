<template>
    <div id="song_detail"></div>
</template>

<script>
    import * as d3 from "d3";
import { object } from "vue-types";
    import testData from "../../assets/data/test.json"; /* Example of reading in data direct from file*/

    export default {
        name: 'TextArea',
        data() { // pass data to others
            return {
                text: ""
            }
        },
        props:{ // received data from others
            myText: Array
        },
        watch: { 
            myText: function(newVal, oldVal) { // watch it
                this.drawText("#song_detail");
            }
        },
        mounted(){ // actually drawing
            this.drawText("#song_detail");
        },
        methods: {
            drawText(id){
                const margin = { top: 10, right: 10, bottom: 10, left: 10 };
                let width  = d3.select(id).node().getBoundingClientRect().width;
                let height = d3.select(id).node().getBoundingClientRect().height;

                d3.selectAll(".textarea").remove();
                let svg = d3.select(id).append("svg")
                    .attr("class", "textarea")
                    .attr("viewBox", [0, 0, width, height])
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);
                
                svg.append("text")
                    .attr("x", margin.left)
                    .attr("y", margin.top)
                    .text("Selected Songs: ")
                    .style("font-size", "9px")
                    .attr("alignment-baseline","middle")
                for (let i=0; i<this.myText.length; i++){
                    svg.append("text")
                        .attr("x", margin.left+80)
                        .attr("y", margin.top + 10*(i+0))
                        .text(this.myText[i])
                        .style("font-size", "9px")
                        .attr("alignment-baseline","middle")
                }
            }
        }
    }

</script>


<style>
    #song_detail{
        width: 100%;
        height: 80%;
    }
</style>