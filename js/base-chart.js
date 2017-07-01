const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

const  _BaseChart = {
    initBase(selector) {
        this.selector = selector;
        this.el = document.querySelector(this.selector);
        this.attachSVG()
        this.attachListeners();
        this.draw();
    },

    attachSVG() {
        this.svg = document.createElementNS(SVG_NAMESPACE, 'svg');
        const width = '100%';
        const height = '100%';
        this.svg.setAttribute('width', width);
        this.svg.setAttribute('height', height);
        this.svg.style.width = width;
        this.svg.style.height = height;
        this.el.appendChild(this.svg);
    },

    detachSVG() {
        this.el.removeChild(this.svg);
        delete this.svg;
    },

    update() {
        this.detachSVG();
        this.attachSVG();
        this.draw();
    },

    attachListeners() {
        const update = this.update.bind(this);
        window.addEventListener('resize', update);
    }
};

export default _BaseChart;
