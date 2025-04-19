import { PasswordInput } from "@/components/common";
import { AuthLayout } from "@/components/layouts";
import { useNavigate } from "@/hooks";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("handleSubmit");
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
            <PasswordInput isRequired label="Nhập lại mật khẩu" name="passwordConfirm" variant="bordered" />
            <Button className="w-full" color="primary" type="submit" size="lg">
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
