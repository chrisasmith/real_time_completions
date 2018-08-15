export interface ChartRef {
  chart: ChartElement;
}

interface ChartElement extends HTMLElement {
  _hoverdata: any;
}
