<template>
    <div class="page-container">
        <RadarChart
        ref="radar_chart"
        v-if="filtered_data"
        :data="filtered_data"
        ></RadarChart>
        <button type="button" @click="radar_chart.goNext"> Next </button>
    </div>
</template>



<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "Home",
})

</script>
<script setup lang="ts">
import * as d3 from "d3";
import * as vue from "vue"
import { Ref, ref } from "vue"
import RadarChart from "../components/RadarChart.vue"
import spotifyData from "../../assets/data/data_1000.json"
const data: Ref<any> = ref(spotifyData)
const filtered_data: Ref<any|undefined> = ref(undefined)
const radar_chart = ref(null)


vue.onMounted(() => {
    const artist_counts = {}
    const song_id_dict = {}
    data.value.forEach(item => {
        const artists = item.artists
        artists.forEach(artist => {
            if(!artist_counts[artist]) artist_counts[artist] = []
            artist_counts[artist].push(item.id) 
        })
        song_id_dict[item.id] = item
    })
    const artist_count_array = Object.keys(artist_counts).map(function(artist) {
        return [artist, artist_counts[artist].length];
    })

    // Sort the array based on the second element
    artist_count_array.sort(function(first, second) {
        return second[1] - first[1];
    });
    const top_artist = artist_count_array[0][0]
    const target_song_ids = artist_counts[top_artist]
    filtered_data.value = idsToItems(target_song_ids, song_id_dict)

})

function idsToItems(ids, id_item_dict) {
    return ids.reduce(function(item_list, id) { item_list.push(id_item_dict[id]); return item_list; }, [])
}

</script>

<style scoped lang="scss">
.page-container {
}
</style>