import { signUp } from "@/apis";
import { Form, PasswordInput } from "@/components/common";
import { AuthLayout } from "@/layouts";
import { useNavigate } from "@/hooks";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { addToast } from "@heroui/toast";
import { useState } from "react";

const Register = () => {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [registering, setRegistering] = useState(false);

  const changeError = (object) => {
    setErrors((prev) => ({ ...prev, ...object }));
  };

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async (data) => {
    const { passwordConfirm, firstName, lastName, ...payload } = data;
    if (payload.password !== passwordConfirm) {
      changeError({ passwordConfirm: "Mật khẩu không khớp" });
      return;
    }

    setRegistering(true);
    payload.name = `${lastName} ${firstName}`;
    const result = await signUp(payload);
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
          <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={handleSubmit}>
            <div className="flex gap-1 w-full">
              <Input isRequired label="Tên" name="firstName" type="text" variant="bordered" />
              <Input isRequired label="Họ" name="lastName" variant="bordered" />
            </div>
            <Input isRequired label="Email" name="email" type="email" variant="bordered" />
            <PasswordInput isRequired label="Mật khẩu" name="password" variant="bordered" />
            <PasswordInput
              isRequired
              label="Nhập lại mật khẩu"
              name="passwordConfirm"
              variant="bordered"
              isInvalid={Boolean(errors.passwordConfirm)}
              errorMessage={errors.passwordConfirm}
              onBlur={() => clearError("passwordConfirm")}
            />
            <Button isLoading={registering} className="w-full" color="primary" type="submit" size="lg">
              Đăng ký
            </Button>
          </Form>
          <p className="text-foreground-500 text-center text-small">
            Bạn đã có tài khoản ?&nbsp;
            <Link href="#" size="sm" onClick={() => navigate("/login")}>
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
