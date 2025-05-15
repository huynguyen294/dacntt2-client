import CourseForm from "./components/CourseForm";
import { FormPage, ModuleLayout } from "@/layouts";
import { editCourseBreadcrumbItems } from "./constants";
import { useParams } from "react-router";
import { courseApi, getServerErrorMessage } from "@/apis";
import { useQuery } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { useEffect } from "react";
import { Spinner } from "@heroui/spinner";

const EditCourse = () => {
  const { id } = useParams();

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["courses", id],
    queryFn: () => courseApi.getById(id),
  });

  useEffect(() => {
    if (isError) addToast({ color: "danger", title: "Lỗi!", description: getServerErrorMessage(error) });
  }, [isError, error]);

  return (
    <ModuleLayout breadcrumbItems={editCourseBreadcrumbItems}>
      <FormPage title="Sửa khóa học">
        {isLoading && (
          <div className="h-80 grid place-items-center">
            <Spinner variant="wave" />
          </div>
        )}
        {data?.item && <CourseForm editMode defaultValues={data.item} />}
      </FormPage>
    </ModuleLayout>
  );
};

export default EditCourse;
