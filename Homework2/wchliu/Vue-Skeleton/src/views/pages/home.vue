<template>
    <div>
        <a-row type="flex">
            <a-col :flex="2">
                <a-card title="Overview: Netflix Movies Data By Genre" style="width: 95%">
                    <BubbleChart v-if="dataExistsBubble" :myBubbleChartData="myBubbleData" /> 
                </a-card>
            </a-col>
            <a-col :flex="3" type="flex">
                <a-row :flex="1">
                    <a-card title="IMDB Scores Distribution by Selected Genre" style="width: 95%">
                        <BeeSwarmChart v-if="dataExistsBeeSwarm" :myBeeSwarmChartData="myBeeSwarmData" />
                    </a-card>
                </a-row>
                <br />
                <a-row :flex="1">
                    <a-card title="Trend of Number of Movies/Average Runtime/Average IMDB Score" style="width: 95%">
                        <LineChart v-if="dataExistsLine" :myLineChartData="myLineData" />
                    </a-card>
                </a-row>
            </a-col>
        </a-row>
        <br />
    </div>
</template>

<script>
import BubbleChart from "../components/bubbleChart.vue";
import BeeSwarmChart from "../components/beeswarmChart.vue";
import LineChart from "../components/lineChart.vue";
import * as d3 from "d3";
import csvBubblePath from '../../assets/data/avg_genres_score.csv';
import csvLinePath from '../../assets/data/avg_year.csv';
import actionPath from '../../assets/data/action.csv';
import animationPath from '../../assets/data/animation.csv';
import comedyPath from '../../assets/data/comedy.csv';
import crimePath from '../../assets/data/crime.csv';
import documentationPath from '../../assets/data/documentation.csv';
import dramaPath from '../../assets/data/drama.csv';
import europeanPath from '../../assets/data/european.csv';
import familyPath from '../../assets/data/family.csv';
import historyPath from '../../assets/data/history.csv';
import horrorPath from '../../assets/data/horror.csv';
import musicPath from '../../assets/data/music.csv';
import realityPath from '../../assets/data/reality.csv';
import romancePath from '../../assets/data/romance.csv';
import scifiPath from '../../assets/data/scifi.csv';
import sportPath from '../../assets/data/sport.csv';
import thrillerPath from '../../assets/data/thriller.csv';
import warPath from '../../assets/data/war.csv';
import westernPath from '../../assets/data/western.csv';
import fantasyPath from '../../assets/data/fantasy.csv';

export default {
    data(){
        return {
            dataExistsBubble: false,
            dataExistsBeeSwarm: false,
            dataExistsLine: false,
            genreDataPaths: [
                actionPath, animationPath, comedyPath, crimePath,
                documentationPath, dramaPath, europeanPath, familyPath,
                historyPath, horrorPath, musicPath, realityPath, romancePath, 
                scifiPath, sportPath, thrillerPath, warPath, westernPath, fantasyPath
            ],
            genreDict: {
                0: 'action', 1: 'animation', 2: 'comedy', 3: 'crime',
                4: 'documentation', 5: 'drama', 6: 'european', 7: 'family',
                8: 'history', 9: 'horror', 10: 'music', 11: 'reality', 12: 'romance',
                13: 'scifi', 14: 'sport', 15: 'thriller', 16: 'war', 17: 'western', 18: 'fantasy'
            },
            myBubbleData: [],
            myBeeSwarmData: {},
            myLineData: {},
        }
    },
    components: {
        BubbleChart,
        BeeSwarmChart,
        LineChart
    },
    created(){
        /* Fetch via CSV */
        this.drawBubbleFromCsv();
        this.drawBeeSwarmFromCsv();
        this.drawLineFromCsc();
    },
    mounted(){},
    methods: {
        drawBubbleFromCsv(){
            console.log(csvBubblePath)
            //async method
            d3.csv(csvBubblePath).then((data) => {
                // array of objects
                console.log(data.length);
                console.log(data);
                this.dataExistsBubble = true; // updates the v-if to conditionally show the barchart only if our data is here.
                this.myBubbleData = data; // updates the prop value to be the recieved data, which we hand in to our bar-chart
            });
        },
        drawBeeSwarmFromCsv(){
            var that = this;
            this.genreDataPaths.forEach(function (csvPath, index) {
                d3.csv(csvPath).then((data) => {
                    that.myBeeSwarmData[that.genreDict[index]] = data;
                });
            });
            this.dataExistsBeeSwarm = true;
            console.log(this.myBeeSwarmData);
        },
        drawLineFromCsc() {
            d3.csv(csvLinePath).then((data) => {
                this.myLineData = data;
                this.dataExistsLine = true;
            });
        }
    }
}

</script>