<template>
    <div class="page-container">
        <div class="left-section">
            <!-- <div class="scatter-container">
                <ArtistScatterPlot
                    v-if="scatter_data"
                    :data="scatter_data">
                </ArtistScatterPlot>
            </div> -->
            <div class="beeswarm-container">
                <h2 class="component-header beeswarm-header">
                    Artists beeswarm by released songs
                    <i class='pi pi-info-circle tooltip'>
                        <span class="tooltiptext right-tooltiptext" style="width: 400px">
                            Each 'bee' is an artist, the position indicates how many songs this artist has released.
                            Only artists who have released more than 50 songs are listed.
                        </span>
                    </i>
                </h2>
                <BeesWarm
                    v-if="beeswarm_data" 
                    :data="beeswarm_data"
                    :selected_artist="selected_artist"
                    @node-clicked="handleNodeClicked"
                    @data-filtered="handleDataFiltered"
                ></BeesWarm>
                <div ref="intro_label" class="float-label" style="">
                    The system helps explore the 'diversity' of the songs released by an artist. <br/>
                    A beeswarm chart is used for user to choose an artist because the more songs an artist have released, the more likely they will be 'diverse'. <br/>
                    The RadarChart shows each song's attributes in animation. <br/>
                    Once observe any pattern, use the bar chart to confirm it. 
                    <a-button class="float-label-close" @click="intro_label.style.scale=0">Got it!</a-button>
                </div>
            </div>
            <div class="artists-table-container">
                <DataTable 
                ref="data_table"
                :data="artist_info_table_data" 
                v-model:selected_artist="selected_artist"/>
            </div>
        </div>
        <div class="right-section">
            <div class="radar-container">
                <h2 class="component-header radar-header">
                    RadarChart of released songs by {{selected_artist || ""}}
                    <i class='pi pi-info-circle tooltip'>
                        <span class="tooltiptext right-tooltiptext" style="width: 400px">
                            The radar chart demonstrates the 'diversity' of the artist's songs. <br/>
                            Each time slice is a radar of a song, sorted by released year.  
                        </span>
                    </i>
                </h2>
                <div class="button-set-container" v-if="selected_artist">
                    <a-button class="animation-previous-button"
                        size="middle"
                        @click="radar_chart.stepBackward()">
                        <template #icon>
                            <step-backward-outlined/>
                        </template>
                    </a-button>
                    <a-button class="animation-play-button"
                        size="middle"
                        @click="stop=!stop">
                        <template #icon>
                            <caret-right-outlined v-if="stop"/>
                            <pause-outlined v-if="!stop"/>
                        </template>
                    </a-button>
                    <a-button class="animation-next-button"
                        size="middle"
                        @click="radar_chart.stepForward(artist_song_dict[selected_artist].length-1)">
                        <template #icon>
                            <step-forward-outlined/>
                        </template>
                    </a-button>
                </div>
                <div class="radar-float-label" v-if="selected_artist">
                    Song name: {{ radarchart_data[animate_step]['name']}}
                </div>
                <RadarChart
                    ref="radar_chart"
                    :data="radarchart_data"
                    :stop="stop"
                    v-model:step="animate_step"
                ></RadarChart>
            </div>
            <div class="barchart-container" v-if="barchart_data">
                <h2 class="component-header barchart-header">
                    Bar charts of 
                    <Dropdown
                        :attribute_list="radar_key_list"
                        v-model:selected_attribute="selected_attribute"
                    ></Dropdown>
                    <i class='pi pi-info-circle tooltip'>
                        <span class="tooltiptext right-tooltiptext" style="width: 400px">
                            This bar chart shows you the exact value of the attribute of each song.
                        </span>
                    </i>
                </h2>
                <div class="label-bar-container">
                    <!-- <div class="barchart-y-label">value →</div> -->
                    <BarChart 
                        :data="barchart_data"
                        :step="animate_step"
                    ></BarChart>
                </div>
                <div class="barchart-label">songs →</div>
            </div>
        </div>
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
import BarChart from "../components/BarChart.vue"
import BeesWarm from "../components/BeesWarm.vue";
import Dropdown from "../components/Dropdown.vue"
import DataTable from "../components/DataTable.vue"

import { CaretRightOutlined, PauseOutlined, StepForwardOutlined, StepBackwardOutlined } from '@ant-design/icons-vue';

// import ArtistScatterPlot from "../components/ArtistScatterPlot.vue"

import artist_song_dict from "../../assets/data/artist_song_dict.json" 

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

const data_table = ref()
let artist_info_table_data: Ref<any[]> = ref([])
Object.keys(artist_song_dict).forEach(artist => {
    artist_info_table_data.value.push({
        artist: artist,
        songs: artist_song_dict[artist].length
    })
})


const intro_label: Ref<any> = ref(null)
const radar_chart: Ref<any> = ref(null)
const animate_step: Ref<number> = ref(0)
const stop: Ref<boolean> = ref(true)
vue.watch(animate_step, (new_value, old_value) => {
    if(new_value === 0 && old_value !== 0) stop.value = true
})

const selected_attribute = ref("acousticness")
const barchart_data = vue.computed(() => {
    if(selected_artist.value === undefined) return undefined
    return artist_song_dict[selected_artist.value].map((item: any) => {return {x:item["name"], y:item[selected_attribute.value], year:item["year"]}})
})
const radarchart_data = vue.computed(() => {
    if(selected_artist.value === undefined) return undefined
    return artist_song_dict[selected_artist.value]
})
const selected_artist = ref(undefined)
vue.watch(selected_artist, (new_value, old_value) => {
    animate_step.value = 0
    stop.value = true
})

const beeswarm_data = vue.computed(() => {
    let res: any[] = []
    Object.keys(artist_song_dict).forEach((artist: string) => {
        res.push({
            artist: artist,
            songs: artist_song_dict[artist]
        })
    })
    return res
})


function idsToItems(ids: any, id_item_dict: any) {
    return ids.reduce(function(item_list:any[], id:any) { item_list.push(id_item_dict[id]); return item_list; }, [])
}

function handleNodeClicked(node) {
    selected_artist.value = node.split(":")[0]
    animate_step.value = 0
}

function handleDataFiltered(filtered_data) {
    artist_info_table_data.value = filtered_data.map(datum => { return { artist: datum.artist, songs: datum.songs.length}})
    if(! artist_info_table_data.value.map(datum => datum.artist).includes(selected_artist.value)) {
        selected_artist.value = undefined
    }
    // update Table
    vue.nextTick(() => {
        data_table.value.addRowClickListener()
    }) 
}
</script>

<style scoped lang="scss">
.page-container {
    display: flex;
    align-items: center;
  width: 100%;
  height: 100%;
  padding:1%;
}
.right-section {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 50%;
}
.left-section {
  height: 100%;
  width: 50%;
  margin-right: 1%;
border-right: solid 1px #b7b7b7;
}
.radar-container {
  height: 77%;
  /*! width: 80%; */
//   display: flex;
//   justify-content: center;
//   flex-direction: column;
}
.barchart-container {
  height: 20%;
  padding-right: 1%;
  display: flex;
flex-direction: column;
}
.beeswarm-container {
  height: 60%;
  display: flex;
  flex-direction: column;
}
.dropdown-container {
    display:inline-block;
}
.label-bar-container {
  display: flex;
  display: grid;
  grid-auto-rows: minmax(min-content, max-content);
  grid-template-columns: auto 1fr;
}
.barchart-y-label {
  transform: rotate(-90deg);
  transform: rotate(180deg);
  writing-mode: vertical-lr;
  text-align: center;
}
.barchart-label {
  left: 20px;
  width: fit-content;
  position: relative;
  top: -10px;
pointer-events: none;
}
.tooltip {
    font-size:1rem;
    margin-left:5px;
}
.float-label {
   position:absolute; 
   width:400px; 
   left:20%; 
   top:7%; 
    box-shadow: rgb(0 0 0 / 25%) 0px 54px 55px, rgb(0 0 0 / 12%) 0px -12px 30px, rgb(0 0 0 / 12%) 0px 4px 6px, rgb(0 0 0 / 17%) 0px 12px 13px, rgb(0 0 0 / 9%) 0px -3px 5px;
    background: #fff;
padding: 0.5%;
font-family: Arial;
}
.button-set-container {
    display: inline-flex;
    width: fit-content;
}
.radar-float-label {
    position: relative;
    display: inline-block;
    margin-left: 5px;
} 
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}
:deep(.ant-table-row) {
    cursor: pointer;
}
</style>