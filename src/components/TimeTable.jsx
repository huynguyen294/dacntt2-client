import { DATE_FORMAT } from "@/constants";
import { useMetadata } from "@/hooks";
import { cn } from "@/lib/utils";
import { shiftFormat } from "@/utils";
import { addDays, endOfWeek, format, startOfWeek } from "date-fns";

const currentDate = new Date();
export const defaultWeekCalendarValue = {
  startDate: format(startOfWeek(currentDate, { weekStartsOn: 1 }), DATE_FORMAT),
  endDate: format(endOfWeek(currentDate, { weekStartsOn: 1 }), DATE_FORMAT),
  date: format(currentDate, DATE_FORMAT),
};

const weeks = ["Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7", "CN"];

const TimeTable = ({ value = defaultWeekCalendarValue, schedules = [] }) => {
  const { shifts } = useMetadata();

  return (
    <div className="shadow-small p-2 w-full rounded-large">
      <table className="w-full [&_th]:p-1 sm:[&_th]:p-2 [&_td]:p-1 sm:[&_td]:p-2 [&_th]:text-foreground [&_th]:border-r-2 [&_td]:border-r-2 [&_th]:border-b-2 [&_td]:border-b-2 [&_th:last-child]:border-r-0 [&_td:last-child]:border-r-0 [&_tr:last-child_td]:border-b-0 [&_tbody_tr:last-child_th]:border-b-0 rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th>Ca | Thứ</th>
            {weeks.map((week, index) => {
              const currentDay = addDays(new Date(value.startDate), index);

              return (
                <th key={`h-${week}`}>
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
          {shifts &&
            shifts.map((shift) => (
              <tr key={shift.name}>
                <th>
                  <div>
                    <p>{shift.name}</p>
                    <p className="font-normal text-sm">({shiftFormat(shift)})</p>
                  </div>
                </th>
                {weeks.map((week, index) => {
                  return (
                    <td key={shift.name + week}>
                      {index % 2 !== 0 && shift.id === 3 && (
                        <div className="bg-primary rounded-lg p-1 sm:p-2 text-primary-foreground">
                          <p>Tiếng Anh 1 - Ca 3</p>
                          <p>Giáo viên 1</p>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimeTable;
