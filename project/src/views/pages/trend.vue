<template>
    <div class = "bottombar">
        <h3>ScatterPlot Here!</h3>
        <ScatterPlot v-if="dataExists" myChartID="topscatter" :myPlotData=scatterChartData></ScatterPlot>
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
import repositoryCompositionData from "../../assets/data/Repository_Composition_Ranking_MTD.json"
</script>
<script>
export default {
    data() {
        return {
            dataExists: false,
            myBarData: Array,
            commitPieData: Array,
            repo_commit_by_month: Object,
            repo_commit_by_company_by_month:Object,
            //data_person = d3.csvParse(FileAttachment().text(), d3.autoType)
            //data_title = d3.csvParse(FileAttachment().text(), d3.autoType)
            //actorGroups : Array,
            dateselected: ['2019-01', '2019-06'],
            scatterChartData: Array,
            
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
        [this.repo_commit_by_month, this.repo_commit_by_company_by_month] = this.parse_data()
        this.extract_scatter_data()
        this.dataExists = true;
    },
    mounted(){

    },
    methods:{
        updateYear(data) {
            console.log("Year changed!", data)
            this.dateselected[0] = data[0];
            this.dateselected[1] = data[1];
            this.extract_scatter_data()
            //this.extract_company_commmit()
            //this.update_selected_company_info(this.selectedCompany)
            //console.log("Year updated", this.titleGroups, this.titleGroups_selected)
        },

        extract_scatter_data() {
            function groupBy(objectArray, property, transform, accumulate) {
                return objectArray.reduce(function (acc, obj) {
                    let key = obj[property]
                    if (transform) {
                        key = transform(key)
                    }
                    if (accumulate) {
                        acc[key] = accumulate(acc[key], obj);
                    } else {
                        if (!acc[key]) {
                            acc[key] = []
                        }
                        acc[key].push(obj)
                    }
                    return acc
                }, {})
            }
            let total_commits = {};
            let company_commits = {};
            let months = 0;
            for (const [month, commit_count] of Object.entries(this.repo_commit_by_month)) {
                // console.log(commits)
                let date = new Date(month);
                if (date >= new Date(this.dateselected[0]) && date < new Date(this.dateselected[1])) {
                    months += 1;
                    for (const commit_entry of commit_count) {
                        const repo = commit_entry["repo_name"]
                        total_commits[repo] = (total_commits[repo] || 0) + commit_entry["Commits"]
                        if (commit_entry["company"] != "Unknown") {
                            company_commits[repo] = (company_commits[repo] || 0) + commit_entry["Commits"]
                        }
                    }
                }
            }

            this.scatterChartData = Object.keys(total_commits).map((repo) => {
                return {
                    id: repo,
                    x: total_commits[repo],
                    y: company_commits[repo] / total_commits[repo] * 100
                }
            })
        },

        parse_data() {
            function groupBy(objectArray, property, transform, accumulate) {
                return objectArray.reduce(function (acc, obj) {
                    let key = obj[property]
                    if (transform) {
                        key = transform(key)
                    }
                    if (accumulate) {
                        acc[key] = accumulate(acc[key], obj);
                    } else {
                        if (!acc[key]) {
                            acc[key] = []
                        }
                        acc[key].push(obj)
                    }
                    return acc
                }, {})
            }

            let repo_commit_by_month = groupBy(repositoryCompositionData, "month", undefined, undefined);

            let repo_commit_by_company_by_month = groupBy(repositoryCompositionData,
                "month",
                undefined,
                undefined
            )
            for (const [key, value] of Object.entries(repo_commit_by_company_by_month)){
                value.sort((a,b) => -a["Commits"] + b["Commits"])
            }

            return [repo_commit_by_month, repo_commit_by_company_by_month]
        }
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