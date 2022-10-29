<template>
    <Header>Welcome To Home Page</Header>
    <a-row type="flex" justify="center">
        <a-col :span="12">
            Advanced Visualization
        </a-col>
        <a-col :span="12">
            <a-row class="height-50">
                <Histogram />
            </a-row>

        </a-col>
        <!-- <a-col :span="4">Sider2</a-col> -->
    </a-row>
    <Footer>Footer</Footer>
</template>

<script>
import BarChart from "../components/barchart.vue"
import * as d3 from "d3";
import csvPath from '../../assets/data/SF_Historical_Ballot_Measures.csv';
import { Layout } from "ant-design-vue";
import Histogram from "../components/histogram.vue"
import { Space } from 'ant-design-vue';

export default {
    data() {
        return {
            dataExists: false,
            myBarData: [],
            simpleValue: 50
        }
    },
    components: {
        BarChart,
        Histogram
    },
    created() {
        /* Fetch via CSV */
        this.drawBarFromCsv()
    },
    mounted() { },
    methods: {
        drawBarFromCsv() {
            //async method
            d3.csv(csvPath).then((data) => {
                // array of objects
                console.log(data.length);
                console.log(data);
                this.dataExists = true; // updates the v-if to conditionally show the barchart only if our data is here.
                this.myBarData = data; // updates the prop value to be the recieved data, which we hand in to our bar-chart

            });
        }
    }
}

</script>
