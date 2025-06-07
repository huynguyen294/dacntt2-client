import { ModuleLayout } from "@/layouts";
import { timetableBreadcrumbItems } from "../training/constants";
import { TimeTable } from "@/components";
import { useAppStore } from "@/state";

const StudentSchedule = () => {
  const user = useAppStore("user");
  return (
    <ModuleLayout breadcrumbItems={timetableBreadcrumbItems}>
      <div className="px-2 sm:px-10">
        <TimeTable studentId={user.id} />
      </div>
    </ModuleLayout>
  );
};

export default StudentSchedule;
