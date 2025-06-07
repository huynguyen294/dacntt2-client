import { ModuleLayout } from "@/layouts";

const StudentExam = () => {
  return (
    <ModuleLayout breadcrumbItems={[{ label: "Lịch thi" }]}>
      <div className="px-2 sm:px-10">StudentExam</div>
    </ModuleLayout>
  );
};

export default StudentExam;
