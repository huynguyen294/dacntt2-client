import { ModuleLayout } from "@/layouts";

const StudentClass = () => {
  return (
    <ModuleLayout breadcrumbItems={[{ label: "Lớp của tôi" }]}>
      <div className="px-2 sm:px-10">StudentClass</div>
    </ModuleLayout>
  );
};

export default StudentClass;
