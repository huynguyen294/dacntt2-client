import { classApi, exerciseScoreApi } from "@/apis";
import { Loader } from "@/components/common";
import { EXERCISE_STATUSES, ORDER_BY_NAME } from "@/constants";
import { cn } from "@/lib/utils";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { Input } from "@heroui/input";
import { CircularProgress } from "@heroui/progress";
import { addToast } from "@heroui/toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronDown, CircleCheckBig, ListChecks } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";

const StudentScore = ({ student, onData }) => {
  const queryClient = useQueryClient();
  const { classId, exerciseId } = useParams();
  const [value, setValue] = useState();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const { isLoading, data } = useQuery({
    queryKey: ["classes", classId, "class-exercise-scores", exerciseId, student.id],
    queryFn: () => exerciseScoreApi.get(null, null, null, { exerciseId, studentId: student.id }),
  });

  const scoreData = data && data.rows[0];

  const getScore = (score) => {
    if (score < 0) return 0;
    if (score > 10) return 10;
    return score;
  };

  const status = useMemo(() => {
    if (isLoading) return "...";
    if (!scoreData) return EXERCISE_STATUSES.missing;
    return scoreData.status;
  }, [isLoading, data]);

  const handleSave = async (e) => {
    const score = getScore(Number(e.target.value || 0));
    if (!score || (scoreData && scoreData.score === score)) return;

    setLoading(true);
    setSaved(false);

    if (scoreData?.id) {
      const result = await exerciseScoreApi.update(scoreData?.id, { score, status: EXERCISE_STATUSES.submitted });
      queryClient.invalidateQueries({
        queryKey: ["classes", classId, "class-exercise-scores", exerciseId, student.id],
      });
      if (!result.ok) addToast({ color: "danger", title: "Lỗi!", description: result.message });
    } else {
      const result = await exerciseScoreApi.create({
        score,
        studentId: student.id,
        classId: +classId,
        exerciseId: +exerciseId,
        status: EXERCISE_STATUSES.submitted,
      });
      queryClient.invalidateQueries({
        queryKey: ["classes", classId, "class-exercise-scores", exerciseId, student.id],
      });
      if (!result.ok) addToast({ color: "danger", title: "Lỗi!", description: result.message });
    }

    setLoading(false);
    setSaved(true);
  };

  useEffect(() => {
    if (scoreData?.id) {
      onData(student.id, scoreData);
      setValue(scoreData.score);
    }
  }, [data]);

  return (
    <>
      <td>
        <div className="flex items-center gap-2">
          <Avatar src={student.imageUrl} />{" "}
          <div>
            <p>{student.name}</p>
            <p
              className={cn(
                "text-sm font-semibold text-danger",
                status === EXERCISE_STATUSES.submitted && "text-primary"
              )}
            >
              {status}
            </p>
          </div>
        </div>
      </td>
      <td className="p-2 pl-6">
        <Input
          type="number"
          value={value}
          onBlur={handleSave}
          onChange={(e) => setValue(getScore(Number(e.target.value || 0)))}
          endContent={
            isLoading || loading ? (
              <CircularProgress size="sm" color="default" classNames={{ svg: "size-6" }} />
            ) : saved ? (
              <Check className="text-success" size="14px" />
            ) : (
              <div className="size-6" />
            )
          }
        />
      </td>
    </>
  );
};

const ExerciseCheck = () => {
  const queryClient = useQueryClient();
  const { classId, exerciseId } = useParams();
  const studentResult = useQuery({
    queryKey: ["classes", classId, "students", "refFields=:full"],
    queryFn: () => classApi.getClassStudents(classId, ORDER_BY_NAME, ["refFields=:full"]),
  });

  const [data, setData] = useState({});
  const [selectedList, setSelectedList] = useState([]);
  const [loading, setLoading] = useState(false);

  const changeData = (studentId, value) => setData((prev) => ({ ...prev, [studentId]: value }));

  const handleMark = async () => {
    setLoading(true);
    const newData = selectedList.filter((id) => !data[id]);
    const oldData = selectedList.filter((id) => data[id]);

    if (newData.length > 0) {
      const res = await exerciseScoreApi.create(
        newData.map((studentId) => ({
          studentId,
          exerciseId: +exerciseId,
          classId: +classId,
          status: EXERCISE_STATUSES.submitted,
        }))
      );
      if (!res.ok) addToast({ color: "danger", title: "Lỗi!", description: res.message });
    }

    if (oldData.length > 0) {
      const res2 = await exerciseScoreApi.update(
        oldData.map((studentId) => ({ id: data[studentId].id, status: EXERCISE_STATUSES.submitted }))
      );
      if (!res2.ok) addToast({ color: "danger", title: "Lỗi!", description: res2.message });
    }

    selectedList.forEach((studentId) => {
      queryClient.invalidateQueries({ queryKey: ["classes", classId, "class-exercise-scores", exerciseId, studentId] });
    });

    setSelectedList([]);
    setLoading(loading);
  };

  return (
    <div>
      <Loader isLoading={studentResult.isLoading} />
      {studentResult.data && (
        <>
          <Dropdown showArrow>
            <DropdownTrigger>
              <Button
                isDisabled={!selectedList.length}
                className="mb-4"
                variant="shadow"
                color="primary"
                endContent={<ChevronDown size="16px" strokeWidth={3} />}
              >
                Thao tác
              </Button>
            </DropdownTrigger>
            <DropdownMenu variant="flat">
              <DropdownItem startContent={<ListChecks size="14px" />}>Chấm điểm hàng loạt</DropdownItem>
              <DropdownItem color="success" startContent={<CircleCheckBig size="14px" />} onPress={handleMark}>
                Đánh dấu là đã nộp
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <div className="my-2">
            <Checkbox
              size="lg"
              isSelected={selectedList.length === studentResult.data.students.length}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedList(studentResult.data.students.map((s) => s.id));
                } else {
                  setSelectedList([]);
                }
              }}
            >
              Tất cả
            </Checkbox>
          </div>
          <table>
            <tbody>
              {studentResult.data.students.map((student) => (
                <tr key={student.id}>
                  <td className="pr-4">
                    <Checkbox
                      size="lg"
                      isSelected={selectedList.includes(student.id)}
                      onChange={(e) =>
                        e.target.checked
                          ? setSelectedList((prev) => [...prev, student.id])
                          : setSelectedList((prev) => prev.filter((id) => id !== student.id))
                      }
                    />
                  </td>
                  <StudentScore student={student} onData={changeData} />
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ExerciseCheck;
