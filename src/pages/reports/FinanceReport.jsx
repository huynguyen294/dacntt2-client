import AdmissionCompareChart from "./components/AdmissionCompareChart";
import { ModuleLayout } from "@/layouts";
import { AdmissionStatusPie, TuitionIndicator } from "@/components/dashboard-widgets";
import { Indicator } from "@/components/common";
import { ChartNoAxesColumn, Percent } from "lucide-react";
import { localeString } from "@/utils";

const FinanceReport = () => {
  return (
    <ModuleLayout breadcrumbItems={[{ label: "Báo cáo tài chính" }]}>
      <div className="container mx-auto px-2 sm:px-10 overflow-auto h-full">
        <section className="p-4">
          <p className="mb-4 ml-2 text-xl font-semibold">Chỉ số</p>
          <dl className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
            <TuitionIndicator disableFooter />
            <Indicator
              icon={<ChartNoAxesColumn size="18px" />}
              title="Tổng học phí ước tính"
              description={`(Lớp đang học và sắp khai giảng)`}
              value={localeString(130000000) + "đ"}
            />
            <Indicator
              icon={<Percent size="18px" />}
              title="Công nợ còn lại"
              description="Số học phí chưa thu"
              value={localeString(50000000) + "đ"}
            />
          </dl>
        </section>

        <section className="p-4">
          <dl className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
            <div className="col-span-full">
              <p className="mb-4 ml-2 text-xl font-semibold">Doanh thu theo tháng</p>
              <AdmissionCompareChart />
            </div>
          </dl>
        </section>
      </div>
    </ModuleLayout>
  );
};

export default FinanceReport;
