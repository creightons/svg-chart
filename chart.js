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

    const svg = `
        <svg width=${CHART_WIDTH} height=${CHART_HEIGHT}>
            ${lines.join(' ')}
        </svg>
    `;

    return svg;
}

function normalizeCoordinate(min, max, value, size, isVertical) {
    const proportion = Math.abs( (value - min) / (max - min) );
    const coordinate = isVertical ? ((1 - proportion) * size) : (proportion * size);
    return coordinate;
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