import { ModuleLayout } from "@/layouts";

const StudentScore = () => {
  return (
    <ModuleLayout breadcrumbItems={[{ label: "Kết quả học tập" }]}>
      <div className="px-2 sm:px-10">StudentScore</div>
    </ModuleLayout>
  );
};

export default StudentScore;
