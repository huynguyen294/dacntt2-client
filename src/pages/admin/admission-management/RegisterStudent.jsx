import AdmissionForm from "./components/AdmissionForm";
import Stepper from "./components/Stepper";
import { ModuleLayout } from "@/layouts";
import { registerBreadcrumbItems } from "./constants";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { MoveRight } from "lucide-react";
import { useNavigate } from "@/hooks";
import { useSearchParams } from "react-router";
import { useState } from "react";

const RegisterStudent = () => {
  const [searchParams] = useSearchParams();
  const [defaultValues, setDefaultValues] = useState();
  const navigate = useNavigate();

  const step = searchParams.get("step");

  return (
    <ModuleLayout breadcrumbItems={registerBreadcrumbItems}>
      {step === "1" && (
        <div className="flex-1 overflow-y-auto pb-10">
          <Stepper />
          <AdmissionForm defaultValues={defaultValues} />
        </div>
      )}
      {step === "2" && <AdmissionForm />}
      {!step && (
        <div className="px-2 sm:px-10 flex-1 flex justify-center items-center flex-col sm:flex-row rounded-2xl backdrop-blur-md">
          <div className="flex-1 w-full h-full flex justify-center sm:justify-end items-end sm:items-center pb-10 pr-0 sm:pb-0 sm:pr-10">
            <Card isHoverable isBlurred className="bg-gradient-to-br from-primary/10 to-secondary/10 p-4 sm:p-6">
              <CardBody>
                <div className="space-y-1">
                  <p className="font-bold text-2xl text-secondary">Ứng viên cũ</p>
                  <p className="text-foreground-600">Đã có tài khoản trong hệ thống</p>
                </div>
              </CardBody>
              <CardFooter>
                <Button color="secondary" variant="bordered" radius="full">
                  <MoveRight className="text-secondary" />
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div className="flex-1 w-full h-full flex justify-center sm:justify-start items-start sm:items-center pb-10 pl-0 sm:pb-0 sm:pl-10">
            <Card isHoverable isBlurred className="bg-gradient-to-tl from-primary/10 to-secondary/10 p-4 sm:p-6">
              <CardBody>
                <div className="space-y-1">
                  <p className="font-bold text-2xl text-primary">Ứng viên mới</p>
                  <p className="text-foreground-600">Chưa có tài khoản trong hệ thống</p>
                </div>
              </CardBody>
              <CardFooter>
                <Button
                  onPress={() => navigate("/admin/register-admission?step=1")}
                  color="primary"
                  variant="bordered"
                  radius="full"
                >
                  <MoveRight className="text-primary" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </ModuleLayout>
  );
};

export default RegisterStudent;
