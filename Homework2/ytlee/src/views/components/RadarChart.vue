<template>
    <div class="radarChart"></div>
</template>
<script setup lang=ts>
import * as d3 from "d3"
import * as vue from "vue"
import { Ref, ref} from "vue"
import { any } from "vue-types";
import { RadarChart } from "./charts/RadarChart"

const props = defineProps({
    data: Object as () => any,
})
const margin = {top: 100, right: 100, bottom: 100, left: 100}
const width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right
const height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
const data = [//iPhone
            {axis:"Battery Life",value:0.22},
            {axis:"Brand",value:0.28},
            {axis:"Contract Cost",value:0.29},
            {axis:"Design And Quality",value:0.17},
            {axis:"Have Internet Connectivity",value:0.22},
            {axis:"Large Screen",value:0.02},
            {axis:"Price Of Device",value:0.21},
            {axis:"To Be A Smartphone",value:0.50}			
            ] ;
const radar_key_list = [
        "acousticness", 
        "danceability", 
        "energy", 
        "instrumentalness",
        "key",
        "liveness",
        "loudness", 
        "popularity",
        "speechiness",
        "tempo",
        "valence",
]
const sorted_data = vue.computed(() => props.data.sort((s1, s2) => s1.release_date - s2.release_date))
const step: Ref<number> = ref(0)
let radarChart;
var color = d3.scaleOrdinal()
    .range(["#EDC951","#CC333F","#00A0B0"]);
    
var radarChartOptions = {
    w: width,
    h: height,
    margin: margin,
    maxValue: 1,
    levels: 5,
    roundStrokes: true,
    color: color
};


//Call function to draw the Radar chart
vue.onMounted(() => {
    console.log(sorted_data.value)
    radarChart = new RadarChart(".radarChart", radar_key_list, radarChartOptions)
    radarChart.init()
    radarChart.update(convert_to_radar_data(sorted_data.value[step.value]))
    // loop(sorted_data.value)
    // RadarChart(".radarChart", radar_data.value, radarChartOptions);
})
function loop(sorted_data) {
    let counter = 0
    if(sorted_data[counter + 1]) {
        d3.timeout(loop, 1000)
    }
    // circle.transition()
    // .duration(500)
    // .attr("cx", data[counter]);
    // counter++
}

function convert_to_radar_data(item) {
    const res = []
    radar_key_list.forEach(key => {
        res.push({"axis": key, "value": item[key]})
    })
    return res
}

function goNext() {
    console.log("go next")
    step.value += 1
    if(step.value < sorted_data.value.length)
        radarChart.update(convert_to_radar_data(sorted_data.value[step.value]))

}

defineExpose({
    goNext
})

</script>