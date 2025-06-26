import { ModuleLayout } from "@/layouts";
import {
  AdmissionStatusPie,
  ClassIndicator,
  StudentIndicator,
  StudentTrendChart,
} from "@/components/dashboard-widgets";
import { Indicator } from "@/components/common";
import { ChartNoAxesColumn } from "lucide-react";

const EduReport = () => {
  return (
    <ModuleLayout breadcrumbItems={[{ label: "Báo cáo tuyển sinh" }]}>
      <div className="container mx-auto px-2 sm:px-10 overflow-auto h-full">
        <section className="p-4">
          <p className="mb-4 ml-2 text-xl font-semibold">Chỉ số</p>
          <dl className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
            <StudentIndicator disableFooter />
            <ClassIndicator disableFooter />
            <Indicator icon={<ChartNoAxesColumn />} title="Tổng số đăng ký" value={130} />
          </dl>
        </section>

        <section className="p-4">
          <dl className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
            <div className="col-span-full">
              <p className="mb-4 ml-2 text-xl font-semibold">Biểu đồ xu hướng học viên</p>
              <StudentTrendChart className="h-[30rem]" />
            </div>
          </dl>
        </section>
      </div>
    </ModuleLayout>
  );
};

export default EduReport;
