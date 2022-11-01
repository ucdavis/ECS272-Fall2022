<template>
    <div class="dashboardContainer">
        <div class="row">
            <div class="column">
                <h1 class="overviewTitle">Overview: World CO2 Emission By Years</h1>
                <MapChart v-if="dataExistsMap" :myMapChartData="myMapData"/>
            </div>
            <div class="column">
                <div class="half-row">
                    <h1 class="focusviewTitle">CO2 Emission Changes In Years By Countries</h1>
                    <LineChart v-if="dataExistsLine" :myLineChartData="myLineData"/>
                </div>
                <div class="half-row">
                    <h1 class="focusviewTitle">CO2 Emission Changes Every 5 Years Comparison Between Regions</h1>
                    <RadarChart v-if="dataExistsRadar" :myRadarChartData="myRadarData"/>
                </div>    
            </div>
        </div>
    </div>
</template>

<script>
import MapChart from "../components/mapchart.vue";
import LineChart from "../components/linechart.vue";
import RadarChart from "../components/radarchart.vue";
import * as d3 from "d3";
import MapcsvPath from "../../assets/data/CO2_emission.csv";
import LinecsvPath from "../../assets/data/line_data.csv";
import RadarcsvPath from "../../assets/data/radar_data.csv";

export default {
    data(){
        return {
            dataExistsMap: false,
            dataExistsLine: false,
            dataExistsRadar: false,
            myMapData: [],
            myLineData: [],
            myRadarData: [],
        }
    },
    components: {
        MapChart,
        LineChart,
        RadarChart
    },
    
    created(){
        /* Fetch via Path */
        this.drawMapFromCsv();
        this.drawLineFromCsv();
        this.drawRadarFromCsv();
    },
    mounted(){},
    methods: {
        drawMapFromCsv(){
            //async method
            d3.csv(MapcsvPath).then((data) => {
                // array of objects
                console.log(data.length);
                console.log(data);
                this.dataExistsMap = true;
                this.myMapData = data;

            });
        },
        drawLineFromCsv(){
            //async method
            d3.csv(LinecsvPath).then((data) => {
                // array of objects
                console.log(data.length);
                console.log(data);
                this.dataExistsLine = true;
                this.myLineData = data;

            });
        },
        drawRadarFromCsv(){
            //async method
            d3.csv(RadarcsvPath).then((data) => {
                // array of objects
                console.log(data.length);
                console.log(data);
                this.dataExistsRadar = true;
                this.myRadarData = data;

            });
        }
    }
}

</script>
<style scoped>
    .dashboardContainer{
        height: 100%;
        display: flex;
    }

    .row{
        width: 100%;
        height: 100%;
        display: inline-flex;
        flex-wrap: wrap;
        background-color: #ffffff;
    }

    .half-row{
        width: 100%;
        height: 50%;
        background-color: #ffffff;
    }

    .column{
        width: 50%;
        height: 100%;
        background-color: #ffffff;
    }

    .overviewTitle{
        font-size: 1.5em;
        width: 100%;
        background-color: #ffffff;
        color: #1a1919;
        text-align: center;
        margin: 0;
        height: 6%;
    }

    .focusviewTitle{
        font-size: 1.5em;
        width: 100%;
        background-color: #ffffff;
        color: #1a1919;
        text-align: center;
        margin: 0;
        height: 12%;
    }
</style>