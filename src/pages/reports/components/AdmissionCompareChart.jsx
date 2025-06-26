import { Chart } from "@/components/common";
import { PALETTE } from "@/constants/palette";
import { alpha } from "@/utils";

const AdmissionCompareChart = () => {
  const barChartData = {
    labels: ["Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
    datasets: [
      {
        data: [1, 50, 40, 23],
        backgroundColor: alpha(PALETTE.PRIMARY, 1),
      },
    ],
  };

  return (
    <div className="h-[24rem] shadow-small rounded-large flex justify-center p-1">
      <Chart type="bar" data={barChartData} />
    </div>
  );
};

export default AdmissionCompareChart;
