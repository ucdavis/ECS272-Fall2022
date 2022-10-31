<template>
  <body>
    <div id="app">
      <div class="container-fluid dashboard">
        <div id="split" class="row">
          <div class="col-1">
            <div class="chart1-radio">
              <input type="radio" name="x-axis" value="xyear" checked>x - year<br>
              <input type="radio" name="x-axis" value="xregion">x - region<br>
            </div>
            <BarChart v-if="dataExists" :myBarChartData="myBarData"/>
          </div>
          <div id="two-views" class="col-2">
            <div class="col-2 row-1 detail-view-1">
              <label>year:</label>
              <select id="selectButton_chart2"></select>
              <LineChart v-if="dataExists" :myLineChartData="myLineData" />
            </div>
            <div class="col-2 row-2 detail-view-2">
              <label>granularity:</label>
              <select id="selectButton_chart3"></select>
              <p>Sum of Attck type, Weapons, Success between 1970 and 2017</p>
              <AlluvialChart v-if="dataExists" :myAlluvialChartData="myAlluvialData" />
            </div>

            <router-view/>

            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</template>

<script>
import BarChart from './components/barchart.vue'
import LineChart from './components/linechart.vue'
import AlluvialChart from './components/alluvialchart.vue'
import * as d3 from 'd3'

export default {
  name: 'App',
  data () {
    return {
      dataExists: false,
      myBarData: [],
      myAlluvialChartData: [],
      myLineData: []
    }
  },
  components: {
    BarChart,
    LineChart,
    AlluvialChart
  },
  created () {
    this.drawBarFromCsv(),
    this.drawLineFromCsv(),
    this.drawAlluvialFromCsv()
  },
  mounted () {},
  methods: {
    drawBarFromCsv () {
      d3.csv('./assets/globalterrorismdb_0718dist.csv').then((data) => {
        console.log(data.length)
        console.log(data)
        this.dataExists = true
        this.myBarData = data
      })
    }
  }
}
</script>

<!-- <style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 60px;
}
</style> -->

<style scoped lang="css">
#app {
  width: 100%;
  height: 100%;
}
body{
  position:fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
  label{
    position: relative;
    left: 5px;
    top: 5px;
    font-size: 0.8em;
  }
  p{
    position:relative;
    font-size: 0.3em;
    left: 10px;
    top: 10px;
  }
  .dashboard{
    position:fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
    .row{
      height: 100%;
      width: 100%;
    }
      .col-1{
        position: relative;
        width: 50%;
        float: left;
        height: 100%;
        border-right-style: solid;
      }
        .chart1-radio {
          position: relative;
          left: 30px;
          top: 3px;
          font-size: .8em;
        }
      .col-2{
        position: absolute;
        float: right;
        right: 0;
        width: 50%;
        height: 100%;
      }
        .detail-view-1{
          position: relative;
          float: top;
          width: 100%;
          height: 40%;
          border-bottom-style: solid;
        }
          #selectButton_chart2 {
            position:relative;
            left: 10px;
            top: 10px;
          }
        .detail-view-2{
          position: relative;
          float: top;
          width: 100%;
          height: 50%;
        }
        #selectButton_chart3 {
          position: relative;
          top: 10px;
          left: 10px;
        }
</style>
