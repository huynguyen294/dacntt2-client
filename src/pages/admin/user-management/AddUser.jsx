import { ModuleLayout } from "@/components/layouts";
import { addUserBreadcrumbItems } from ".";

const AddUser = () => {
  return (
    <ModuleLayout title="Thêm tài khoản" breadcrumbItems={addUserBreadcrumbItems}>
      <div className="px-10">
        <p className="text-xl font-bold">Thêm tài khoản</p>
        <ul>
          <li>- Thông tin cơ bản</li>
          <li>- Ảnh đại diện</li>
          <li>- Thông tin chi tiết</li>
        </ul>
      </div>
    </ModuleLayout>
  );
};

export default AddUser;
