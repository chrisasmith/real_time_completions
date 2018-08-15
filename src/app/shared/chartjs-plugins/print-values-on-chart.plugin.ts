import {Chart} from 'chart.js';

export const PrintChartValues: any = {
  afterDatasetsDraw: (chart) => {
    const ctx = chart.ctx;
    chart.data.datasets.forEach((dataset, i) => {
      const meta = chart.getDatasetMeta(i);
      if (!meta.hidden) {
        meta.data.forEach((element, index) => {
          // Draw the text in white, with the specified font
          ctx.fillStyle = '#626f86';
          const fontSize = 16;
          const fontStyle = 'normal';
          const fontFamily = 'inherit';
          ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
          // Just naively convert to string for now
          const dataString = dataset.data[index].y ? dataset.data[index].y.toString() : '';
          // Make sure alignment settings are correct
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const padding = 5;
          const position = element.tooltipPosition();
          ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
        });
      }
    });
  }
};
