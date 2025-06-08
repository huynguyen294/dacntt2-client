import { ADMISSION_STATUSES, CLASS_STATUSES, COURSE_LEVELS, getStatusColor } from "@/constants";
import { ModuleLayout } from "@/layouts";
import { cn } from "@/lib/utils";
import { useAppStore, useStudentStore } from "@/state";
import { arrayToObject, displayDate, getClassStatus, localeString, orderBy, shiftFormat } from "@/utils";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Calendar, ChevronRight, DollarSign, Info, PhoneCall, Users2 } from "lucide-react";
import { studentClassBreadcrumbItems } from "./constants";
import { useNavigate } from "@/hooks";
import { studentConsultationApi } from "@/apis";
import { useState } from "react";
import { addToast } from "@heroui/toast";

const StudentClass = () => {
  const navigate = useNavigate();
  const user = useAppStore("user");
  const { classes, shifts, teachers, courses, consultations } = useStudentStore([
    "classes",
    "shifts",
    "teachers",
    "courses",
    "consultations",
  ]);

  const actions = useStudentStore("studentActions");

  const shiftObj = arrayToObject(shifts);
  const teacherObj = arrayToObject(teachers);
  const sortedClasses = orderBy(classes, (item) => {
    const status = getClassStatus(item);
    if (status.text === CLASS_STATUSES.active) return -1;
    if (status.text === CLASS_STATUSES.pending) return 0;
    return 1;
  });

  const [loading, setLoading] = useState(false);

  const handleRegisterConsultation = async (expectedCourseId) => {
    setLoading(true);
    const { email, name, dateOfBirth, phoneNumber, address, id } = user;
    const result = await studentConsultationApi.create({
      email,
      name,
      dateOfBirth,
      phoneNumber,
      address,
      status: ADMISSION_STATUSES.pending,
      studentId: id,
      expectedCourseId,
    });

    if (result.ok) {
      actions.add("consultations", result.created);
    } else {
      addToast({ color: "danger", title: "Lỗi!", description: result.message });
    }

    setLoading(false);
  };

  return (
    <ModuleLayout breadcrumbItems={studentClassBreadcrumbItems}>
      <div className="px-2 sm:px-10 space-y-8 overflow-y-auto pb-10">
        <div>
          <p className="m-4 text-lg font-bold">Lớp học của tôi</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {sortedClasses.map((classData) => {
              const shift = shiftObj[classData.shiftId];
              const teacher = teacherObj[classData.teacherId];
              const status = getClassStatus(classData);

              let statusText = status.text;
              if (statusText === CLASS_STATUSES.active) statusText = "Đang học";
              if (statusText === CLASS_STATUSES.pending)
                statusText = `Khai giảng vào ${displayDate(classData.openingDay)}`;

              return (
                <Card
                  isPressable={status.text !== CLASS_STATUSES.pending}
                  shadow="none"
                  className="border"
                  onPress={() => navigate(`/classes/${classData.id}`)}
                >
                  <div
                    className={cn(
                      "p-3 w-full bg-gradient-to-tr from-primary-100 from-70% to-primary-600/70 text-left text-foreground border-b-1",
                      status.text === CLASS_STATUSES.stopped &&
                        "from-default-100 to-default-400/60 text-foreground-500",
                      status.text === CLASS_STATUSES.pending && "from-warning-50/60 to-warning-300/50"
                    )}
                  >
                    <p className="text-lg font-semibold">{classData.name}</p>
                    <p className="text-small">
                      {shift.name} - ({shiftFormat(shift)})
                    </p>
                  </div>
                  <div
                    className={cn(
                      "px-3 relative mt-2",
                      status.text === CLASS_STATUSES.stopped && "[&_p]:!text-foreground-500"
                    )}
                  >
                    <div className="flex flex-col justify-between">
                      <Avatar src={teacher.imageUrl} className="absolute -top-[50%] size-14 right-4 border" />
                      <div className="text-foreground-700 !text-left flex flex-wrap gap-1 items-center text-small font-semibold">
                        <p>Lịch học: </p>
                        {classData.weekDays.split(",").map((day) => (
                          <Chip size="sm" variant="flat" startContent={<Calendar size="10px" />}>
                            {day !== "CN" ? `Thứ ${day}` : "Chủ nhật"}
                          </Chip>
                        ))}
                      </div>
                      <p className="text-left mt-4 mb-2">{teacher.name}</p>
                    </div>
                  </div>
                  <div className={cn("border-t-1 px-3 py-2 flex justify-between items-center")}>
                    <div
                      className={cn(
                        "flex items-center gap-2 !text-small",
                        status.text === CLASS_STATUSES.active && "text-primary",
                        status.text === CLASS_STATUSES.stopped && "text-foreground-500",
                        status.text === CLASS_STATUSES.pending && "text-warning-600"
                      )}
                    >
                      <Info size="14px" />
                      {statusText}
                    </div>
                    {status.text !== CLASS_STATUSES.pending && (
                      <ChevronRight size="18px" className="text-foreground-500" strokeWidth={2.5} />
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
        <div>
          <p className="m-4 text-lg font-bold ">Lớp học khác</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {courses
              .filter((course) => !classes.find((c) => c.courseId === course.id))
              .map((course) => {
                const found = consultations.find((c) => c.expectedCourseId === course.id);

                return (
                  <Card shadow="none" className="border">
                    <div
                      className={cn(
                        "px-3 py-2 w-full bg-gradient-to-tr from-primary-100 from-70% to-primary-600/70 text-left text-foreground border-b-1"
                      )}
                    >
                      <p className="text-lg font-semibold">{course.name}</p>
                      <p>{COURSE_LEVELS[course.level]}</p>
                    </div>
                    <div className={cn("p-3 space-y-3")}>
                      <div className="flex justify-between">
                        <div className="flex gap-1 items-center text-small">
                          <Calendar size="16px" /> {course.numberOfLessons || 0}
                          <p>Buổi học</p>
                        </div>
                        <div className="flex gap-1 items-center text-small">
                          <Users2 size="16px" /> {course.numberOfStudents || 0}
                          <p>Học viên</p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-start text-small py-1 text-foreground-500">
                        <Info size="22px" /> Đăng ký tư vấn để được tư vấn thông tin về các lớp học đang mở cho khóa học
                        này!
                      </div>
                    </div>
                    <div className={cn("border-t-1 px-3 py-2 flex justify-between items-center")}>
                      <div className="flex gap-1 items-center font-semibold">
                        <DollarSign size="16px" />
                        {localeString(course.tuitionFee)}đ
                      </div>
                      {!found ? (
                        <Button
                          isLoading={loading}
                          onPress={() => handleRegisterConsultation(course.id)}
                          size="sm"
                          color="primary"
                          radius="full"
                          startContent={<PhoneCall size="14px" />}
                        >
                          Đăng ký tư vấn
                        </Button>
                      ) : (
                        <Chip startContent={<Info size="14px" />} variant="flat" color={getStatusColor(found.status)}>
                          {found.status}
                        </Chip>
                      )}
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
};

export default StudentClass;
