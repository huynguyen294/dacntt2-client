import { ModuleLayout } from "@/layouts";
import { certificatesManagementBreadcrumbItems } from "./constants";

const CertificateManagement = () => {
  return (
    <ModuleLayout breadcrumbItems={certificatesManagementBreadcrumbItems}>
      <div className="px-10">Hello CertificateManagement Module!</div>
    </ModuleLayout>
  );
};

export default CertificateManagement;
