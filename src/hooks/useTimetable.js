import { classApi, enrollmentApi, scheduleApi, userApi } from "@/apis";
import { DATE_FORMAT, defaultWeekCalendarValue, EMPLOYEE_STATUS } from "@/constants";
import { useMetadata, useServerList } from "@/hooks";
import { arrayToObject, unique } from "@/utils";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { COLORS } from "@/constants/palette";

const useTimetable = ({ generalMode = null, studentId = null, teacherId = null, classId = null } = {}) => {
  const [value, setValue] = useState(defaultWeekCalendarValue);
  const metadata = useMetadata();
  const teacherList = useServerList("users", userApi.get, {
    filters: { role: "teacher", status: EMPLOYEE_STATUS.active },
    otherParams: ["role=teacher"],
    paging: false,
  });
  const classList = useServerList("classes", classApi.get, {
    filters: {
      openingDay: { lte: format(new Date(), DATE_FORMAT) },
      closingDay: { gte: format(new Date(), DATE_FORMAT) },
    },
    paging: false,
  });
  const scheduleList = useServerList("class-schedules", classList.ready && scheduleApi.get, {
    filters: { classId: classList.list.map((c) => c.id) },
    otherParams: ["refs=true"],
    paging: false,
  });
  const enrResult = useQuery({
    queryKey: ["enrollments", "by-student", studentId],
    queryFn: () => studentId && enrollmentApi.getByStudents([studentId]),
  });

  const classColors = classList.list.reduce((acc, c, index) => ({ ...acc, [c.id]: COLORS[index] }), []);
  const studentClasses = enrResult.data ? enrResult.data.rows.map((r) => r.classId) : [];

  const ready = classList.ready && scheduleList.ready && teacherList.ready && Boolean(metadata.shifts);
  const isLoading = classList.isLoading && scheduleList.isLoading && teacherList.isLoading && metadata.loading;
  const classObj = arrayToObject(classList.list);
  const teacherObj = arrayToObject(teacherList.list);

  const filteredSchedules = useMemo(() => {
    // default mode
    if (!generalMode) {
      return scheduleList.list.filter((s) => {
        const sDate = new Date(s.date);
        if (sDate < new Date(value.startDate) || sDate > new Date(value.endDate)) return;

        let valid = true;
        if (teacherId) valid = s.teacherId === teacherId;
        if (studentId) valid = studentClasses.includes(s.classId);
        if (classId) valid = s.classId === classId;

        return valid;
      });
    }

    // general mode
    const filtered = unique(scheduleList.list, (i) => `${i.classId},${i.shiftId}`);
    return filtered.filter((s) => {
      let valid = true;
      if (teacherId) valid = s.teacherId === teacherId;
      if (studentId) valid = studentClasses.includes(s.classId);
      if (classId) valid = s.classId === classId;
      return valid;
    });
  }, [generalMode, value, classId, studentId, teacherId, enrResult.data, scheduleList.list]);

  const multipleMode = !studentId && !teacherId && !classId;

  return {
    ready,
    value,
    classId,
    teacherId,
    studentId,
    setValue,
    multipleMode,
    generalMode,
    classColors,
    isLoading,
    classObj,
    teacherObj,
    schedules: filteredSchedules,
  };
};

export default useTimetable;
