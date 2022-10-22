<template>
    <div>
      <header>
        <h1>Homework2: Visualization dashboard</h1>
      </header>
      <a-row :style="{ height: '100%' }" >
        <a-col :span="8" :style="{ height: '100%' }" >
          <radar-chart-demo></radar-chart-demo>
        </a-col>
        <a-col :span="16" :style="{ height: '100%' }">
          <a-row :span="4" :style="{ height: '50%', width: '100%' }">
            <a-col :style="{ width: '50%' }">
              <demo1></demo1>
            </a-col>
          </a-row>
          <a-row :span="20" :style="{ height: '50%', width: '100%' }">
            <a-col :style="{ width: '50%' }">
              <bar></bar>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <body>

      </body>
    </div>

</template>



<script>
import RadarChartDemo from "../components/radar-chart-demo.vue"
import BarChart from "../components/barchart.vue"
import * as d3 from "d3";
import demo1 from "../components/line1.vue";
import bar from "../components/barChart1.vue";



export default {
    data(){
        return {
          myData: Object,
          barList: [],
          dataExists: false,
        }
    },
    components: {
      BarChart,
      RadarChartDemo,
      demo1,
      bar
    },
    //async method
    created() {
      this.getData()
    },
    mounted() {
    },
    methods: {
        getData(){

        }
    },
}

</script>

<style lang="css">
title {
  font-size: 3rem;
  text-align: center;
}
header {
  height: 3rem;
  width: 100%;
  /*background-color: rgba(0, 0, 255, .2);*/

  font-size: 3rem;
  color: #fff;
  text-align: center;
  line-height: 1rem;
}
</style>