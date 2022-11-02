<template>
  <h2>average grade per age</h2>
  <div style="max-width: 600px">
    <vue3-chart-js v-bind="{ ...barChart }" />
  </div>
</template>

<script>
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";

export default {
  name: "bar",
  components: {
    Vue3ChartJs,
  },
  setup() {
    const barChart = {
      type: "bar",
      options: {
        min: 0,
        max: 100,
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
        scales: {
          y: {
            min: 0,
            max: 15,
            ticks: {
              callback: function (value) {
                return `${value}%`;
              },
            },
          },
        },
      },
      data: {
        labels: ["Grade1", "Grade2", "Grade3"],
        datasets: [
          {
            label: "15",
            backgroundColor: ["#bc301a", "#bc301a", "#bc301a"],
            data: [11.231707, 11.365854, 11.256098],
          },
          {
            label: "16",
            backgroundColor: ["#2ecc71", "#2ecc71", "#2ecc71"],
            data: [10.942308, 11.182692, 11.028846],
          },
          {
            label: "17",
            backgroundColor: ["#e67e22", "#e67e22", "#e67e22"],
            data: [10.897959, 10.479592, 10.275510],
          },
          {
            label: "18",
            backgroundColor: ["#1a4dbc", "#1a4dbc", "#1a4dbc"],
            data: [10.719512, 10.134146, 9.548780],
          },
          {
            label: "19",
            backgroundColor: ["#8e1abc", "#8e1abc", "#8e1abc"],
            data: [10.25000, 9.250000, 8.208333],
          },
          {
            label: "20",
            backgroundColor: ["#41e5c2", "#41e5c2", "#41e5c2"],
            data: [13.666667, 13.666667, 14.000000],
          },
          {
            label: "21",
            backgroundColor: ["#e6df22", "#e6df22", "#e6df22"],
            data: [10.000000, 8.000000, 7.000000],
          },
          {
            label: "22",
            backgroundColor: ["#f7b204", "#f7b204", "#f7b204"],
            data: [6.000000, 8.000000, 8.000000],
          },
        ],
      },
    };

    return {
      barChart,
    };
  },
};
</script>