<template>
    <!-- <div> -->
        <!-- <h1>Welcome Home</h1> -->
        <div class="container-fluid">
            <div id="split" class="row">
                <div class="col">
                    <div class="container border">
                        <h1 class="text-justify">Homework 2 Starter</h1>
                        <MainChart v-if="dataExists" :myMainChartData="myBarData" />
                    </div>
                </div>

                <div class="col">
                    <div class="row border">
                            <p>Bar chart 1</p>
                            <BarChart1 v-if="dataExists" :myBarchartData="myBarData" />
                    </div>
                    <div class="row border">
                            <p>Bar chart 2</p>
                            <BarChart2 v-if="dataExists" :myBarchartData="myBarData" />
                        
                    </div> 
                </div>
            </div>
        </div>
        
    <!-- </div> -->
</template>

<script>

import MainChart from "../components/mainchart.vue"
import BarChart1 from "../components/barchart1.vue"
import BarChart2 from "../components/barchart2.vue"
import * as d3 from "d3";
import csvPath from "../../../dataset/CO2_emission.csv";
import geoPath from "../../../dataset/world_topo.json";

export default {
    data(){
        return {
            dataExists: false,
            myBarData: [],
            myGeoData: [],
        }
    },
    components: {
    MainChart,
    BarChart1,
    BarChart2,
},
    created(){
        /* Fetch via CSV */
        this.drawBarFromCsv()
    },
    mounted(){},
    methods: {
        drawBarFromCsv(){

            // d3.json(geoPath).then((data) => {
            //     console.log(data.length)
            //     console.log(data);
            //     this.myGeoData = data;
            // })
            //async method
            d3.csv(csvPath).then((data) => {
                // array of objects
                console.log(data.length);
                console.log(data);
                this.dataExists = true; // updates the v-if to conditionally show the barchart only if our data is here.
                this.myBarData = data; // updates the prop value to be the recieved data, which we hand in to our bar-chart

            });
        }
    }
}

</script>
