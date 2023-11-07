<template>
    <div>
        <h1>Summary of top popular involved OSS projects</h1>
    </div>
    <div class="column side">
        <BubbleChart v-if="dataExists" myChartID="middlepie" @selectedEntry="updateRepo"
                :myBubbleData=bubbleChartData :refSize=bubbleChartSizeRef></BubbleChart>
    </div>
    <div class="column middle">
        <div class="card">
            <!--<h3>RadarChart of the scores of Movie/Show</h3>
            <RadarChart v-if="dataExists" :myRadarData=title_idindex :showID=title_radar myChartID="upperleftradar"></RadarChart>
            -->
            <h3>Now viewing : {{ this.selectedRepo }}</h3>
            <table v-if="dataExists">
                <tr>
                    <th>Metric</th>
                    <th></th>
                </tr>
                <tr>
                    <td>Commits</td>
                    <td>{{ (this.bubbleChartData.find((x) => x.name == this.selectedRepo) || {size:0}).size }}</td>
                </tr>
                <tr>
                    <td>Contributing Enteprise Count</td>
                    <td>{{ this.selected_repo_info.company_count }}</td>
                </tr>
                <tr>
                    <td>Commits from Enterprise </td>
                    <td>{{ this.selected_repo_info.company_commits }}</td>
                </tr>
                <tr>
                    <td>% of Commits from Enterprise </td>
                    <td>{{ this.selected_repo_info.company_commits_percent * 100 }}</td>
                </tr>
                <tr>
                    <td>Top Contributing Company </td>
                    <td>{{ this.selected_repo_info.companies[0] ? this.selected_repo_info.companies[0][0]: `N/A`}} (Commits: {{ this.selected_repo_info.companies[0] ? this.selected_repo_info.companies[0][1]: `N/A` }})</td>
                </tr>
            </table>
        </div>
    </div>
    <div class="bottombar">
        <BarChart v-if="dataExists" @selectedyear="updateYear" myChartID="bottombar" :myBarchartData=myBarData>
        </BarChart>
    </div>
</template>

<script setup>
import BubbleChart from '../components/bubblechart.vue';
import BarChart from '../components/barchart.vue';
import testData from "../../assets/data/test.json";
import repositoryCompositionData from "../../assets/data/Repository_Composition_Ranking_MTD.json"
</script>
<script>
import * as d3 from "d3";
export default {
    data() {
        return {
            dataExists: false,
            myBarData: Array,
            bubbleChartData: Array,
            bubbleChartSizeRef: Number,
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
            repo_commit_by_month: Object, 
            repo_commit_by_company_by_month:Object,
            selectedRepo: String,
            selected_repo_info: Object
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
    created() {
        this.myBarData = testData.data;
        //console.log("Test Bardata", this.myBarData);
        [this.repo_commit_by_month, this.repo_commit_by_company_by_month] = this.parse_data()
        this.extract_repository_commmit()
        this.selectedRepo = "llvm/llvm-project"
        this.update_selected_repo_info(this.selectedRepo)
        this.dataExists = true;
    },
    mounted() {

    },
    methods: {
        updateYear(data) {
            console.log("Year changed!", data)
            this.dateselected[0] = data[0];
            this.dateselected[1] = data[1];
            this.extract_repository_commmit();
            this.update_selected_repo_info(this.selectedRepo)
            console.log("Year updated", this.dateselected)
        },

        updateRepo(data) {
            this.selectedRepo = data
            this.update_selected_repo_info(this.selectedRepo)
        },

        extract_repository_commmit() {
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
            let commits_by_repo = {};
            let months = 0;
            for (const [month, commit_count] of Object.entries(this.repo_commit_by_month)) {
                // console.log(commits)
                let date = new Date(month);
                if (date >= new Date(this.dateselected[0]) && date < new Date(this.dateselected[1])) {
                    months += 1;
                    for (const commit_entry of commit_count) {
                        const repo = commit_entry["repo_name"]
                        commits_by_repo[repo] = (commits_by_repo[repo] || 0) + commit_entry["Commits"]

                    }
                }
            }
            this.bubbleChartData = Object.entries(commits_by_repo).map(([repo, commits]) => {
                return {
                    name: repo,
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
        },
        update_selected_repo_info(selectedRepo, dateselected) {
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

            let repo_company_count = {};
            for (const [month, commit_count] of Object.entries(this.repo_commit_by_month)) {
                // console.log(commits)
                let date = new Date(month);
                if (date >= new Date(this.dateselected[0]) && date < new Date(this.dateselected[1])) {
                    for (const commit_entry of commit_count) {
                        const repo = commit_entry["repo_name"]
                        if (repo == selectedRepo ){
                            repo_company_count[commit_entry["company"]] = (repo_company_count[commit_entry["company"]] || 0) + commit_entry["Commits"]
                        }

                    }
                }
            }
            console.log(repo_company_count)
            let company_commits = Object.entries(repo_company_count).filter(([company, commits]) => company != "Unknown")
            company_commits.sort((a,b) => -a[1] + b[1])

            console.log("updated")
            const total_commits = Object.values(repo_company_count).reduce((a, b) => a + b, 0)
            this.selected_repo_info = {
                commits: total_commits,
                company_count: company_commits.length, 
                company_commits: company_commits.map((x) => x[1]).reduce((a, b) => a + b, 0),
                company_commits_percent: company_commits.map((x) => x[1]).reduce((a, b) => a + b, 0) / total_commits,
                companies: company_commits
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