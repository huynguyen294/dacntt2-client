import { ModuleLayout } from "@/layouts";
import { TuitionIndicator } from "@/components/dashboard-widgets";
import { Chart, Indicator, Loader } from "@/components/common";
import { ChartNoAxesColumn, Percent } from "lucide-react";
import { alpha, localeString, orderBy } from "@/utils";
import { useServerList } from "@/hooks";
import { API, classApi, tuitionApi } from "@/apis";
import { PALETTE } from "@/constants/palette";
import { useMemo } from "react";
import { format } from "date-fns";
import { DATE_FORMAT } from "@/constants";
import { useQuery } from "@tanstack/react-query";

const FinanceReport = () => {
  const tuitionList = useServerList("tuitions", tuitionApi.get, { paging: false });
  const classList = useServerList("classes", classApi.get, {
    filters: { closingDay: { gte: format(new Date(), DATE_FORMAT) } },
    otherParams: ["refs=true"],
  });
  const resultTotal = useQuery({
    queryKey: ["reports", "total-student-by-classes"],
    queryFn: () => API.get("/api-v1/reports/total-student-by-classes"),
    select: (res) => res.data,
  });

  const barChartData = useMemo(() => {
    if (!tuitionList.data) return;
    const grouped = tuitionList.list.reduce((acc, curr) => {
      const month = `Tháng ${new Date(curr.date).getMonth() + 1}`;
      if (!acc[month]) acc[month] = 0;
      acc[month] += Number(curr.amount);
      return acc;
    }, {});

    const labels = orderBy(Object.keys(grouped), (i) => i);

    return {
      labels,
      datasets: [
        {
          data: labels.map((l) => grouped[l]),
          backgroundColor: alpha(PALETTE.PRIMARY, 1),
        },
      ],
    };
  }, [tuitionList.data, tuitionList.list]);

  const data = useMemo(() => {
    if (!tuitionList.data || !classList.data || !resultTotal.data) return;
    const activeClasses = classList.list.map((c) => c.id);
    const totalTuitionPaid = tuitionList.list
      .filter((t) => activeClasses.includes(t.classId))
      .reduce((acc, curr) => acc + curr.amount, 0);
    const totalTuition = classList.list.reduce((acc, curr) => {
      const found = resultTotal.data.totals.find((c) => c.id === curr.id);
      const classTuition = curr.tuitionFee * +found.total;
      return acc + classTuition;
    }, 0);

    return { totalTuition, totalTuitionPaid };
  }, [tuitionList.data, tuitionList.list, classList.list, classList.data, resultTotal.data]);

  return (
    <ModuleLayout breadcrumbItems={[{ label: "Báo cáo tài chính" }]}>
      <div className="container mx-auto px-2 sm:px-10 overflow-auto h-full">
        <section className="p-4">
          <p className="mb-4 ml-2 text-xl font-semibold">Chỉ số</p>
          <dl className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
            <TuitionIndicator disableFooter />
            <Indicator
              isLoading={tuitionList.isLoading || classList.isLoading || resultTotal.isLoading}
              icon={<ChartNoAxesColumn size="18px" />}
              title="Tổng học phí ước tính"
              description={`(Lớp đang học và sắp khai giảng)`}
              value={data && localeString(data.totalTuition) + "đ"}
            />
            <Indicator
              icon={<Percent size="18px" />}
              isLoading={tuitionList.isLoading || classList.isLoading || resultTotal.isLoading}
              title="Công nợ còn lại"
              description="Số học phí chưa thu"
              value={data && localeString(data.totalTuitionPaid) + "đ"}
            />
          </dl>
        </section>

        <section className="p-4">
          <dl className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
            <div className="col-span-full">
              <p className="mb-4 ml-2 text-xl font-semibold">Doanh thu theo tháng</p>
              <div className="h-[24rem] shadow-small rounded-large flex justify-center p-1">
                <Loader className="h-full" isLoading={tuitionList.isLoading} />
                {barChartData && <Chart type="bar" data={barChartData} />}
              </div>
            </div>
          </dl>
        </section>
      </div>
    </ModuleLayout>
  );
};

export default FinanceReport;
