import { classApi } from "@/apis";
import { ORDER_BY_NAME } from "@/constants";
import { useMetadata } from "@/hooks";
import { getClassSchedule } from "@/utils/class";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useParams } from "react-router";

const useClassData = (classId) => {
  const { id } = useParams();
  if (!classId) classId = id;

  const { shiftObj } = useMetadata();
  const { isLoading, data } = useQuery({
    queryKey: ["classes", id, "refs=true"],
    queryFn: () => classApi.getById(id, { refs: true }),
  });

  const { isLoading: studentLoading, data: studentData } = useQuery({
    queryKey: ["classes", id, "students", "refFields=:full"],
    queryFn: () => classApi.getClassStudents(id, ORDER_BY_NAME, ["refFields=:full"]),
  });

  const schedules = useMemo(() => {
    if (!data) return;
    const dates = getClassSchedule(data.item);
    const shift = shiftObj[data.item.shiftId];
    const teacher = data.refs.teacher;

    return dates.map((date) => ({ date, shift, teacher }));
  }, [data]);

  const loading = isLoading || studentLoading;
  const ready = Boolean(data) && Boolean(studentData);

  return { loading, schedules, ready, data, shiftObj, students: studentData?.students || [] };
};

export default useClassData;
