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


const BAR_HEIGHT = 300;
const BAR_WIDTH = 400;

function buildBarChart(selector, labels, data) {
    let max, min;
    data.forEach(val => {
        if (!max || val > max) { max = val; }
        if (!min || val < min) { min = val; }
    });

    const range = Math.abs(max - min);
    const count = data.length;

    const barWidth = ( BAR_WIDTH / count ) * 0.7;
    const barGap =  ( BAR_WIDTH / count ) * 0.15;

    let yAxisHeight;

    if (max < 0) { yAxisHeight = 0; }
    else if (min > 0) { yAxisHeight = BAR_HEIGHT; }
    else { yAxisHeight = ( max / range ) * BAR_HEIGHT; }

    const yAxis = `<line x1=${0} y1=${yAxisHeight} x2=${BAR_WIDTH} y2=${yAxisHeight} stroke=black width=10></line>`;
    
    const bars = data.map((value, index) => {
        let height;
        if (max < 0) { height = (value / min) * BAR_HEIGHT; }
        else if (min > 0) { height = (value / max) * BAR_HEIGHT; }
        else { height = (value / range) * BAR_HEIGHT; }
        height = Math.abs(height);

        let yOffset, xOffset;
        if (min > 0) { yOffset = BAR_HEIGHT - height; }
        else if (max < 0) { yOffset = 0; }
        else if (value > 0) { yOffset = yAxisHeight - height; }
        else { yOffset = yAxisHeight; }

        xOffset = (index * (barWidth / 2)) + barGap;

        return `<rect x=${xOffset} y=${yOffset} width=${barWidth} height=${height} />`;
    }).join('');


    const svg = `
        <svg width=${BAR_WIDTH} height=${BAR_HEIGHT}>
            ${yAxis}
            ${bars}
        </svg>
    `;


    const element = document.querySelector(selector);
    element.innerHTML = svg;
}

const labels = [ 'a', 'b', 'c', 'd', 'e' ];
const data = [ 12, 2, -3, 5, -11 ];
buildBarChart('#bar-chart', labels, data);
