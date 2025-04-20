import { ModuleLayout } from "@/layouts";
import { addUserBreadcrumbItems } from ".";
import { Collapse, PasswordInput } from "@/components/common";
import { UserBasicFields } from "@/components";
import { Select, SelectItem } from "@heroui/select";
import { useState } from "react";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Plus, RefreshCcw, Rotate3D } from "lucide-react";

const AddUser = () => {
  const [role, setRole] = useState("student");

  return (
    <ModuleLayout title="Thêm tài khoản" breadcrumbItems={addUserBreadcrumbItems}>
      <div className="px-10 overflow-y-auto pb-10">
        <p className="text-2xl font-bold">Thêm tài khoản</p>
        <Form className="mt-3 space-y-4">
          <Collapse defaultExpanded variant="splitted" title="THÔNG TIN CƠ BẢN">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
              <UserBasicFields />
            </div>
          </Collapse>
          <Collapse defaultExpanded variant="splitted" title="BẢO MẬT">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
              <Select
                isRequired
                selectedKeys={new Set([role])}
                onSelectionChange={(newValue) => setRole(newValue.currentKey)}
                size="lg"
                variant="bordered"
                label="Vai trò"
                radius="sm"
                labelPlacement="outside"
              >
                <SelectItem key="admin">Admin</SelectItem>
                <SelectItem key="student">Học viên</SelectItem>
                <SelectItem key="teacher">Giáo viên</SelectItem>
                <SelectItem key="consultant">Tư vấn viên</SelectItem>
                <SelectItem key="finance-officer">Nhân viên học vụ/tài chính</SelectItem>
              </Select>
              <PasswordInput
                radius="sm"
                size="lg"
                labelPlacement="outside"
                label="Mật khẩu"
                isRequired
                variant="bordered"
                placeholder="Nhập mật khẩu"
              />
              <PasswordInput
                radius="sm"
                size="lg"
                labelPlacement="outside"
                label="Nhập lại mật khẩu"
                placeholder="Nhập lại mật khẩu"
                isRequired
                variant="bordered"
              />
            </div>
          </Collapse>
          {role === "teacher" && <Collapse defaultExpanded variant="splitted" title="THÔNG TIN GIÁO VIÊN"></Collapse>}
          {role === "consultant" && (
            <Collapse defaultExpanded variant="splitted" title="THÔNG TIN TƯ VẤN VIÊN"></Collapse>
          )}
          {role === "finance-officer" && (
            <Collapse defaultExpanded variant="splitted" title="THÔNG TIN NHÂN VIÊN HỌC VỤ/TÀI CHÍNH"></Collapse>
          )}
          <div className="space-x-4">
            <Button startContent={<Plus size="20px" />} className="shadow-xl" color="primary">
              Thêm tài khoản
            </Button>
            <Button startContent={<RefreshCcw size="16px" />} className="shadow-xl" variant="flat">
              Đặt lại
            </Button>
          </div>
        </Form>
      </div>
    </ModuleLayout>
  );
};

export default AddUser;
