<template>
    <div>Start From: {{ year }}</div>
    <select v-model="year">
        <option v-for="item in Object.keys(mydata)" :value="item.y">
            {{ item.y }}
        </option>
    </select>
    <div class="card" :id="myChartID">
    </div>
</template>
<script>
import * as d3 from "d3";
import { setEnvironmentData } from "worker_threads";
import {sunburst} from "./sunburst"
export default{
    name : 'SunBurst',
    data(){
        return{
            sundata : Array,
        }
    },
    props:{
        mysundata : Array,
        myChartID : String
    },
    created(){
        this.sundata = dataProcess(mydata)
    },
    mounted(){
        this.drawSunburst(mydata, myChartID)
    },
    methods:{
        drawSunburst(data, id){
            sunburst(data, id);
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
    width: 100%;
    height: 100%;
}
</style>