<template>
    <div>
        <a-row type="flex">
            <a-col :flex="3">
                <a-card title="Overview: Pokemon Total Stats VS Weight" style="width: 95%">
                    <template #extra>
                        <a-popover placement="bottom">
                            <template #content>
                                <p>The scatterplot supports select, pan and zoom actions</p>
                                <p>Click on the specific point to select a pokemon</p>
                                <p>The selected point will become orange and details will appear on the right</p>
                                <p>Scroll to zoom, click and hold to pan</p>
                                <p>There will be little offset to divide points with the same coordinates</p>
                            </template>
                            <a><question-circle-outlined /></a> 
                        </a-popover>
                    </template>
                    <ScatterChart v-if="dataExistsScatter" :myScatterChartData="myScatterData" :selectPokemon="selectPokemon" :selectedPokemon="selectedPokemon" /> 
                </a-card>
            </a-col>
            <a-col :flex="2" type="flex">
                <a-row :flex="1">
                    <a-card title="Radar Plot for Selected Pokemon" style="width: 95%">
                        <RadarChart v-if="dataExistsRadar" :selectedPokemon="selectedPokemon" />
                        <h4 v-else> Click on the Scatter Point to Select a Pokemon</h4>
                    </a-card>
                </a-row>
                <br />
                <a-row :flex="1">
                    <a-card title="Are Pokemon Becoming Stronger Over Generations?" style="width: 95%">
                        <BarChart v-if="dataExistsBar" :myBarChartData="myBarData" />
                    </a-card>
                </a-row>
            </a-col>
        </a-row>
        <br />
    </div>
</template>

<script>
import ScatterChart from "../components/scatterChart.vue";
import RadarChart from "../components/radarChart.vue";
import BarChart from "../components/barChart.vue";
import * as d3 from "d3";
import csvScatterPath from '../../assets/data/pokemon_all.csv';
import csvBarPath from '../../assets/data/avg_stats_generation.csv';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';


export default {
    data(){
        return {
            dataExistsScatter: false,
            dataExistsRadar: false,
            dataExistsBar: false,
            myScatterData: [],
            myBarData: {},
            selectedPokemon: {},
        }
    },
    components: {
        ScatterChart,
        RadarChart,
        BarChart,
        QuestionCircleOutlined
    },
    created(){
        /* Fetch via CSV */
        this.drawScatterFromCsv();
        this.drawBarFromCsv();
    },
    mounted(){},
    methods: {
        selectPokemon(data){
            this.selectedPokemon = data;
            this.dataExistsRadar = true;
            console.log(this.selectedPokemon);
        },
        drawScatterFromCsv(){
            //async method
            d3.csv(csvScatterPath).then((data) => {
                // array of objects
                console.log(data.length);
                console.log(data);
                this.dataExistsScatter = true; // updates the v-if to conditionally show the barchart only if our data is here.
                this.myScatterData = data; // updates the prop value to be the recieved data, which we hand in to our bar-chart
            });
        },
        drawBarFromCsv() {
            d3.csv(csvBarPath).then((data) => {
                this.myBarData = data;
                this.dataExistsBar = true;
            });
        }
    }
}

</script>