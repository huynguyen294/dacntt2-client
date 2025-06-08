import { ModuleLayout } from "@/layouts";
import { useParams, useSearchParams } from "react-router";
import { ClipboardCheck, Target } from "lucide-react";
import { Tab, Tabs } from "@heroui/tabs";
import { useStudentStore } from "@/state";
import { studentClassBreadcrumbItems } from "./constants";
import ClassExercise from "./components/ClassExercise";
import ClassScore from "./components/ClassScore";

const StudentClassRoom = () => {
  const { classId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  const classes = useStudentStore("classes");
  const classData = classes.find((c) => c.id === +classId);

  return (
    <ModuleLayout breadcrumbItems={[...studentClassBreadcrumbItems, { label: classData?.name || "..." }]}>
      <Tabs
        aria-label="ClassRoom tabs"
        defaultSelectedKey="exercise"
        selectedKey={tab}
        onSelectionChange={(key) => {
          searchParams.set("tab", key);
          setSearchParams(searchParams, { replace: true });
        }}
        classNames={{
          base: "container mx-auto w-full my-2 sm:my-4 px-2 sm:px-10",
          panel: "flex-1 overflow-y-auto container mx-auto max-w-3xl pb-10 px-2 sm:px-10",
        }}
      >
        <Tab
          key="exercise"
          title={
            <div className="flex items-center space-x-2">
              <ClipboardCheck size="18px" />
              <span>Bài tập</span>
            </div>
          }
        >
          <ClassExercise />
        </Tab>

        <Tab
          key="schedule"
          title={
            <div className="flex items-center space-x-2">
              <Target size="18px" />
              <span>Kết quả học tập</span>
            </div>
          }
        >
          <ClassScore />
        </Tab>
      </Tabs>
    </ModuleLayout>
  );
};

export default StudentClassRoom;
