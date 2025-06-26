import { Indicator } from "@/components/common";
import { ChartNoAxesColumn } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { localeString } from "@/utils";
import { API } from "@/apis";

const TotalStudentIndicator = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["reports", "total-student"],
    queryFn: () => API.get("/api-v1/reports/total-student"),
    select: (res) => res.data,
  });

  return (
    data && (
      <Indicator
        icon={<ChartNoAxesColumn />}
        isLoading={isLoading}
        title="Tổng số học sinh"
        description="(Của lớp đang hoạt động và chưa khai giảng)"
        value={localeString(Number(data.total))}
      />
    )
  );
};

export default TotalStudentIndicator;
