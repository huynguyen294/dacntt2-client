import { CLASS_STATUSES } from "@/constants";
import { useMetadata, useNavigate } from "@/hooks";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/state";
import { displayDate, getClassStatus, shiftFormat } from "@/utils";
import { Avatar } from "@heroui/avatar";
import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Calendar, ChevronRight, Info } from "lucide-react";

const UserClasses = ({ classes, shiftObj, teacherObj }) => {
  const navigate = useNavigate();
  const user = useAppStore("user");
  if (!shiftObj) {
    const metadata = useMetadata();
    shiftObj = metadata.ready && metadata.shiftObj;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
      {shiftObj &&
        classes.map((classData) => {
          const shift = shiftObj[classData.shiftId];
          const teacher = user?.role !== "teacher" ? teacherObj[classData.teacherId] : user;
          const status = getClassStatus(classData);

          let statusText = status.text;
          if (statusText === CLASS_STATUSES.active) statusText = "Đang diễn ra";
          if (statusText === CLASS_STATUSES.pending) statusText = `Khai giảng vào ${displayDate(classData.openingDay)}`;

          return (
            <Card
              key={classData.id}
              isPressable={status.text !== CLASS_STATUSES.pending}
              shadow="none"
              className="border"
              onPress={() => navigate(`/classes/${classData.id}`)}
            >
              <div
                className={cn(
                  "p-3 w-full bg-gradient-to-tr from-primary-100 from-70% to-primary-600/70 text-left text-foreground border-b-1",
                  status.text === CLASS_STATUSES.stopped && "from-default-100 to-default-400/60 text-foreground-500",
                  status.text === CLASS_STATUSES.pending && "from-warning-50/60 to-warning-300/50"
                )}
              >
                <p className="text-lg font-semibold">{classData.name}</p>
                <p className="text-small">
                  {shift.name} - ({shiftFormat(shift)})
                </p>
              </div>
              <div
                className={cn(
                  "px-3 relative mt-2",
                  status.text === CLASS_STATUSES.stopped && "[&_p]:!text-foreground-500"
                )}
              >
                <div className="flex flex-col justify-between">
                  <Avatar src={teacher.imageUrl} className="absolute -top-[50%] size-14 right-4 border" />
                  <div className="text-foreground-700 !text-left flex flex-wrap gap-1 items-center text-small font-semibold">
                    <p>Lịch học: </p>
                    {classData.weekDays.split(",").map((day) => (
                      <Chip key={day} size="sm" variant="flat" startContent={<Calendar size="10px" />}>
                        {day !== "CN" ? `Thứ ${day}` : "Chủ nhật"}
                      </Chip>
                    ))}
                  </div>
                  <p className="text-left mt-4 mb-2">{teacher.name}</p>
                </div>
              </div>
              <div className={cn("border-t-1 px-3 py-2 flex justify-between items-center")}>
                <div
                  className={cn(
                    "flex items-center gap-2 !text-small",
                    status.text === CLASS_STATUSES.active && "text-primary",
                    status.text === CLASS_STATUSES.stopped && "text-foreground-500",
                    status.text === CLASS_STATUSES.pending && "text-warning-600"
                  )}
                >
                  <Info size="14px" />
                  {statusText}
                </div>
                {status.text !== CLASS_STATUSES.pending && (
                  <ChevronRight size="18px" className="text-foreground-500" strokeWidth={2.5} />
                )}
              </div>
            </Card>
          );
        })}
    </div>
  );
};

export default UserClasses;
