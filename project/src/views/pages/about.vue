<template>
    <h2>Top Enterprise that contribute to </h2>
    <div class="column side">
        <!--<div class="card">
            <h3>Staff of the Movie</h3>
            <NodeTree v-if="dataExists" :myNodeData=title_nameindex myChartID="upperleft"></NodeTree>
        </div>-->
            
        <div class="card">
            <h3>Top 10 Enterprise of contribution</h3>
            <BubbleChart v-if="dataExists" myChartID="companybubble" @selectedEntry="updateCompany"/>
            <!--<Sunburst v-if="dataExists" @givefather="getSon" myChartID="upperright" :mysundata=titleGroups_selected>

            </Sunburst>-->
        </div>
    </div>
    <div class="column middle">
        <div class="card">
            <!--<h3>RadarChart of the scores of Movie/Show</h3>
            <RadarChart v-if="dataExists" :myRadarData=title_idindex :showID=title_radar myChartID="upperleftradar"></RadarChart>
            -->
        </div>
    </div>
    <div class="bottombar">
        
        <h3>Barchart of number of products each year </h3>
        <BarChart v-if="dataExists" @selectedyear="updateYear" :myBarchartData=myBarData myChartID="barbottom"/>
        
        
    </div>
</template>

<script setup>
import BubbleChart from "../components/bubblechart.vue"
import BarChart from "../components/barchart.vue";
import Piechart from '../components/piechart.vue';
import Sunburst from "../components/sunburst.vue";
import NodeTree from "../components/nodetree.vue";
import RadarChart from "../components/radar.vue";
</script>

<script>

import * as d3 from "d3";
//import csvPath from '../../assets/data/SF_Historical_Ballot_Measures.csv';
import person_csvPath from '../../assets/data/credits.csv';
import title_csvPath from '../../assets/data/titles.csv';
import testData from "../../assets/data/test.json";
import commitData from "../../assets/data/OSCI_commits_ranking_MTD.json"

export default {
    data(){
        return {
            dataExists: false,
            myBarData: Array,
            //commitPieData: Array,
            commit_by_company_vs_noncompany: Object,
            //data_person = d3.csvParse(FileAttachment().text(), d3.autoType)
            //data_title = d3.csvParse(FileAttachment().text(), d3.autoType)
            //actorGroups : Array,
            dateselected: ['2019-01', '2019-06'],
            titleGroups: {},
            titleGroups_selected: {},
            //fdata_person : Array,
            fdata_title: Array,
            title_nameindex: Object,
            title_idindex: Object,
            title_radar: String,
        }
    },
    components: {
    BarChart,
    //Piechart,
    //Sunburst,
    //NodeTree,
    RadarChart
},
    created(){
        const [repository_composition, commit_by_company, commit_by_company_vs_noncompany, company_contributed_repository_count] = this.parse_data()
        this.commit_by_company_vs_noncompany = commit_by_company_vs_noncompany
        this.myBarData = testData.data;
        this.commitPieData = [{ date: "Enterprise", count: 1 }, { date: "Community", count: 1 }];
        this.extract_company_commmit()
        console.log(this.commitPieData)
        // console.log("Test Bardata", this.myBarData);
        this.dataExists = true;
        // radar data update
        this.title_radar = "tm32982"
        
    },
    mounted(){
        
    },
    methods: {
        updateYear(data){
            console.log("Year changed!", data)
            let selected = {}
            Object.keys(this.titleGroups).forEach(k =>{
                if (k>data[0] & k<data[1]){
                    selected[k] = this.titleGroups[k]
                }
            })
            //return
            this.titleGroups_selected = selected;
            //console.log("Year updated", this.titleGroups, this.titleGroups_selected)
        },
        updateCompany(data){
            console.log("Year changed!", data)
            let selected = {}
            Object.keys(this.titleGroups).forEach(k =>{
                if (k>data[0] & k<data[1]){
                    selected[k] = this.titleGroups[k]
                }
            })
            //return
            this.titleGroups_selected = selected;
            //console.log("Year updated", this.titleGroups, this.titleGroups_selected)
        },
        
        groupBy(objectArray, property) {            
            return objectArray.reduce(function (acc, obj) {
                let key = obj[property]
                if (!acc[key]) {
                acc[key] = []
                }
                acc[key].push(obj)
                return acc
            }, {})
        },
        extract_company_commmit() {
            let company_commits_in_period = 0
            let noncompany_commits_in_period = 0
            for (const [month, commits] of Object.entries(this.commit_by_company_vs_noncompany)) {
                // console.log(commits)
                let date = new Date(month);
                if (date >= new Date(this.dateselected[0]) && date < new Date(this.dateselected[1])) {
                    company_commits_in_period += commits["company"]
                    noncompany_commits_in_period += commits["noncompany"]
                }
            }
            this.commitPieData = [{ date: "Enterprise", count: company_commits_in_period }, { date: "Community", count: noncompany_commits_in_period }]

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

            // const months = 24
            // const start_year = 2019
            // let repository_composition = [];
            // let company_contributed_repository_count = [];
            // for (let i = 0; i < months; i++) {
            //     const year = start_year + Math.floor(i / 12)
            //     const month = 1 + (i % 12)
            //     const last_day_of_month = new Date(year, month, 0)
            //     const repository_composition_monthly = d3.csvParseRows(require(`../../assets/data/Repository_Composition_Ranking_MTD/Repository_Composition_Ranking_MTD_${last_day_of_month.toISOString().split('T')[0]}.csv`), (d, i) => {
            //         return {
            //             repo_name: d.repo_name,
            //             company: d.company,
            //             commits: d.commits,
            //             month: `${year}-${month < 10 ? month : ('0' + str(month))}`,
            //         };
            //     });

            //     const is_repository_contributed_by_company = groupBy(repository_composition_monthly, "repo_name", accumulate = (acc, entry) => acc || entry.company != "Unknown")

            //     company_contributed_repository_count.push({
            //         x: Object.entries(is_repository_contributed_by_company).filter(([key, flag]) => flag == true).length,
            //         y: `${year}-${month < 10 ? month : ('0' + str(month))}`,
            //     })


            //     repository_composition = repository_composition.concat(repository_composition_monthly)
            // }

            // let commit_by_company = [];
            // let commit_by_company_vs_noncompany = []
            // for (let i = 0; i < months; i++) {
            //     const year = start_year + math.floor(i / 12)
            //     const month = 1 + (i % 12)
            //     const last_day_of_month = new Date(year, month + 1, 0)
            //     commit_by_company = commit_by_company.concat(d3.csvParseRows(require(`../../assets/data/OSCI_commits_ranking_MTD/OSCI_commits_ranking_MTD_${last_day_of_month.toISOString().split('T')[0]}.csv`), (d, i) => {
            //         return {
            //             company: d.company,
            //             commits: d.commits,
            //             month: `${year}-${month < 10 ? month : ('0' + str(month))}`,
            //         };
            //     }));
            //     const commit_by_company_total = commit_by_company.filter((d) => d.company != "Unknown").map((d) => d.commits).sum();
            //     commit_by_company_vs_noncompany.push({
            //         commits_noncompany: commit_by_company.find((d) => d.company == "Unknown").commits,
            //         commits_company: commit_by_company_total,
            //         month: `${year}-${month < 10 ? month : ('0' + str(month))}`,
            //     })
            // }

            const commit_company_vs_noncompany_by_month = groupBy(commitData, "month", undefined, (acc, entry) => {
                // console.log(entry)
                if (!acc) {
                    acc = {}
                }
                if (entry['Company'] == 'Unknown') {
                    acc['noncompany'] = (acc['noncompany'] || 0) + entry['Commits']
                } else {
                    acc['company'] = (acc['company'] || 0) + entry['Commits']
                }
                return acc;
            });
            // const company_commits_in_period = 0
            // const noncompany_commits_in_period = 0
            // for (const [month, commits] of Object.entries(commit_by_company_vs_noncompany)) {
            //     let date = new Date(month);
            //     if (date >= new Date(this.dateselected[0]) && date < new Date(this.dateselected[0])) {
            //         company_commits_in_period += commits["company"]
            //         noncompany_commits_in_period += commits["noncompany"]
            //     }
            // }





            // return [repository_composition, commit_by_company, commit_by_company_vs_noncompany, company_contributed_repository_count]

            return [0,0, commit_company_vs_noncompany_by_month, 0]
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
    padding: 10px;
    }

    .column.side {
    width: 50%;
    height: 60%;
    }

    .column.middle {
    width: 50%;
    height: 60%;
    }
    .bottombar{
        width: 100%;
        height: 20%;
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
