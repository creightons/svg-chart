import BarChart from './bar-chart';
import LineChart from './line-chart';
import PieChart from './pie-chart';


function getRandom(range, includeNegatives = true) {
    const offset = includeNegatives ? 0.5 : 0;
    return range * (Math.random() - offset);
}

const barData = [];
const lineData = [];
const pieData = [];

for (let i = 0; i < 30; i++) {
    lineData.push({ x: getRandom(100), y: getRandom(100) });
}

lineData.sort((a, b) => { return a.x < b.x ? -1 : 1; });

for (let i = 0; i < 20; i++) {
    barData.push(getRandom(100));
}

for (let i = 0; i < 10; i++) {
    pieData.push(getRandom(100, false));
}

const lineChart = LineChart('#chart', lineData);
const barChart = BarChart('#bar-chart', barData);
const pieChart = PieChart('#pie-chart', pieData);
