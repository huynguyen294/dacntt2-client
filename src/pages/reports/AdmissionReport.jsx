import AdmissionCompareChart from "./components/AdmissionCompareChart";
import { ModuleLayout } from "@/layouts";
import { AdmissionStatusPie } from "@/components/dashboard-widgets";
import { Indicator } from "@/components/common";
import { ChartNoAxesColumn, Percent } from "lucide-react";
import { ADMISSION_STATUSES, PREVIOUS_MONTH } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { API } from "@/apis";
import { useMemo } from "react";
import { localeString } from "@/utils";

const AdmissionReport = () => {
  const result = useQuery({
    queryKey: ["reports", "admission-per-months"],
    queryFn: () => API.get("/api-v1/reports/admission-per-months"),
    select: (res) => res.data,
  });

  const data = useMemo(() => {
    if (!result.data) return {};
    const { admissionsPerMonth } = result.data;
    const filtered = admissionsPerMonth.filter((d) => new Date(d.month).getMonth() + 1 === PREVIOUS_MONTH);
    const total = filtered.map((f) => Number(f.total)).reduce((acc, curr) => acc + curr, 0);
    const accepted = filtered
      .filter((f) => f.status === ADMISSION_STATUSES.accepted || f.status === ADMISSION_STATUSES.done)
      .reduce((acc, curr) => acc + Number(curr.total), 0);
    const rejected = filtered
      .filter((f) => f.status === ADMISSION_STATUSES.rejected)
      .reduce((acc, curr) => acc + Number(curr.total), 0);

    return { total, accepted, rejected };
  }, [result.data]);

  return (
    <ModuleLayout breadcrumbItems={[{ label: "Báo cáo tuyển sinh" }]}>
      <div className="container mx-auto px-2 sm:px-10 overflow-auto h-full">
        <section className="p-4">
          <p className="mb-4 ml-2 text-xl font-semibold">Chỉ số</p>
          <dl className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
            <Indicator
              icon={<ChartNoAxesColumn />}
              title="Tổng số hồ sơ"
              description={`(Tháng ${PREVIOUS_MONTH})`}
              isLoading={result.isLoading}
              value={localeString(data.total)}
            />
            <Indicator
              icon={<Percent size="18px" />}
              title="Tỉ lệ chốt đơn"
              description={`(Tháng ${PREVIOUS_MONTH})`}
              isLoading={result.isLoading}
              value={((data.accepted / data.total) * 100).toFixed(1) + "%"}
            />
            <Indicator
              icon={<Percent size="18px" />}
              title="Tỉ lệ thất bại"
              description={`(Tháng ${PREVIOUS_MONTH})`}
              isLoading={result.isLoading}
              value={((data.rejected / data.total) * 100).toFixed(1) + "%"}
            />
          </dl>
        </section>

        <section className="p-4">
          <dl className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
            <div className="col-span-1 sm:col-span-2">
              <p className="mb-4 ml-2 text-xl font-semibold">Biểu đồ so sánh</p>
              <AdmissionCompareChart />
            </div>
            <div className="col-span-1 lg:col-span-2 xl:col-span-1">
              <p className="mb-4 ml-2 text-xl font-semibold">Trạng thái tư vấn</p>
              <AdmissionStatusPie />
            </div>
          </dl>
        </section>
      </div>
    </ModuleLayout>
  );
};

export default AdmissionReport;
