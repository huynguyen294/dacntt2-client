import { ModuleLayout } from "@/layouts";
import { examsManagementBreadcrumbItems } from "./constants";

const ExamScheduleManagement = () => {
  return (
    <ModuleLayout breadcrumbItems={examsManagementBreadcrumbItems}>
      <div className="px-10">Hello ExamScheduleManagement Module!</div>
    </ModuleLayout>
  );
};

export default ExamScheduleManagement;
