import _BaseChart from './base-chart';

const _LineChart = Object.create(_BaseChart);

Object.assign(_LineChart, {
    init(selector, data) {
        this.data = data;
        this.initBase(selector);
    },

    draw() {
        const { width, height } = this.getParentDimensions();

        let xMin, yMin, xMax, yMax;
        this.data.forEach(coordinates => {
            const { x, y } = coordinates;
            if (xMin === undefined || x < xMin) { xMin = x; }
            if (xMax === undefined || x > xMax) { xMax = x; }
            if (yMin === undefined || y < yMin) { yMin = y; }
            if (yMax === undefined || y > yMax) { yMax = y; }
        });

        const normalizedData = this.data.map(({ x, y }) => {
            return {
                x: this.normalizeCoordinate(xMin, xMax, x, width, false),
                y: this.normalizeCoordinate(yMin, yMax, y, height, true),
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

        const xAxis = this.getXAxis(xMin, xMax, width, height);
        const yAxis = this.getYAxis(yMin, yMax, width, height);
        const graphContents = `
            ${xAxis}
            ${yAxis}
            <g>${lines.join(' ')}</g>
        `;

        return this.svg.innerHTML = graphContents;
    },

    normalizeCoordinate(min, max, value, size, isVertical) {
        const proportion = Math.abs( (value - min) / (max - min) );
        const coordinate = isVertical ? ((1 - proportion) * size) : (proportion * size);
        return coordinate;
    },

    getXAxis(min, max, width, height) {
        let axisHeight;

        if (max < 0) { axisHeight = max; }
        else if (min > 0) { axisHeight = min; }
        else { axisHeight = 0; }

        const normalizedHeight = this.normalizeCoordinate(min, max, axisHeight, height, false);

        return `<line x1=0 y1=${normalizedHeight} x2=${width} y2=${normalizedHeight} stroke='black' width=10 />`;
    },

    getYAxis(min, max, width, height) {
        let axisWidth;

        if (max < 0) { axisWidth = max; }
        else if (min > 0) { axisWidth = min; }
        else { axisWidth = 0; }

        const normalizedWidth = this.normalizeCoordinate(min, max, axisWidth, width, true);

            return `<line x1=${normalizedWidth} y1=0 x2=${normalizedWidth} y2=${height} stroke='black' width=10 />`;
    },

});

export default function LineChart(selector, data) {
    const chart = Object.create(_LineChart);
    chart.init(selector, data);
    return chart;
}
