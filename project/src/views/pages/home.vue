<template>
    <div>
        <h1>Summary of Companies' contribution to OSS projects</h1>
    </div>
    <div class="column left">
        <PieChart myChartID="leftpie"></Piechart>
    </div>
    <div class="column middle">
        <PieChart myChartID="middlepie"></Piechart>
    </div>
    
</template>

<script setup>
    import PieChart from '../components/piechart.vue';
    import BarChart from '../components/barchart.vue';
</script>

<script>
//<div class="column right">
//        <BarChart myChartID="rightbar"></BarChart>
//    </div>
//    <div class="bottom bar">
//        <BarChart myChartID="bottombar"></BarChart>
//    </div>
import * as d3 from "d3";
export default {
    data(){
        return {
            dataExists: false,
            myBarData: [],
            //data_person = d3.csvParse(FileAttachment().text(), d3.autoType)
            //data_title = d3.csvParse(FileAttachment().text(), d3.autoType)
            //actorGroups : Array,
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
        PieChart,
        //Sunburst,
        //NodeTree,
        //RadarChart
    },
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

    .column.left {
    width: 30%;
    height: 50%;
    }

    .column.middle {
    width: 30%;
    height: 50%;
    }

    .column.right {
    width: 30%;
    height: 50%;
    }
    .bottombar{
        width: 100%;
        height: 30%;
    }
    .card {
    background-color: white;
    padding: 5px;
    margin-top: 5px;
    }
</style>