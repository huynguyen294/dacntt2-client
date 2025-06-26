import AdmissionCompareChart from "./components/AdmissionCompareChart";
import { ModuleLayout } from "@/layouts";
import { AdmissionStatusPie } from "@/components/dashboard-widgets";
import { Indicator } from "@/components/common";
import { ChartNoAxesColumn, Percent } from "lucide-react";
import { PREVIOUS_MONTH } from "@/constants";

const AdmissionReport = () => {
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
              value={130}
            />
            <Indicator
              icon={<Percent size="18px" />}
              title="Tỉ lệ chốt đơn"
              description={`(Tháng ${PREVIOUS_MONTH})`}
              value={"80%"}
            />
            <Indicator
              icon={<Percent size="18px" />}
              title="Tỉ lệ thất bại"
              description={`(Tháng ${PREVIOUS_MONTH})`}
              value={"5%"}
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
