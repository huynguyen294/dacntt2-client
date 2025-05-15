import UserForm from "./components/UserForm";
import { getServerErrorMessage, userApi } from "@/apis";
import { useParams, useSearchParams } from "react-router";
import { breadcrumbItemsByRole } from "./constants";
import { ModuleLayout } from "@/layouts";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@heroui/spinner";
import { useEffect } from "react";
import { addToast } from "@heroui/toast";
import { EMPLOYEE_ROLES } from "@/constants";

const EditUser = () => {
  const [search] = useSearchParams();
  const { userId, role } = useParams();
  const userRole = search.get("role");

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => userApi.getById(userId, { refs: EMPLOYEE_ROLES.includes(userRole) }),
  });

  useEffect(() => {
    if (isError) addToast({ color: "danger", title: "Lỗi!", description: getServerErrorMessage(error) });
  }, [isError, error]);

  return (
    <ModuleLayout
      breadcrumbItems={[
        ...breadcrumbItemsByRole[role],
        { label: "Sửa tài khoản", path: `/admin/user-management/${role}/edit/${userId}` },
      ]}
    >
      <div className="px-2 sm:px-10 overflow-y-auto pb-10">
        <p className="text-2xl font-bold pl-1">Sửa tài khoản</p>
        {isLoading && (
          <div className="h-80 grid place-items-center">
            <Spinner variant="wave" />
          </div>
        )}
        {data?.item && <UserForm editMode defaultValues={data.item} />}
      </div>
    </ModuleLayout>
  );
};

export default EditUser;
