import _BaseChart from './base-chart';

const _BarChart = Object.create(_BaseChart);

_BarChart.init = function(selector, data) {
    this.data = data;
    this.initBase(selector);
};

_BarChart.getMinMax = function() {
    let min, max;

    this.data.forEach(value => {
        if (!max || value > max) { max = value; }
        if (!min || value < min) { min = value; }
    });

    return { min, max };
};

_BarChart.draw = function() {

    const { min, max } = this.getMinMax();
    const { height: parentHeight, width: parentWidth } = this.getParentDimensions();
    const count = this.data.length;
    const range = Math.abs(max - min);

    const barSlotWidth = parentWidth / count;
    const barWidth = barSlotWidth * 0.7;
    const barGap =  barSlotWidth * 0.15;
    const color = 'crimson';
    const chartHeight = 0.8 * parentHeight;
    const labelHeight = 0.92 * parentHeight;

    let yAxisHeight;

    if (max < 0) { yAxisHeight = 0; }
    else if (min > 0) { yAxisHeight = chartHeight; }
    else { yAxisHeight = ( max / range ) * chartHeight; }

    const xAxis = `<line x1=${0} y1=${yAxisHeight} x2=${parentWidth} y2=${yAxisHeight} stroke=black width=10></line>`;
    const yAxis = `<line x1=0 y1=0 x2=0 y2=${chartHeight} stroke=black width=10></line>`;

    const bars = this.data.map((value, index) => {
        let height;
        if (max < 0) { height = (value / min) * chartHeight; }
        else if (min > 0) { height = (value / max) * chartHeight; }
        else { height = (value / range) * chartHeight; }
        height = Math.abs(height);

        let yOffset, xOffset;
        if (min > 0) { yOffset = chartHeight - height; }
        else if (max < 0) { yOffset = 0; }
        else if (value > 0) { yOffset = yAxisHeight - height; }
        else { yOffset = yAxisHeight; }

        xOffset = (index * barSlotWidth) + barGap;

        return `<rect x=${xOffset} y=${yOffset} width=${barWidth} height=${height} fill='${color}' stroke='${color}'/>`;
    }).join('');

    const labels = [];
    for (let i = 0; i < count; i++) {
        labels.push(String.fromCharCode(i + 65));
    }

    const labelElements = labels.map((label, index) => {
        const xOffset = barSlotWidth * (index + 0.5);
        return `<text x=${xOffset} y=${labelHeight} font-size=16>${label}</text>`;
    });

    const graphContents = `
            ${xAxis}
            ${yAxis}
            <g>${bars}</g>
            <g>${labelElements.join('')}</g>
        `;

    this.svg.innerHTML = graphContents;
};

export default function BarChart(selector, data) {
    const chart = Object.create(_BarChart);
    chart.init(selector, data);
    return chart;
}
