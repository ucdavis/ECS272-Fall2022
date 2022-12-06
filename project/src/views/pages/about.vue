<template>
    <h2>Top Enterprise that contribute to OSS projects </h2>
    <div class="column side">
        <!--<div class="card">
            <h3>Staff of the Movie</h3>
            <NodeTree v-if="dataExists" :myNodeData=title_nameindex myChartID="upperleft"></NodeTree>
        </div>-->

        <div class="card">
            <BubbleChart v-if="dataExists" myChartID="companybubble" @selectedEntry="updateCompany"
                :myBubbleData=bubbleChartData :refSize=bubbleChartSizeRef />
            <!--<Sunburst v-if="dataExists" @givefather="getSon" myChartID="upperright" :mysundata=titleGroups_selected>

            </Sunburst>-->
        </div>
    </div>
    <div class="column middle">
        <div class="card">
            <!--<h3>RadarChart of the scores of Movie/Show</h3>
            <RadarChart v-if="dataExists" :myRadarData=title_idindex :showID=title_radar myChartID="upperleftradar"></RadarChart>
            -->
            <h3>Now viewing : {{ this.selectedCompany }}</h3>
            <table v-if="dataExists">
                <tr>
                    <th>Metric</th>
                    <th></th>
                </tr>
                <tr>
                    <td>Commits</td>
                    <td>{{ (this.bubbleChartData.find((x) => x.name == this.selectedCompany) || {size:0}).size }}</td>
                </tr>
                <tr>
                    <td>Contributed Repository Count</td>
                    <td>{{ this.selected_company_info.repo_count }}</td>
                </tr>
                <tr>
                    <td>Community Size </td>
                    <td>{{ this.selected_company_info.community }}</td>
                </tr>
                <tr>
                    <td>Active Contributors </td>
                    <td>{{ this.selected_company_info.contributors }}</td>
                </tr>
                <tr>
                    <td>Top Repository Contributed </td>
                    <td>{{ this.selected_company_info.repos[0] ? this.selected_company_info.repos[0][0]: `N/A`}} (Commits: {{ this.selected_company_info.repos[0] ? this.selected_company_info.repos[0][1]: `N/A` }})</td>
                </tr>
            </table>
        </div>
    </div>
    <div class="bottombar">

        <h1>Number of commits </h1>
        <BarChart v-if="dataExists" @selectedyear="updateYear" :myBarchartData=myBarData myChartID="barbottom" />


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
import repositoryCompositionData from "../../assets/data/Repository_Composition_Ranking_MTD.json"
import communityData from "../../assets/data/OSCI_ranking_MTD.json"

export default {
    data() {
        return {
            dataExists: false,
            myBarData: Array,
            bubbleChartData: Array,
            bubbleChartSizeRef: Number,
            //commitPieData: Array,
            commit_company_by_month: Object,
            //data_person = d3.csvParse(FileAttachment().text(), d3.autoType)
            //data_title = d3.csvParse(FileAttachment().text(), d3.autoType)
            //actorGroups : Array,
            dateselected: ['2019-01', '2019-06'],
            selectedCompany: String,
            titleGroups: {},
            titleGroups_selected: {},
            //fdata_person : Array,
            fdata_title: Array,
            title_nameindex: Object,
            title_idindex: Object,
            title_radar: String,
            selected_company_info: Object
        }
    },
    components: {
        BarChart,
        //Piechart,
        //Sunburst,
        //NodeTree,
        RadarChart
    },
    created() {
        const commit_by_company_vs_noncompany = this.parse_data()
        this.commit_company_by_month = commit_by_company_vs_noncompany
        this.myBarData = testData.data;
        this.commitPieData = [{ date: "Enterprise", count: 1 }, { date: "Community", count: 1 }];
        this.extract_company_commmit()
        console.log(this.commitPieData)
        // console.log("Test Bardata", this.myBarData);
        this.dataExists = true;
        // radar data update
        this.title_radar = "tm32982"
        this.selectedCompany = "Google"
        this.update_selected_company_info(this.selectedCompany)
    },
    mounted() {

    },
    methods: {
        updateYear(data) {
            console.log("Year changed!", data)
            this.dateselected[0] = data[0];
            this.dateselected[1] = data[1];
            this.extract_company_commmit()
            this.update_selected_company_info(this.selectedCompany)
            //console.log("Year updated", this.titleGroups, this.titleGroups_selected)
        },
        updateCompany(data) {
            console.log("Year changed!", data)
            //return
            this.selectedCompany = data
            this.update_selected_company_info(this.selectedCompany)
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
            let commits_by_company = {};
            let months = 0;
            for (const [month, commit_data] of Object.entries(this.commit_company_by_month)) {
                // console.log(commits)
                let date = new Date(month);
                if (date >= new Date(this.dateselected[0]) && date < new Date(this.dateselected[1])) {
                    months += 1;
                    for (const commit_entry of commit_data) {
                        const company = commit_entry["Company"]
                        commits_by_company[company] = (commits_by_company[company] || 0) + commit_entry["Commits"]

                    }
                }
            }
            this.bubbleChartData = Object.entries(commits_by_company).map(([company, commits]) => {
                return {
                    name: company,
                    size: commits
                }
            })
            this.bubbleChartSizeRef = 7000 * months;

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

            const commit_company_by_month = groupBy(commitData.filter((x) => x["Company"] != 'Unknown'), "month", undefined, undefined);
            return commit_company_by_month
        },
        update_selected_company_info(company, dateselected) {
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
            let company_repo_count = groupBy(repositoryCompositionData.filter((x) => new Date(x.month) >= new Date(this.dateselected[0]) && new Date(x.month) < new Date(this.dateselected[1])),
                "company",
                undefined,
                (acc, entry) => {
                    if (!acc) {
                        acc = {}
                    }
                    acc[entry["repo_name"]] = (acc[entry["repo_name"]] || 0) + entry["Commits"]
                    return acc
                }
            )
            console.log(company_repo_count)
            let repos = Object.entries(company_repo_count[company] || [])
            repos.sort((a,b) => -a[1] + b[1])

            let relevantCommunityData = communityData.filter((x) => x.Company == company && new Date(x.month) >= new Date(this.dateselected[0]) && new Date(x.month) < new Date(this.dateselected[1]))
            console.log("updated")
            this.selected_company_info = {
                repo_count: repos.length,
                repos: repos,
                community: Math.max(...relevantCommunityData.map((x) => x["Total community"])),
                contributors: Math.max(...relevantCommunityData.map((x) => x["Active contributors"])),
            }
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
    height: 55%;
}

.column.middle {
    width: 50%;
    height: 55%;
}

.bottombar {
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

    .column.side,
    .column.middle {
        width: 100%;
    }
}
</style>
