import { alpha } from "@/utils";
import { Chart } from "../common";
import { PALETTE } from "@/constants/palette";
import { getDefaultOptions } from "../common/Charts/constants";
import { cn } from "@/lib/utils";

const StudentTrendChart = ({ className }) => {
  const lineChartData = {
    labels: ["Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
    datasets: [
      {
        data: [1, 50, 40, 23],
        backgroundColor: alpha(PALETTE.PRIMARY, 0.1),
        borderColor: alpha(PALETTE.PRIMARY, 0.7),
      },
    ],
  };

  return (
    <div className={cn("h-[24rem] shadow-small rounded-large p-6", className)}>
      <Chart
        type="line"
        data={lineChartData}
        options={{
          ...getDefaultOptions("line"),
          plugins: {
            tooltip: { enabled: true },
            legend: { display: false },
            datalabels: { display: false },
          },
        }}
      />
    </div>
  );
};

export default StudentTrendChart;
