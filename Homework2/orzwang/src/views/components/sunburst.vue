<template>
    <div id="sunburstWrapper" class="sunburstContainer">
        <svg id="sunburstChart" :height="height" :width="width"> </svg>
    </div>
</template>
<script>
import * as d3 from "d3";
import { setEnvironmentData } from "worker_threads";
import {sunburst} from "./sunburst"
export default{
    data(){
        return
    },
    props:{
        mydata : Array
    },
    created(){

    },
    mounted(){

    },
    methods:{
        drawSunburst(data){
            sunburst(data);
            return
        }
        
    }
}

created
</script>
<style scoped>
.pieChartContainer {
    background-color: grey;
    height: 100%;
}
</style>