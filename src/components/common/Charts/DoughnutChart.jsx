import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { DEFAULT_DOUGHNUT_DATASET_STYLE } from "./constants";
import { forwardRef } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, ChartDataLabels);

const DoughnutChart = forwardRef(({ data = {}, ...props }, ref) => {
  const { labels, datasets } = data;

  return (
    <Doughnut
      ref={ref}
      data={{
        labels,
        datasets: datasets.map((dataset) => ({
          ...DEFAULT_DOUGHNUT_DATASET_STYLE,
          ...(dataset.backgroundColor && { hoverBackgroundColor: dataset.backgroundColor }),
          ...dataset,
        })),
      }}
      {...props}
    />
  );
});

export default DoughnutChart;
