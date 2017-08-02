import BarChart from './bar-chart';
import LineChart from './line-chart';
import PieChart from './pie-chart';


function getRandom(range) {
    return range * (Math.random() - 0.5);
}

const barData = [];
const lineData = [];

for (let i = 0; i < 30; i++) {
    lineData.push({ x: getRandom(100), y: getRandom(100) });
}

lineData.sort((a, b) => { return a.x < b.x ? -1 : 1; });

for (let i = 0; i < 20; i++) {
    barData.push(getRandom(100));
}

const lineChart = LineChart('#chart', lineData);
const barChart = BarChart('#bar-chart', barData);
const pieChart = PieChart('#pie-chart', []);
