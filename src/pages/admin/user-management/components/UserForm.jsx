/* eslint-disable no-unused-vars */
import { Collapse, CurrencyInput, PasswordInput } from "@/components/common";
import { UserBasicFields } from "@/components";
import { Select, SelectItem } from "@heroui/select";
import { useState } from "react";
import { Button } from "@heroui/button";
import { Plus, RefreshCcw, Save } from "lucide-react";
import { useNavigate } from "@/hooks";
import { imageApi, userApi } from "@/apis";
import { useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { convertImageSrc } from "@/utils";
import { format } from "date-fns";
import { DATE_FORMAT, EMPLOYEE_STATUS, ROLE_LABELS, ROLE_PALLET, USER_ROLES } from "@/constants";
import { Checkbox } from "@heroui/checkbox";
import { Input, Textarea } from "@heroui/input";
import { DatePicker } from "@heroui/date-picker";
import { useParams } from "react-router";
import { parseDate } from "@internationalized/date";
import { useForm, Form } from "react-simple-formkit";

const UserForm = ({ defaultValues = {}, editMode }) => {
  const { role: paramRole } = useParams();
  const { id: userId, imageUrl, password, ...removed } = defaultValues;
  removed.dateOfBirth = removed.dateOfBirth && format(removed.dateOfBirth, DATE_FORMAT);
  removed.startDate = removed.startDate && format(removed.startDate, DATE_FORMAT);
  removed.password = "";
  removed.passwordConfirm = "";
  defaultValues = removed;

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [role, setRole] = useState(defaultValues.role || paramRole || "student");

  const [registering, setRegistering] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [imgUrl, setImgUrl] = useState(convertImageSrc(imageUrl));
  const [deletedImg, setDeletedImg] = useState(null);

  // handle for date
  const form = useForm({ numberFields: ["salary"] });
  const { isError, isDirty, errors, actions } = form;

  const handleSubmit = async (data) => {
    const { passwordConfirm, ...payload } = data;

    setRegistering(true);
    let resultImg;
    if (imgUrl.file) {
      resultImg = await imageApi.save(imgUrl, "avatar");
      payload.imageUrl = resultImg.url;
    } else if (deletedImg) {
      resultImg = await imageApi.delete(deletedImg);
      payload.imageUrl = null;
    }

    if (resultImg && !resultImg.ok) {
      addToast({
        color: "danger",
        title: "Lưu ảnh thất bại!",
        description: "Gặp sự cố khi lưu ảnh, vui lòng thử lại!",
      });
      setRegistering(false);
      return;
    }

    const { role } = data;
    if (editMode) {
      const { passwordConfirm, ...removed } = defaultValues;
      const result = await userApi.update(userId, { ...removed, ...payload }, { role });
      if (result.ok) {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        navigate("/admin/user-management/" + paramRole);
      } else {
        addToast({ color: "danger", title: "Lỗi tạo tài khoản", description: result.message });
      }
      return;
    }

    const result = await userApi.create(payload, { role });
    if (result.ok) {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/admin/user-management/" + paramRole);
    } else {
      addToast({ color: "danger", title: "Lỗi sửa tài khoản", description: result.message });
    }

    setRegistering(false);
  };

  return (
    <Form form={form} className="mt-3 space-y-4" onSubmit={handleSubmit}>
      <Collapse showDivider defaultExpanded variant="splitted" title="THÔNG TIN CƠ BẢN">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-start gap-4 pb-4">
          <UserBasicFields
            form={form}
            img={imgUrl}
            onImgChange={setImgUrl}
            onImgDelete={(id) => setDeletedImg(id)}
            defaultValues={defaultValues}
          />
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
            isRequired={!editMode || resetPassword ? true : false}
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
            isRequired={!editMode || resetPassword ? true : false}
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
              isRequired
              name="employmentType"
              defaultSelectedKeys={defaultValues.employmentType && new Set([defaultValues.employmentType])}
              onChange={actions.instantChange}
              size="lg"
              variant="bordered"
              label="Loại lao động"
              radius="sm"
              labelPlacement="outside"
              placeholder="Chính thức, thời vụ..."
            >
              <SelectItem key={"Nhân viên chính thức"}>Nhân viên chính thức</SelectItem>
              <SelectItem key={"Nhân viên bán thời gian"}>Nhân viên bán thời gian</SelectItem>
              <SelectItem key={"Nhân viên thời vụ"}>Nhân viên thời vụ</SelectItem>
            </Select>
            <CurrencyInput
              autoFocus
              isRequired
              name="salary"
              size="lg"
              variant="bordered"
              defaultValue={defaultValues.salary || 0}
              label="Lương cơ bản"
              radius="sm"
              labelPlacement="outside"
              placeholder="Nhập số tiền"
            />
            <DatePicker
              onChange={actions.instantChange}
              defaultValue={
                defaultValues.startDate
                  ? parseDate(format(defaultValues.startDate, DATE_FORMAT))
                  : parseDate(format(new Date(), DATE_FORMAT))
              }
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
              defaultValue={defaultValues.major}
              isRequired
              name="major"
              size="lg"
              variant="bordered"
              label="Chuyên môn"
              radius="sm"
              labelPlacement="outside"
              placeholder="Tiếng Anh, Tin học..."
            />
            <Input
              autoFocus
              defaultValue={defaultValues.certificates}
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
              name="status"
              isRequired
              onChange={actions.instantChange}
              defaultSelectedKeys={
                defaultValues.status ? new Set([defaultValues.status]) : new Set([EMPLOYEE_STATUS.active])
              }
              size="lg"
              variant="bordered"
              label="Trạng thái"
              radius="sm"
              labelPlacement="outside"
              placeholder="Đang làm, đã nghỉ..."
            >
              {Object.values(EMPLOYEE_STATUS).map((status) => (
                <SelectItem key={status}>{status}</SelectItem>
              ))}
            </Select>
            <Textarea
              autoFocus
              defaultValue={defaultValues.note}
              name="note"
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
