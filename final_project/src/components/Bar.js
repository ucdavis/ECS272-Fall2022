import React, { Component } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

class BarChart extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        count: 0
      };
    }

componentDidUpdate = () => {}

options = {
  indexAxis: 'y',
  elements: {
    bar: {
      borderWidth: 1,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      display: this.props.legend,
      position: 'top',
    },
    title: {
      display: true,
      text: '',
    },
  },
  scales: {
    x: {
        title: {
          display: true,
          text: 'Happiness Score',
        },
        beginAtZero: true,
        steps: 10,
        stepSize: 0.1
    },
    y: {
      title: {
        display: true,
        text: 'Country'
      }
  }
},
  maintainAspectRatio: false

};


data1 = () => {

  return(
    {
      labels: this.props.label,
    datasets: [
      {
        label: this.props.year,
        data: this.props.data,
        fill: true,
        backgroundColor: this.props.color,
        borderColor: this.props.color,
      }]

    }
  )

  }



render() {
  return (

    <Bar key={this.props.data} data={this.data1()} options={this.options}/>


  );

}
}

export default BarChart
