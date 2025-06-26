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
          alpha(PALETTE.SUCCESS, 0.9),
          alpha(PALETTE.SUCCESS, 0.9),
          alpha(PALETTE.SUCCESS, 0.9),
          alpha(PALETTE.WARNING, 0.9),
          alpha(PALETTE.DANGER, 0.9),
          alpha(PALETTE.scarlet, 0.9),
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
