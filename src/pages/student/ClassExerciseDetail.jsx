import { DropDown } from "@/components/common";
import { ClipboardPen, Edit, Trash2 } from "lucide-react";
import { useParams } from "react-router";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Divider } from "@heroui/divider";
import { useStudentStore } from "@/state";
import { ModuleLayout } from "@/layouts";
import { cn } from "@/lib/utils";
import { classBreadcrumbItems } from "../constants";

const ClassExerciseDetail = () => {
  const { classId, exerciseId } = useParams();
  const { classes, classExercises, classExerciseScores } = useStudentStore([
    "classes",
    "classExercises",
    "classExerciseScores",
  ]);

  const classData = classes.find((c) => c.id === +classId);
  const exercise = classExercises.find((e) => e.id === +exerciseId);
  const score = classExerciseScores.find((s) => s.exerciseId === +exerciseId);

  return (
    <ModuleLayout
      breadcrumbItems={[
        ...classBreadcrumbItems,
        { label: classData?.name || "...", path: "/classes/" + classId },
        { label: exercise?.title || "..." },
      ]}
    >
      <div className="flex-1 overflow-y-auto container mx-auto max-w-3xl pb-10 mt-4 px-2 sm:px-10">
        {exercise && (
          <div className="flex gap-2 w-full">
            <div
              className={
                "size-10 min-w-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 text-primary-foreground grid place-items-center"
              }
            >
              <ClipboardPen size="18px" />
            </div>
            <div className="w-full">
              <div className="flex justify-between w-full">
                <div className="flex items-center">
                  <p className="text-3xl">{exercise.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  {exercise.dueDay && (
                    <p className="text-foreground-500 text-sm">
                      Đến hạn {format(new Date(exercise.dueDay), "dd MMM", { locale: vi })}
                    </p>
                  )}
                </div>
              </div>
              <p className="mt-2 text-foreground-500">
                Đã đăng vào {format(new Date(exercise.createdAt), "dd MMM", { locale: vi })}
              </p>

              <Divider className="my-4" />
              <div className={cn("mb-2 text-primary font-bold", !score && "text-danger")}>
                {score ? `Điểm: ${score.score}/10` : "Chưa có điểm"}
              </div>
              <div dangerouslySetInnerHTML={{ __html: exercise.description }} />
            </div>
          </div>
        )}
      </div>
    </ModuleLayout>
  );
};

export default ClassExerciseDetail;
