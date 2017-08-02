import _BaseChart from './base-chart';

const _PieChart = Object.create(_BaseChart);

_PieChart.init = function(selector, data) {
    this.data = data;
    this.initBase(selector);
};

_PieChart.draw = function() {
    const { height: parentHeight, width: parentWidth } = this.getParentDimensions();

    const diameter = parentHeight > parentWidth ? parentHeight : parentWidth;
    const centerX = parentWidth / 2;
    const centerY = parentHeight / 2;

    const graphContents = `
       <circle cx="${centerX}" cy="${centerY}" r="${diameter/2}"></circle> 
    `;

    this.svg.innerHTML = graphContents;

};

export default function PieChart(selector, data) {
    const chart = Object.create(_PieChart);
    chart.init(selector, data);
    return chart;
};
