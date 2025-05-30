import { FormPage, ModuleLayout } from "@/layouts";
import { addCertificateBreadcrumbItems } from "../constants";
import CertificateForm from "./components/CertificateForm";

const AddCertificate = () => {
  return (
    <ModuleLayout breadcrumbItems={addCertificateBreadcrumbItems}>
      <FormPage title="Thêm chứng chỉ">
        <CertificateForm />
      </FormPage>
    </ModuleLayout>
  );
};

export default AddCertificate;
