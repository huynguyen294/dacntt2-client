import { ModuleLayout } from "@/layouts";
import { registerBreadcrumbItems } from "./constants";

const RegisterStudent = () => {
  return (
    <ModuleLayout breadcrumbItems={registerBreadcrumbItems}>
      <div className="px-10">Hello RegisterStudent Module!</div>
    </ModuleLayout>
  );
};

export default RegisterStudent;
