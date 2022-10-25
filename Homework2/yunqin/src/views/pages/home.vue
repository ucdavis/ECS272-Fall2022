<template>
    <div>
        <a-row type="flex">
            <a-col :flex="2">
                <a-card title="Overview: Total CO2 Emission Percentage Of The Whole World By Countries" style="width: 95%">
                    <Map />
                </a-card>
            </a-col>
            <a-col :flex="3" type="flex">
                <a-row :flex="1">
                    <a-card title="CO2 Emission Changes In Years By Countries" style="width:95%">
                        <BarChart />
                    </a-card>
                </a-row>
                <br />
                <a-row :flex="1">
                    <a-card title="CO2 Emission Changes Comparison Between Regions" style="width:95%">
                        <RadarChart />
                    </a-card>
                </a-row>    
            </a-col>
        </a-row>
        <br />
    </div>
</template>

<script>
import Map from "../components/map.vue"
import LineChart from "../components/barchart.vue"
import RadarChart from "../components/radarchart.vue"

export default {
    data(){
        return {
            dataExists: false,
            myBarData: [],
        }
    },
    components: {
        Map,
        LineChart,
        RadarChart
    },
    
    // created(){
    //     /* Fetch via CSV */
    //     this.drawMapFromCsv()
    // },
    // mounted(){},
    // methods: {
    //     drawMapFromCsv(){
    //         //async method
    //         d3.csv(csvPath).then((data) => {
    //             // array of objects
    //             console.log(data.length);
    //             console.log(data);
    //             this.dataExists = true; // updates the v-if to conditionally show the barchart only if our data is here.
    //             this.myBarData = data; // updates the prop value to be the recieved data, which we hand in to our bar-chart

    //         });
    //     }
    // }
}

</script>
