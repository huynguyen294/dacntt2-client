import { PasswordInput } from "@/components/common";
import { AuthLayout } from "@/components/layouts";
import { useNavigate } from "@/hooks";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("handleSubmit");
  };

  return (
    <AuthLayout key="login-page">
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex w-full max-w-sm sm:max-w-md flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
          <div className="flex flex-col gap-1">
            <h1 className="text-foreground-500 text-large font-medium">Đăng nhập</h1>
          </div>
          <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={handleSubmit}>
            <Input isRequired label="Email" name="email" type="email" variant="bordered" />
            <PasswordInput isRequired label="Mật khẩu" name="password" variant="bordered" />
            <div className="flex w-full items-center justify-between px-1 py-2">
              <Link className="text-default-500" href="#" size="sm">
                Quên mật khẩu?
              </Link>
            </div>
            <Button className="w-full" color="primary" type="submit">
              Đăng nhập
            </Button>
          </Form>
          <div className="flex items-center gap-4 py-2">
            <Divider className="flex-1" />
            <p className="shrink-0 text-tiny text-default-500">Hoặc</p>
            <Divider className="flex-1" />
          </div>
          <div className="flex flex-col gap-2">
            <Button startContent={<FontAwesomeIcon icon={faGoogle} />} variant="bordered">
              Đăng nhập bằng Google
            </Button>
          </div>
          <p className="text-foreground-500 text-center text-small">
            Bạn chưa tài khoản ?&nbsp;
            <Link href="#" size="sm" onClick={() => navigate("/register")}>
              Đăng ký
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
