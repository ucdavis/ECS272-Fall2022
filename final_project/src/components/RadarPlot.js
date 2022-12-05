import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  zoomPlugin,
  Filler,
  Tooltip,
  Legend
);

const options = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    zoom: {
      zoom: {
        wheel: {
          enabled: true // SET SCROOL ZOOM TO TRUE
        },
        mode: "xy",
        speed: 100
      },
      pan: {
        enabled: true,
        mode: "xy",
        speed: 100
      }
    }
  }
};

class RadarPlot extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        count: 0
      };
    }

componentDidUpdate = () => {this.data()}

data = () => {
    return(
        {
        labels: ['Armed Assault', 'Assassination', 'Bombing/Explosion', 'Infrastructure Attack', 'Hijacking', 'Hostage Taking'],
        datasets: this.props.data
      }
    
    )
}



render() {
  return <Radar key={this.props.data} data={this.data()} options={options}/>;
}
}

export default RadarPlot