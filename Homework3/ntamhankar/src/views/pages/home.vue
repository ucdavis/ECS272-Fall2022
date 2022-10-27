<template>
    <div id="dashboard">
        <div class="column1" id="left">
            <ParallelSetChart v-if="dataExists" :myData="myCsvData"
            @updateBrushedData="updateBrushedData"/>
        </div>
        <div class="column2" id="right">
            <div class="row" id="top">
                <SpiderChart v-if="dataExists" :myData='myCsvData' :brushedData='myBrushedData'/>

            </div>
            <div class="row" id="bottom">
                <ScatterChart v-if="dataExists" :myData="myCsvData" :brushedData='myBrushedData' />
            </div>
        </div>
    </div>
</template>

<script>

import * as d3 from "d3";
import csvPath from '../../assets/data/data.csv';
import ParallelSetChart from "../components/parallelSetChart.vue";
import SpiderChart from "../components/spiderChart.vue"
import ScatterChart from "../components/scatterChart.vue"

export default {
    data(){
        return {
            dataExists: false,

            myCsvData: [],
            myBrushedData: []
        }
    },
    components: {
        ParallelSetChart,
        SpiderChart,
        ScatterChart
    },
    created(){
        this.drawFromCsv()
    },
    mounted(){},
    methods: {

        drawFromCsv(){
            //async method
            d3.csv(csvPath).then((data) => {
                // array of objects
                console.log(data.length);
                console.log(data);
                this.dataExists = true; // updates the v-if to conditionally show the barchart only if our data is here.

                this.myCsvData = data; // updates the prop value to be the recieved data, which we hand in to our bar-chart

                this.myBrushedData = data;

                console.log("Initial myBrushedData")
                console.log(this.myBrushedData);

            });
        },

        updateBrushedData(data){
            console.log("Updating brushed data in home.vue")
            this.myBrushedData = data;

            console.log(this.myBrushedData);
        }

    }
}

</script>


<style>
#dashboard{
    display: flex;
    width: 100%;
    height: 100%;
}

.column1{
    width: 50%;
}

.column2{
    width: 50%
}

#left{
}

#top{
    height: 60%
}

#bottom{
    height: 40%
}

h1{
    margin: 0;
}

h2{
    margin: 0;
}

</style>
