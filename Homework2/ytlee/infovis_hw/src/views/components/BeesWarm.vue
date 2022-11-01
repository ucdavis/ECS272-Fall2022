<script setup lang="ts">
import * as vue from "vue"
import * as d3 from "d3"
import { BeeswarmChart } from "./charts/BeeswarmChart"
import { Ref, ref } from "vue"


let chart;
const props = defineProps({
  data: Object as () => any,
  selected_artist: String,
})

const class_name = "beeswarmChart"
const min_year: Ref<number> = ref(0)

const emit = defineEmits(["node-clicked", "data-filtered"])
vue.watch(() => props.selected_artist, (new_value, old_value) => {
  chart.highlight(new_value, old_value)
})

vue.onMounted(() => {
  chart = new BeeswarmChart(`.${class_name}`,  {
    xLabel: "#songs →",
    xScale: d3.scaleLinear, // try d3.scaleLog
    xMin: Math.min(...props.data.map(datum => datum.songs.length)),
    xMax: Math.max(...props.data.map(datum => datum.songs.length)),
    title: d => `${d.artist}: ${d.songs.length} songs`,
    x: d=>d.songs.length,
    tooltip_class:"beeswarm_tooltip",
  })
  chart.init()
  chart.update(props.data, emit)
  chart.highlight(props.selected_artist)
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
  emit("data-filtered", filtered_data)
}



</script>
<template>
    <div :class="class_name"> 
      <div class="beeswarm_tooltip"></div>
      <div class="controller-container">
        <span> Release Year >  </span>
        <a-input-number class="year-threshold" 
        :value="min_year" 
        :min="0" :max="9999" 
        @pressEnter="handleTimeRangeChange($event.target.value)"
        @step="handleTimeRangeChange"/>

        <i class='pi pi-info-circle tooltip'>
            <span class="tooltiptext right-tooltiptext" style="width: 250px">
              Songs released before the specified year will be removed.
              By setting a more recent year, you can see which artists are recently active.
            </span>
        </i>
      </div>
    </div>
</template>
<style scoped lang="scss">
.beeswarm_tooltip {
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
.controller-container {
  position:absolute;
  right: 53%;
}
.tooltip {
    font-size:1rem;
    margin-left:5px;
}
</style>