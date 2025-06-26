import { useMemo } from "react";
import Indicator from "../common/Indicator";
import { User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { API } from "@/apis";
import { localeString } from "@/utils";
import { PREVIOUS_MONTH } from "@/constants";

const StudentIndicators = ({ disableFooter }) => {
  const result = useQuery({
    queryKey: ["reports", "enrollment-per-months"],
    queryFn: () => API.get("/api-v1/reports/enrollment-per-months"),
    select: (res) => res.data,
  });

  const data = useMemo(() => {
    let month = new Date().getMonth();
    // if month = 0 => current month => pre month = 12
    if (month === 0) month = 12;

    const obj = { description: `(Tháng ${month})` };

    if (result.data) {
      const { enrollmentsPerMonth } = result.data;
      const previousMonthValue =
        enrollmentsPerMonth.find((i) => new Date(i.month).getMonth() + 1 === PREVIOUS_MONTH)?.total || 0;
      const previous2MonthValue =
        enrollmentsPerMonth.find((i) => new Date(i.month).getMonth() + 2 === PREVIOUS_MONTH)?.total || 0;
      obj.value = localeString(previousMonthValue);
      obj.change = previous2MonthValue - previousMonthValue;
    }

    return obj;
  }, [result.data]);

  return (
    <Indicator
      title="Học viên mới"
      icon={<User size="18px" />}
      path="/user-management/student"
      isLoading={result.isLoading}
      disableFooter={disableFooter}
      {...data}
    />
  );
};

export default StudentIndicators;
