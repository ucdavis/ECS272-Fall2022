<template>
    <div class = "column middle">
        <h3>ScatterPlot Here!</h3>
    </div>
    <div class="bottom bar">
        <BarChart v-if="dataExists" @selectedyear="updateYear" myChartID="bottombar" :myBarchartData=myBarData>
        </BarChart>
    </div>
</template>
<script setup>
import BarChart from '../components/barchart.vue';
import testData from "../../assets/data/test.json";
import commitData from "../../assets/data/OSCI_commits_ranking_MTD.json"
</script>
<script>
export default {
    data() {
        return {
            dataExists: false,
            myBarData: Array,
            commitPieData: Array,
            commit_by_company_vs_noncompany: Object,
            //data_person = d3.csvParse(FileAttachment().text(), d3.autoType)
            //data_title = d3.csvParse(FileAttachment().text(), d3.autoType)
            //actorGroups : Array,
            dateselected: ['2019-01', '2019-06'],
        }
    },
    components:{
        BarChart,
    },
    props:{

    },
    created(){
        this.myBarData = testData.data;
        this.dataExists = true;
    },
    mounted(){

    },
    methods:{

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
    width: 100%;
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