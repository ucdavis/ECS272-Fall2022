
import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false
      },
    },
    maintainAspectRatio: false
  };

    

class LineChart extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        count: 0,
        data: this.props.data
      };
    }


componentDidUpdate = () => {this.data()}

data = () => {
    return(
        {
        labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021'],
        datasets: this.state.data
        }
    
    )
}



render() {
  return <Line key={this.props.data} data={this.data()} options={options}/>;
}
}

export default LineChart