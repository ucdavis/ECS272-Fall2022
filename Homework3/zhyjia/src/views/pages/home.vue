<template>
    <div>
        <h2>Dashboard for TMDB 5000 Movie Dataset</h2>
        <a-row type="flex">
            <a-col :flex="3" type="flex">
                <a-row :flex="1">
                    <a-card title="Scatter Plot: The relationship between movie budget and revenue by genre (brush to zoom)" style="width: 95%">
                        <ScatterPlot /> 
                    </a-card>
                </a-row>
                <br />
                <a-row :flex="1">
                    <a-card title="Strem Graph: The trend in the number of movies by genre over time (click to select)" style="width: 95%">
                        <StreamGraph />
                    </a-card>
                </a-row>
            </a-col>
            <a-col :flex="5" type="flex">
                <a-card title="Bubble Chart: The overview of the dataset distribution" style="width: 730px">
                    <BubbleChart /> 
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import StreamGraph from "../components/sg.vue"
import ScatterPlot from "../components/sp.vue"
import BubbleChart from "../components/bc.vue"
import * as d3 from "d3";
import csvPath from '../../assets/data/SF_Historical_Ballot_Measures.csv';

export default {
    data(){
        return {
            dataExists: false,
        }
    },
    components: {
        StreamGraph,
        ScatterPlot,
        BubbleChart
    },
    created(){},
    mounted(){},
    methods: {}
}

</script>
