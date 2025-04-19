import { MainLayout } from "@/components/layouts";
import KPI from "@/components/ui/KPI";

const Admin = () => {
  return (
    <MainLayout title="Tổng quan" hideMenuButton>
      <div className="p-6 space-y-6">
        <div>
          <p className=" mb-4 ml-2 text-xl font-semibold">Số liệu KPI</p>
          <KPI />
        </div>
      </div>
    </MainLayout>
  );
};

export default Admin;
