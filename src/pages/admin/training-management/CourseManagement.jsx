import { ModuleLayout } from "@/layouts";
import { coursesManagementBreadcrumbItems } from "./constants";

const CourseManagement = () => {
  return (
    <ModuleLayout breadcrumbItems={coursesManagementBreadcrumbItems}>
      <div className="px-10">Hello CourseManagement Module!</div>
    </ModuleLayout>
  );
};

export default CourseManagement;
