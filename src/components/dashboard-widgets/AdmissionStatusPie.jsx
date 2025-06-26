import { alpha } from "@/utils";
import { Chart } from "../common";
import { PALETTE } from "@/constants/palette";
import { ADMISSION_STATUSES } from "@/constants";

const AdmissionStatusPie = () => {
  const lineChartData = {
    labels: Object.values(ADMISSION_STATUSES),
    datasets: [
      {
        data: [3, 50, 40, 23, 20],
        backgroundColor: [
          alpha(PALETTE.charcoal, 0.3),
          PALETTE.WARNING,
          PALETTE.SUCCESS,
          PALETTE.DANGER,
          alpha(PALETTE.forest_green, 0.6),
        ],
      },
    ],
  };

  return (
    <div className="h-[24rem] shadow-small rounded-large flex justify-center">
      <Chart type="doughnut" data={lineChartData} />
    </div>
  );
};

export default AdmissionStatusPie;
