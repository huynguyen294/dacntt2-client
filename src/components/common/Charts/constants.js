import { shortenNumber } from "@/utils";

export const DEFAULT_DOUGHNUT_DATASET_STYLE = {
  borderColor: "#fff",
  hoverBorderColor: "#fff",
  borderRadius: 6,
  borderWidth: 1,
  hoverOffset: 10,
};

export const DEFAULT_LINE_DATASET_STYLE = {
  fill: true,
  tension: 0.4,
};

export const DEFAULT_BAR_DATASET_STYLE = {
  borderRadius: 4,
};

export const oneDatasetCharts = ["pie", "doughnut"];

export const getDefaultOptions = (type) => {
  switch (type) {
    case "doughnut":
      return defaultDoughnutOptions;
    case "line":
      return defaultLineOptions;
    case "bar":
      return defaultBarOptions;
    case "mixed":
    default:
      return defaultMixedOptions;
  }
};

export const defaultBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      left: 0,
      right: 20,
      top: 0,
      bottom: 0,
    },
  },
  interaction: {
    mode: "index",
    intersect: false,
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => {
          return shortenNumber(value);
        },
        display: true,
      },
      grid: {
        display: true,
      },
    },
    x: {
      grid: { display: false },
    },
  },
};

export const defaultLineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      left: 0,
      right: 20,
      top: 0,
      bottom: 0,
    },
  },
  interaction: {
    mode: "index",
    intersect: false,
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => {
          return shortenNumber(value);
        },
        display: true,
      },
      grid: {
        display: true,
      },
    },
  },
};

export const defaultMixedOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: 18,
  },
  plugins: {
    datalabels: {
      anchor: "end",
      align: "end",
      offset: -5,
      color: "#fff",
      borderColor: "#000",
      textStrokeColor: "black", // <-- added this
      textStrokeWidth: 3, // <-- added this,
      font: {
        size: 12,
      },
    },
  },
};

export const defaultDoughnutOptions = {
  layout: {
    padding: 4,
  },
  cutout: "25%",
  scales: {
    y: {
      display: false,
      beginAtZero: true,
      ticks: {
        display: false,
      },
      grid: {
        display: false,
      },
    },
    x: {
      display: false,
      ticks: {
        display: false,
      },
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    datalabels: {
      color: "#fff",
      font: {
        size: 12,
        weight: "bold",
      },
      formatter: (value) => {
        if (value < 10) return "";
        return value + "%";
      },
    },
  },
};
