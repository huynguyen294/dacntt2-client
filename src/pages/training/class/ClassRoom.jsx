import { classApi, getServerErrorMessage } from "@/apis";
import { ModuleLayout } from "@/layouts";
import { addToast } from "@heroui/toast";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { classesManagementBreadcrumbItems } from "../constants";
import { Calendar1, ClipboardCheck, Info, ListChecks, Users } from "lucide-react";
import { Tab, Tabs } from "@heroui/tabs";
import ClassStudents from "./components/ClassStudents";
import CheckAttendance from "./components/CheckAttendance";
import ClassSchedule from "./components/ClassSchedule";
import ClassInfo from "./components/ClassInfo";
import ClassExercise from "./components/ClassExercise";

const ClassRoom = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const tab = searchParams.get("tab");

  const { data, isError, error } = useQuery({
    queryKey: ["classes", id, "refs=true"],
    queryFn: () => classApi.getById(id, ["refs=true"]),
  });

  useEffect(() => {
    if (isError) addToast({ color: "danger", title: "Lỗi!", description: getServerErrorMessage(error) });
  }, [isError, error]);

  return (
    <ModuleLayout breadcrumbItems={[...classesManagementBreadcrumbItems, { label: data?.item?.name || "..." }]}>
      <Tabs
        aria-label="ClassRoom tabs"
        defaultSelectedKey="exercise"
        selectedKey={tab}
        onSelectionChange={(key) => {
          searchParams.set("tab", key);
          setSearchParams(searchParams, { replace: true });
        }}
        classNames={{
          base: "container mx-auto w-full justify-center my-2 sm:my-4 px-2 sm:px-10",
          panel:
            "flex-1 overflow-y-auto container mx-auto max-w-3xl pb-10 px-2 sm:px-10 [&:has(#attendance)]:max-w-7xl [&:has(#info)]:max-w-none",
        }}
      >
        <Tab
          key="info"
          title={
            <div className="flex items-center space-x-2">
              <Info size="18px" />
              <span>Thông tin</span>
            </div>
          }
        >
          <ClassInfo />
        </Tab>
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
          key="people"
          title={
            <div className="flex items-center space-x-2">
              <Users size="18px" />
              <span>Học viên</span>
            </div>
          }
        >
          <ClassStudents />
        </Tab>

        <Tab
          key="attendance"
          title={
            <div className="flex items-center space-x-2">
              <ListChecks size="18px" />
              <span>Điểm danh</span>
            </div>
          }
        >
          <CheckAttendance />
        </Tab>

        <Tab
          key="schedule"
          title={
            <div className="flex items-center space-x-2">
              <Calendar1 size="18px" />
              <span>Lịch học</span>
            </div>
          }
        >
          <ClassSchedule />
        </Tab>
      </Tabs>
    </ModuleLayout>
  );
};

export default ClassRoom;
