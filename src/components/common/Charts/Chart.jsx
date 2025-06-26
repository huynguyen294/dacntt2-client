import { useCallback, useMemo, useRef, useState } from "react";
import { ChartContext } from "./context";
import { getDefaultOptions, oneDatasetCharts } from "./constants";
import ChartDataLabels from "chartjs-plugin-datalabels";
import DoughnutChart from "./DoughnutChart";
import MixedChart from "./MixedChart";
import LineChart from "./LineChart";
import BarChart from "./BarChart";

/**
 * @param {{
 *   type: 'doughnut' | 'line' | 'bar',
 *   data: { labels: [], datasets: [] },
 *   plugins: [],
 *   options: object,
 *   defaultActiveItem: number,
 *   canBeBlurred: number,
 *   onActive: () => {},
 * }} props
 */

const Chart = ({
  type = "mixed",
  data = { labels: [], datasets: [] },
  plugins = [ChartDataLabels],
  options = getDefaultOptions(type),
  defaultActiveItem = null,
  canBeBlurred = true,
  onActive = () => {},
  ...other
}) => {
  const chartRef = useRef();
  const [state, setState] = useState({ activeItem: defaultActiveItem });

  const Component = useMemo(() => {
    switch (type) {
      case "doughnut":
        return DoughnutChart;
      case "line":
        return LineChart;
      case "bar":
        return BarChart;
      default:
        return MixedChart;
    }
  }, []);

  const changeStateProperty = useCallback((property, value) => {
    setState((prev) => {
      if (prev[property] === value) return prev;
      return { ...prev, [property]: value };
    });
  }, []);

  const handelActive = useCallback(
    (index) => {
      onActive(index);
      changeStateProperty("activeItem", index);
    },
    [state]
  );

  const setActiveElement = useCallback((index) => {
    if (chartRef.current) {
      const chartInstance = chartRef.current;
      if (oneDatasetCharts.includes(type)) {
        chartInstance.setActiveElements([{ datasetIndex: 0, index }]);
      } else {
        chartInstance.setActiveElements([{ datasetIndex: index, index: 0 }]);
      }
      chartInstance.update();
    }
  }, []);

  options.onHover = (_, elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      handelActive(index);
      return;
    }

    if (!canBeBlurred) return;
    handelActive(null);
  };

  const actions = {
    setState,
    changeStateProperty,
    handelActive,
    setActiveElement,
  };

  return (
    <ChartContext.Provider value={{ state: { ...state, type, options, chartRef, data }, actions }}>
      <Component ref={chartRef} data={data} plugins={plugins} options={options} {...other} />
    </ChartContext.Provider>
  );
};

export default Chart;
