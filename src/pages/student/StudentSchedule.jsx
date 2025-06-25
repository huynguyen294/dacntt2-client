import { ModuleLayout } from "@/layouts";
import { TimeTable } from "@/components";
import { useState } from "react";
import { defaultWeekCalendarValue } from "@/constants";
import { arrayToObject } from "@/utils";
import { COLORS } from "@/constants/palette";
import { useStudentStore } from "@/state";

const StudentSchedule = () => {
  const { schedules, classes, teachers, shifts } = useStudentStore(["schedules", "classes", "teachers", "shifts"]);
  const [value, setValue] = useState(defaultWeekCalendarValue);

  const classColors = classes.reduce((acc, c, index) => ({ ...acc, [c.id]: COLORS[index] }), []);
  const classObj = arrayToObject(classes);
  const teacherObj = arrayToObject(teachers);
  const shiftObj = arrayToObject(shifts);

  return (
    <ModuleLayout breadcrumbItems={[{ label: "Thời khóa biểu" }]} className="min-w-[800px] overflow-x-auto">
      <div className="px-2 sm:px-10">
        <TimeTable
          timeTable={{ ready: true, shiftObj, value, setValue, schedules, classColors, classObj, teacherObj }}
        />
      </div>
    </ModuleLayout>
  );
};

export default StudentSchedule;
