<template>
    <div :class="class_name"></div>
</template>
<script setup lang=ts>
import * as d3 from "d3"
import * as vue from "vue"
import { Ref, ref} from "vue"
import { ArtistScatterplot } from "../components/charts/ArtistScatterplot"

const props = defineProps({
    data: Object as () => any,
})
const margin = {top: 50, right: 100, bottom: 100, left: 50}
const width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right
const height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

let scatterplot;    
const class_name = "artistScatter"
let scatterplotOptions = {
    w: width,
    h: height,
    margin: margin,
};

const emit = defineEmits(["node-clicked"])
vue.onMounted(() => {
    console.log(props.data)
    scatterplot = new ArtistScatterplot(`.${class_name}`, "mse", "#songs",scatterplotOptions)
    scatterplot.init(emit)
    scatterplot.update(props.data)
})
</script>