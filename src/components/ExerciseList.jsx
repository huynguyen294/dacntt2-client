import { Accordion, AccordionItem } from "@heroui/accordion";
import { Button } from "@heroui/button";
import { ClipboardPen, MoveRight } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

const ExerciseList = ({ exercises, dropdown, onAction = () => {} }) => {
  if (!exercises.length) return null;

  return (
    <Accordion variant="splitted" className="mt-4" selectionMode="multiple">
      {exercises.map((exercise) => {
        let helperText = "";
        if (new Date(exercise.releaseDay) > new Date()) {
          helperText = "Đã lên lịch vào " + format(new Date(exercise.releaseDay), "dd MMM", { locale: vi });
        } else if (exercise.isDraft) {
          helperText = "Bản nháp";
        } else if (exercise.dueDay) {
          helperText = "Đến hạn " + format(new Date(exercise.dueDay), "dd MMM", { locale: vi });
        } else {
          helperText = "Đã đăng vào " + format(new Date(exercise.createdAt), "dd MMM", { locale: vi });
        }

        const notAvailable = exercise.isDraft || exercise.releaseDay;

        return (
          <AccordionItem
            classNames={{ trigger: "border-b-1" }}
            startContent={
              <div
                className={cn(
                  "size-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 text-primary-foreground grid place-items-center",
                  notAvailable && "from-foreground-300 to-foreground-300"
                )}
              >
                <ClipboardPen size="18px" />
              </div>
            }
            key={exercise.id}
            aria-label={exercise.title}
            title={
              <div className="w-full flex-1 flex justify-between">
                <p className="text-base font-semibold text-foreground-700">{exercise.title}</p>
                <div className="flex items-center gap-1">
                  <p className={cn("text-[12px] text-foreground-500", notAvailable && "italic font-semibold")}>
                    {helperText}
                  </p>
                  {dropdown}
                </div>
              </div>
            }
            indicator={<div />}
          >
            <div className="pb-4">
              <p className="mb-4 text-small text-foreground-500">
                {!exercise.dueDay
                  ? "Không có ngày đến hạn"
                  : "Đã đăng vào " + format(new Date(exercise.createdAt), "dd MMM", { locale: vi })}
              </p>
              <div dangerouslySetInnerHTML={{ __html: exercise.description }} />
              <Button
                endContent={<MoveRight size="14px" />}
                size="sm"
                className="text-background bg-foreground mt-4"
                onPress={() => onAction(exercise)}
              >
                {notAvailable ? "Chỉnh sửa bài tập" : "Xem chi tiết"}
              </Button>
            </div>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default ExerciseList;
