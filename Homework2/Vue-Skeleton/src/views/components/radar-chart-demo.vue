<template>
  <div class="radar-chart-demo">
    <p class="title"></p>
    <radar-chart :width="400" :dimensions="dimensions" :dataset="dataset" @action="onRadarChartAction"></radar-chart>
  </div>
<!--  .radar-chart-demo-->
<!--    p.title-->
<!--    radar-chart(:width="400", :dimensions="dimensions", :dataset="dataset", @action="onRadarChartAction")-->

</template>

<script>
import {RadarChart} from '../src/index.js'

export default {
  name: "radar-chart-demo",

  components: {
    RadarChart
  },

  data () {
    return {
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
      ]
    }
  },
  computed: {
  },
  methods: {
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

<style lang="stylus" scoped>
  .radar-chart-demo
    text-align: center
  .title
    text-align: center
    font-size: 26px
    font-weight: bold
</style>
