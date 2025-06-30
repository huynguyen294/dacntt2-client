import ExerciseInfo from "./components/ExerciseInfo";
import ExerciseCheck from "./components/ExerciseCheck";
import { classApi, exerciseApi } from "@/apis";
import { ModuleLayout } from "@/layouts";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router";
import { classesManagementBreadcrumbItems } from "../constants";
import { Tab, Tabs } from "@heroui/tabs";
import { Info, ListChecks } from "lucide-react";

const ClassExercisePage = () => {
  const { classId, exerciseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  const classResult = useQuery({
    queryKey: ["classes", classId, "refs=true"],
    queryFn: () => classApi.getById(classId, ["refs=true"]),
  });

  const exerciseResult = useQuery({
    queryKey: ["class-exercises", classId, exerciseId],
    queryFn: () => exerciseApi.getById(exerciseId),
  });

  return (
    <ModuleLayout
      breadcrumbItems={[
        ...classesManagementBreadcrumbItems,
        { label: classResult.data?.item?.name || "...", path: "/classes/" + classId + "?tab=exercise" },
        { label: exerciseResult.data?.item?.title || "..." },
      ]}
    >
      <Tabs
        aria-label="ClassExercisePage tabs"
        defaultSelectedKey="exercise"
        selectedKey={tab}
        onSelectionChange={(key) => {
          searchParams.set("tab", key);
          setSearchParams(searchParams);
        }}
        classNames={{
          base: "container mx-auto w-full justify-start my-2 sm:my-4 px-2 sm:px-10",
          panel: "flex-1 overflow-y-auto container mx-auto max-w-3xl pb-10",
        }}
      >
        <Tab
          key="info"
          title={
            <div className="flex items-center space-x-2">
              <Info size="18px" />
              <span>Chi tiết bài tập</span>
            </div>
          }
        >
          <div className="px-2 sm:px-10">
            <ExerciseInfo />
          </div>
        </Tab>
        <Tab
          key="score"
          title={
            <div className="flex items-center space-x-2">
              <ListChecks size="18px" />
              <span>Chấm điểm</span>
            </div>
          }
        >
          <div className="px-2 sm:mx-10">
            <ExerciseCheck />
          </div>
        </Tab>
      </Tabs>
    </ModuleLayout>
  );
};

export default ClassExercisePage;
