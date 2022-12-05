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
import {australAsia, attackCounts, casualtyCounts} from '../data/AttackCounts'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

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
  return <Radar key={this.props.data} data={this.data()} />;
}
}

export default RadarPlot