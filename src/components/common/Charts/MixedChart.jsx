import { Chart as ChartJS, LinearScale, CategoryScale, BarElement, PointElement, LineElement, Legend, Tooltip, LineController, BarController } from "chart.js";
import { Chart } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(LinearScale, CategoryScale, BarElement, PointElement, LineElement, Legend, Tooltip, LineController, BarController, ChartDataLabels);

const MixedChart = ({ data, options, plugins, ...props }) => {
  const { labels, datasets } = data;

  return (
    <Chart
      data={{
        labels,
        datasets: datasets.map((dataset) => ({
          ...(dataset.backgroundColor && { hoverBackgroundColor: dataset.backgroundColor }),
          ...dataset,
        })),
      }}
      options={options}
      plugins={plugins}
      {...props}
    />
  );
};

export default MixedChart;
