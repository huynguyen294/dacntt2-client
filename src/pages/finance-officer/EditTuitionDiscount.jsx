import TuitionDiscountForm from "./components/TuitionDiscountForm";
import { FormPage, ModuleLayout } from "@/layouts";
import { useParams } from "react-router";
import { getServerErrorMessage, tuitionDiscountApi } from "@/apis";
import { useQuery } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { useEffect } from "react";
import { Spinner } from "@heroui/spinner";
import { editTuitionDiscountBreadcrumbItems } from "./constants";

const EditTuitionDiscount = () => {
  const { id } = useParams();

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["tuition-discounts", id],
    queryFn: () => tuitionDiscountApi.getById(id),
  });

  useEffect(() => {
    if (isError) addToast({ color: "danger", title: "Lỗi!", description: getServerErrorMessage(error) });
  }, [isError, error]);

  return (
    <ModuleLayout breadcrumbItems={editTuitionDiscountBreadcrumbItems}>
      <FormPage title="Sửa miễn giảm">
        {isLoading && (
          <div className="h-80 grid place-items-center">
            <Spinner variant="wave" />
          </div>
        )}
        {data?.item && <TuitionDiscountForm editMode defaultValues={data.item} />}
      </FormPage>
    </ModuleLayout>
  );
};

export default EditTuitionDiscount;
