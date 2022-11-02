<template>
    <div class="container-fluid">
        <div id="split" class="row">
            <div class="col pt-0">
                <!-- <div class="container border"> -->
                    <h1 class="my-0">World CO2 Emission Per Capita</h1>
                    <!-- <h1 class=""></h1> -->
                    <LineChart v-if="dataExists" :myLineChartData="myCsvData" :curr_year="parseInt(curr_year)" :selected_country_code="selected_country_code"
                        :history_max="history_max" :selected_country_name="selected_country_name"/>
                    
                    <h2 class="my-0">Year: {{ curr_year }}
                        <span class="h6"><span class="badge badge-info mx-1">Tip</span>Click on white part to reset map</span>
                    </h2>
                    <div class="slidecontainer">
                        <input type="range" v-bind:min="first_year" v-bind:max="last_year" class="slider"
                            id="year_slider" v-model="curr_year">   
                    </div>
                    <MapChart v-if="geoDataExists" :myGeoData="myGeoData" :myMapChartData="myCsvData"
                        :curr_year="parseInt(curr_year)" :history_max="history_max" v-on:country_picked="update_selected"/>
                <!-- </div> -->
            </div>

            <div class="col">
                <div class="row">
                    <h3 class="mb-0 ml-4 mt-3">Top {{ top_n }} CO2 Emission Countries in {{ curr_year }}</h3>
                    <BarChart v-if="dataExists" :myBarchartData="myCsvData" :curr_year="parseInt(curr_year)"
                        :x_key="x_key" :top_n="top_n" :selected_country_code="selected_country_code" :selected_country_name="selected_country_name"/>
                </div>
                <div class="row">
                    <h3 class="mb-0 ml-4">Emission by Regions</h3>
                    <RadarChart v-if="dataExists" :myCsvData="myCsvData" :curr_year="parseInt(curr_year)" />

                </div>
            </div>
        </div>
    </div>

</template>

<script>

import MapChart from "../components/mapchart.vue"
import BarChart from "../components/barchart.vue"
import RadarChart from "../components/radarchart.vue"
import LineChart from "../components/linechart.vue"
import * as d3 from "d3";
import csvPath from "../../../dataset/CO2_emission.csv";


const geoPath = 'https://raw.githubusercontent.com/1832051637/ECS272-Fall2022/main/Homework2/erjzhang/dataset/world_topo.json'

const FIRST_YEAR = 1990
const LAST_YEAR = 2019
const CURR_YEAR = 2019
const TOP_N = 7
const X_KEY = 'Country Name'
const SELECTED_COUNTRY_CODE = "no country selected"
const SELECTED_COUNTRY_NAME = "no country selected"
const HISTORY_MAX = 50  // actual value is 50.95403383


export default {
    data() {
        return {
            country_num: -999,
            dataExists: false,
            geoDataExists: false,
            radarDataExists: false,
            myCsvData: [],
            myGeoData: [],
            first_year: FIRST_YEAR,
            last_year: LAST_YEAR,
            curr_year: CURR_YEAR,
            top_n: TOP_N,
            x_key: "nothing",
            history_max: 50.95403383,
            selected_country_code: SELECTED_COUNTRY_CODE,
            selected_country_name: SELECTED_COUNTRY_NAME
        }
    },
    components: {
        MapChart,
        BarChart,
        RadarChart,
        LineChart,
    },
    created() {
        /* Fetch via CSV */
        this.read_from_csv()
        this.read_from_geo()
        
    },
    mounted() {},
    updated() {
        // console.log(MapChart.selected_country_code)
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

        update_selected(val) {
            this.selected_country_code = val
            console.log("Received updated country selection from child: ", this.selected_country_code)
            if (val == SELECTED_COUNTRY_CODE) {
                this.selected_country_name = SELECTED_COUNTRY_NAME
                return
            }
            this.selected_country_name = this.myCsvData.find((c) => {
                return c["country_code"] == this.selected_country_code
            })["Country Name"]
        },
    }
}

</script>
