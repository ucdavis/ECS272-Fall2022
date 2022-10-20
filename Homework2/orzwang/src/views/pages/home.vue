<template>
    <div class="column side">
        <div class="card">
            <h2>Chart UpperLeft</h2>
            <BarChart v-if="dataExists" :myBarchartData="myBarData" myChartID="bar1"/>
        </div>
        <div class="card">
            <h2>Chart LowerLeft</h2>
            <BarChart v-if="dataExists" :myBarchartData="myBarData" myChartID="bar2"/>
        </div>
    </div>
    <div class="column middle">
    <div class="card">
        <h2>Chart Right</h2>
        <Piechart myChartID="bar3"/>
    </div>
    </div>
</template>

<script>
import BarChart from "../components/barchart.vue";
import * as d3 from "d3";
import csvPath from '../../assets/data/SF_Historical_Ballot_Measures.csv';
import Piechart from '../components/piechart.vue';

export default {
    data(){
        return {
            dataExists: false,
            myBarData: [],
        }
    },
    components: {
    BarChart,
    Piechart
},
    created(){
        /* Fetch via CSV */
        this.drawBarFromCsv()
    },
    mounted(){},
    methods: {
        drawBarFromCsv(){
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
<style>
    body {
    margin: 0;
    }
    .column {
    float: left;
    padding: 10px;
    }

    /* 左右两侧宽度 */
    .column.side {
    width: 40%;
    height: 45%;
    }

    /* 中间区域宽度 */
    .column.middle {
    width: 60%;
    height: 100%;
    }
    .card {
    background-color: white;
    padding: 20px;
    margin-top: 20px;
    }
    /* 列后面清除浮动 */
    .row:after {
    content: "";
    display: table;
    clear: both;
    }
@media screen and (max-width: 600px) {
  .column.side, .column.middle {
    width: 100%;
  }
}
</style>
