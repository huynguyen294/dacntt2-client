import { userApi } from "@/apis";
import { PasswordInput } from "@/components/common";
import { useNavigate } from "@/hooks";
import { AuthLayout } from "@/layouts";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/toast";
import { useState } from "react";
import { Form, useForm } from "react-simple-formkit";

const Register = () => {
  const navigate = useNavigate();
  const [registering, setRegistering] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);

  const form = useForm();
  const { isDirty, isError, actions, errors } = form;

  const handleSubmit = async (data) => {
    const { passwordConfirm, firstName, lastName, ...payload } = data;
    if (payload.password !== passwordConfirm) return;

    setRegistering(true);
    payload.name = `${lastName} ${firstName}`;
    const result = await userApi.signUp(payload);
    if (result.ok) {
      addToast({
        classNames: { base: "dark" },
        color: "success",
        title: "Đăng ký thành công!",
        description: "Vui lòng đăng nhập để tiếp tục",
      });
    } else {
      addToast({
        classNames: { base: "dark" },
        color: "danger",
        title: "Đăng ký thất bại!",
        description: result.message,
      });
    }

    setRegistering(false);
  };

  return (
    <AuthLayout key="register-page">
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex w-full max-w-sm sm:max-w-md flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
          <div className="flex flex-col gap-1">
            <h1 className="text-foreground-500 text-large font-medium">Đăng ký</h1>
          </div>
          <Form form={form} className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <div className="flex gap-1 w-full">
              <Input
                autoFocus
                isRequired
                label="Tên"
                name="firstName"
                type="text"
                variant="bordered"
                onBlur={actions.checkValidity}
              />
              <Input isRequired label="Họ" name="lastName" variant="bordered" onBlur={actions.checkValidity} />
            </div>
            <Input
              isRequired
              label="Email"
              name="email"
              type="email"
              variant="bordered"
              isInvalid={Boolean(errors.email)}
              errorMessage={errors.email}
              endContent={emailChecking && <Spinner size="sm" />}
              onBlur={async (e) => {
                let error = null;
                error = actions.getFieldValidity(e);
                if (error) return actions.changeError("email", error);

                const value = e.target.value;
                setEmailChecking(true);
                const result = await userApi.checkEmailAvailable(value);
                if (!result.ok) error = result.message;
                actions.changeError("email", error);
                setEmailChecking(false);
              }}
            />
            <PasswordInput
              isRequired
              label="Mật khẩu"
              name="password"
              variant="bordered"
              onBlur={actions.checkValidity}
            />
            <PasswordInput
              isRequired
              label="Nhập lại mật khẩu"
              name="passwordConfirm"
              variant="bordered"
              isInvalid={Boolean(errors.passwordConfirm)}
              errorMessage={errors.passwordConfirm}
              onBlur={(e) => {
                let error = null;
                error = actions.getFieldValidity(e);
                if (error) return actions.changeError("passwordConfirm", error);

                const value = e.target.value;
                const password = actions.getFormState().password;
                if (value !== password) error = "Mật khẩu không khớp";
                actions.changeError("passwordConfirm", error);
              }}
            />
            <Button
              isDisabled={!isDirty || isError}
              isLoading={registering}
              className="w-full"
              color="primary"
              type="submit"
              size="lg"
            >
              Đăng ký
            </Button>
          </Form>
          <p className="text-foreground-500 text-center text-small">
            Bạn đã có tài khoản ?&nbsp;
            <Link onPress={() => navigate("/login")} size="sm">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
