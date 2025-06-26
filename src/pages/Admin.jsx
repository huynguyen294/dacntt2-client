import { ClassIndicator, StudentIndicator, StudentTrendChart, TuitionIndicator } from "@/components/dashboard-widgets";
import AdmissionStatusPie from "@/components/dashboard-widgets/AdmissionStatusPie";
import { MainLayout } from "@/layouts";

const Admin = () => {
  return (
    <MainLayout title="Tổng quan" hideMenuButton>
      <section className="p-4">
        <p className="mb-4 ml-2 text-xl font-semibold">Chỉ số</p>
        <dl className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 xl:md:grid-cols-3">
          <StudentIndicator />
          <TuitionIndicator />
          <ClassIndicator />
        </dl>
      </section>

      <section className="p-4">
        <dl className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 xl:md:grid-cols-3">
          <div className="col-span-2">
            <p className="mb-4 ml-2 text-xl font-semibold">Biểu đồ xu hướng học viên</p>
            <StudentTrendChart />
          </div>
          <div className="col-span-1">
            <p className="mb-4 ml-2 text-xl font-semibold">Tư vấn tuyển sinh</p>
            <AdmissionStatusPie />
          </div>
        </dl>
      </section>
    </MainLayout>
  );
};

export default Admin;
