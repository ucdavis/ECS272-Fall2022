<template>
  <h2>average grade based on various factors</h2>

  <vue3-chart-js v-bind="{ ...lineChart }" />

</template>

<script>
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import zoomPlugin from "chartjs-plugin-zoom";
import dataLabels from "chartjs-plugin-datalabels";

// globally registered and available for all charts
Vue3ChartJs.registerGlobalPlugins([zoomPlugin]);

export default {
  name: "line1",
  data() {
    return {

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
  methods: {
    handleEmotionChange() {

    },
  },
  components: {
    Vue3ChartJs,
  },
  setup() {
    const lineChart = {
      type: "line",
      // locally registered and available for this chart
      plugins: [dataLabels],
      data: {
        labels: [
          "level 0",
          "level 1",
          "level 2",
          "level 3",
          "level 4",
        ],
        datasets: [
          {
            label: "failures",
            data: [11.356838, 8.980000, 7.313725, 6.354167],
            fill: false,
            borderColor: "#41B883",
            backgroundColor: "black",
          },
          {
            label: "travel time",
            data: [10.979248, 10.295950, 9.855072, 8.541667],
            fill: false,
            borderColor: "#00D8FF",
            tension: 0.5,
            backgroundColor: "blue",
          },
          {
            label: "study time",
            data: [10.253968, 10.442761, 11.651282, 11.728395],
            fill: false,
            borderColor: "#baa93c",
            tension: 0.5,
            backgroundColor: "red",
          },
          {
            label: "mother's education",
            data: [12.555556, 9.197740, 10.216828, 10.451178, 11.839695],
            fill: false,
            borderColor: "#e8ad9d",
            tension: 0.5,
            backgroundColor: "pink",
          },
          {
            label: "father's education",
            data: [12.666667, 9.426829, 10.721739, 10.716667, 11.618056],
            fill: false,
            borderColor: "#a79de8",
            tension: 0.5,
            backgroundColor: "black",
          },
        ],
      },
      options: {
        plugins: {
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: "y",
            },
          },
          datalabels: {
            backgroundColor: function (context) {
              return context.dataset.backgroundColor;
            },
            borderRadius: 4,
            color: "white",
            font: {
              weight: "bold",
            },
            formatter: Math.round,
            padding: 6,
          },
        },
      },
    };

    return {
      lineChart,
    };
  },
};
</script>

<style lang="css">
  h2 {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    color: #548cf0;
  }
</style>