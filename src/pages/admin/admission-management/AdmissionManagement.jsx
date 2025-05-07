import { ModuleLayout } from "@/layouts";
import { admissionManagementBreadcrumbItems } from "./contansts";

const AdmissionManagement = () => {
  return (
    <ModuleLayout breadcrumbItems={admissionManagementBreadcrumbItems}>
      <div className="px-10">Hello AdmissionManagement Module!</div>
    </ModuleLayout>
  );
};

export default AdmissionManagement;
