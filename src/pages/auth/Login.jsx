import { googleSignIn, signIn } from "@/apis";
import { PasswordInput } from "@/components/common";
import { AuthLayout } from "@/layouts";
import { useNavigate } from "@/hooks";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { useState } from "react";
import { Form, useForm } from "react-simple-formkit";
import { addToast } from "@heroui/toast";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate(false);
  const [signing, setSigning] = useState(false);

  const form = useForm();
  const { isDirty, isError, errors, actions } = form;

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setSigning(true);
      const result = await googleSignIn(tokenResponse, navigate);
      if (!result.ok) {
        addToast({ classNames: { base: "dark" }, color: "danger", title: "Lỗi!", description: result.message });
      }
      setSigning(false);
    },
    onError: (e) => console.log(e),
  });

  const handleLogin = async (data) => {
    setSigning(true);
    const result = await signIn(data, navigate);
    if (!result.ok) {
      addToast({ classNames: { base: "dark" }, color: "danger", title: "Lỗi!", description: result.message });
    }
    setSigning(false);
  };

  return (
    <AuthLayout key="login-page">
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex w-full max-w-sm sm:max-w-md flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
          <div className="flex flex-col gap-1">
            <h1 className="text-foreground-500 text-large font-medium">Đăng nhập</h1>
          </div>
          <Form form={form} className="flex flex-col gap-3" onSubmit={handleLogin}>
            <Input
              autoFocus
              isInvalid={Boolean(errors.email)}
              errorMessage={errors.email}
              isRequired
              label="Email"
              name="email"
              type="email"
              variant="bordered"
              onBlur={actions.checkValidity}
            />
            <PasswordInput
              isInvalid={Boolean(errors.password)}
              errorMessage={errors.password}
              isRequired
              label="Mật khẩu"
              name="password"
              variant="bordered"
              onBlur={actions.checkValidity}
            />
            <div className="flex w-full items-center justify-between px-1 py-2">
              <Link className="text-default-500" size="sm" onPress={() => navigate("/forget-password")}>
                Quên mật khẩu?
              </Link>
            </div>
            <Button
              isDisabled={!isDirty || isError}
              isLoading={signing}
              className="w-full"
              color="primary"
              type="submit"
            >
              Đăng nhập
            </Button>
          </Form>
          <div className="flex items-center gap-4 py-2">
            <Divider className="flex-1" />
            <p className="shrink-0 text-tiny text-default-500">Hoặc</p>
            <Divider className="flex-1" />
          </div>
          <div className="flex flex-col gap-2">
            <Button
              isLoading={signing}
              onPress={login}
              startContent={<FontAwesomeIcon icon={faGoogle} />}
              variant="bordered"
            >
              Đăng nhập bằng Google
            </Button>
          </div>
          <p className="text-foreground-500 text-center text-small">
            Bạn chưa tài khoản ?&nbsp;
            <Link href="#" size="sm" onPress={() => navigate("/register")}>
              Đăng ký
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
