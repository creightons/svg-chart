function buildChart(selector, data) {
    const svgChart = getSVG(data);
    const element = document.querySelector(selector);
    element.innerHTML = svgChart;
}

function getSVG(data) {
    const yaxis = "<line x1='0' y1='0' x2='0' y2='200' stroke='black' width='10' />";
    const xaxis = "<line x1='0' y1='200' x2='300' y2='200' stroke='black' width='10' />";
    const lines = `
        <line x1='20' y1='59' x2='40' y2='78' stroke='black' width='10' />
        <line x1='40' y1='78' x2='60' y2='118' stroke='black' width='10' />
        <line x1='60' y1='118' x2='80' y2='109' stroke='black' width='10' />
        <line x1='80' y1='109' x2='100' y2='17' stroke='black' width='10' />
        <line x1='100' y1='17' x2='170' y2='55' stroke='black' width='10' />
    `;
    const svg = `
        <svg width=300 height=200>
            ${xaxis}
            ${yaxis}
            ${lines}
        </svg>
    `;

    return svg;
}

buildChart('#chart', []);
