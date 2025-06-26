import { useMemo } from "react";
import Indicator from "./components/Indicator";
import { User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { API } from "@/apis";
import { localeString } from "@/utils";

const TuitionIndicator = () => {
  const result = useQuery({
    queryKey: ["reports", "tuition-indicator"],
    queryFn: async () => API.get("/api-v1/reports/tuition-indicator"),
    select: (res) => res.data,
  });

  const data = useMemo(() => {
    let month = new Date().getMonth();
    // if month = 0 => current month => pre month = 12
    if (month === 0) month = 12;

    const obj = {
      description: `(Tháng ${month})`,
      icon: <User size="18px" />,
      path: "/tuition-management",
      value: 0,
    };

    if (result.data) {
      const { previousMonthValue, previous2MonthValue } = result.data;
      obj.value = localeString(previousMonthValue) + "đ";
      obj.change = previous2MonthValue - previousMonthValue;

      console.log(obj.change);
    }

    return obj;
  }, [result.data]);

  return <Indicator title="Học phí đã thu" isLoading={result.isLoading} {...data} />;
};

export default TuitionIndicator;
