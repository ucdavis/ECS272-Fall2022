<template>
  <div class="main-container">
    <div class="vis-title">Airline Passenger Satisfaction
      <font-awesome-icon icon="fa-solid fa-plane-departure" />
    </div>
    <div class="body-charts">
      <div class="charts-left">
        <div class="radarChart">
          <div class="radar-dd">
            Choose Data Type:
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
              <a-select-option value="travelData">Travel Type</a-select-option>
            </a-select>
          </div>
          <RadarChart
            v-if="dataExists"
            :RadartestData="testData"
            :myRadarchartData="myRadarData"
          />
        </div>
      </div>
      <div class="charts-right">
        <div class="LineChart">
          <div class="line-dd">
            Choose Parameter:
            <a-select
              ref="select"
              style="width: 160px"
              defaultValue="In-flight Wifi"
              @change="linehandleClick"
            >
              <a-select-option value="inflightWifi"
                >In-flight Wifi</a-select-option
              >
              <a-select-option value="Dept_Arr_Time_Convenience"
                >Departure/Arrival time Convenience</a-select-option
              >
              <a-select-option value="onlineBooking_ease"
                >Ease of Online Booking</a-select-option
              >
              <a-select-option value="gateLocation"
                >Gate Location</a-select-option
              >
              <a-select-option value="foodandDrinks"
                >Food and Drinks</a-select-option
              >
              <a-select-option value="onlineBoarding"
                >Online Boarding</a-select-option
              >
              <a-select-option value="seatComfort"
                >Seat Comfort</a-select-option
              >
              <a-select-option value="inflightEntertainment"
                >In-flight Entertainment</a-select-option
              >
              <a-select-option value="onboardService"
                >Onboard Service</a-select-option
              >
              <a-select-option value="legroomService"
                >Legroom Service</a-select-option
              >
              <a-select-option value="baggageHandling"
                >Baggage Handling</a-select-option
              >
              <a-select-option value="checkinService"
                >Check-in Service</a-select-option
              >
              <a-select-option value="inflightService"
                >In-flight Service</a-select-option
              >
              <a-select-option value="Cleanliness">Cleanliness</a-select-option>
            </a-select>
          </div>
          <LineChart
            v-if="dataExists"
            :testData="testData"
            :LinetestData="testDataline"
            :myLinechartData="myLineData"
          />
        </div>
        <div class="BarChart">
          <div class="bar-dd">
            <a-space direction="vertical">
              <div class="text">Choose category: </div>
              <a-radio-group
                v-model:value="testDataBar"
                @change="barbuttonClick"
                :options="plainOptions"
              />
            </a-space>
          </div>

          <BarChart
            v-if="dataExists"
            :testData="testData"
            :bartestData="testDataBar"
            :myBarchartData="myBarData"
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
      testDataline: "inflightWifi",
      testDataBar: "Female",
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
    linehandleClick(event) {
      this.testDataline = event;
    },
    barbuttonClick(event) {
      this.testDataBar = event.target.value;
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
  padding-top: 12px;
  padding-left: 12px;
  font-size: 14px;
}
.radar-dd {
  padding-top: 12px;
  padding-left: 12px;
  font-size: 14px;
}
.bar-dd {
  padding-top: 12px;
  padding-left: 12px;
  font-size: 14px;
}
.vis-title {
  font-size: 50px;
  font-weight: 400;
  text-align: center;
  color: #004c84;
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
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.21), 0 4px 8px rgba(0, 0, 0, 0.22),
    0 10px 10px rgba(0, 0, 0, 0.16), 0 7px 70px rgba(0, 0, 0, 0.24);
}
</style>
