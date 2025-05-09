import { getServerErrorMessage, getUserByIdWithRole } from "@/apis";
import { useParams, useSearchParams } from "react-router";
import { breadcrumbItemsByRole } from "./constants";
import { ModuleLayout } from "@/layouts";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@heroui/spinner";
import { useEffect } from "react";
import { addToast } from "@heroui/toast";
import UserForm from "./components/UserForm";

const EditUser = () => {
  const [search] = useSearchParams();
  const { userId, role } = useParams();
  const userRole = search.get("role");

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => getUserByIdWithRole(userId, userRole),
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
        {data?.user && <UserForm editMode defaultValues={data.user} />}
      </div>
    </ModuleLayout>
  );
};

export default EditUser;
