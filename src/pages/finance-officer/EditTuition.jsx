import { FormPage, ModuleLayout } from "@/layouts";
import { useParams } from "react-router";
import { getServerErrorMessage, tuitionApi } from "@/apis";
import { useQuery } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { useEffect } from "react";
import { Spinner } from "@heroui/spinner";
import { editTuitionBreadcrumbItems } from "./constants";
import TuitionForm from "./components/TuitionForm";

const EditTuition = () => {
  const { id } = useParams();

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["tuitions", id],
    queryFn: () => tuitionApi.getById(id),
  });

  useEffect(() => {
    if (isError) addToast({ color: "danger", title: "Lỗi!", description: getServerErrorMessage(error) });
  }, [isError, error]);

  return (
    <ModuleLayout breadcrumbItems={editTuitionBreadcrumbItems}>
      <FormPage title="Sửa khóa học">
        {isLoading && (
          <div className="h-80 grid place-items-center">
            <Spinner variant="wave" />
          </div>
        )}
        {data?.item && <TuitionForm editMode defaultValues={data.item} />}
      </FormPage>
    </ModuleLayout>
  );
};

export default EditTuition;
