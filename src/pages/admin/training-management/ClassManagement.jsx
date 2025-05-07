import { ModuleLayout } from "@/layouts";
import { classesManagementBreadcrumbItems } from "./constants";

const ClassManagement = () => {
  return (
    <ModuleLayout breadcrumbItems={classesManagementBreadcrumbItems}>
      <div className="px-10">Hello ClassManagement Module!</div>
    </ModuleLayout>
  );
};

export default ClassManagement;
