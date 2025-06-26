import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, LineElement, Filler } from "chart.js";
import { Line } from "react-chartjs-2";
import { DEFAULT_LINE_DATASET_STYLE } from "./constants";
import { forwardRef } from "react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const LineChart = forwardRef(({ data = {}, plugins, ...props }, ref) => {
  const { labels, datasets } = data;

  return (
    <Line
      ref={ref}
      data={{
        labels,
        datasets: datasets.map((dataset) => ({
          ...DEFAULT_LINE_DATASET_STYLE,
          ...(dataset.backgroundColor && { hoverBackgroundColor: dataset.backgroundColor }),
          ...dataset,
        })),
      }}
      plugins={[...plugins, intersectDataVerticalLine]}
      {...props}
    />
  );
});

const intersectDataVerticalLine = {
  id: "intersectDataVerticalLine",
  beforeDraw: (chart) => {
    if (chart.tooltip?._active && chart.tooltip._active.length) {
      const ctx = chart.ctx;
      ctx.save();
      const activePoint = chart.tooltip._active[0];
      const chartArea = chart.chartArea;
      // grey vertical hover line - full chart height
      ctx.beginPath();
      ctx.moveTo(activePoint.element.x, chartArea.top);
      ctx.lineTo(activePoint.element.x, chartArea.bottom);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(0,0,0,0.1)";
      ctx.stroke();
      ctx.restore();
      // colored vertical hover line - ['node' point to chart bottom] - only for line graphs (graphs with 1 data point)
      if (chart.tooltip._active.length === 1) {
        ctx.beginPath();
        ctx.moveTo(activePoint.element.x, activePoint.element.y);
        ctx.lineTo(activePoint.element.x, chartArea.bottom);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(0,0,0,0.5)";
        ctx.stroke();
        ctx.restore();
      }
    }
  },
};

export default LineChart;
