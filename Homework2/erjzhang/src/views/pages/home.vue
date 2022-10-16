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
                    <BarChart v-if="dataExists" :myBarchartData="myCsvData" :curr_year="parseInt(curr_year)"
                        :x_key="x_key" :top_n="top_n" />
                </div>
                <div class="row border">
                    <p>Chart 2: Radar Chart on Emission by Regions in {{curr_year}}</p>
                    <RadarChart v-if="dataExists" :myCsvData="myCsvData" :curr_year="parseInt(curr_year)"/>

                </div>
            </div>
        </div>
    </div>

    <!-- </div> -->
</template>

<script>

import MainChart from "../components/mainchart.vue"
import BarChart from "../components/barchart.vue"
import RadarChart from "../components/radarchart.vue"
import * as d3 from "d3";
import * as topojson from "topojson"
import csvPath from "../../../dataset/CO2_emission.csv";


const geoPath = 'https://raw.githubusercontent.com/1832051637/ECS272-Fall2022/main/Homework2/erjzhang/dataset/world_topo.json'

const FIRST_YEAR = 1990
const LAST_YEAR = 2019
const CURR_YEAR = 2019
const TOP_N = 7
const X_KEY = 'Country Name'

const HISTORY_MAX = 50  // actual value is 50.95403383


export default {
    data() {
        return {
            country_num: -999,
            dataExists: false,
            geoDataExists: false,
            radarDataExists:false,
            myCsvData: [],
            myGeoData: [],
            // myRadarData: [],
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
        BarChart,
        RadarChart,
    },
    created() {
        /* Fetch via CSV */
        this.read_from_csv()
        this.read_from_geo()
        // this.drawRadarFronCSV()
    },
    mounted() {
        // this.read_from_csv()
        // this.read_from_geo()
    },
    methods: {
        read_from_csv() {
            //async method
            d3.csv(csvPath)
                .then((data) => { 
                    console.log(data.length);
                    console.log(data);
                    this.country_num = data.length
                    this.dataExists = true; // updates the v-if to conditionally when data loaded successfully
                    this.myCsvData = data; // updates the prop value to be the recieved data from csv
                    this.x_key = X_KEY
                    this.curr_year = CURR_YEAR
                    this.top_n = TOP_N
                    this.history_max = HISTORY_MAX

                });
        },

        read_from_geo() {
            d3.json(geoPath)
                .then((geoData) => {
                    this.geoDataExists = true;
                    this.myGeoData = geoData
                })
        },

        // drawRadarFronCSV() {
        //     d3.csv(csvPath)
        //         .then((data) => { 
                    
        //             this.radarDataExists = true
        //             this.myCsvData = data
        //         });

        // },
        // toNumber(item) {
        //     // console.log(item)
        //     if (typeof item === 'number') {
        //         return item
        //     }
        //     return item ? parseFloat(item) : 0.0
        // },
    }
}

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

// function all_year_min(data) {
//     let min = Infinity
//     for (let index = FIRST_YEAR; index < LAST_YEAR + 1; index++) {
//         let every_min = d3.min(data, d => {
//             if (d[index]) {
//                 // if (parseFloat(d[index]) == 0.0) {
//                 //     console.log("Wow, there is actually a ZERO")
//                 // }
//                 return parseFloat(d[index])
//             }
//             return Infinity
//         })
//         if (every_min < min) {
//             min = every_min
//         }
//     }
//     return min
// }

// function toNumber(item) {
//     if (typeof item === 'number') {
//         return item
//     }
//     return item ? parseFloat(item) : 0.0
// }

</script>
