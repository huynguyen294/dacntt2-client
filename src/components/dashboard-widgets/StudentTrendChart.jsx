import { alpha } from "@/utils";
import { Chart, Loader } from "../common";
import { PALETTE } from "@/constants/palette";
import { getDefaultOptions } from "../common/Charts/constants";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { API } from "@/apis";
import { useMemo } from "react";

const StudentTrendChart = ({ className }) => {
  const { isLoading, data } = useQuery({
    queryKey: ["reports", "enrollment-per-months"],
    queryFn: () => API.get("/api-v1/reports/enrollment-per-months"),
    select: (res) => res.data,
  });

  const lineChartData = useMemo(() => {
    if (!data) return;
    const { enrollmentsPerMonth } = data;
    return {
      labels: enrollmentsPerMonth.map((item) => `Tháng ${new Date(item.month).getMonth() + 1}`),
      datasets: [
        {
          data: enrollmentsPerMonth.map((item) => item.total),
          backgroundColor: alpha(PALETTE.PRIMARY, 0.1),
          borderColor: alpha(PALETTE.PRIMARY, 0.7),
        },
      ],
    };
  }, [data]);

  return (
    <div className={cn("h-[18rem] xl:h-[24rem] shadow-small rounded-large p-6", className)}>
      <Loader className="h-full" isLoading={isLoading} />
      {data && (
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
      )}
    </div>
  );
};

export default StudentTrendChart;
