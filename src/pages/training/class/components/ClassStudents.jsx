import useClassData from "../hooks/useClassData";
import useExerciseData from "../hooks/useExerciseData";
import { exerciseScoreApi } from "@/apis";
import { Amount, Loader } from "@/components/common";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { ChevronRight } from "lucide-react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@/hooks";

const ClassStudents = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const { students, loading } = useClassData();
  const { exercises } = useExerciseData();

  const { isLoading, data } = useQuery({
    queryKey: ["classes", classId, "class-exercise-scores", "student-statuses"],
    queryFn: () => exerciseScoreApi.getStudentStatuses(classId),
  });

  return (
    <div>
      <div className="font-bold px-4 sm:px-10 inline-flex items-center">
        <p className="text-2xl">Học viên</p>
        <Amount className="ml-2 font-semibold">{students?.length}</Amount>
      </div>
      <Loader isLoading={isLoading || loading} />
      {data && (
        <Listbox variant="flat" className="p-4 sm:px-10">
          {students.map((student) => (
            <ListboxItem
              startContent={
                <div>
                  <Avatar src={student.imageUrl} />
                </div>
              }
              endContent={
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <ChevronRight size="18px" />
                </Button>
              }
              description={`Bài tập đã hoàn thành: ${data.result?.[student.id]?.total || 0}/${exercises.length}`}
              className="py-3"
              onPress={() => navigate(`/classes/${id}/student/${student.id}`)}
            >
              <p className="text-base">{student.name}</p>
            </ListboxItem>
          ))}
        </Listbox>
      )}
    </div>
  );
};

export default ClassStudents;
