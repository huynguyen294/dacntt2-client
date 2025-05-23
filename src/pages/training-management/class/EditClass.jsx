import ClassForm from "./components/ClassForm";
import { FormPage, ModuleLayout } from "@/layouts";
import { editClassBreadcrumbItems } from "../constants";
import { useParams } from "react-router";
import { classApi, getServerErrorMessage } from "@/apis";
import { useQuery } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { useEffect } from "react";
import { Spinner } from "@heroui/spinner";

const EditClass = () => {
  const { id } = useParams();

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["classes", id],
    queryFn: () => classApi.getById(id),
  });

  useEffect(() => {
    if (isError) addToast({ color: "danger", title: "Lỗi!", description: getServerErrorMessage(error) });
  }, [isError, error]);

  return (
    <ModuleLayout breadcrumbItems={editClassBreadcrumbItems}>
      <FormPage title="Sửa lớp học">
        {isLoading && (
          <div className="h-80 grid place-items-center">
            <Spinner variant="wave" />
          </div>
        )}
        {data?.item && <ClassForm editMode defaultValues={data.item} />}
      </FormPage>
    </ModuleLayout>
  );
};

export default EditClass;
