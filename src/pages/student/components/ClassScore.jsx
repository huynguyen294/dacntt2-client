import { ModuleLayout } from "@/layouts";
import { studentClassBreadcrumbItems } from "../constants";
import { useParams } from "react-router";
import { Divider } from "@heroui/divider";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { SquareArrowOutUpRight } from "lucide-react";
import { arrayToObject } from "@/utils";
import { EXERCISE_STATUSES } from "@/constants";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Tooltip } from "@heroui/tooltip";
import { useNavigate } from "@/hooks";
import { useAppStore, useStudentStore } from "@/state";
import { EmptyMessage } from "@/components";

const ClassScore = () => {
  const navigate = useNavigate();
  const { classId } = useParams();

  const user = useAppStore("user");
  const { classExercises, classExerciseScores } = useStudentStore(["classes", "classExercises", "classExerciseScores"]);
  const scores = arrayToObject(classExerciseScores, "exerciseId");
  const exercises = classExercises.filter((ce) => ce.classId === +classId && !ce.isDraft && !ce.releaseDay);

  return (
    <div className="container max-w-3xl mx-auto px-2 sm:px-10">
      <>
        <div className="p-2 sm:p-10 flex gap-2 sm:gap-4">
          <Avatar src={user.imageUrl} className="size-10 sm:size-20" />
          <p className="text-3xl">{user.name}</p>
        </div>
        <Divider />
      </>
      <div className="py-6 space-y-3">
        {!exercises?.length && <EmptyMessage message="Chưa có bài tập nào" />}
        {[...exercises].reverse().map((exercise) => {
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
    </div>
  );
};

export default ClassScore;
