import { ModuleLayout } from "@/layouts";
import { timetableBreadcrumbItems } from "../training/constants";
import { TimeTable } from "@/components";
import { useState } from "react";
import { defaultWeekCalendarValue } from "@/constants";
import { arrayToObject } from "@/utils";
import { COLORS } from "@/constants/palette";
import { useStudentStore } from "@/state";

const StudentSchedule = () => {
  const { schedules, classes, teachers } = useStudentStore(["schedules", "classes", "teachers"]);
  const [value, setValue] = useState(defaultWeekCalendarValue);

  const classColors = classes.reduce((acc, c, index) => ({ ...acc, [c.id]: COLORS[index] }), []);
  const classObj = arrayToObject(classes);
  const teacherObj = arrayToObject(teachers);

  return (
    <ModuleLayout breadcrumbItems={timetableBreadcrumbItems}>
      <div className="px-2 sm:px-10">
        <TimeTable timeTable={{ ready: true, value, setValue, schedules, classColors, classObj, teacherObj }} />
      </div>
    </ModuleLayout>
  );
};

export default StudentSchedule;
