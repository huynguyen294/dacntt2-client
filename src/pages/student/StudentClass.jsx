import { COLORS } from "@/constants/palette";
import { ModuleLayout } from "@/layouts";
import { useStudentStore } from "@/state";
import { alpha, arrayToObject, shiftFormat } from "@/utils";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { ChevronRight, MoveRight, PhoneCall } from "lucide-react";

const StudentClass = () => {
  const { classes, shifts, teachers } = useStudentStore(["classes", "shifts", "teachers"]);

  const classColors = classes.reduce((acc, c, index) => ({ ...acc, [c.id]: COLORS[index] }), []);
  const shiftObj = arrayToObject(shifts);
  const teacherObj = arrayToObject(teachers);

  return (
    <ModuleLayout breadcrumbItems={[{ label: "Lớp học" }]}>
      <div className="px-2 sm:px-10 space-y-8">
        <div>
          <p className="m-4 text-lg font-bold">Lớp học của tôi</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {classes.map((classData) => {
              const shift = shiftObj[classData.shiftId];
              const teacher = teacherObj[classData.teacherId];

              return (
                <Card isHoverable isPressable>
                  <div className="w-full h-20 bg-default-100 text-left px-3 py-2 text-foreground">
                    <p className="text-lg font-semibold">{classData.name}</p>
                    <p>
                      {shift.name} - ({shiftFormat(shift)})
                    </p>
                  </div>
                  <div className="px-3 py-2">
                    <div className="h-20 flex items-end relative">
                      <Avatar src={teacher.imageUrl} className="absolute -top-[50%] size-14 right-4" />
                      <div className="flex justify-between w-full items-center">
                        <p className="font-semibold text-foreground-700 mb-2">GV: {teacher.name}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
        <div>
          <p className="m-4 text-lg font-bold ">Lớp học khác</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <Card>
              <div className="w-full h-20 bg-default-100 text-left px-3 py-2 text-foreground">
                <p className="text-lg font-semibold">Tiếng Anh 4 - Ca 1</p>
                <p>Ca 2 - ({shiftFormat(shiftObj[2])})</p>
              </div>
              <div className="px-3 py-2">
                <div className="h-20 flex items-end relative">
                  <Avatar src="" className="absolute -top-[50%] size-14 right-4" />
                  <div className="flex justify-between w-full items-center">
                    <p className="font-semibold text-foreground-700 mb-2">GV: Giáo viên 1</p>
                    <Button color="primary" size="sm" className="mb-1 mr-2" startContent={<PhoneCall size="14px" />}>
                      Đăng ký tư vấn
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
};

export default StudentClass;
