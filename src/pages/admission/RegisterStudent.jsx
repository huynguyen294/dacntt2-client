/* eslint-disable react-hooks/exhaustive-deps */
import AdmissionForm from "./components/AdmissionForm";
import Stepper from "./components/Stepper";
import { ModuleLayout } from "@/layouts";
import { registerBreadcrumbItems } from "./constants";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { MoveLeft, MoveRight } from "lucide-react";
import { useNavigate, useReload } from "@/hooks";
import { useSearchParams } from "react-router";
import { useMemo } from "react";
import { ClassAssignment, SearchUser } from "@/components";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { studentConsultationApi, userApi } from "@/apis";
import { Spinner } from "@heroui/spinner";
import { ADMISSION_STATUSES } from "@/constants";
import { addToast } from "@heroui/toast";
import { Loader, Modal } from "@/components/common";
import { ModalBody, ModalHeader, useDisclosure } from "@heroui/modal";

const RegisterStudent = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
  const [lastedReloadedAt, reload] = useReload();

  const step = searchParams.get("step");
  const userId = searchParams.get("userId");
  const admissionId = searchParams.get("admissionId");

  const { isSuccess, data, isLoading } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => (userId ? userApi.getById(userId) : null),
  });

  const {
    isSuccess: admissionSuccess,
    data: admissionData,
    isLoading: admissionLoading,
  } = useQuery({
    queryKey: ["admissions", admissionId],
    queryFn: () => (admissionId ? studentConsultationApi.getById(admissionId) : null),
  });

  const loading = isLoading || admissionLoading;

  const defaultValues = useMemo(() => {
    reload();
    return admissionData?.item || data?.item || {};
  }, [isSuccess, admissionSuccess, admissionData, data]);

  const handleRegistered = async () => {
    addToast({ color: "success", title: "Thành công!", description: "Xếp học sinh vào lớp thành công." });
    const result = await studentConsultationApi.update(admissionId, { status: ADMISSION_STATUSES.done });
    if (result.ok) {
      queryClient.invalidateQueries({ queryKey: ["admissions"] });
      addToast({ title: "Cập nhật trạng thái!", description: "Đã chuyển trạng thái thành đã xếp lớp." });
    } else {
      addToast({ color: "danger", title: "Lỗi!", description: "Có lỗi khi cập nhật trạng thái." });
    }
  };

  return (
    <ModuleLayout breadcrumbItems={registerBreadcrumbItems} className="flex-1 overflow-y-auto pb-10">
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalHeader>Tìm học viên</ModalHeader>
        <ModalBody>
          <SearchUser
            endBtnText="Đăng ký"
            onChange={(id) => {
              navigate(`/register-admission?userId=${id}&step=1`);
              onClose();
            }}
          />
        </ModalBody>
      </Modal>
      <Loader isLoading={loading} />
      {!loading && step && <Stepper step={Number(step)} />}
      {!loading && step === "1" && defaultValues && (
        <div>
          <div className="flex justify-between px-2 sm:px-10 mb-3">
            <Button
              variant="flat"
              radius="full"
              className="shadow-small bg-default-50 font-semibold"
              startContent={<MoveLeft size="21px" />}
              onPress={() => navigate(`/register-admission`)}
            >
              Quay lại
            </Button>
            <Button
              isDisabled={defaultValues.status !== ADMISSION_STATUSES.accepted}
              variant="flat"
              radius="full"
              className="shadow-small bg-default-50 font-semibold"
              endContent={<MoveRight size="21px" />}
              onPress={() => navigate(`/register-admission?step=2&admissionId=${admissionId}`)}
            >
              Tiếp theo
            </Button>
          </div>
          <AdmissionForm
            key={lastedReloadedAt}
            defaultValues={defaultValues}
            editMode={Boolean(admissionId)}
            onReload={reload}
          />
        </div>
      )}
      {!loading && step === "2" && (
        <>
          <div className="flex justify-between px-2 sm:px-10 mb-3">
            <Button
              variant="flat"
              radius="full"
              className="shadow-small bg-default-50 font-semibold"
              startContent={<MoveLeft size="21px" />}
              onPress={() => navigate(`/register-admission?step=1&admissionId=${admissionId}`)}
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
            <div className="shadow-large rounded-lg p-4">
              {admissionData && (
                <ClassAssignment isSingleMode studentIds={[admissionData.item.studentId]} onDone={handleRegistered} />
              )}
            </div>
          </div>
        </>
      )}
      {!loading && !step && (
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
                <div className="border-1.5 border-secondary py-1 px-4 rounded-full">
                  <MoveRight className="text-secondary" />
                </div>
              </CardFooter>
            </Card>
          </div>
          <div className="flex-1 w-full h-full flex justify-center sm:justify-start items-start sm:items-center pb-10 pl-0 sm:pb-0 sm:pl-10">
            <Card
              onPress={() => navigate(`/register-admission?step=1`)}
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
                <div className="border-1.5 border-primary py-1 px-4 rounded-full">
                  <MoveRight className="text-primary" />
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </ModuleLayout>
  );
};

export default RegisterStudent;
