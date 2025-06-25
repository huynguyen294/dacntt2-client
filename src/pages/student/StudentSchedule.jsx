import { ModuleLayout } from "@/layouts";
import { TimeTable } from "@/components";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    const siteWidth = 1024;
    const scale = screen.width / siteWidth;

    document
      .querySelector('meta[name="viewport"]')
      .setAttribute("content", "width=" + siteWidth + ", initial-scale=" + scale + "");

    return () => {
      document
        .querySelector('meta[name="viewport"]')
        .setAttribute("content", "width=width=device-width, initial-scale=1.0");
    };
  }, []);

  return (
    <ModuleLayout breadcrumbItems={[{ label: "Thời khóa biểu" }]}>
      <div className="px-2 sm:px-10">
        <TimeTable
          timeTable={{ ready: true, shiftObj, value, setValue, schedules, classColors, classObj, teacherObj }}
        />
      </div>
    </ModuleLayout>
  );
};

export default StudentSchedule;
