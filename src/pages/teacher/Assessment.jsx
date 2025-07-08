import { classApi, exerciseApi } from "@/apis";
import { ORDER_BY_NAME } from "@/constants";
import { useNavigate, useServerList } from "@/hooks";
import { ModuleLayout } from "@/layouts";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Select, SelectItem } from "@heroui/select";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import ExerciseCheck from "../training/class/components/ExerciseCheck";

const Assessment = () => {
  const navigate = useNavigate();
  const { classId, exerciseId } = useParams();

  const classList = useServerList("classes", classApi.get, { order: ORDER_BY_NAME, paging: false });
  const { isLoading, data } = useQuery({
    queryKey: ["classes", classId, "class-exercises"],
    queryFn: () => (classId !== "undefined" ? exerciseApi.get(null, null, null, { classId }) : null),
  });

  return (
    <ModuleLayout breadcrumbItems={[{ label: "Chấm điểm" }]}>
      <div className="px-2 sm:px-10 overflow-y-auto container mx-auto max-w-5xl">
        <div className="flex flex-wrap gap-2 sm:gap-4 overflow-hidden">
          <Select
            size="lg"
            variant="bordered"
            label="Lớp học"
            radius="sm"
            labelPlacement="outside"
            placeholder="Tìm theo tên lớp học"
            isVirtualized
            maxListboxHeight={265}
            itemHeight={40}
            items={classList.list}
            isLoading={classList.isLoading}
            listboxProps={classList.listboxProps}
            selectedKeys={classId !== "undefined" && new Set([classId])}
            className="w-full sm:w-[300px]"
            onSelectionChange={(keys) => {
              const classId = [...keys][0];
              navigate(`/assessment/${classId}/exercise/${exerciseId}`);
            }}
          >
            {(item) => <SelectItem key={item.id?.toString()}>{item.name}</SelectItem>}
          </Select>
          <Autocomplete
            size="lg"
            variant="bordered"
            label="Lớp học"
            radius="sm"
            labelPlacement="outside"
            placeholder="Chọn bài tập"
            isLoading={isLoading}
            selectedKey={exerciseId !== "undefined" && exerciseId}
            className="w-full sm:w-[300px]"
            listboxProps={{ emptyContent: classId === "undefined" ? "Vui lòng chọn lớp" : "No results found." }}
            onSelectionChange={(keys) => {
              const exerciseId = keys || "undefined";
              navigate(`/assessment/${classId}/exercise/${exerciseId}`);
            }}
          >
            {data &&
              data.rows.map(
                (item) => !item.isDraft && <AutocompleteItem key={item.id?.toString()}>{item.title}</AutocompleteItem>
              )}
          </Autocomplete>
        </div>
        {classId !== "undefined" && exerciseId !== "undefined" && (
          <div className="mt-4">
            <ExerciseCheck />
          </div>
        )}
      </div>
    </ModuleLayout>
  );
};

export default Assessment;
