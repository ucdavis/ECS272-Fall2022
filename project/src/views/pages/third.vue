<template>
    <div>
        <h1>Summary of top popular involved OSS projects</h1>
    </div>
    <div class="column middle">
        <BubbleChart v-if="dataExists" myChartID="middlepie"></BubbleChart>
    </div>
    <div class="bottom bar">
        <BarChart v-if="dataExists" @selectedyear="updateYear" myChartID="bottombar" :myBarchartData=myBarData></BarChart>
    </div>
</template>

<script setup>
    import BubbleChart from '../components/bubblechart.vue';
    import BarChart from '../components/barchart.vue';
    import testData from "../../assets/data/test.json";
</script>
<script>
import * as d3 from "d3";
export default {
    data(){
        return {
            dataExists: false,
            myBarData: Array,
            //data_person = d3.csvParse(FileAttachment().text(), d3.autoType)
            //data_title = d3.csvParse(FileAttachment().text(), d3.autoType)
            //actorGroups : Array,
            dateselected : {},
            titleGroups : {},
            titleGroups_selected : {},
            //fdata_person : Array,
            fdata_title : Array,
            title_nameindex : Object,
            title_idindex : Object,
            title_radar : String,
        }
    },
    components: {
        BarChart,
        //PieChart,
        BubbleChart
        //Sunburst,
        //NodeTree,
        //RadarChart
    },
    created(){
        this.myBarData = testData.data;
        //console.log("Test Bardata", this.myBarData);
        this.dataExists = true;
    },
    mounted(){
        
    },
    methods:{
        updateYear(data){
            console.log("Year changed!", data)
            this.dateselected[0] = data[0];
            this.dateselected[1] = data[1];
            console.log("Year updated", this.dateselected)
        },
    }
}
</script>

<style scoped>
    body {
    margin: 0;
    }
    .column {
    float: left;
    padding: 10px;
    }

    .column.side {
    width: 50%;
    height: 55%;
    }

    .column.middle {
    width: 50%;
    height: 55%;
    }
    .bottombar{
        width: 100%;
        height: 25%;
    }
    .card {
    background-color: white;
    padding: 5px;
    margin-top: 5px;
    }

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