<template>
    <div>
        <a-row type="flex">
            <a-col :flex="1">
                <a-card title="Overview: CO2 Emission By Years" style="width: 95%">
                    <MapChart v-if="dataExistsMap" :myMapChartData="myMapData"/>
                </a-card>
            </a-col>
            <a-col :flex="1" type="flex">
                <a-row :flex="1">
                    <a-card title="CO2 Emission Changes In Years By Countries" style="width:95%">
                        <LineChart v-if="dataExistsLine" :myLineChartData="myLineData"/>
                    </a-card>
                </a-row>
                <br />
                <a-row :flex="1">
                    <a-card title="CO2 Emission Changes Comparison Between Regions" style="width:95%">
                        <RadarChart v-if="dataExistsRadar" :myRadarChartData="myRadarData"/>
                    </a-card>
                </a-row>    
            </a-col>
        </a-row>
        <br />
    </div>
</template>

<script>
import MapChart from "../components/mapchart.vue";
import LineChart from "../components/linechart.vue";
import RadarChart from "../components/radarchart.vue";
import * as d3 from "d3";
import MapcsvPath from "../../assets/data/map_data.csv";
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
