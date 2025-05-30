import { FormPage, ModuleLayout } from "@/layouts";
import { useParams } from "react-router";
import { certificateApi, getServerErrorMessage } from "@/apis";
import { useQuery } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { useEffect } from "react";
import { Spinner } from "@heroui/spinner";
import { editCertificateBreadcrumbItems } from "../constants";
import CertificateForm from "./components/CertificateForm";

const EditExam = () => {
  const { id } = useParams();

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["exams", id],
    queryFn: () => certificateApi.getById(id),
  });

  useEffect(() => {
    if (isError) addToast({ color: "danger", title: "Lỗi!", description: getServerErrorMessage(error) });
  }, [isError, error]);

  return (
    <ModuleLayout breadcrumbItems={editCertificateBreadcrumbItems}>
      <FormPage title="Sửa chứng chỉ">
        {isLoading && (
          <div className="h-80 grid place-items-center">
            <Spinner variant="wave" />
          </div>
        )}
        {data?.item && <CertificateForm editMode defaultValues={data.item} />}
      </FormPage>
    </ModuleLayout>
  );
};

export default EditExam;
