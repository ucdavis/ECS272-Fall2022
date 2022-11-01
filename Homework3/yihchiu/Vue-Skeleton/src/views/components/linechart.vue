<template>
    <div id="line"></div>
</template>

<script>
    import * as d3 from "d3";
    import csvData from "../../../../../datasets/CO2_emission.csv"; /* Example of reading in data direct from file*/

export default {
    name: 'LineChart',
    data() {
        return {
        }
    },
    props:{
        myLinechartData: Array,
    },
    mounted(){
        
    },
    methods:{
        
    }
}
</script>


<style>

</style>