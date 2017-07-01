import _BaseChart from './base-chart';

const _BarChart = Object.create(_BaseChart);

_BarChart.init = function(selector, data) {
    this.data = data;
    this.initBase(selector);
};

_BarChart.draw = function() {
    const bar = `<rect x='0' y='0' width='10' height='10' fill='red' stroke='red'></rect>`;
    this.svg.innerHTML = bar;
};

export default function BarChart(selector, data) {
    const chart = Object.create(_BarChart);
    chart.init(selector, data);
    return chart;
}
