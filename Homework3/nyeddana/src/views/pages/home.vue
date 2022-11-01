<template>
  <div class="main-container">
    <div class="vis-title">
      Airline Passenger Satisfaction
      <!-- <font-awesome-icon icon="fa-solid fa-plane" size="xs" /> -->
    </div>
    <div class="body-charts">
      <div class="charts-left">
        <div class="radarChart">
          <div class="radar-interact">
            <div class="radar-dd">
              Filter By:
              <a-select
                ref="select"
                style="width: 160px"
                defaultValue="Gender"
                @change="radarhandleClick"
              >
                <a-select-option value="genderData">Gender</a-select-option>
                <a-select-option value="customerData"
                  >Customer Type</a-select-option
                >
                <a-select-option value="classData"
                  >Class of Customer</a-select-option
                >
                <a-select-option value="travelData"
                  >Travel Type</a-select-option
                >
              </a-select>
            </div>
            <div class="info">
              <font-awesome-icon icon="fa-solid fa-circle-info" size="xl" />
            </div>
            <div class="hide">Click on highlighted blobs to remove them.</div>
            <div class="radar-reset">
              <a-button @click="resetClick">Reset</a-button>
            </div>
          </div>
          <RadarChart
            v-if="dataExists"
            :RadartestData="testData"
            :myRadarchartData="myRadarData"
            :resetclick="resetclick"
          />
        </div>
      </div>
      <div class="charts-right">
        <div class="LineChart">
          <LineChart
            v-if="dataExists"
            :testData="testData"
            :myLinechartData="myLineData"
          />
        </div>
        <div class="BarChart">
          <div class="bar-interact">
            <div class="bar-dd">
              <div class="text">Choose category:</div>
              <a-space direction="vertical">
                <a-radio-group
                  v-model:value="testDataBar"
                  @change="barbuttonClick"
                  :options="plainOptions"
                />
              </a-space>
            </div>
            <div class="info-bar">
              <font-awesome-icon icon="fa-solid fa-circle-info" size="xl" />
            </div>
            <div class="hide">
              Use the brush tool to view a single group. <br />
              Toggle views to obtain values.
            </div>
            <div class="toggle">
              Select View:
              <a-select
                ref="select"
                style="width: 100px"
                defaultValue="1"
                @change="toggleView"
              >
                <a-select-option value="1">Grouped</a-select-option>
                <a-select-option value="2">Stacked</a-select-option>
              </a-select>
            </div>
          </div>

          <BarChart
            v-if="dataExists"
            :testData="testData"
            :bartestData="testDataBar"
            :myBarchartData="myBarData"
            :layout="togValue"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RadarChart from "../components/radarchart.vue";
import BarChart from "../components/groupedbar.vue";
import LineChart from "../components/linechart.vue";
import * as d3 from "d3";
import csvPath from "../../assets/data/passengerSatisfaction.csv";
import "../../styles/main.scss";

export default {
  data() {
    return {
      plainOptions: ["Female", "Male"],
      dataExists: false,
      myBarData: [],
      myRadarData: [],
      myLineData: [],
      testData: "genderData",
      testDataBar: "Female",
      togValue: "1",
      resetclick: 0,
    };
  },
  components: {
    RadarChart,
    BarChart,
    LineChart,
  },
  created() {
    /* Fetch via CSV */
    this.drawBarFromCsv(),
      this.radarhandleClick,
      this.linehandleClick,
      this.barbuttonClick,
      this.toggleView,
      this.drawRadarFromCsv(),
      this.drawLineFromCsv();
  },
  mounted() {},
  methods: {
    drawBarFromCsv() {
      //async method
      d3.csv(csvPath).then((data) => {
        this.dataExists = true; // updates the v-if to conditionally show the barchart only if our data is here.
        this.myBarData = data; // updates the prop value to be the recieved data, which we hand in to our bar-chart
      });
    },
    drawLineFromCsv() {
      //async method
      d3.csv(csvPath).then((data) => {
        this.dataExists = true; // updates the v-if to conditionally show the barchart only if our data is here.
        this.myLineData = data; // updates the prop value to be the recieved data, which we hand in to our bar-chart
      });
    },
    radarhandleClick(event) {
      this.testData = event;
      switch (event) {
        case "genderData":
          this.plainOptions = ["Female", "Male"];
          this.testDataBar = "Female";
          break;
        case "customerData":
          this.plainOptions = ["Loyal Customer", "disloyal Customer"];
          this.testDataBar = "Loyal Customer";
          break;
        case "classData":
          this.plainOptions = ["Business", "Eco", "Eco Plus"];
          this.testDataBar = "Business";
          break;
        case "travelData":
          this.plainOptions = ["Personal Travel", "Business travel"];
          this.testDataBar = "Personal Travel";
          break;
      }
    },
    barbuttonClick(event) {
      this.testDataBar = event.target.value;
    },
    toggleView(event) {
      this.togValue = event;
      console.log("toggle", this.togValue);
    },
    resetClick(e) {
      console.log("I've been clicked", this.resetclick);
      if (e) this.resetclick += 1;
    },
    drawRadarFromCsv() {
      //async method
      d3.csv(csvPath).then((data) => {
        this.dataExists = true; // updates the v-if to conditionally show the barchart only if our data is here.
        this.myRadarData = data; // updates the prop value to be the recieved data, which we hand in to our bar-chart
      });
    },
  },
};
</script>

<style>
body {
  overflow: hidden;
}
.main-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: rgb(244, 244, 244);
}
.body-charts {
  display: flex;
  gap: 20px;
}
.line-dd {
  display: flex;
  align-items: center;
  padding-top: 12px;
  padding-left: 12px;
  font-size: 14px;
  gap: 10px;
}
.radar-interact {
  display: flex;
}
.radar-dd {
  padding-top: 12px;
  padding-left: 12px;
  font-size: 14px;
}
.info {
  padding: 20px 12px;
  cursor: pointer;
}
.hide {
  display: none;
}
.info:hover + .hide {
  margin-top: 20px;
  display: block;
  font-size: 12px;
  font-style: italic;
}

.info-bar {
  padding: 36px 0px;
  cursor: pointer;
}
.info-bar:hover + .hide {
  margin-top: 28px;
  margin-left: 10px;
  display: block;
  font-size: 12px;
  font-style: italic;
}

.radar-reset {
  padding-top: 12px;
  margin-left: auto;
  padding-right: 12px;
}
.bar-interact {
  display: flex;
}
.bar-dd {
  padding-top: 12px;
  padding-left: 12px;
  font-size: 14px;
  padding-bottom: 30px;
}
.toggle {
  font-size: 14px;
  padding-right: 18px;
  padding-top: 12px;
}
.vis-title {
  font-size: 50px;
  font-weight: 400;
  text-align: center;
  color: #004c84;
  padding-right: 10px;
}
.radarChart {
  background-color: white;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 20px;
  margin-bottom: 500px;
}
.radarChart:hover {
  transition: 0.3s;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.21), 0 4px 8px rgba(0, 0, 0, 0.22),
    0 10px 10px rgba(0, 0, 0, 0.16), 0 7px 70px rgba(0, 0, 0, 0.24);
}
.charts-left {
  display: flex;
}

.charts-right {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
}

.LineChart {
  display: flex;
  flex-direction: column;
  background-color: white;
  margin-right: 20px;
}
.LineChart:hover {
  transition: 0.3s;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.21), 0 4px 8px rgba(0, 0, 0, 0.22),
    0 10px 10px rgba(0, 0, 0, 0.16), 0 7px 70px rgba(0, 0, 0, 0.24);
}

.BarChart {
  display: flex;
  flex-direction: column;
  background-color: white;
  margin-right: 20px;
}
.BarChart:hover {
  transition: 0.3s;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.21), 0 4px 8px rgba(0, 0, 0, 0.22),
    0 10px 10px rgba(0, 0, 0, 0.16), 0 7px 70px rgba(0, 0, 0, 0.24);
}
</style>
