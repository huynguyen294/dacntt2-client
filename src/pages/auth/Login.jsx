import { signIn } from "@/apis";
import { Form, PasswordInput } from "@/components/common";
import { AuthLayout } from "@/layouts";
import { useNavigate } from "@/hooks";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState({});

  const handleLogin = async (data) => {
    setSigning(true);
    const result = await signIn(data, navigate);
    if (!result.ok) {
      const validate = {};
      if (result.status === 404) {
        validate.email = result.message;
      } else {
        validate.password = result.message;
      }
      setError(validate);
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
          <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={handleLogin}>
            <Input
              isInvalid={Boolean(error.email)}
              errorMessage={error.email}
              isRequired
              label="Email"
              name="email"
              type="email"
              variant="bordered"
              onBlur={() => setError("")}
            />
            <PasswordInput
              isInvalid={Boolean(error.password)}
              errorMessage={error.password}
              isRequired
              label="Mật khẩu"
              name="password"
              variant="bordered"
              onBlur={() => setError("")}
            />
            <div className="flex w-full items-center justify-between px-1 py-2">
              <Link className="text-default-500" size="sm" onPress={() => navigate("/forget-password")}>
                Quên mật khẩu?
              </Link>
            </div>
            <Button isLoading={signing} className="w-full" color="primary" type="submit">
              Đăng nhập
            </Button>
          </Form>
          <div className="flex items-center gap-4 py-2">
            <Divider className="flex-1" />
            <p className="shrink-0 text-tiny text-default-500">Hoặc</p>
            <Divider className="flex-1" />
          </div>
          <div className="flex flex-col gap-2">
            <Button isLoading={signing} startContent={<FontAwesomeIcon icon={faGoogle} />} variant="bordered">
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
