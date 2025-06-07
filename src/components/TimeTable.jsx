import { currentDate, DATE_FORMAT } from "@/constants";
import { useMetadata } from "@/hooks";
import { cn } from "@/lib/utils";
import { alpha, displayDate, shiftFormat, splitTime } from "@/utils";
import { addDays, differenceInMinutes, endOfWeek, format, startOfWeek, subDays } from "date-fns";
import { Loader } from "./common";
import { Button } from "@heroui/button";
import { ArrowRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const weeks = ["Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7", "CN"];
const START_HOUR = 7;
const END_HOUR = 21;
// steps: 5 minutes
const NUM_OF_ROWS = ((END_HOUR - START_HOUR) * 60) / 5;
const ONE_HOUR_ROWS = 12;

const TimeTable = ({ timeTable = {} }) => {
  const { ready, value, setValue, multipleMode, generalMode, classColors, isLoading, classObj, teacherObj, schedules } =
    timeTable;
  const { shiftObj } = useMetadata();

  const Block = ({ schedule, className }) => {
    const shift = shiftObj[schedule.shiftId];
    const teacher = teacherObj[schedule.teacherId];
    const classData = classObj[schedule.classId];

    return (
      <div
        style={{
          "--bg-color": alpha(classColors[schedule.classId], 0.12),
          "--current-color": classColors[schedule.classId],
        }}
        className={cn(
          "w-full bg-[var(--bg-color)] border-l-5 border-[var(--current-color)] rounded-small px-1",
          schedule.isAbsented && "bg-default-100 border-foreground-500",
          className
        )}
      >
        <p
          className={cn("font-bold text-[var(--current-color)]", schedule.isAbsented && "text-foreground line-through")}
        >
          {classData.name}
        </p>
        <p className={cn("text-small text-foreground-700", schedule.isAbsented && "line-through")}>
          ({shiftFormat(shift)})
        </p>
        <p className={cn("text-foreground-700", schedule.isAbsented && "line-through")}>GV: {teacher.name}</p>
        {schedule.isAbsented && <p className="text-danger font-bold pb-1">GV báo vắng!</p>}
      </div>
    );
  };

  const OverlapBlock = ({ schedules }) => {
    return (
      <div className="flex flex-col gap-[0.5px]">
        {schedules.map((schedule, index) => (
          <Block
            key={schedule.id}
            schedule={schedule}
            className={cn(
              "rounded-sm",
              index === schedules.length - 1 && "rounded-b-medium",
              index === 0 && "rounded-t-medium"
            )}
          />
        ))}
      </div>
    );
  };

  const generateRows = (schedules, isToday, label) => {
    const result = new Array(NUM_OF_ROWS)
      .fill()
      .map((_, index) => (
        <td
          key={`r-${label}-${index}`}
          className={cn(
            index % ONE_HOUR_ROWS === ONE_HOUR_ROWS - 1 && index < NUM_OF_ROWS - ONE_HOUR_ROWS && "border-b-1",
            isToday && "bg-secondary-50/50"
          )}
        />
      ));

    if (multipleMode || generalMode) {
      const merged = groupOverlappingSchedules(schedules, shiftObj);
      merged.forEach((gSchedule) => {
        const startIdx = calcIndexFromTime(getStartTimeFromSchedules(gSchedule, shiftObj));
        const endIdx = calcIndexFromTime(getEndTimeFromSchedules(gSchedule, shiftObj));
        result[startIdx] = (
          <td
            key={JSON.stringify(gSchedule.map((s) => s.id))}
            rowSpan={endIdx - startIdx}
            className={cn("!p-[2px] border-b-1", isToday && "bg-secondary-50/50")}
          >
            <OverlapBlock schedules={gSchedule} />
          </td>
        );
        Array.from({ length: endIdx - startIdx - 1 }).forEach((_, index) => {
          result[startIdx + index + 1] = null;
        });
      });
    } else {
      schedules.forEach((schedule) => {
        const shift = shiftObj[schedule.shiftId];
        const startIdx = calcIndexFromTime(shift.startTime);
        const endIdx = calcIndexFromTime(shift.endTime);

        result[startIdx] = (
          <td
            key={schedule.id}
            rowSpan={endIdx - startIdx}
            className={cn("!p-[2px] border-b-1", isToday && "bg-secondary-50/50")}
          >
            <Block schedule={schedule} />
          </td>
        );
        Array.from({ length: endIdx - startIdx - 1 }).forEach((_, index) => {
          result[startIdx + index + 1] = null;
        });
      });
    }

    return result;
  };

  const columns = weeks.map((label, index) => {
    const currentDay = addDays(new Date(value.startDate), index);

    const isToday = format(currentDay, DATE_FORMAT) === format(currentDate, DATE_FORMAT);
    let filtered = schedules.filter((s) => format(new Date(s.date), DATE_FORMAT) === format(currentDay, DATE_FORMAT));

    if (generalMode) {
      filtered = schedules.filter((s) => {
        const day = new Date(s.date).getDay();
        if (day !== 0) return day - 1 === index;
        return index === 6;
      });
    }

    return generateRows(filtered, isToday, label);
  });

  return (
    <>
      <Loader isLoading={isLoading} />
      {ready && (
        <>
          {!generalMode && (
            <div className="flex justify-between items-end py-2">
              <div className="font-semibold pl-2 text-2xl">Năm học: {new Date(value.startDate).getFullYear()}</div>
              <div className="flex gap-[1px]">
                <Button
                  color="primary"
                  className="rounded-r-none"
                  startContent={<ChevronsLeft size="18px" />}
                  onPress={() => {
                    const endDate = format(subDays(new Date(value.startDate), 1), DATE_FORMAT);
                    const startDate = format(startOfWeek(endDate, { weekStartsOn: 1 }), DATE_FORMAT);
                    setValue({ startDate, endDate });
                  }}
                >
                  Tuần trước
                </Button>
                <div className="bg-secondary-50/80 flex items-center px-2 gap-2 font-semibold">
                  {format(new Date(value.startDate), "dd/MM")} <ArrowRight size="12px" />{" "}
                  {format(new Date(value.endDate), "dd/MM")}
                </div>
                <Button
                  color="primary"
                  className="rounded-l-none"
                  endContent={<ChevronsRight size="18px" />}
                  onPress={() => {
                    const startDate = format(addDays(new Date(value.endDate), 1), DATE_FORMAT);
                    const endDate = format(endOfWeek(startDate, { weekStartsOn: 1 }), DATE_FORMAT);
                    setValue({ startDate, endDate });
                  }}
                >
                  Tuần sau
                </Button>
              </div>
            </div>
          )}
          <div className="shadow-small p-2 w-full rounded-large">
            <table className="timetable w-full [&_th]:p-1 sm:[&_th]:p-2 [&_td]:p-0 [&_th]:text-foreground [&_th]:border-r-1 [&_td]:border-r-1 [&_td]: [&_th:last-child]:border-r-0 [&_td:last-child]:border-r-0 rounded-lg overflow-hidden">
              <thead>
                <tr>
                  <th className="border-b-1 w-[6rem]"></th>
                  {weeks.map((week, index) => {
                    const currentDay = addDays(new Date(value.startDate), index);
                    const isToday = format(currentDay, DATE_FORMAT) === format(currentDate, DATE_FORMAT);

                    return (
                      <th key={`h-${week}`} className={cn("border-b-1", isToday && "bg-secondary-50/50")}>
                        <div>
                          <p className={cn("text-sm font-normal", generalMode && "text-lg font-bold")}>{week}</p>
                          {!generalMode && <div className={cn("text-lg")}>{format(currentDay, "dd/MM")}</div>}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: NUM_OF_ROWS }).map((_, index) => {
                  const firstCol = index % ONE_HOUR_ROWS === 0;
                  const hour = getHourFromIndex(index);

                  return (
                    <tr key={`r-${index}`}>
                      {firstCol ? (
                        <th
                          rowSpan={ONE_HOUR_ROWS}
                          className={cn(
                            "!p-1 text-center border-b-1 font-normal",
                            hour === END_HOUR - 1 && "border-b-0"
                          )}
                        >
                          {format(new Date().setHours(hour, 0), "HH:mm")}
                        </th>
                      ) : null}
                      {columns.map((col) => col[index])}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
};

const getHourFromIndex = (index) => 7 + Math.floor((index * 5) / 60);

const calcIndexFromTime = (time) => {
  const [hour, minute] = time.split(":");
  const diffMinutes = differenceInMinutes(new Date().setHours(Number(hour), Number(minute)), new Date().setHours(7, 0));
  return diffMinutes / 5;
};

const getStartTimeFromSchedules = (list, shiftObj) => {
  const [first, ...other] = list;

  let startTime = shiftObj[first.shiftId].startTime;
  other.forEach((item) => {
    const itemStartTime = shiftObj[item.shiftId].startTime;
    if (splitTime(itemStartTime)[0] < splitTime(startTime)[0]) startTime = itemStartTime;
  });
  return startTime;
};

const getEndTimeFromSchedules = (list, shiftObj) => {
  const [first, ...other] = list;

  let endTime = shiftObj[first.shiftId].endTime;
  other.forEach((item) => {
    const itemStartTime = shiftObj[item.shiftId].endTime;
    if (splitTime(itemStartTime)[0] > splitTime(endTime)[0]) endTime = itemStartTime;
  });
  return endTime;
};

const isOverlap = ([a1, a2], [b1, b2]) => {
  return Math.max(a1, b1) <= Math.min(a2, b2);
};

const groupOverlappingSchedules = (schedules, shiftObj) => {
  const cloned = [...schedules];
  const grouped = [];

  cloned.forEach((schedule) => {
    const shift = shiftObj[schedule.shiftId];
    const found = grouped.find((g) =>
      Boolean(
        g.find((gS) => {
          const gsShift = shiftObj[gS.shiftId];
          if (displayDate(shift.date) !== displayDate(gsShift.date)) return;

          return isOverlap(
            [splitTime(shift.startTime)[0], splitTime(shift.endTime)[0]],
            [splitTime(gsShift.startTime)[0], splitTime(gsShift.endTime)[0]]
          );
        })
      )
    );
    if (!found) grouped.push([schedule]);
    if (found) found.push(schedule);
  });

  return grouped;
};

export default TimeTable;
