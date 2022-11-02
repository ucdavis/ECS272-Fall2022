<template>
  <div class="radar-chart-demo">
    <h2>grade overview for male and female</h2>
    <a-select
        v-model="formData.selectKey"
        class="filter-item_select"
        @change="handleEmotionChange"
        style="width: 200px"
        placeholder="color1"
    >
      <a-select-option :key="item.value" v-for="item in emotionList">{{
          item.name
        }}</a-select-option>
    </a-select>

    <p class="title"></p>
    <radar-chart :width="500" :dimensions="dimensions" :dataset="dataset" @action="onRadarChartAction"></radar-chart>
  </div>
<!--  .radar-chart-demo-->
<!--    p.title-->
<!--    radar-chart(:width="400", :dimensions="dimensions", :dataset="dataset", @action="onRadarChartAction")-->

</template>

<script>
import {RadarChart} from './index.js'

export default {
  name: "radar-chart-demo",

  components: {
    RadarChart
  },

  data () {
    return {
      changeColor: Boolean,
      dimensions: ["Grade1", "Grade2", "Grade3", "study time", "free time"],
      dataset: [
        {
          label: "Male",
          color: "green",
          d: [11.22994652, 11.07486631, 10.9144385, 1.764705882, 3.486631016]
        },
        {
          label: "Female",
          color: "red",
          d: [10.62019231, 10.38942308, 9.966346154, 2.278846154, 3.009615385]
        }
      ],
      select2: "all",
      formData: {
        selectKey: undefined,
      },
      emotionList: [
        { name: "color1", value: "1" },
        { name: "color2", value: "2" },
      ],
    }
  },
  computed: {
  },
  methods: {
    clear() {
      this.formData.selectKey = undefined;
    },
    handleEmotionChange() {
      if (this.changeColor === false) {
        this.dataset[0].color = "blue";
        this.dataset[1].color = "pink";
        this.changeColor = !this.changeColor;
      } else {
        this.dataset[0].color = "green";
        this.dataset[1].color = "red";
        this.changeColor = !this.changeColor;
      }
    },
    onRadarChartAction (params) {
      const {origin, act, payload} = params

      switch (act) {
        case origin.ACT_CLICK:
          alert(`Region ${payload} clicked`)
          break
        case origin.ACT_CLICK_DIMENSION_LABEL:
          alert(`${this.dimensions[payload]} clicked`)
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="css" scoped>
  radar-chart-demo {
    text-align: center
  }
  title {
    text-align: center;
    font-size: 26px;
    font-weight: bold
  }

</style>
