<template>
    <div>
        <h1>Summary of Companies' contribution to OSS projects</h1>
    </div>
    <div class="column left">
        <PieChart v-if="dataExists" myChartID="leftpie" :myPieData=commitPieData></Piechart>
    </div>
    <div class="column middle">
        <PieChart v-if="dataExists" myChartID="middlepie" :myPieData=commitPieData></Piechart>
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
        PieChart,
        //Sunburst,
        //NodeTree,
        //RadarChart
    },
    created() {
        const [repository_composition, commit_by_company, commit_by_company_vs_noncompany, company_contributed_repository_count] = this.parse_data()
        this.commit_by_company_vs_noncompany = commit_by_company_vs_noncompany
        this.myBarData = testData.data;
        this.commitPieData = [{ date: "Company", count: 1 }, { date: "Non-Company", count: 1 }];
        this.extract_company_commmit()
        console.log(this.commitPieData)
        // console.log("Test Bardata", this.myBarData);
        this.dataExists = true;
    },
    mounted() {

    },
    methods: {
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
            this.commitPieData = [{ date: "Company", count: company_commits_in_period }, { date: "Noncompany", count: noncompany_commits_in_period }]

        },
        updateYear(data) {
            console.log("Year changed!", data)
            this.dateselected[0] = data[0];
            this.dateselected[1] = data[1];
            const company_commits_in_period = 0
            const noncompany_commits_in_period = 0
            for (const [month, commits] of Object.entries(this.commit_by_company_vs_noncompany)) {
                let date = new Date(month);
                if (date >= new Date(this.dateselected[0]) && date < new Date(this.dateselected[1])) {
                    company_commits_in_period += commits["company"]
                    noncompany_commits_in_period += commits["noncompany"]
                }
            }
            this.commitPieData = [{ date: "Company", count: company_commits_in_period }, { date: "Noncompany", count: noncompany_commits_in_period }]
            console.log("Year updated", this.dateselected)
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

.bottombar {
    width: 100%;
    height: 30%;
}

.card {
    background-color: white;
    padding: 5px;
    margin-top: 5px;
}
</style>