<script setup lang="ts">
import * as vue from "vue"
import * as d3 from "d3"
import { BeeswarmChart } from "./charts/BeeswarmChart"
import { cardMetaProps } from "ant-design-vue/lib/card/Meta";
import { number } from "vue-types";


let chart;
const props = defineProps({
  data: Object as () => any,
})

const class_name = "beeswarmChart"

const emit = defineEmits(["node-clicked"])
vue.onMounted(() => {
  console.log(props.data)
  chart = new BeeswarmChart(`.${class_name}`,  {
    xLabel: "#songs →",
    xScale: d3.scaleLinear, // try d3.scaleLog
    xMin: Math.min(...props.data.map(datum => datum.value)),
    xMax: Math.max(...props.data.map(datum => datum.value)),
    title: d => `${d.artist}: ${d.value} songs`
  })
  chart.init()
  chart.update(props.data, emit)
})

</script>
<template>
    <div :class="class_name"> 
      <div class="tooltip"></div>
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