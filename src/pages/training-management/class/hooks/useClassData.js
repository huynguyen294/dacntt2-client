import { classApi, scheduleApi } from "@/apis";
import { DATE_FORMAT, ORDER_BY_NAME } from "@/constants";
import { useMetadata } from "@/hooks";
import { arrayToObject } from "@/utils";
import { getClassSchedule } from "@/utils/class";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useMemo } from "react";
import { useParams } from "react-router";

const useClassData = (classId) => {
  const { id } = useParams();
  if (!classId) classId = id;

  const { shiftObj } = useMetadata();
  const { isLoading, data } = useQuery({
    queryKey: ["classes", classId, "refs=true"],
    queryFn: () => classApi.getById(classId, { refs: true }),
  });

  const { isLoading: studentLoading, data: studentData } = useQuery({
    queryKey: ["classes", classId, "students", "refFields=:full"],
    queryFn: () => classApi.getClassStudents(classId, ORDER_BY_NAME, ["refFields=:full"]),
  });

  const { isLoading: scheduleLoading, data: scheduleData } = useQuery({
    queryKey: ["classes", classId, "schedules"],
    queryFn: () => scheduleApi.getByClass(classId),
  });

  const schedules = useMemo(() => {
    if (!data || !scheduleData) return;
    const { rows = [] } = scheduleData;
    const scheduleObj = arrayToObject(rows, (row) => format(new Date(row.date), DATE_FORMAT));
    const dates = getClassSchedule(data.item);
    const shift = shiftObj[data.item.shiftId];
    const teacher = data.refs.teacher;

    return dates
      .map((date) => {
        const result = { ...scheduleObj[date], date, shift, teacher };
        return result;
      })
      .filter((d) => !d.isDeleted);
  }, [data, scheduleData]);

  const loading = isLoading || studentLoading || scheduleLoading;
  const ready = Boolean(data) && Boolean(studentData) && Boolean(scheduleData);

  return { loading, schedules, ready, data, shiftObj, students: studentData?.students || [] };
};

export default useClassData;
