/* eslint-disable no-unused-vars */
import { Collapse, Form, PasswordInput } from "@/components/common";
import { UserBasicFields } from "@/components";
import { Select, SelectItem } from "@heroui/select";
import { useState } from "react";
import { Button } from "@heroui/button";
import { Plus, RefreshCcw, Save } from "lucide-react";
import { useNavigate } from "@/hooks";
import { signUp, updateUser } from "@/apis";
import { useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { convertImageSrc } from "@/utils";
import { format } from "date-fns";
import { DATE_FORMAT } from "@/constants";
import useForm from "@/hooks/useForm";

const defaultUserFormValues = {
  imageUrl: null,
  password: "",
  passwordConfirm: "",
  role: "student",
  name: "",
  gender: "",
  email: "",
  phoneNumber: "",
  address: "",
  dateOfBirth: null,
};

const UserForm = ({ defaultValues = defaultUserFormValues, editMode }) => {
  const { id: userId, imageUrl, password, ...removed } = defaultValues;
  removed.dateOfBirth = removed.dateOfBirth && format(removed.dateOfBirth, DATE_FORMAT);
  removed.password = "";
  removed.passwordConfirm = "";

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [role, setRole] = useState(defaultValues.role);

  const [registering, setRegistering] = useState(false);
  const [imgUrl, setImgUrl] = useState(convertImageSrc(imageUrl));

  // handle for date
  const form = useForm();
  const { isError, isDirty, errors, actions } = form;

  const handleSubmit = async (data) => {
    const { passwordConfirm, ...payload } = data;

    setRegistering(true);
    if (editMode) {
      const result = await updateUser(userId, payload);
      if (result.ok) {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        navigate("/admin/user-management");
      } else {
        addToast({ color: "danger", title: "Lỗi tạo tài khoản", description: result.message });
      }
    }

    const result = await signUp(payload);
    if (result.ok) {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/admin/user-management");
    } else {
      addToast({ color: "danger", title: "Lỗi tạo tài khoản", description: result.message });
    }
    setRegistering(false);
  };

  return (
    <Form form={form} className="mt-3 space-y-4" onSubmit={handleSubmit}>
      <Collapse showDivider defaultExpanded variant="splitted" title="THÔNG TIN CƠ BẢN">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
          <UserBasicFields form={form} img={imgUrl} onImgChange={setImgUrl} defaultValues={defaultValues} />
        </div>
      </Collapse>
      <Collapse showDivider defaultExpanded variant="splitted" title="BẢO MẬT">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
          <Select
            name="role"
            isRequired
            defaultSelectedKeys={defaultValues.role && new Set([defaultValues.role])}
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
            name="password"
            radius="sm"
            size="lg"
            labelPlacement="outside"
            label="Mật khẩu"
            isRequired
            variant="bordered"
            placeholder="Nhập mật khẩu"
            autoComplete="new-password"
          />
          <PasswordInput
            name="passwordConfirm"
            radius="sm"
            size="lg"
            labelPlacement="outside"
            label="Nhập lại mật khẩu"
            placeholder="Nhập lại mật khẩu"
            isRequired
            variant="bordered"
            isInvalid={Boolean(errors.passwordConfirm)}
            errorMessage={errors.passwordConfirm}
            autoComplete="new-password"
            onBlur={(e) => {
              let passwordConfirmError = "";
              const currentPasswordConfirm = e.target.value;
              const { password } = actions.getFormState();

              if (currentPasswordConfirm !== password) {
                passwordConfirmError = "Mật khẩu không khớp";
              }
              actions.changeError("passwordConfirm", passwordConfirmError);
            }}
          />
        </div>
      </Collapse>
      {/* {role === "teacher" && (
    <Collapse showDivider defaultExpanded variant="splitted" title="THÔNG TIN GIÁO VIÊN"></Collapse>
  )}
  {role === "consultant" && (
    <Collapse showDivider defaultExpanded variant="splitted" title="THÔNG TIN TƯ VẤN VIÊN"></Collapse>
  )}
  {role === "finance-officer" && (
    <Collapse
      showDivider
      defaultExpanded
      variant="splitted"
      title="THÔNG TIN NHÂN VIÊN HỌC VỤ/TÀI CHÍNH"
    ></Collapse>
  )} */}
      <div className="space-x-4">
        <Button
          isLoading={registering}
          isDisabled={isError}
          type="submit"
          startContent={editMode ? <Save size="20px" /> : <Plus size="20px" />}
          className="shadow-xl"
          color="primary"
        >
          {editMode ? "Lưu thay đổi" : "Thêm tài khoản"}
        </Button>
        <Button
          isDisabled={!isDirty}
          onPress={() => actions.reset()}
          startContent={<RefreshCcw size="16px" />}
          className="shadow-xl"
          variant="flat"
        >
          Đặt lại
        </Button>
      </div>
    </Form>
  );
};

export default UserForm;
