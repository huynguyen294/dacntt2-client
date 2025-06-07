import { ModuleLayout } from "@/layouts";

const StudentTuition = () => {
  return (
    <ModuleLayout breadcrumbItems={[{ label: "Học phí" }]}>
      <div className="px-2 sm:px-10">StudentTuition</div>
    </ModuleLayout>
  );
};

export default StudentTuition;
