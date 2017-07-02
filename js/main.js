import './chart';
import BarChart from './bar-chart';


function getRandom(range) {
    return range * (Math.random() - 0.5);
}

const data = []

for (let i = 0; i < 20; i++) {
    data.push(getRandom(100));
}

const chart = BarChart('#bar-chart-2', data);
