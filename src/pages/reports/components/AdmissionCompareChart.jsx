import { API } from "@/apis";
import { Chart, Loader } from "@/components/common";
import { PALETTE } from "@/constants/palette";
import { alpha } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const AdmissionCompareChart = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["reports", "admission-per-months"],
    queryFn: () => API.get("/api-v1/reports/admission-per-months"),
    select: (res) => res.data,
  });

  const barChartData = useMemo(() => {
    if (!data) return;
    const { admissionsPerMonth } = data;
    const grouped = admissionsPerMonth.reduce((acc, curr) => {
      const month = `Tháng ${new Date(curr.month).getMonth() + 1}`;
      if (!acc[month]) acc[month] = 0;
      acc[month] += Number(curr.total);
      return acc;
    }, {});

    const labels = Object.keys(grouped);

    return {
      labels,
      datasets: [
        {
          data: labels.map((l) => grouped[l]),
          backgroundColor: alpha(PALETTE.PRIMARY, 1),
        },
      ],
    };
  }, [data]);

  return (
    <div className="h-[24rem] shadow-small rounded-large flex justify-center p-1">
      <Loader className="h-full" isLoading={isLoading} />
      {data && <Chart type="bar" data={barChartData} />}
    </div>
  );
};

export default AdmissionCompareChart;
