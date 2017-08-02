import _BaseChart from './base-chart';

const _PieChart = Object.create(_BaseChart);

_PieChart.init = function(selector, data) {
    this.data = data;
    this.initBase(selector);
};

_PieChart.polarToCartesian = function (centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
};

_PieChart.describeArc = function (x, y, radius, startAngle, endAngle){
    const start = this.polarToCartesian(x, y, radius, endAngle);
    const end = this.polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    const d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;
};

_PieChart.dataToSectorRanges = function() {
    const sum = this.data.reduce((total, val) => total + val, 0);

    let startAngle = 0;
    const sectorRanges = this.data
        .map(value => ((value / sum) * 360))
        .map(sectorAngle => {
            const endAngle = startAngle + sectorAngle;
            const angleRange = {
                start: startAngle,
                end: endAngle,
            };
            startAngle = endAngle;
            return angleRange;
        });

    return sectorRanges;
}

_PieChart.getSectorColor = function(index) {
    const colors = [ 'red', 'blue', 'green', 'orange', 'purple' ];
    const normalizedIndex = index % colors.length;
    return colors[normalizedIndex];
};

_PieChart.draw = function() {
    const { height: parentHeight, width: parentWidth } = this.getParentDimensions();

    const diameter = Math.min(parentWidth, parentHeight);
    const centerX = parentWidth / 2;
    const centerY = parentHeight / 2;
    const arcWidth = diameter / 2;
    const arcRadius = arcWidth / 2;

    const sectorAngles = this.dataToSectorRanges();

    const sectorArcs = sectorAngles.map((sector, index) => {
        const path = this.describeArc(
            centerX, centerY, arcRadius, sector.start, sector.end
        );

        const sectorColor = this.getSectorColor(index);

        return `<path fill='none' stroke='${sectorColor}' stroke-width='${arcWidth}' d='${path}'></path>`;
    }).join('');

    const graphContents = `${sectorArcs}`;

    this.svg.innerHTML = graphContents;

};

export default function PieChart(selector, data) {
    const chart = Object.create(_PieChart);
    chart.init(selector, data);
    return chart;
};
