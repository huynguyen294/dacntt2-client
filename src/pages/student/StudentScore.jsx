import { EmptyMessage } from "@/components";
import { Section } from "@/components/common";
import { getCode } from "@/constants";
import { ModuleLayout } from "@/layouts";
import { useStudentStore } from "@/state";
import { arrayToObject, calcTotal, displayDate, shiftFormat } from "@/utils";
import { Divider } from "@heroui/divider";
import { Select, SelectItem } from "@heroui/select";
import { BookMarked } from "lucide-react";
import { useMemo, useState } from "react";

const StudentScore = () => {
  const { classes, shifts, attendances, classExercises, classExerciseScores } = useStudentStore([
    "classes",
    "shifts",
    "attendances",
    "classExercises",
    "classExerciseScores",
  ]);
  const [selectedClass, setSelectedClass] = useState();

  const shiftObj = arrayToObject(shifts);

  const data = useMemo(() => {
    if (!selectedClass) return;
    const filteredAttendances = attendances.filter((a) => a.classId == selectedClass);
    const filteredExercises = classExercises.filter((a) => a.classId == selectedClass);
    const filteredScores = classExerciseScores.filter((a) => a.classId == selectedClass);
    const notes = filteredAttendances.filter((a) => a.note);
    const exercisePercent = Math.round(
      (filteredScores.filter((s) => s.status === "Đã nộp").length / filteredExercises.length || 0) * 100
    );

    const scored = filteredScores.filter((e) => e.score);
    const avg = ((calcTotal(scored, "score") / (10 * scored.length)) * 10 || 0).toFixed(1);

    return {
      exercisePercent,
      attendances: filteredAttendances,
      notes,
      avg,
      exercises: filteredExercises,
      scores: filteredScores,
    };
  }, [selectedClass, attendances, classExercises, classExerciseScores, classes]);

  return (
    <ModuleLayout breadcrumbItems={[{ label: "Kết quả học tập" }]}>
      <div className="px-2 sm:px-10 container mx-auto max-w-3xl space-y-4">
        <Select
          label="Lớp học"
          placeholder="Chọn lớp học"
          labelPlacement="outside"
          size="lg"
          aria-label="select"
          className="min-w-[200px]"
          selectedKeys={selectedClass && new Set([selectedClass])}
          onSelectionChange={(keys) => {
            setSelectedClass([...keys][0]);
          }}
        >
          {classes.map((item) => {
            return (
              <SelectItem key={item.id?.toString()} description={shiftFormat(shiftObj[item.shiftId])}>
                {`${getCode("class", item.id)}: ${item.name}`}
              </SelectItem>
            );
          })}
        </Select>
        <Section
          className="shadow-none border"
          title="Kết quả học tập"
          classNames={{
            title: "bg-gradient-to-tr from-primary-100 from-70% to-primary-600/70",
            content: "space-y-4 relative",
          }}
        >
          {selectedClass ? (
            <>
              <BookMarked
                size="200px"
                strokeWidth={1}
                className="absolute bottom-3 -right-10 rotate-45 text-primary-100/30"
              />
              <div>
                <p className="font-medium text-foreground-500 -mt-2">Chuyên cần</p>
                <ul className="mt-2">
                  <li className="font-medium">
                    Số buổi tham gia: {data.attendances.filter((a) => a.attend !== "no").length}/
                    {data.attendances.length}
                  </li>
                  <li className="font-medium">
                    Số buổi trễ: {data.attendances.filter((a) => a.attend === "late").length}
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-foreground-500">Nhận xét trên lớp</p>
                {data.notes.length > 0 ? (
                  <ul className="mt-2">
                    {data.notes.map((item) => (
                      <li className="font-medium">
                        - {item.note} <span className="italic font-normal">({displayDate(item.createdAt)})</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic font-medium mt-2">Không có nhận xét nào</p>
                )}
              </div>
              <Divider />
              <div>
                <p className="font-medium text-foreground-500">Bài tập trên lớp</p>
                <ul className="mt-2">
                  <li className="font-medium">Tỉ lệ hoàn thành: {data.exercisePercent}%</li>
                  <li className="font-medium">
                    Điểm trung bình: <span>{data.avg}</span>
                  </li>
                </ul>
              </div>
              <p></p>
            </>
          ) : (
            <EmptyMessage message="Vui lòng chọn lớp học" />
          )}
        </Section>
      </div>
    </ModuleLayout>
  );
};

export default StudentScore;
