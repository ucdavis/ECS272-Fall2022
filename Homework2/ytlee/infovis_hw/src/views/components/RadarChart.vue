<template>
    <div :class="class_name"></div>
</template>
<script setup lang=ts>
import * as d3 from "d3"
import * as vue from "vue"
import { Ref, ref} from "vue"
import { any } from "vue-types";
import { RadarChart } from "./charts/RadarChart"

const props = defineProps({
    data: Object as () => any,
    step: Number,
    stop: Boolean,
})

const emit = defineEmits(["update:step"])
const margin = {top: 50, right: 80, bottom: 0, left: 80}
const width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right
const height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

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
const sorted_data = vue.computed(() => {
    if(props.data === undefined) return undefined
    return props.data.sort((s1:any, s2:any) => s1.release_date - s2.release_date)
})
const internal_step: Ref<number> = ref(0)
let radarChart: any;
var color = d3.scaleOrdinal()
    .range(["#EDC951","#CC333F","#00A0B0"]);
const class_name = "radarChart" 
var radarChartOptions = {
    w: width,
    h: height,
    margin: margin,
    maxValue: 1,
    levels: 5,
    roundStrokes: true,
    color: color
};
const transition_options = {
    duration: 600,
    ease_func: d3.easeSinOut,
}

vue.watch(sorted_data, () => {
    radarChart.update(convert_to_radar_data(sorted_data.value[internal_step.value]), transition_options)
}, {deep:true})

vue.watch(() => props.stop, (new_value, old_value) => {
    if(new_value === false) loop()
})

let terminate = false
vue.watch(() => props.step, (new_value, old_value) => {
    if(old_value !== 0 && new_value === 0 && old_value-new_value !== 1) terminate = true
    // else {
    //     internal_step.value = props.step
    //     radarChart.update(convert_to_radar_data(sorted_data.value[internal_step.value]), transition_options)
    // }

})
//Call function to draw the Radar chart
vue.onMounted(() => {
    radarChart = new RadarChart(`.${class_name}`, radar_key_list, radarChartOptions)
    radarChart.init()
})
function loop() {
    if(terminate) {
        internal_step.value = 0
        terminate = false
        return
    }
    if(internal_step.value >= sorted_data.value.length) {
        internal_step.value = 0
        emit("update:step", 0)
        return
    }
    if(props.stop) return

    emit("update:step", internal_step.value)
    radarChart.update(convert_to_radar_data(sorted_data.value[internal_step.value]), transition_options)
    internal_step.value += 1
    d3.timeout(loop, transition_options.duration-100)
}

function stepForward(max:number) {
    internal_step.value = Math.min(internal_step.value+1, max)
    emit("update:step", internal_step.value)
    radarChart.update(convert_to_radar_data(sorted_data.value[internal_step.value]), transition_options)
}

function stepBackward(min:number=0) {
    internal_step.value = Math.max(internal_step.value-1, min)
    emit("update:step", internal_step.value)
    radarChart.update(convert_to_radar_data(sorted_data.value[internal_step.value]), transition_options)
}

function convert_to_radar_data(item:any) {
    const res:any[] = []
    radar_key_list.forEach(key => {
        res.push({"axis": key, "value": item[key]})
    })
    return res
}

function create_test_gradient_data() {
    const res:any[] = []
    radar_key_list.forEach(key => {
        res.push({"axis": key, "value": Math.random()})
        // res.push({"axis": key, "value": 1})
    })
    return res
}

defineExpose({
    stepForward,
    stepBackward,
})

</script>
<style scoped lang="scss">
.radarChart {
  width: 100%;
  height: 100%;
}

</style>