import useClassData from "./hooks/useClassData";
import useExerciseData from "./hooks/useExerciseData";
import { ModuleLayout } from "@/layouts";
import { classesManagementBreadcrumbItems } from "../constants";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { exerciseScoreApi } from "@/apis";
import { useMemo } from "react";
import { Divider } from "@heroui/divider";
import { Avatar } from "@heroui/avatar";
import { Loader } from "@/components/common";
import { Button } from "@heroui/button";
import { Info, SquareArrowOutUpRight } from "lucide-react";
import { arrayToObject } from "@/utils";
import { EXERCISE_STATUSES } from "@/constants";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Tooltip } from "@heroui/tooltip";
import { useNavigate } from "@/hooks";

const ClassStudentExercises = () => {
  const navigate = useNavigate();
  const { studentId, id: classId } = useParams();
  const exerciseData = useExerciseData();
  const classData = useClassData();
  const { exercises } = exerciseData;
  const { students } = classData;

  const { isLoading, data } = useQuery({
    queryKey: ["classes", classId, "class-exercise-scores", "all-exercises", studentId],
    queryFn: () => exerciseScoreApi.get(null, null, null, { studentId, classId }),
  });

  const scores = useMemo(() => {
    if (!data) return;
    return arrayToObject(data.rows, "exerciseId");
  }, []);

  const student = useMemo(() => {
    if (!classData.ready) return null;
    return students.find((s) => s.id === +studentId);
  }, [classData.ready]);

  return (
    <ModuleLayout
      breadcrumbItems={[
        ...classesManagementBreadcrumbItems,
        { label: classData?.data?.item?.name || "...", path: "/classes/" + classId },
        { label: "Học viên" },
      ]}
    >
      <Loader isLoading={classData.loading || exerciseData.isLoading || isLoading} />
      <div className="container max-w-3xl mx-auto px-2 sm:px-10">
        {student && (
          <>
            <div className="p-2 sm:p-10 flex gap-2 sm:gap-4">
              <Avatar src={student.imageUrl} className="size-10 sm:size-20" />
              <p className="text-3xl">{student.name}</p>
            </div>
            <Divider />
          </>
        )}
        {data && scores && exerciseData.ready && (
          <div className="py-6 space-y-3">
            {exercises.map((exercise) => {
              const score = scores[exercise.id]?.score;
              const status = scores[exercise.id]?.status || EXERCISE_STATUSES.missing;
              let text = status;
              if (score) text = `${score}/10`;

              return (
                <div key={exercise.id}>
                  <div className="flex justify-between hover:bg-default-50 p-1 rounded-lg">
                    <div>
                      <p className="text-base font-semibold">{exercise.title}</p>
                      <p className="text-foreground-500 text-sm font-semibold">
                        {exercise.dueDay
                          ? `Đến hạn ${format(new Date(exercise.dueDay), "dd MMM", { locale: vi })}`
                          : `Không có ngày đến hạn`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <p
                        className={cn(
                          "text-sm font-semibold text-danger",
                          status === EXERCISE_STATUSES.submitted && "text-primary",
                          score && "text-foreground"
                        )}
                      >
                        {text}
                      </p>
                      <Tooltip content="Xem chi tiết">
                        <Button
                          size="sm"
                          variant="light"
                          isIconOnly
                          radius="full"
                          onPress={() => navigate(`/classes/${classId}/exercise/${exercise.id}`)}
                        >
                          <SquareArrowOutUpRight size="16px" />
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                  <Divider className="my-1" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ModuleLayout>
  );
};

export default ClassStudentExercises;
