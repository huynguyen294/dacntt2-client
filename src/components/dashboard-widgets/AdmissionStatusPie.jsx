import { alpha } from "@/utils";
import { Chart, Loader } from "../common";
import { PALETTE } from "@/constants/palette";
import { ADMISSION_STATUSES, PREVIOUS_MONTH } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { API } from "@/apis";
import { useMemo } from "react";
import { getDefaultOptions } from "../common/Charts/constants";

const AdmissionStatusPie = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["reports", "admission-per-months"],
    queryFn: () => API.get("/api-v1/reports/admission-per-months"),
    select: (res) => res.data,
  });

  const lineChartData = useMemo(() => {
    if (!data) return;
    const { admissionsPerMonth } = data;
    const grouped = admissionsPerMonth.reduce((acc, curr) => {
      if (new Date(curr.month).getMonth() + 1 === PREVIOUS_MONTH) {
        acc[curr.status] = +curr.total;
      }
      return acc;
    }, {});

    return {
      labels: Object.values(ADMISSION_STATUSES),
      datasets: [
        {
          data: Object.values(ADMISSION_STATUSES).map((status) => grouped[status]),
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
  }, [data]);

  const defaultOptions = getDefaultOptions("doughnut");

  return (
    <div className="h-[24rem] shadow-small rounded-large flex flex-col items-center p-2">
      <Loader className="h-full" isLoading={isLoading} />
      {data && (
        <Chart
          type="doughnut"
          data={lineChartData}
          options={{
            ...defaultOptions,
            plugins: {
              ...defaultOptions.plugins,
              title: {
                display: true,
                text: `Tháng ${PREVIOUS_MONTH}`,
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default AdmissionStatusPie;
