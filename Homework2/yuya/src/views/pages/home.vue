<template>
    <body>
        <a-row :style="{ height: '100%' }">
                <a-col :span="10" :style="{ height: '100%' }" >
                            <button @click="getRandomAB">Get New at-bat</button>
                            <PitchChart v-if="dataExists" :myData="myData" :key="componentKey" />
                </a-col>
                <a-col :span="14" :style="{ height: '100%' }">
                    <a-row :span="14" :style="{ height: '50%', width: '100%' }"> 
                        <a-col :style="{ width: '100%' }">
                            <BarChart v-if="dataExists" :myData="myData" :key="componentKey"/>
                        </a-col>
                    </a-row>
                    <a-row :span="10" :style="{ height: '50%', width: '100%' }">
                        <a-col :style="{ width: '100%' }">
                            <FlowChart v-if="flowDataExists && dataExists" :myFlowData="myFlowData"  :myData="myData" :key="componentKey"/>
                        </a-col>
                    </a-row>
                </a-col>
        </a-row>
    </body>
</template>

<script>
import BarChart from "../components/barchart.vue"
import PitchChart from "../components/pitchchart.vue"
import FlowChart from "../components/flow.vue"
import * as d3 from "d3";
import csvPath from '../../assets/data/ab150_subset.csv';
import csvPath2 from '../../assets/data/pitch_flow_2.csv';

export default {
    data(){
        return {
            at_bat_list: [],
            data: Object,
            cur_at_bat: null,
            dataExists: false,
            flowDataExists: false,
            myData: [],
            myFlowData: [],
            componentKey: 0,
        }
    },
    components: {
        BarChart,
        PitchChart,
        FlowChart,
    },
    created(){
        /* Fetch via CSV */
        this.getDataFromCsv();
        this.getDataFromCsv2();
    },
    mounted(){
        /* d3.csv(csvPath, e => this.myData = e); */
        /* d3.csv(csvPath2, e => this.myFlowData = e); */

    },
    methods: {
        forceRerender() {
            this.componentKey += 1;
        },
        getABSequence(){

        },
        getRandomAB(){
            let newAB = this.at_bat_list[Math.floor(Math.random()*this.at_bat_list.length)];
            this.cur_at_bat = newAB;
            this.myData = this.data.filter(x => x['ab_id'] === this.cur_at_bat)
            this.forceRerender();
            /* myData = */ 
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
    }
}

</script>
