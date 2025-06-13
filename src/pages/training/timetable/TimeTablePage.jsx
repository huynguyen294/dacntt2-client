import { ModuleLayout } from "@/layouts";
import { timetableBreadcrumbItems } from "../constants";
import { useTimetable } from "@/hooks";
import { TimeTable, TimetableFilter } from "@/components";
import { useState } from "react";
import { useAppStore } from "@/state";

const TimeTablePage = ({ breadcrumbItems = timetableBreadcrumbItems }) => {
  const [value, setValue] = useState({});
  const user = useAppStore("user");
  const timeTable = useTimetable(user?.role === "teacher" ? { teacherId: user?.id } : value);

  return (
    <ModuleLayout breadcrumbItems={breadcrumbItems}>
      {["admin", "finance-officer"].includes(user?.role) && (
        <div className="px-2 sm:px-10">
          <TimetableFilter value={value} onChange={setValue} />
        </div>
      )}
      <div className="px-2 sm:px-10 mt-4 overflow-y-auto pt-2 pb-6">
        <TimeTable timeTable={timeTable} />
      </div>
    </ModuleLayout>
  );
};

export default TimeTablePage;
