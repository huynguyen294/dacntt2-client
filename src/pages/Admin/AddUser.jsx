import { ModuleLayout } from "@/components/layouts";

const AddUser = () => {
  return (
    <ModuleLayout
      title="Thêm tài khoản"
      breadcrumbItems={[
        { label: "Quản lý tài khoản", path: "/admin/user-management" },
        { label: "Thêm tài khoản", path: "/admin/user-management/add" },
      ]}
    >
      AddUser
    </ModuleLayout>
  );
};

export default AddUser;
