<template>
    <div>
        <a-row type="flex">
            <a-col :span="12">
                <LineChart v-if="dataExists" :csvData="csvData" />
            </a-col>
            <a-col :span="12">
                <ScatterPlot v-if="dataExists" :csvData="csvData" />
            </a-col>
            <a-col :span="24">
                <ParallelChart v-if="dataExists" :csvData="csvData" />
            </a-col>
        </a-row>
    </div>
</template>

<script>
import LineChart from "../components/linechart.vue"
import ScatterPlot from "../components/scatterplot.vue"
import ParallelChart from "../components/parallelchart.vue"
import * as d3 from "d3";
import csvPath from '../../assets/titles.csv';
import utils from '../../utils'

export default {
    data() {
        return {
            dataExists: false,
            csvData: {},
        }
    },
    components: {
        LineChart,
        ScatterPlot,
        ParallelChart,
    },
    created() {
        this.drawFromCsv()
    },
    mounted() { },
    methods: {
        drawFromCsv() {
            d3.csv(csvPath).then((data) => {
                this.csvData = utils.processTitleData(data);
                this.dataExists = true;
            });
        }
    }
}

</script>
