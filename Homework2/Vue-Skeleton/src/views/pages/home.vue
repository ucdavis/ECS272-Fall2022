<template>
    <div id="dashboard">
        <div class="column1" id ="left">
            <ParaCoords v-if="dataExists" :myParaCoordsData="myParaData" /> 
        </div>
        <div class="column2" id="right">
            <div class="row" id="top">
                <PieChart v-if="dataExists" :myPieData="myParaData" />
            </div>
            <div class="row" id="bottom">
                <RadarChart v-if="dataExists" :myRadarData="myParaData" />
            </div>
        </div>
    </div>
</template>

<script>
import BarChart from "../components/barchart.vue"
import ParaCoords from "../components/paracoords.vue"
import PieChart from "../components/piechart.vue"
import RadarChart from "../components/radarchart.vue"
import * as d3 from "d3";
import csvPath from '../../assets/data/SF_Historical_Ballot_Measures.csv';
import musicPath from '../../assets/data/CODING_TEST.csv'

export default {
    data(){
        return {
            dataExists: false,
            myBarData: [],
            myParaData: []
        }
    },
    components: {
        BarChart,
        ParaCoords,
        PieChart,
        RadarChart
    },
    created(){
        /* Fetch via CSV */
        this.drawBarFromCsv()
    },
    mounted(){},
    methods: {
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
