import { classApi, scheduleApi } from "@/apis";
import { DATE_FORMAT, ORDER_BY_NAME } from "@/constants";
import { useMetadata } from "@/hooks";
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
    queryFn: () => classApi.getById(classId, ["refs=true"]),
  });

  const { isLoading: studentLoading, data: studentData } = useQuery({
    queryKey: ["classes", classId, "students", "refFields=:full"],
    queryFn: () => classApi.getClassStudents(classId, ORDER_BY_NAME, ["refFields=:full"]),
  });

  const { isLoading: scheduleLoading, data: scheduleData } = useQuery({
    queryKey: ["classes", classId, "schedules", "refs=true"],
    queryFn: () => scheduleApi.get(null, { order: "asc", orderBy: "date" }, null, { classId }, ["refs=true"]),
  });

  const schedules = useMemo(() => {
    if (!data || !scheduleData) return [];
    const { rows = [] } = scheduleData;
    const shift = shiftObj[data.item.shiftId];
    const teacher = data.refs.teacher;

    const result = rows.map((row) => {
      const date = format(new Date(row.date), DATE_FORMAT);
      const result = { ...row, date, shift, teacher };
      return result;
    });

    return result;
  }, [data, scheduleData]);

  const loading = isLoading || studentLoading || scheduleLoading;
  const ready = Boolean(data) && Boolean(studentData) && Boolean(scheduleData);

  return { classId, loading, schedules, ready, data, shiftObj, students: studentData?.students || [] };
};

export default useClassData;
