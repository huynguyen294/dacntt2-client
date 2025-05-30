import { ModuleLayout } from "@/layouts";
import { breadcrumbItemsByRole } from "./constants";
import { useParams } from "react-router";
import UserForm from "./components/UserForm";

const AddUser = () => {
  const { role } = useParams();

  return (
    <ModuleLayout
      breadcrumbItems={[
        ...breadcrumbItemsByRole[role],
        { label: "Thêm tài khoản", path: `/user-management/${role}/add` },
      ]}
    >
      <div className="px-2 sm:px-10 overflow-y-auto pb-10">
        <p className="text-2xl font-bold pl-1">Thêm tài khoản</p>
        <UserForm />
      </div>
    </ModuleLayout>
  );
};

export default AddUser;
