import { useMemo } from "react";
import Indicator from "../common/Indicator";
import { User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { API } from "@/apis";
import { localeString } from "@/utils";

const StudentIndicators = ({ disableFooter }) => {
  const result = useQuery({
    queryKey: ["reports", "student-indicator"],
    queryFn: async () => API.get("/api-v1/reports/student-indicator"),
    select: (res) => res.data,
  });

  const data = useMemo(() => {
    let month = new Date().getMonth();
    // if month = 0 => current month => pre month = 12
    if (month === 0) month = 12;

    const obj = { description: `(Tháng ${month})` };

    if (result.data) {
      const { previousMonthValue, previous2MonthValue } = result.data;
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
