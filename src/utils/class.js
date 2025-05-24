import { DATE_FORMAT } from "@/constants";
import { addDays, format, startOfWeek, subDays } from "date-fns";
import { arrayToObject } from "./utils";

export const getWeeks = (startDate, endDate) => {
  const weeks = [];
  while (startDate <= endDate) {
    let startWeek = startOfWeek(endDate, { weekStartsOn: 1 });
    weeks.push([format(startWeek, DATE_FORMAT), format(endDate, DATE_FORMAT)]);
    endDate = subDays(startWeek, 1);
  }

  return [...weeks].reverse();
};

export const getClassSchedule = ({ openingDay, closingDay, numberOfLessons, weekDays }) => {
  const startDate = new Date(openingDay);
  const endDate = new Date(closingDay);

  const weeks = getWeeks(startDate, endDate);
  const days = weekDays.split(",");

  return weeks.reduce((acc, [startWeek, endWeek]) => {
    const startWeekDate = new Date(startWeek);
    const endWeekDate = new Date(endWeek);

    days.forEach((day, index) => {
      if (acc.length >= numberOfLessons) return acc;

      const date = addDays(startWeekDate, day === "CN" ? 5 : Number(day) - 2);
      if (date < startDate) return;

      if (date >= startWeekDate && date <= endWeekDate) {
        acc.push(format(date, DATE_FORMAT));
      }
    });

    return acc;
  }, []);
};
