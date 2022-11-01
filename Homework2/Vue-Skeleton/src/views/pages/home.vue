<template>
    <div id="dashboard">
        <div class="column1" id ="left">
            <ParaCoords v-if="dataExists" @updateBrushedData="updateBrushedData" :myParaCoordsData="myParaData" /> 
        </div>
        <div class="column2" id="right">
            <div class="row" id="top">
                <!-- <PieChart v-if="dataExists" :myPieData="myParaData" /> -->
                <!-- <SunBurst v-if="dataExists" @update_year="setMessage" @update_radar_chart="update_radar_chart" :mySunData="myParaData" :brushedData="brushedData" /> -->
                <SunBurst v-if="dataExists" @update_radar_chart="update_radar_chart" :mySunData="myParaData" :brushedData="brushedData" :selectedSongs="selectedSongs" />
            </div>
            <div class="row" id="bottom">
                <RadarChart v-if="dataExists" @updateStrokeColor="updateStrokeColor" :myRadarData="myParaData" :selectedSunData="selectedSunData" :brushedData="brushedData" :year=year  />
            </div>
        </div>
    </div>
</template>

<script>
import BarChart from "../components/barchart.vue"
import ParaCoords from "../components/paracoords.vue"
import PieChart from "../components/piechart.vue"
import RadarChart from "../components/radarchart.vue"
import SunBurst from '../components/sunburst.vue'
import * as d3 from "d3";
import musicPath from '../../assets/data/CODING_TEST.csv'

export default {
    data(){
        return {
            dataExists: false,
            myBarData: [],
            myParaData: [],
            year: '0',
            brushedData: [],
            selectedSunData: [],
            selectedSongs: []
        }
    },
    components: {
        BarChart,
        ParaCoords,
        PieChart,
        RadarChart,
        SunBurst
    },
    created(){
        /* Fetch via CSV */
        this.drawBarFromCsv()
    },
    mounted(){},
    methods: {
         // Define method that will use the payload to update the data property
         setMessage(payload) {
            this.year = payload;
        },

        updateBrushedData(payload) {
            this.brushedData = payload
        },

        update_radar_chart(payload) {
            this.selectedSunData = payload
        },

        updateStrokeColor(payload) {
            this.selectedSongs = payload
        },

        drawBarFromCsv(){
            //async method
            d3.csv(musicPath).then((data) => {
                this.dataExists = true; // updates the v-if to conditionally show the barchart only if our data is here.
                this.myParaData = data// updates the prop value to be the recieved data, which we hand in to our bar-chart

            });
        }
    }
}

</script>
<style scoped src="./home.css"></style>
