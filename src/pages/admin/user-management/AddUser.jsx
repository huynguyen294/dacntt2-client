import { ModuleLayout } from "@/layouts";
import { addUserBreadcrumbItems } from ".";
import UserForm from "./UserForm";

const AddUser = () => {
  return (
    <ModuleLayout title="Thêm tài khoản" breadcrumbItems={addUserBreadcrumbItems}>
      <div className="px-10 overflow-y-auto pb-10">
        <p className="text-2xl font-bold pl-1">Thêm tài khoản</p>
        <UserForm />
      </div>
    </ModuleLayout>
  );
};

export default AddUser;
