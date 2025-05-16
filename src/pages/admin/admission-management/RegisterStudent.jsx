/* eslint-disable react-hooks/exhaustive-deps */
import AdmissionForm from "./components/AdmissionForm";
import Stepper from "./components/Stepper";
import { ModuleLayout } from "@/layouts";
import { registerBreadcrumbItems } from "./constants";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { MoveLeft, MoveRight } from "lucide-react";
import { useNavigate } from "@/hooks";
import { useSearchParams } from "react-router";
import { useMemo } from "react";
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/modal";
import { ClassAssignment, SearchUser } from "@/components";
import { useQuery } from "@tanstack/react-query";
import { studentConsultationApi, userApi } from "@/apis";
import { Spinner } from "@heroui/spinner";
import { ADMISSION_STATUSES } from "@/constants";
import { Section } from "@/components/common";

const RegisterStudent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  const step = searchParams.get("step");
  const userId = searchParams.get("userId");
  const admissionId = searchParams.get("admissionId");

  const { isSuccess, data, isLoading } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => userId && userApi.getById(userId),
  });

  const {
    isSuccess: admissionSuccess,
    data: admissionData,
    isLoading: admissionLoading,
  } = useQuery({
    queryKey: ["admission", admissionId],
    queryFn: () => admissionId && studentConsultationApi.getById(admissionId),
  });

  const defaultValues = useMemo(() => {
    return admissionData?.item || data?.item;
  }, [isSuccess, admissionSuccess, admissionData, data]);

  return (
    <ModuleLayout breadcrumbItems={registerBreadcrumbItems}>
      {isOpen && (
        <Modal isOpen={true} size="3xl" onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Tìm học viên</ModalHeader>
                <ModalBody>
                  <SearchUser
                    onChange={(id) => {
                      navigate(`/admin/register-admission?userId=${id}&step=1`);
                      onClose();
                    }}
                  />
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
      {(isLoading || admissionLoading) && (
        <div className="h-40 w-full flex justify-center items-center">
          <Spinner variant="wave" />
        </div>
      )}
      {step === "1" && defaultValues && (
        <div className="flex-1 overflow-y-auto pb-10">
          <Stepper />
          <div className="flex justify-between px-2 sm:px-10 mb-3">
            <Button
              variant="flat"
              radius="full"
              className="shadow-small bg-default-50 font-semibold"
              startContent={<MoveLeft size="21px" />}
              onPress={() => navigate("/admin/register-admission")}
            >
              Quay lại
            </Button>
            <Button
              isDisabled={defaultValues.status !== ADMISSION_STATUSES.accepted}
              variant="flat"
              radius="full"
              className="shadow-small bg-default-50 font-semibold"
              endContent={<MoveRight size="21px" />}
              onPress={() => navigate(`/admin/register-admission?step=2&admissionId=${admissionId}`)}
            >
              Tiếp theo
            </Button>
          </div>
          <AdmissionForm key={defaultValues.id} defaultValues={defaultValues} editMode={Boolean(admissionId)} />
        </div>
      )}
      {step === "2" && (
        <div className="flex-1 overflow-y-auto pb-10">
          <Stepper step={2} />
          <div className="flex justify-between px-2 sm:px-10 mb-3">
            <Button
              variant="flat"
              radius="full"
              className="shadow-small bg-default-50 font-semibold"
              startContent={<MoveLeft size="21px" />}
              onPress={() => navigate(`/admin/register-admission?step=1&admissionId=${admissionId}`)}
            >
              Quay lại
            </Button>
            <Button
              isDisabled
              variant="flat"
              radius="full"
              className="shadow-small bg-default-50 font-semibold"
              endContent={<MoveRight size="21px" />}
            >
              Tiếp theo
            </Button>
          </div>
          <div className="px-2 sm:px-10">
            <Section title="Xếp lớp">
              <ClassAssignment />
            </Section>
          </div>
          {/* <AdmissionForm key={defaultValues.id} defaultValues={defaultValues} editMode={Boolean(admissionId)} /> */}
        </div>
      )}
      {!step && (
        <div className="px-2 sm:px-10 flex-1 flex justify-center items-center flex-col sm:flex-row rounded-2xl backdrop-blur-md">
          <div className="flex-1 w-full h-full flex justify-center sm:justify-end items-end sm:items-center pb-10 pr-0 sm:pb-0 sm:pr-10">
            <Card
              onPress={onOpen}
              isPressable
              isHoverable
              isBlurred
              className="bg-gradient-to-br from-primary/10 to-secondary/10 p-4 sm:p-6"
            >
              <CardBody>
                <div className="space-y-1">
                  <p className="font-bold text-2xl text-secondary">Ứng viên cũ</p>
                  <p className="text-foreground-600">Đã có tài khoản trong hệ thống</p>
                </div>
              </CardBody>
              <CardFooter>
                <Button color="secondary" variant="bordered" radius="full" onPress={onOpen}>
                  <MoveRight className="text-secondary" />
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div className="flex-1 w-full h-full flex justify-center sm:justify-start items-start sm:items-center pb-10 pl-0 sm:pb-0 sm:pl-10">
            <Card
              onPress={() => navigate("/admin/register-admission?step=1")}
              isPressable
              isHoverable
              isBlurred
              className="bg-gradient-to-tl from-primary/10 to-secondary/10 p-4 sm:p-6"
            >
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
