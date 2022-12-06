<template>
    <div class = "bottombar">
        <h3>ScatterPlot Here!</h3>
        <ScatterPlot v-if="dataExists" myChartID="topscatter"></ScatterPlot>
    </div>
    <div class="bottombar">
        <h1>Number of commits </h1>
        <BarChart v-if="dataExists" @selectedyear="updateYear" myChartID="bottombar" :myBarchartData=myBarData>
        </BarChart>
    </div>
</template>
<script setup>
import BarChart from '../components/barchart.vue';
import testData from "../../assets/data/test.json";
import commitData from "../../assets/data/OSCI_commits_ranking_MTD.json"
import ScatterPlot from "../components/scatter.vue";
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
        ScatterPlot
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
        updateYear(data) {
            console.log("Year changed!", data)
            this.dateselected[0] = data[0];
            this.dateselected[1] = data[1];
            //this.extract_company_commmit()
            //this.update_selected_company_info(this.selectedCompany)
            //console.log("Year updated", this.titleGroups, this.titleGroups_selected)
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
    padding: 5px;
    }

    .column.side {
    width: 100%;
    height: 55%;
    }

    .bottombar{
        width: 100%;
        height: 50%;
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
  .column.side {
    width: 100%;
  }
}
</style>