import { useServerList } from "@/hooks";
import { ModuleLayout } from "@/layouts";
import { getClassStatus, orderBy } from "@/utils";
import { classBreadcrumbItems } from "../constants";
import { classApi } from "@/apis";
import { CLASS_STATUSES } from "@/constants";
import { useAppStore } from "@/state";
import { UserClasses } from "@/components";
import { Loader } from "@/components/common";

const TeacherClass = () => {
  const user = useAppStore("user");
  const classList = useServerList("classes", classApi.get, {
    filters: { teacherId: user?.id },
    otherParams: ["fields=:full"],
  });
  const sortedClasses = orderBy(classList.list, (item) => {
    const status = getClassStatus(item);
    if (status.text === CLASS_STATUSES.active) return item.name;
    if (status.text === CLASS_STATUSES.pending) return "z";
    return "y";
  });

  return (
    <ModuleLayout breadcrumbItems={classBreadcrumbItems}>
      <div className="px-2 sm:px-10 overflow-y-auto pb-10">
        <p className="m-4 text-lg font-bold">Lớp học của tôi</p>
        <Loader isLoading={classList.isLoading} />
        {classList.ready && <UserClasses classes={sortedClasses} />}
      </div>
    </ModuleLayout>
  );
};

export default TeacherClass;
