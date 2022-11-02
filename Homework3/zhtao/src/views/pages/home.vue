<template>
        <h1>CO2 Emissions Around the World</h1>
        <!-- <BarChart v-if="dataExists" :myBarchartData="myBarData" /> -->
        <div class="container">
            <div class="main">
                <BubbleChart />
            </div>
            <div class="side">
                <DonutChart />
                <BeeswarmChart />
            </div>
        </div>
</template>

<script>
import BarChart from "../components/barchart.vue"
import DonutChart from "../components/donutchart.vue"
import BeeswarmChart from "../components/beeswarmchart.vue"
import BubbleChart from "../components/bubblechart.vue"
import * as d3 from "d3";
import csvPath from '../../assets/data/SF_Historical_Ballot_Measures.csv';

export default {
    data(){
        return {
            dataExists: false,
            myBarData: [],
        }
    },
    components: {
        BarChart,
        DonutChart,
        BeeswarmChart,
        BubbleChart
    },
    created(){
        /* Fetch via CSV */
        // this.drawBarFromCsv()
    },
    mounted(){},
    methods: {
        // drawBarFromCsv(){
        //     //async method
        //     d3.csv(csvPath).then((data) => {
        //         // array of objects
        //         console.log(data.length);
        //         console.log(data+ "gggggg");
        //         this.dataExists = true; // updates the v-if to conditionally show the barchart only if our data is here.
        //         this.myBarData = data; // updates the prop value to be the recieved data, which we hand in to our bar-chart

        //     });
        // }
    }
}

</script>

<style>
.container {
    /* width: 100%;
    height: 100%; */
    display: flex;
    justify-content: space-around;
}
.main {
    /* width: 80%; */
    /* height: 100%; */
    display: flex;
    justify-content: space-around;
}
.side {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

</style>
