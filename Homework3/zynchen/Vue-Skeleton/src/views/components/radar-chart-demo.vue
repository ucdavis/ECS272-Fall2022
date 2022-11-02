<template>
  <div class="radar-chart-demo">
    <h2 class="chartname">CO2 emissions each Region filtered by year</h2>


    <p class="title"></p>
    <div class="leftRadar">
      <div class="radar-select">
        Year :
        <a-select
            class="radar-dropdown"
            ref="select"
            style="width: 100px"
            defaultValue="2019"
            @change="radarhandleClick"
        >
          <a-select-option value="2019">2019</a-select-option>
          <a-select-option value="2018"
          >2018</a-select-option
          >
          <a-select-option value="2017"
          >2017</a-select-option
          >
          <a-select-option value="2016">2016</a-select-option>
          <a-select-option value="2015">2015</a-select-option>
          <a-select-option value="2014">2014</a-select-option>
          <a-select-option value="2013">2013</a-select-option>
          <a-select-option value="2012">2012</a-select-option>
          <a-select-option value="2011">2011</a-select-option>
          <a-select-option value="2010">2010</a-select-option>
          <a-select-option value="2009">2009</a-select-option>
          <a-select-option value="2008">2008</a-select-option>
          <a-select-option value="2007">2007</a-select-option>
          <a-select-option value="2006">2006</a-select-option>
          <a-select-option value="2005">2005</a-select-option>
          <a-select-option value="2004">2004</a-select-option>
          <a-select-option value="2003">2003</a-select-option>
          <a-select-option value="2002">2002</a-select-option>
          <a-select-option value="2001">2001</a-select-option>
          <a-select-option value="2000">2000</a-select-option>
          <a-select-option value="1999">1999</a-select-option>
          <a-select-option value="1998">1998</a-select-option>
          <a-select-option value="1997">1997</a-select-option>
          <a-select-option value="1996">1996</a-select-option>
          <a-select-option value="1995">1995</a-select-option>
          <a-select-option value="1994">1994</a-select-option>
          <a-select-option value="1993">1993</a-select-option>
          <a-select-option value="1992">1992</a-select-option>
          <a-select-option value="1991">1991</a-select-option>
          <a-select-option value="1990">1990</a-select-option>
        </a-select>
      </div>
      <radar-chart :width="350" :dimensions="dimensions" :dataset="dataset" @action="onRadarChartAction"></radar-chart>
    </div>
    <div class="rightRadar">

    </div>


  </div>


</template>

<script>
import {RadarChart} from './index.js'
import yearlyData from "../../assets/data/test.json"; /* Example of reading in data direct from file*/
export default {
  name: "radar-chart-demo",

  components: {
    RadarChart
  },

  data () {
    return {
      changeColor: Boolean,
      dimensions: ["East Asia & Pacific", "Europe & Central Asia", "Latin America & Caribbean",
        "Middle East & North Africa", "North America", "South Asia", "Sub-Saharan Africa"],
      dimensions1: ["East Asia & Pacific", "Europe & Central Asia", "Latin America & Caribbean",
        "Middle East & North Africa", "North America", "South Asia", "Sub-Saharan Africa"],
      dataset: yearlyData["data2019"],
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
    handleClick() {
      const sleep = (ms, i) => {
        const end = new Date().getTime() + ms;
        while (new Date().getTime() < end) {

        }
      }
      for (var i = 2019; i >= 1990; i--) {
        this.radarhandleClick(i + "");

      }
    },
    radarhandleClick(event) {
      this.dataset = event;
      switch (event) {
        case "2019":
          this.dataset = yearlyData["data2019"];
          break;
        case "2018":
          this.dataset = yearlyData["data2018"];
          break;
        case "2017":
          this.dataset = yearlyData["data2017"];
          break;
        case "2016":
          this.dataset = yearlyData["data2016"];
          break;
        case "2015":
          this.dataset = yearlyData["data2015"];
          break;
        case "2014":
          this.dataset = yearlyData["data2014"];
          break;
        case "2013":
          this.dataset = yearlyData["data2013"];
          break;
        case "2012":
          this.dataset = yearlyData["data2012"];
          break;
        case "2011":
          this.dataset = yearlyData["data2011"];
          break;
        case "2010":
          this.dataset = yearlyData["data2010"];
          break;
        case "2009":
          this.dataset = yearlyData["data2009"];
          break;
        case "2008":
          this.dataset = yearlyData["data2008"];
          break;
        case "2007":
          this.dataset = yearlyData["data2007"];
          break;
        case "2006":
          this.dataset = yearlyData["data2006"];
          break;
        case "2005":
          this.dataset = yearlyData["data2005"];
          break;
        case "2004":
          this.dataset = yearlyData["data2004"];
          break;
        case "2003":
          this.dataset = yearlyData["data2003"];
          break;
        case "2002":
          this.dataset = yearlyData["data2002"];
          break;
        case "2001":
          this.dataset = yearlyData["data2001"];
          break;
        case "2000":
          this.dataset = yearlyData["data2000"];
          break;
        case "1999":
          this.dataset = yearlyData["data1999"];
          break;
        case "1998":
          this.dataset = yearlyData["data1998"];
          break;
        case "1997":
          this.dataset = yearlyData["data1997"];
          break;
        case "1996":
          this.dataset = yearlyData["data1996"];
          break;
        case "1995":
          this.dataset = yearlyData["data1995"];
          break;
        case "1994":
          this.dataset = yearlyData["data1994"];
          break;
        case "1993":
          this.dataset = yearlyData["data1993"];
          break;
        case "1992":
          this.dataset = yearlyData["data1992"];
          break;
        case "1991":
          this.dataset = yearlyData["data1991"];
          break;
        case "1990":
          this.dataset = yearlyData["data1990"];
          break;
      }
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
          alert(`CO2 emission this year filtered by region`)
          break
        case origin.ACT_CLICK_DIMENSION_LABEL:
          alert(`Region: ${this.dimensions1[payload]}`)
          break
        default:
          break
      }
    }
  }
}
</script>

<style>
  .leftRadar {
    display: flex;
    width: 100%;
  }
  .rightRadar {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 20px;
  }
  .radar-chart-demo {
    text-align: center
  }
  .title {
    text-align: center;
    font-size: 26px;
    font-weight: bold
  }
  .chartname {
    text-align: left;
    font-size: 16px;
  }

</style>
