<template>
    <!-- <div> -->
    <!-- <h1>Welcome Home</h1> -->
    <div class="container-fluid">
        <div id="split" class="row">
            <div class="col">
                <div class="container border">
                    <h1 class="text-justify">Homework 2 Starter</h1>
                    <MainChart v-if="geoDataExists" :myMainChartData="myGeoData" />
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
import * as topojson from "topojson"
import csvPath from "../../../dataset/CO2_emission.csv";


const geoPath = 'https://raw.githubusercontent.com/1832051637/ECS272-Fall2022/main/Homework2/erjzhang/dataset/world_topo.json'

export default {
    data() {
        return {
            dataExists: false,
            geoDataExists: false, 
            myBarData: [],
            myGeoData: [],
        }
    },
    components: {
        MainChart,
        BarChart1,
        BarChart2,
    },
    created() {
        /* Fetch via CSV */
        this.drawBarFromCsv()
        this.drawMapFromJson()
    },
    mounted() { },
    methods: {
        drawBarFromCsv() {
            //async method
            d3.csv(csvPath)
                .then((data) => {
                    // array of objects
                    console.log(data.length);
                    console.log(data);
                    this.dataExists = true; // updates the v-if to conditionally show the barchart only if our data is here.const countries 
                    this.myBarData = data; // updates the prop value to be the recieved data, which we hand in to our bar-chart

                });
            // d3.json(geoPath)
            //     .then((geoData) => {
            //         console.log(geoData)
            //         this.geoDataExists = true;
            //         this.myGeoData = geoData
            //     })
        },

        drawMapFromJson() {
            d3.json(geoPath)
                .then((geoData) => {
                    // console.log(geoData)
                    this.geoDataExists = true;
                    this.myGeoData = geoData
                })
        }
    }
}

</script>
