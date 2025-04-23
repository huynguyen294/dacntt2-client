import { withAuth } from "@/hocs";
import { MainLayout } from "@/layouts";

const Student = withAuth(() => {
  return (
    <MainLayout>
      <div className="p-6">
        <p className="text-xl">Xin chào học viên</p>
      </div>
    </MainLayout>
  );
});

export default Student;
