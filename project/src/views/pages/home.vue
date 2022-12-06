<template>
    <div>
        <h3>Summary of Enterprise' contribution to OSS projects</h3>
    </div>
    <div class="column left">
        <h1>Enterprise commit vs Community commit</h1>
        <PieChart v-if="dataExists" myChartID="leftpie" :myPieData=commitPieData></Piechart>
    </div>
    <div class="column middle">
        <h1>Enterprise community vs Community community</h1>
        <PieChart v-if="dataExists" myChartID="middlepie" :myPieData=communityPieData></Piechart>
    </div>
    <div class="column right">
        <h1>Enterprise active contributors vs Community active contributors</h1>
        <PieChart v-if="dataExists" myChartID="rightpie" :myPieData=activeContributorPieData></Piechart>
    </div>
    <div class="bottom bar">
        <BarChart v-if="dataExists" @selectedyear="updateYear" myChartID="bottombar" :myBarchartData=myBarData>
        </BarChart>
    </div>
</template>

<script setup>
import PieChart from '../components/piechart.vue';
import BarChart from '../components/barchart.vue';
import testData from "../../assets/data/test.json";
import commitData from "../../assets/data/OSCI_commits_ranking_MTD.json"
import communityData from "../../assets/data/OSCI_ranking_MTD.json"
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
    data() {
        return {
            dataExists: false,
            myBarData: Array,
            commitPieData: Array,
            communityPieData: Array,
            activeContributorPieData: Array,
            commit_company_vs_noncompany: Object,
            community_company_vs_noncompany: Object,
            active_contributor_company_vs_noncompany: Object,
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
        PieChart,
        //Sunburst,
        //NodeTree,
        //RadarChart
    },
    created() {
        const [commit_company_vs_noncompany, community_company_vs_noncompany, active_contributor_company_vs_noncompany] = this.parse_data()
        this.commit_company_vs_noncompany = commit_company_vs_noncompany
        this.community_company_vs_noncompany = community_company_vs_noncompany
        this.active_contributor_company_vs_noncompany = active_contributor_company_vs_noncompany
        this.myBarData = testData.data;
        this.commitPieData = [{ date: "Enterprise", count: 1 }, { date: "Community", count: 1 }];
        this.extract_company_commit()
        this.extract_company_community()
        this.extract_company_active_contributor() 
        //console.log(this.commitPieData)
        // console.log("Test Bardata", this.myBarData);
        this.dataExists = true;
    },
    mounted() {

    },
    methods: {
        extract_company_commit() {
            let company_commits_in_period = 0
            let noncompany_commits_in_period = 0
            for (const [month, commits] of Object.entries(this.commit_company_vs_noncompany)) {
                // console.log(commits)
                let date = new Date(month);
                if (date >= new Date(this.dateselected[0]) && date < new Date(this.dateselected[1])) {
                    company_commits_in_period += commits["company"]
                    noncompany_commits_in_period += commits["noncompany"]
                }
            }
            this.commitPieData = [{ date: "Enterprise", count: company_commits_in_period }, { date: "Community", count: noncompany_commits_in_period }]

        },
        extract_company_community() {
            let company_community_in_period = 0
            let noncompany_community_in_period = 0
            for (const [month, community] of Object.entries(this.community_company_vs_noncompany)) {
                // console.log(commits)
                let date = new Date(month);
                if (date >= new Date(this.dateselected[0]) && date < new Date(this.dateselected[1])) {
                    company_community_in_period += community["company"]
                    noncompany_community_in_period += community["noncompany"]
                }
            }
            this.communityPieData = [{ date: "Enterprise", count: company_community_in_period }, { date: "Community", count: noncompany_community_in_period }]

        },
        extract_company_active_contributor() {
            let company_active_contributor_in_period = 0
            let noncompany_active_contributor_in_period = 0
            for (const [month, active_contributor] of Object.entries(this.active_contributor_company_vs_noncompany)) {
                // console.log(commits)
                let date = new Date(month);
                if (date >= new Date(this.dateselected[0]) && date < new Date(this.dateselected[1])) {
                    company_active_contributor_in_period += active_contributor["company"]
                    noncompany_active_contributor_in_period += active_contributor["noncompany"]
                }
            }
            this.activeContributorPieData = [{ date: "Enterprise", count: company_active_contributor_in_period }, { date: "Community", count: noncompany_active_contributor_in_period }]

        },
        updateYear(data) {
            //console.log("Year changed!", data)
            this.dateselected[0] = data[0];
            this.dateselected[1] = data[1];
            this.extract_company_commit()
            this.extract_company_community()
            this.extract_company_active_contributor() 
            //console.log("Year updated", this.dateselected)
            //console.log("data updated", this.commitPieData)
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

            const community_company_vs_noncompany_by_month = groupBy(communityData, "month", undefined, (acc, entry) => {
                // console.log(entry)
                if (!acc) {
                    acc = {}
                }
                if (entry['Company'] == 'Unknown') {
                    acc['noncompany'] = (acc['noncompany'] || 0) + entry['Total community']
                } else {
                    acc['company'] = (acc['company'] || 0) + entry['Total community']
                }
                return acc;
            });

            const active_contributor_company_vs_noncompany_by_month = groupBy(communityData, "month", undefined, (acc, entry) => {
                // console.log(entry)
                if (!acc) {
                    acc = {}
                }
                if (entry['Company'] == 'Unknown') {
                    acc['noncompany'] = (acc['noncompany'] || 0) + entry['Active contributors']
                } else {
                    acc['company'] = (acc['company'] || 0) + entry['Active contributors']
                }
                return acc;
            });


            // return [repository_composition, commit_by_company, commit_by_company_vs_noncompany, company_contributed_repository_count]

            return [commit_company_vs_noncompany_by_month, community_company_vs_noncompany_by_month, active_contributor_company_vs_noncompany_by_month]
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

.column.left {
    width: 30%;
    height: 55%;
}

.column.middle {
    width: 30%;
    height: 55%;
}

.column.right {
    width: 30%;
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
</style>