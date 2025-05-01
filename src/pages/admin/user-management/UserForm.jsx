/* eslint-disable no-unused-vars */
import { Collapse, Form, PasswordInput } from "@/components/common";
import { UserBasicFields } from "@/components";
import { Select, SelectItem } from "@heroui/select";
import { useState } from "react";
import { Button } from "@heroui/button";
import { Plus, RefreshCcw, Save } from "lucide-react";
import { useForm, useNavigate } from "@/hooks";
import { createUser, updateUser } from "@/apis";
import { useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { convertImageSrc } from "@/utils";
import { format } from "date-fns";
import { DATE_FORMAT, ROLE_LABELS, ROLE_PALLET, USER_ROLES } from "@/constants";
import { Checkbox } from "@heroui/checkbox";
import { Input, Textarea } from "@heroui/input";
import { DatePicker } from "@heroui/date-picker";
import { useParams } from "react-router";

const UserForm = ({ defaultValues = {}, editMode }) => {
  const { role: paramRole } = useParams();
  const { id: userId, imageUrl, password, ...removed } = defaultValues;
  removed.dateOfBirth = removed.dateOfBirth && format(removed.dateOfBirth, DATE_FORMAT);
  removed.password = "";
  removed.passwordConfirm = "";

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [role, setRole] = useState(defaultValues.role || paramRole || "student");

  const [registering, setRegistering] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
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
        navigate("/admin/user-management/" + role);
      } else {
        addToast({ color: "danger", title: "Lỗi tạo tài khoản", description: result.message });
      }
      return;
    }

    const result = await createUser(payload);
    if (result.ok) {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/admin/user-management/" + role);
    } else {
      addToast({ color: "danger", title: "Lỗi tạo tài khoản", description: result.message });
    }
    setRegistering(false);
  };

  return (
    <Form form={form} className="mt-3 space-y-4" onSubmit={handleSubmit}>
      <Collapse showDivider defaultExpanded variant="splitted" title="THÔNG TIN CƠ BẢN">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-start gap-4 pb-4">
          <UserBasicFields form={form} img={imgUrl} onImgChange={setImgUrl} defaultValues={defaultValues} />
        </div>
      </Collapse>
      <Collapse showDivider defaultExpanded variant="splitted" title="THÔNG TIN TÀI KHOẢN">
        {editMode && (
          <Checkbox className="mb-2" isSelected={resetPassword} onValueChange={setResetPassword}>
            Đặt lại mật khẩu
          </Checkbox>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-start gap-4 pb-4">
          <Select
            autoFocus
            name="role"
            isRequired
            defaultSelectedKeys={defaultValues.role && new Set([defaultValues.role])}
            startContent={
              <div
                style={{ "--current-color": ROLE_PALLET[role] }}
                className="size-2 bg-[var(--current-color)] rounded-full mr-1"
              />
            }
            selectedKeys={new Set([role])}
            onSelectionChange={(newValue) => setRole(newValue.currentKey)}
            onChange={actions.instantChange}
            size="lg"
            variant="bordered"
            label="Vai trò"
            radius="sm"
            labelPlacement="outside"
          >
            {USER_ROLES.map((id) => (
              <SelectItem
                key={id}
                startContent={
                  <div
                    style={{ "--current-color": ROLE_PALLET[id] }}
                    className="size-2 bg-[var(--current-color)] rounded-full"
                  />
                }
              >
                {ROLE_LABELS[id]}
              </SelectItem>
            ))}
          </Select>
          <PasswordInput
            isDisabled={editMode && !resetPassword}
            isRequired={resetPassword ? true : false}
            name="password"
            radius="sm"
            size="lg"
            labelPlacement="outside"
            label="Mật khẩu"
            variant="bordered"
            placeholder="Nhập mật khẩu"
            autoComplete="new-password"
          />
          <PasswordInput
            isDisabled={editMode && !resetPassword}
            isRequired={resetPassword ? true : false}
            name="passwordConfirm"
            radius="sm"
            size="lg"
            labelPlacement="outside"
            label="Nhập lại mật khẩu"
            placeholder="Nhập lại mật khẩu"
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
      {["teacher", "consultant", "finance-officer"].includes(role) && (
        <Collapse showDivider defaultExpanded variant="splitted" title={"THÔNG TIN " + ROLE_LABELS[role]}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-start gap-4 pb-4">
            <Select
              autoFocus
              name="employmentType"
              isRequired
              onChange={actions.instantChange}
              size="lg"
              variant="bordered"
              label="Loại lao động"
              radius="sm"
              labelPlacement="outside"
              placeholder="Chính thức, thời vụ..."
            >
              <SelectItem key={"Chính thức"}>Chính thức</SelectItem>
              <SelectItem key={"Bán thời gian"}>Bán thời gian</SelectItem>
              <SelectItem key={"Thời vụ"}>Thời vụ</SelectItem>
            </Select>
            <Input
              autoFocus
              isRequired
              name="salary"
              size="lg"
              variant="bordered"
              label="Lương cơ bản"
              radius="sm"
              labelPlacement="outside"
              placeholder="Nhập số tiền"
            />
            <DatePicker
              onChange={actions.instantChange}
              // defaultValue={defaultValues.dateOfBirth && parseDate(format(defaultValues.dateOfBirth, DATE_FORMAT))}
              name="startDate"
              calendarProps={{ showMonthAndYearPickers: true }}
              size="lg"
              variant="bordered"
              label="Ngày vào làm"
              radius="sm"
              labelPlacement="outside"
              classNames={{ label: "-mt-1" }}
            />
            <Input
              autoFocus
              isRequired
              name="major"
              size="lg"
              variant="bordered"
              label="Chuyên môn"
              radius="sm"
              labelPlacement="outside"
              placeholder="Toán, Tiếng Anh..."
            />
            <Input
              autoFocus
              isRequired
              name="certificates"
              size="lg"
              variant="bordered"
              label="Bằng cấp"
              radius="sm"
              labelPlacement="outside"
              placeholder="Tốt nghiệp trường, trung tâm..."
            />
            <Select
              autoFocus
              name="employmentType"
              isRequired
              onChange={actions.instantChange}
              size="lg"
              variant="bordered"
              label="Trạng thái"
              radius="sm"
              labelPlacement="outside"
              placeholder="Đang làm, đã nghĩ..."
            >
              <SelectItem key={"Đang làm việc"}>Đang làm việc</SelectItem>
              <SelectItem key={"Tạm nghĩ việc"}>Tạm nghĩ việc</SelectItem>
              <SelectItem key={"Đã nghĩ việc"}>Đã nghĩ việc</SelectItem>
            </Select>
            <Textarea
              autoFocus
              isRequired
              name="certificates"
              size="lg"
              variant="bordered"
              label="Ghi chú (nếu có)"
              radius="sm"
              labelPlacement="outside"
              placeholder="Ghi chú thêm nếu có"
            />
          </div>
        </Collapse>
      )}
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
