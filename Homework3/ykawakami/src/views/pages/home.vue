<template>
    <body>
                <div class="modal" v-if="showModal">
                <h3>Basics</h3>
                <p>The game of baseball consists of a series of hitter-pitcher interactions. Each such interactions have three main results. Either the hitter is <em>out</em>, the hitter records a <em>hit</em>, or the hitter <em>walks</em>. This is called an <em>at-bat</em>. When the hitter accrues 3 strikes, the hitter is out. When they accrue 4 balls, the hitter walks (takes a free base). </p>
                <h3>Strike and Balls</h3>
                <p>A <em>strike</em> is recorded whenever the one of the following happen: the hitter swings and misses, the pitch is in the strike zone, or the hitter hits a foul ball. The strike zone is therefore an important part of baseball - this determines what constitutes a <em>strike</em>. The zone depends on the hitter's height, but in this visualization the strike zone is represented by the light blue square.</p>
                <p>A ball is a recorded for any pitch that the hitter makes no contact and is out of the strike zone. (Recall that a foul ball is a strike unless at 2 strikes already, so a ball could arrive outside the strike zone and still result in a strike.)</p>
                <p>
                Note also that for this visualization, the ball charts are drawn from the perspective of the catcher. 
                </p>
                <h3>At-bat progression and counts</h3>
                <p>
                Recall that an <em>at-bat</em> refers to one hitter-pitcher encounter. Now since 4 balls is an free base for the hitter, and 3 strikes gets the hitter out, the count (that is, the number of strikes and balls on the hitter) becomes important. If there are 3 balls, the pitcher had pressure to throw an immediate strike - otherwise the hitter walks. Similarly, if there are 2 strikes, the hitter is under pressure to make sure to hit any balls in the strike zone. As
                such, some counts are considered <b>hitter's count</b> and some are considered <b>pitcher's count</b>. 3-0 count (Meaning 3 balls and 0 strikes) is a hitter's count since the hitter is at an advantage. Conversely, a 0-2 count is a pitcher's count following a similar reasoning. The colors in the Sankey diagram follows this line of reason from the perspective of the hitter - some outcomes are better for the hitter and others for the pitcher.
                </p>
                <h3>Pitch Types</h3>
                <p>
                There is an abundance on the type of pitches in baseball from fastballs, splitters to curveballs. Some travel faster than the rest and most balls are characterized by their movement (or the lack of) as they travel from the pitcher. 
                </p>
                <button class="close" @click="showModal = false" :style="{ float: 'right', 'margin-right': '0px' }">Close</button>
            </div>
        <a-row :style="{ width: '100%', height: '100%' }">
                <div class="overlay" v-if="showModal" @click="showModal = false"></div>
                <a-col :span="10" :style="{ height: '100%' }" >
                            <button @click="getRandomAB(); ">Get New at-bat</button>
                            <button v-if="selectedPitch" @click="reset(); $refs.PC.resetOpacity();">Clear selection</button>
                            <button @click="showModal = true" :style="{ float: 'right', 'margin-right': '20px' }">Help! (Some baseball basics...)</button>
                            <PitchChart ref="PC" v-if="dataExists" :myData="myData" :key="componentKey_pitch" @selected="getSelected"/>
                </a-col>
                <a-col :span="14" :style="{ height: '100%' }">
                    <a-row :span="14" :style="{ height: '50%', width: '100%' }"> 
                        <a-col :style="{ width: '100%' }">
                            <BarChart v-if="dataExists" :myRenderData="myRenderData" :key="componentKey_render"/>
                        </a-col>
                    </a-row>
                    <a-row :span="10" :style="{ height: '50%', width: '100%' }">
                        <a-col :style="{ height: '100%', width: '100%' }">
                            <FlowChart v-if="flowDataExists && dataExists && !showHeat" :myFlowData="myFlowData"  :myData="myData" :key="componentKey_flow"/>
                            <HeatChart v-if="heatDataExists && showHeat" :selectedPitch="selectedPitch" :myHeatData="myHeatData" :key="componentKey_heat"/>
                        </a-col>
                    </a-row>
                </a-col>
        </a-row>
    </body>
</template>

<script>
                            //<button v-if="showHeat" @click="reset(); $refs.PC.resetOpacity();">Clear selection</button>
                            //<SmallMChart v-if="heatDataExists && showHeat" :myHeatData="myHeatData" :selectedPitch="selectedPitch" :key="componentKey_heat"/>
                            //<HeatChart v-if="heatDataExists && showHeat" :selectedPitch="selectedPitch" :myHeatData="myHeatData" :key="componentKey_heat"/>
import BarChart from "../components/barchart.vue"
import PitchChart from "../components/pitchchart.vue"
import FlowChart from "../components/flow.vue"
import HeatChart from "../components/pitchheat.vue"
import SmallMChart from "../components/smallm.vue"
import * as d3 from "d3";
import csvPath from '../../assets/data/ab150_subset.csv';
import csvPath2 from '../../assets/data/pitch_flow_2.csv';
import csvPath3 from '../../assets/data/ab50000_subset.csv';

//<FlowChart v-if="flowDataExists && dataExists" :myFlowData="myFlowData"  :myData="myData" :key="componentKey_flow"/>

export default {
    data(){
        return {
            at_bat_list: [],
            data: Object,
            cur_at_bat: null,
            dataExists: false,
            flowDataExists: false,
            heatDataExists: false,
            showHeat: false,
            showModal: false,
            selectedPitch: null,
            myData: [],
            myRenderData: [],
            myFlowData: [],
            myHeatData: [],
            componentKey_pitch: 0,
            componentKey_render: 0,
            componentKey_flow: 0,
            componentKey_heat: 0,
        }
    },
    components: {
        BarChart,
        PitchChart,
        FlowChart,
        HeatChart,
        SmallMChart,
    },
    created(){
        /* Fetch via CSV */
        this.getDataFromCsv();
        this.getDataFromCsv2();
        this.getDataFromCsv3();
    },
    mounted(){
        /* d3.csv(csvPath, e => this.myData = e); */
        /* d3.csv(csvPath2, e => this.myFlowData = e); */

    },
    methods: {
        reset(){
            this.selectedPitch = null;
            this.myRenderData = this.myData;
            this.componentKey_render += 1;
            this.showHeat = false;
        },
        getSelected(selected){
            this.myData_backup = this.myData;
            this.myRenderData = this.myData.filter(x => x[""] == selected)
            this.selectedPitch = this.myRenderData[0]
            /* this.selectedPitchType_prop = this.myRenderData[0]['pitch_type'] */
            this.componentKey_render += 1;
            this.showHeat = true;
        },
        getRandomAB(){
            let newAB = this.at_bat_list[Math.floor(Math.random()*this.at_bat_list.length)];
            this.cur_at_bat = newAB;
            this.myData = this.data.filter(x => x['ab_id'] === this.cur_at_bat)
            this.myRenderData = this.myData
            this.componentKey_pitch += 1;
            this.componentKey_render += 1;
            this.componentKey_flow += 1;
            this.showHeat = false;
        },
        getDataFromCsv(){
            //async method
            d3.csv(csvPath).then((data) => {
                // array of objects
                this.dataExists = true; // updates the v-if to conditionally show the barchart only if our data is here.
                /* this.myData = data; // updates the prop value to be the recieved data, which we hand in to our bar-chart */
                /* this.myData = data.slice(0, 50); // updates the prop value to be the recieved data, which we hand in to our bar-chart */
                /* this.myData = data; // updates the prop value to be the recieved data, which we hand in to our bar-chart */
                data.forEach((item) => {
                        if (this.at_bat_list.indexOf(item['ab_id']) === -1){
                            this.at_bat_list.push(item['ab_id']);
                        }
                        });
                this.data = data
                // For now select the first
                this.cur_at_bat = this.at_bat_list[0];
                this.myData = data.filter(x => x['ab_id'] === this.cur_at_bat)
                this.myRenderData = this.myData
                /* data.forEach(function(x) {debugger; if (!this.at_bat_list.includes(x['ab_id'])) { at_bat_list.push(x['ab_id']); }}) */
            });
        },
        getDataFromCsv2(){
            //async method
            console.log(csvPath2)
            d3.csv(csvPath2).then((data) => {
                // array of objects
                this.flowDataExists = true; // updates the v-if to conditionally show the barchart only if our data is here.
                /* this.myData = data; // updates the prop value to be the recieved data, which we hand in to our bar-chart */
                console.log('sdfsdf', data)
                this.myFlowData = data;

            });
        },
        getDataFromCsv3(){
            //async method
            console.log(csvPath3)
            d3.csv(csvPath3).then((data) => {
                this.heatDataExists = true; // updates the v-if to conditionally show the barchart only if our data is here.
                this.myHeatData = data;
            });
        },
    }
}

</script>
