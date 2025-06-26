import { Chart as ChartJS, LinearScale, CategoryScale, BarElement, Legend, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
import { DEFAULT_BAR_DATASET_STYLE } from "./constants";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels);

const BarChart = ({ data, options, ...props }) => {
  const { labels, datasets } = data;

  return (
    <Bar
      data={{
        labels,
        datasets: datasets.map((dataset) => ({
          ...DEFAULT_BAR_DATASET_STYLE,
          ...dataset,
        })),
      }}
      options={options}
      {...props}
    />
  );
};

export default BarChart;
