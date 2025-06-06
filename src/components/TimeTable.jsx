import { classApi, enrollmentApi, scheduleApi, userApi } from "@/apis";
import { DATE_FORMAT, EMPLOYEE_STATUS } from "@/constants";
import { useMetadata, useServerList } from "@/hooks";
import { cn } from "@/lib/utils";
import { arrayToObject, displayDate, shiftFormat, splitTime } from "@/utils";
import { addDays, differenceInMinutes, endOfWeek, format, startOfWeek, subDays } from "date-fns";
import { Loader } from "./common";
import { Button } from "@heroui/button";
import { ArrowRight, ChevronsLeft, ChevronsRight, MoveRight } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const currentDate = new Date();
export const defaultWeekCalendarValue = {
  startDate: format(startOfWeek(currentDate, { weekStartsOn: 1 }), DATE_FORMAT),
  endDate: format(endOfWeek(currentDate, { weekStartsOn: 1 }), DATE_FORMAT),
};

const weeks = ["Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7", "CN"];
const START_HOUR = 7;
const END_HOUR = 21;
// steps: 5 minutes
const NUM_OF_ROWS = ((END_HOUR - START_HOUR) * 60) / 5;
const ONE_HOUR_ROWS = 12;

const TimeTable = ({ generalMode, studentId, teacherId, classId }) => {
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
    queryKey: ["enrollments", [studentId]],
    queryFn: () => studentId && enrollmentApi.getByStudents([studentId]),
  });

  const studentClasses = enrResult.data ? enrResult.data.rows.map((r) => r.classId) : [];

  const ready = classList.ready && scheduleList.ready && teacherList.ready && Boolean(metadata.shifts);
  const isLoading = classList.isLoading && scheduleList.isLoading && teacherList.isLoading && metadata.loading;
  const classObj = arrayToObject(classList.list);
  const teacherObj = arrayToObject(teacherList.list);

  const filteredSchedule = scheduleList.list.filter((s) => {
    const sDate = new Date(s.date);
    if (sDate < new Date(value.startDate) || sDate > new Date(value.endDate)) return;

    let valid = true;
    if (teacherId) valid = s.teacherId === teacherId;
    if (studentId) valid = studentClasses.includes(s.classId);
    if (classId) valid = s.classId === classId;

    return valid;
  });

  const multipleMode = !studentId && !teacherId && !classId;

  const { shiftObj } = metadata;

  const Block = ({ schedule, rowSpan, isToday }) => {
    const shift = shiftObj[schedule.shiftId];
    const teacher = teacherObj[schedule.teacherId];
    const classData = classObj[schedule.classId];

    return (
      <td rowSpan={rowSpan} className={cn("!p-[2px] border-b-1", isToday && "bg-secondary-50/50")}>
        <div className="w-full bg-primary-100 border-l-5 border-primary-400 rounded-small text-primary-700 px-1">
          <p className="font-bold">{classData.name}</p>
          <p className="text-small">({shiftFormat(shift)})</p>
          <div className="flex gap-1 items-center py-2">
            <p className="font-semibold">GV: {teacher.name}</p>
          </div>
        </div>
      </td>
    );
  };

  const OverlapBlock = ({ schedules, rowSpan, isToday }) => {
    return (
      <td rowSpan={rowSpan} className={cn("!p-[2px] border-b-1", isToday && "bg-secondary-50/50")}>
        <div className="flex flex-col gap-[0.5px]">
          {schedules.map((schedule, index) => {
            const shift = shiftObj[schedule.shiftId];
            const teacher = teacherObj[schedule.teacherId];
            const classData = classObj[schedule.classId];

            return (
              <div
                className={cn(
                  "w-full bg-primary-100 border-l-5 border-primary-400 rounded-sm text-primary-700 px-1",
                  index === schedules.length - 1 && "rounded-b-small",
                  index === 0 && "rounded-t-small"
                )}
              >
                <p className="font-bold">{classData.name}</p>
                <p className="text-small">({shiftFormat(shift)})</p>
                <div className="flex gap-1 items-center py-2">
                  <p className="font-semibold">GV: {teacher.name}</p>
                </div>
              </div>
            );
          })}
        </div>
      </td>
    );
  };

  const generateRows = (schedules, isToday) => {
    const result = new Array(NUM_OF_ROWS)
      .fill()
      .map((_, index) => (
        <td
          className={cn(
            index % ONE_HOUR_ROWS === ONE_HOUR_ROWS - 1 && index < NUM_OF_ROWS - ONE_HOUR_ROWS && "border-b-1",
            isToday && "bg-secondary-50/50"
          )}
        />
      ));

    if (multipleMode) {
      const merged = groupOverlappingSchedules(schedules, shiftObj);
      merged.forEach((gSchedule) => {
        const startIdx = calcIndexFromTime(getStartTimeFromSchedules(gSchedule, shiftObj));
        const endIdx = calcIndexFromTime(getEndTimeFromSchedules(gSchedule, shiftObj));
        result[startIdx] = <OverlapBlock isToday={isToday} rowSpan={endIdx - startIdx} schedules={gSchedule} />;
        Array.from({ length: endIdx - startIdx - 1 }).forEach((_, index) => {
          result[startIdx + index + 1] = null;
        });
      });
    } else {
      schedules.forEach((schedule) => {
        const shift = shiftObj[schedule.shiftId];
        const startIdx = calcIndexFromTime(shift.startTime);
        const endIdx = calcIndexFromTime(shift.endTime);

        result[startIdx] = <Block isToday={isToday} rowSpan={endIdx - startIdx} schedule={schedule} />;
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
    const filtered = filteredSchedule.filter(
      (s) => format(new Date(s.date), DATE_FORMAT) === format(currentDay, DATE_FORMAT)
    );
    return generateRows(filtered, isToday);
  });

  return (
    <>
      <Loader isLoading={isLoading} />
      {ready && (
        <>
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
              <div className="bg-default-200 flex items-center px-2 gap-2 font-semibold">
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
                          <p className="text-sm font-normal">{week}</p>
                          <div className={cn("text-lg")}>{format(currentDay, "dd/MM")}</div>
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
