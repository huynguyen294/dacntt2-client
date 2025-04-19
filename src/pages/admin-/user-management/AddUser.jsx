import { ModuleLayout } from "@/components/layouts";
import { addUserBreadcrumbItems } from ".";

const AddUser = () => {
  return (
    <ModuleLayout title="Thêm tài khoản" breadcrumbItems={addUserBreadcrumbItems}>
      AddUser
    </ModuleLayout>
  );
};

export default AddUser;
