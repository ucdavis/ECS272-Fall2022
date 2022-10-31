<script setup lang="ts">
import * as vue from "vue"
import * as d3 from "d3"
import { BeeswarmChart } from "./charts/BeeswarmChart"
import { Ref, ref } from "vue"


let chart;
const props = defineProps({
  data: Object as () => any,
})

const class_name = "beeswarmChart"
const min_year: Ref<number> = ref(0)

const emit = defineEmits(["node-clicked"])
vue.onMounted(() => {
  console.log(props.data)
  chart = new BeeswarmChart(`.${class_name}`,  {
    xLabel: "#songs →",
    xScale: d3.scaleLinear, // try d3.scaleLog
    xMin: Math.min(...props.data.map(datum => datum.songs.length)),
    xMax: Math.max(...props.data.map(datum => datum.songs.length)),
    title: d => `${d.artist}: ${d.songs.length} songs`,
    x: d=>d.songs.length,
  })
  chart.init()
  chart.update(props.data, emit)
})

function handleTimeRangeChange(value: number) {
  min_year.value = value
  const filtered_data = props.data.map(datum => {
    return {
      artist: datum.artist,
      songs: datum.songs.filter(song => +song.year > min_year.value)
    }
  }).filter(datum => datum.songs.length >= 10)
  chart.updateXaxis(
    Math.min(...filtered_data.map(datum => datum.songs.length)),
    Math.max(...filtered_data.map(datum => datum.songs.length)),
  )
  chart.update(filtered_data, emit)
}


</script>
<template>
    <div :class="class_name"> 
      <div class="tooltip"></div>
      <div class="controller-contaienr">
        <a-input-number class="year-threshold" :value="min_year" :min="0" :max="9999" @change="handleTimeRangeChange" />
      </div>
    </div>
</template>
<style scoped lang="scss">
.tooltip {
  z-index: 1;
  background: white;
  border: 1px solid black;
  position:absolute;
  padding:0.5%;
  opacity:0;
}
.beeswarmChart {
  height: 100%;
  overflow: hidden;
}
</style>