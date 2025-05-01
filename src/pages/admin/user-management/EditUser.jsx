import { getServerErrorMessage, getUserById } from "@/apis";
import { useParams } from "react-router";
import { breadcrumbItemsByRole } from ".";
import { ModuleLayout } from "@/layouts";
import { useQuery } from "@tanstack/react-query";
import UserForm from "./UserForm";
import { Spinner } from "@heroui/spinner";
import { Ban } from "lucide-react";
import { useEffect } from "react";
import { addToast } from "@heroui/toast";

const EditUser = () => {
  const { role, userId } = useParams();

  console.log({ role, userId });

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => getUserById(userId),
  });

  useEffect(() => {
    if (isError) addToast({ color: "danger", title: "Error!", description: getServerErrorMessage(error) });
  }, [isError, error]);

  return (
    <ModuleLayout
      breadcrumbItems={[
        ...breadcrumbItemsByRole[role || "admin"],
        { label: "Sửa tài khoản", path: `/admin/user-management/${role}/edit/${userId}` },
      ]}
    >
      <div className="px-10 overflow-y-auto pb-10">
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
