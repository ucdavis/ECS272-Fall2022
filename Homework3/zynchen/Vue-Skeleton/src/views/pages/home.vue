<template>
    <div class="container">
      <div class="main-title">CO2 emission around the world</div>
      <div class="charts-body">
        <div class="leftChart">
          <div class="chart1">

            <bubble></bubble>
          </div>
        </div>
        <div class="rightChart">
          <div class="chart2">
            <radar-chart-demo></radar-chart-demo>
          </div>
          <div class="chart3">
            <scatter></scatter>
          </div>
        </div>
      </div>

    </div>

</template>



<script>
import RadarChartDemo from "../components/radar-chart-demo.vue"
import * as d3 from "d3";
import csvPath from '../../assets/data/scatterData.csv';
import Scatter from "../components/scatter.vue"
import Bubble from "../components/bubblechart.vue";

export default {
    data(){
        return {
          dataExists: false,
        }
    },
    components: {
      RadarChartDemo,
      Scatter,
      Bubble
    },
    //async method
    created() {
    },
    mounted() {
    },
    methods: {
    },
}

</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: rgb(244, 244, 244);
}
.charts-body {
  display: flex;
  gap: 20px;
}
.chart1 {
  background-color: white;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 20px;
  margin-bottom: 500px;

}
.leftChart {
  display: flex;

}
.rightChart {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
}
.chart2 {
  display: flex;
  flex-direction: column;
  background-color: white;
  margin-right: 20px;

}
.chart3 {
  display: flex;
  flex-direction: column;
  background-color: white;
  margin-right: 20px;

}
.main-title {
  font-size: 3rem;
  text-align: center;
}

</style>