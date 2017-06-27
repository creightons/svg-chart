function buildChart(selector, data) {
    const svgChart = getSVG(data);
    const element = document.querySelector(selector);
    element.innerHTML = svgChart;
}

function getSVG(data) {
    const CHART_HEIGHT = 200;
    const CHART_WIDTH = 300;
    
    let xMin, yMin, xMax, yMax;
    data.forEach(coordinates => {
        const { x, y } = coordinates;
        if (xMin === undefined || x < xMin) { xMin = x; }
        if (xMax === undefined || x > xMax) { xMax = x; }
        if (yMin === undefined || y < yMin) { yMin = y; }
        if (yMax === undefined || y > yMax) { yMax = y; }
    });

    const normalizedData = data.map(({ x, y }) => {
        return {
            x: normalizeCoordinate(xMin, xMax, x, CHART_WIDTH, false),
            y: normalizeCoordinate(yMin, yMax, y, CHART_HEIGHT, true),
        };
    });

    let lines = [];
    let lineString, x1, x2, y1, y2;
    for (let i = 0; i < (normalizedData.length - 1); i++) {
        x1 = normalizedData[i].x;
        y1 = normalizedData[i].y;
        x2 = normalizedData[i + 1].x;
        y2 = normalizedData[i + 1].y;
        lineString = `<line x1=${x1} y1=${y1} x2=${x2} y2=${y2} stroke='black' width='10' />`;
        lines.push(lineString);
    }

    const xAxis = getXAxis(xMin, xMax, CHART_WIDTH, CHART_HEIGHT);
    const yAxis = getYAxis(yMin, yMax, CHART_WIDTH, CHART_HEIGHT);
    const svg = `
        <svg width=${CHART_WIDTH} height=${CHART_HEIGHT}>
            ${lines.join(' ')}
            ${xAxis}
            ${yAxis}
        </svg>
    `;

    return svg;
}

function normalizeCoordinate(min, max, value, size, isVertical) {
    const proportion = Math.abs( (value - min) / (max - min) );
    const coordinate = isVertical ? ((1 - proportion) * size) : (proportion * size);
    return coordinate;
}

function getXAxis(min, max, width, height) {
    let axisHeight;

    if (max < 0) { axisHeight = max; }
    else if (min > 0) { axisHeight = min; }
    else { axisHeight = 0; }

    const normalizedHeight = normalizeCoordinate(min, max, axisHeight, width, false);

    return `<line x1=0 y1=${normalizedHeight} x2=${width} y2=${normalizedHeight} stroke='black' width=10 />`;
}

function getYAxis(min, max, width, height) {
    let axisWidth;

    if (max < 0) { axisWidth = max; }
    else if (min > 0) { axisWidth = min; }
    else { axisWidth = 0; }

    const normalizedWidth = normalizeCoordinate(min, max, axisWidth, width, true);

    return `<line x1=${normalizedWidth} y1=0 x2=${normalizedWidth} y2=${height} stroke='black' width=10 />`;
}

const lineData = [
    { x: 5, y: 12 },
    { x: 7, y: -7 },
    { x: 12, y: 2 },
    { x: 13, y: 4 },
    { x: 15, y: 23 },
    { x: 20, y: 15 },
    { x: 22, y: 37 },
    { x: 24, y: 35 },
];


const randomCount = 30;

function getRandom(range) {
    return range * (Math.random() - 0.5);
}

const randomData = [];
for (let i = 0; i < randomCount; i++) {
    randomData.push({ x: getRandom(100), y: getRandom(100) });
}

randomData.sort((a, b) => { return a.x < b.x ? -1 : 1; });

buildChart('#chart', randomData);

class BarChart {
    constructor(selector, data) {
        this.selector = selector;
        this.el = document.querySelector(this.selector);
        this.data = data;
        const { width, height } = this.getParentDimensions();
        this.width = width || 300;
        this.height = height || 300;
        this.addListeners();

        this.draw();
    }

    draw() {
        const self = this;
        let max, min;
        this.data.forEach(val => {
            if (!max || val > max) { max = val; }
            if (!min || val < min) { min = val; }
        });

        const range = Math.abs(max - min);
        const count = this.data.length;

        const barSlotWidth = self.width / count;
        const barWidth = barSlotWidth * 0.7;
        const barGap =  barSlotWidth * 0.15;
        const color = 'crimson';

        let yAxisHeight;

        if (max < 0) { yAxisHeight = 0; }
        else if (min > 0) { yAxisHeight = self.height; }
        else { yAxisHeight = ( max / range ) * self.height; }

        const xAxis = `<line x1=0 y1=0 x2=0 y2=${self.height} stroke=black width=10></line>`;
        const yAxis = `<line x1=${0} y1=${yAxisHeight} x2=${self.width} y2=${yAxisHeight} stroke=black width=10></line>`;

        const bars = this.data.map((value, index) => {
            let height;
            if (max < 0) { height = (value / min) * self.height; }
            else if (min > 0) { height = (value / max) * self.height; }
            else { height = (value / range) * self.height; }
            height = Math.abs(height);

            let yOffset, xOffset;
            if (min > 0) { yOffset = self.height - height; }
            else if (max < 0) { yOffset = 0; }
            else if (value > 0) { yOffset = yAxisHeight - height; }
            else { yOffset = yAxisHeight; }

            xOffset = (index * barSlotWidth) + barGap;

            return `<rect x=${xOffset} y=${yOffset} width=${barWidth} height=${height} fill='${color}' stroke='${color}'/>`;
        }).join('');

        const svg = `
            <svg width=${self.width} height=${self.height}>
                ${xAxis}
                ${yAxis}
                ${bars}
            </svg>
        `;

        this.el.innerHTML = svg;
    }

    addListeners() {
        // TODO: Listen for changes to viewport size and redraw
    }

    getParentDimensions() {
        const { width, height } = this.el.parentElement.getBoundingClientRect();
        return { width, height };
    }
}

const data = [];
for (let i = 0; i < 10; i++) {
    data.push(getRandom(100));
}

const barChart = new BarChart('#bar-chart', data);
