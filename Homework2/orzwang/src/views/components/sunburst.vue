<template>
    <div id="sunburstWrapper" class="sunburstContainer">
        <svg id="sunburstChart" :data="mydata" :height="height" :width="width"> </svg>
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
        this.sundata = dataProcess(mydata)
    },
    mounted(){
        
    },
    methods:{
        drawSunburst(data){
            sunburst(data);
            return
        },
        dataProcess(data){
            const formattedData = [];
            
            Object.keys(data).forEach(item =>{
                let thistype = {
                    name: item,
                    children : []
                }
                Object.keys(data[item]).forEach(item2 =>{
                    thistype.children.push(data[item][item2])
                })
                formattedData.push(thistype);
            })
            return formattedData;
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