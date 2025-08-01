import Indicator from "../common/Indicator";
import { LayoutGrid } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { API } from "@/apis";
import { Skeleton } from "@heroui/skeleton";

const ClassIndicator = ({ disableFooter }) => {
  const result = useQuery({
    queryKey: ["reports", "class-indicator"],
    queryFn: async () => API.get("/api-v1/reports/class-indicator"),
    select: (res) => res.data,
  });

  return (
    <Indicator
      isLoading={result.isLoading}
      title="Lớp học"
      icon={<LayoutGrid size="18px" />}
      path="/classes"
      disableFooter={disableFooter}
    >
      <div className="px-4">
        {result.isLoading ? (
          <Skeleton className="w-20 h-6 rounded-lg mb-2" />
        ) : (
          <p className="text-2xl font-semibold text-success-700">
            {result.data.active} <span className="text-base font-normal">đang hoạt động</span>
          </p>
        )}
        {result.isLoading ? (
          <Skeleton className="w-20 h-6 rounded-lg" />
        ) : (
          <p className="text-2xl font-semibold text-warning-600">
            {result.data.pending} <span className="text-base font-normal">sắp khai giảng</span>
          </p>
        )}
      </div>
    </Indicator>
  );
};

export default ClassIndicator;
