import CourseForm from "./components/CourseForm";
import { FormPage, ModuleLayout } from "@/layouts";
import { editCoursesBreadcrumbItems } from "./constants";
import { useParams } from "react-router";
import { getCourseById, getServerErrorMessage } from "@/apis";
import { useQuery } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { useEffect } from "react";
import { Spinner } from "@heroui/spinner";

const EditCourse = () => {
  const { id } = useParams();

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["users", id],
    queryFn: () => getCourseById(id),
  });

  useEffect(() => {
    if (isError) addToast({ color: "danger", title: "Lỗi!", description: getServerErrorMessage(error) });
  }, [isError, error]);

  return (
    <ModuleLayout breadcrumbItems={editCoursesBreadcrumbItems}>
      <FormPage title="Sửa khóa học">
        {isLoading && (
          <div className="h-80 grid place-items-center">
            <Spinner variant="wave" />
          </div>
        )}
        {data?.course && <CourseForm editMode defaultValues={data.course} />}
      </FormPage>
    </ModuleLayout>
  );
};

export default EditCourse;
