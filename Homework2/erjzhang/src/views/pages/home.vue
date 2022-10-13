<template>
    <!-- <div> -->
    <!-- <h1>Welcome Home</h1> -->
    <div class="container-fluid">
        <div id="split" class="row">
            <div class="col">
                <div class="container border">
                    <h1 class="">World CO2 Emission Per Capita</h1>
                    <h2>Year: {{curr_year}}</h2>
                    <div class="slidecontainer">
                        <input 
                        type="range" v-bind:min="first_year" v-bind:max="last_year" class="slider"
                            id="year_slider"  v-model.lazy="curr_year">
                    </div>

                    <MainChart v-if="geoDataExists" :myGeoData="myGeoData" :myMainChartData="myCsvData"
                        :curr_year="parseInt(curr_year)" :history_max="history_max"/>
                </div>
            </div>

            <div class="col">
                <div class="row border">
                    <p>Chart 1: Top {{top_n}} CO2 Emission Countries in {{curr_year}}</p>
                    <BarChart1 v-if="dataExists" :myBarchartData="myCsvData" :curr_year="parseInt(curr_year)"
                        :x_key="x_key" :top_n="top_n" />
                </div>
                <div class="row border">
                    <p>Bar chart 2</p>
                    <BarChart2 v-if="dataExists" :myBarchartData="myCsvData" />

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
// import VueSlider from 'vue-slider-component'
// import 'vue-slider-component/theme/default.css'
import * as d3 from "d3";
import * as topojson from "topojson"
import csvPath from "../../../dataset/CO2_emission.csv";


const geoPath =
    'https://raw.githubusercontent.com/1832051637/ECS272-Fall2022/main/Homework2/erjzhang/dataset/world_topo.json'

const FIRST_YEAR = 1990
const LAST_YEAR = 2019
const CURR_YEAR = 2019
const TOP_N = 7
const X_KEY = 'Country Name'
const HISTORY_MAX = 50.95403383
// const slider = document.getElementById("year_slider");

// function all_year_max(data) {
//     let max = Number.NEGATIVE_INFINITY
//     for (let index = FIRST_YEAR; index < LAST_YEAR + 1; index++) {
//         let every_max = d3.max(data, d => {
//             return toNumber(d[index])
//         })
//         if (every_max > max) {
//             max = every_max
//         }
//     }
//     return max
// }

// function toNumber(item) {
//     if (typeof item === 'number') {
//         return item
//     }
//     return item ? parseFloat(item) : 0.0
// }

export default {
    data() {
        return {
            country_num: -999,
            dataExists: false,
            geoDataExists: false,
            myCsvData: [],
            myGeoData: [],
            first_year: FIRST_YEAR,
            last_year: LAST_YEAR,
            curr_year: CURR_YEAR,
            top_n: TOP_N,
            x_key: "nothing",
            history_max: 50.95403383,
        }
    },
    components: {
        // VueSlider,
        MainChart,
        BarChart1,
        BarChart2,
    },
    created() {
        /* Fetch via CSV */
        this.drawBarFromCsv()
        this.drawMapFromJson()
    },
    mounted() {
        this.drawBarFromCsv()
        this.drawMapFromJson()
    },
    methods: {
        drawBarFromCsv() {
            //async method
            d3.csv(csvPath)
                .then((data) => { 
                    // array of objects
                    // data.sort((d1, d2) => {
                    //     let a = this.toNumber(d1[this.curr_year])
                    //     let b = this.toNumber(d2[this.curr_year])
                    //     return d3.descending(a, b)
                    // })
                    console.log(data.length);
                    console.log(data);
                    this.country_num = data.length
                    this.dataExists = true; // updates the v-if to conditionally show the barchart only if our data is here.const countries 
                    this.myCsvData = data; // updates the prop value to be the recieved data, which we hand in to our bar-chart
                    this.x_key = X_KEY
                    // console.log(slider)
                    // this.curr_year = CURR_YEAR
                    this.top_n = TOP_N
                    this.history_max = HISTORY_MAX
                    // console.log("all year max ", this.history_max)
                });
            // d3.json(geoPath)
            //     .then((geoData) => {
            //         console.log(geoData)
            //         this.geoDataExists = true;
            //         this.myGeoData = geoData
            //     })
            // this.$forceUpdate()
        },

        drawMapFromJson() {
            d3.json(geoPath)
                .then((geoData) => {
                    // console.log(geoData)
                    this.geoDataExists = true;
                    this.myGeoData = geoData
                })
        },
        toNumber(item) {
            // console.log(item)
            if (typeof item === 'number') {
                return item
            }
            return item ? parseFloat(item) : 0.0
        },
    }
}

</script>
