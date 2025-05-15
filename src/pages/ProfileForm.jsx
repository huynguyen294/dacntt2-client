/* eslint-disable no-unused-vars */
import { useState } from "react";
import { convertImageSrc } from "@/utils";
import { Form, useForm } from "react-simple-formkit";
import { UserBasicFields } from "@/components";
import { useAppStore } from "@/state";
import { PasswordInput, Section } from "@/components/common";
import { Checkbox } from "@heroui/checkbox";
import { Button } from "@heroui/button";
import { RefreshCcw, Save } from "lucide-react";
import { imageApi, userApi } from "@/apis";
import { addToast } from "@heroui/toast";
import { useQueryClient } from "@tanstack/react-query";

const ProfileForm = ({ onReload }) => {
  const user = useAppStore("user");
  const queryClient = useQueryClient();

  const [imgUrl, setImgUrl] = useState(convertImageSrc(user.imageUrl));
  const [deletedImg, setDeletedImg] = useState(null);
  const [resetPassword, setResetPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm();
  const { isDirty, isError, errors, actions } = form;

  const handleSubmit = async (data) => {
    const { passwordConfirm, ...payload } = data;

    setSaving(true);
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
      setSaving(false);
      return;
    }

    const { accessToken, ...userData } = user;
    const result = await userApi.updateProfile(user.id, { ...userData, ...payload }, resetPassword);
    if (result.ok) {
      queryClient.invalidateQueries({ queryKey: ["users", user.id] });
      onReload(new Date().toString());
    } else {
      addToast({ color: "danger", title: "Lỗi", description: result.message });
    }

    setSaving(false);
  };

  return (
    <div className="px-2 sm:px-10 overflow-y-auto pb-10 space-y-4">
      <p className="text-2xl font-bold pl-1">Chỉnh sửa hồ sơ</p>
      <Form form={form} onSubmit={handleSubmit} className="space-y-4">
        <Section title="THÔNG TIN CƠ BẢN">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-start gap-4 pb-4">
            <UserBasicFields
              form={form}
              img={imgUrl}
              onImgChange={setImgUrl}
              onImgDelete={(id) => setDeletedImg(id)}
              defaultValues={user}
            />
          </div>
        </Section>
        <Section title="Bảo mật">
          <Checkbox className="mb-2" isSelected={resetPassword} onValueChange={setResetPassword}>
            Đổi mật khẩu
          </Checkbox>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-start gap-4 pb-4">
            <PasswordInput
              isDisabled={!resetPassword}
              isRequired={resetPassword ? true : false}
              name="oldPassword"
              radius="sm"
              size="lg"
              labelPlacement="outside"
              label="Mật khẩu cũ"
              variant="bordered"
              placeholder="Nhập mật khẩu cũ"
              autoComplete="new-password"
            />
            <PasswordInput
              isDisabled={!resetPassword}
              isRequired={resetPassword ? true : false}
              name="password"
              radius="sm"
              size="lg"
              labelPlacement="outside"
              label="Mật khẩu mới"
              variant="bordered"
              placeholder="Nhập mật khẩu mới"
              autoComplete="new-password"
            />
            <PasswordInput
              isDisabled={!resetPassword}
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
        </Section>
        <div className="space-x-4">
          <Button
            isLoading={saving}
            isDisabled={isError}
            type="submit"
            startContent={<Save size="20px" />}
            className="shadow-xl"
            color="primary"
          >
            {"Lưu thay đổi"}
          </Button>
          <Button
            isDisabled={!isDirty}
            type="reset"
            startContent={<RefreshCcw size="16px" />}
            className="shadow-xl"
            variant="flat"
          >
            Đặt lại
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ProfileForm;
