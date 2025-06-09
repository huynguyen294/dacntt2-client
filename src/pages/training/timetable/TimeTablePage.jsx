import { ModuleLayout } from "@/layouts";
import { timetableBreadcrumbItems } from "../constants";
import { useTimetable } from "@/hooks";
import { TimeTable, TimetableFilter } from "@/components";
import { useState } from "react";

const TimeTablePage = () => {
  const [value, setValue] = useState({});
  const timeTable = useTimetable(value);

  return (
    <ModuleLayout breadcrumbItems={timetableBreadcrumbItems}>
      <div className="px-2 sm:px-10">
        <TimetableFilter value={value} onChange={setValue} />
      </div>
      <div className="px-2 sm:px-10 mt-4 overflow-y-auto pt-2 pb-6">
        <TimeTable timeTable={timeTable} />
      </div>
    </ModuleLayout>
  );
};

export default TimeTablePage;
