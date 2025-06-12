import { EmptyMessage, ExerciseList } from "@/components";
import { useNavigate } from "@/hooks";
import { useStudentStore } from "@/state";
import { Divider } from "@heroui/divider";
import { Ban } from "lucide-react";
import { useParams } from "react-router";

const ClassExercise = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const { classTopics, classExercises } = useStudentStore(["classExercises", "classTopics"]);

  const topics = classTopics.filter((ct) => ct.classId === +classId);
  const exercises = classExercises.filter(
    (ce) => ce.classId === +classId && !ce.isDraft && (!ce.releaseDay || new Date(ce.releaseDay) < new Date())
  );

  return (
    <div className="space-y-4">
      {!exercises?.length && <EmptyMessage message="Chưa có bài tập nào" />}
      <ExerciseList
        exercises={exercises.filter((e) => !e.topicId)}
        onAction={(exercise) => navigate(`/classes/${classId}/exercise/${exercise.id}`)}
      />
      {[...topics].reverse().map((topic) => {
        const filtered = exercises.filter((exercise) => exercise.topicId === topic.id);
        if (!filtered.length) return null;

        return (
          <div key={topic.id}>
            <div className="flex items-center justify-between">
              <p className="m-4 text-2xl font-semibold">{topic.name}</p>
            </div>
            <Divider className="m-2" />
            <ExerciseList
              exercises={filtered}
              onAction={(exercise) => navigate(`/classes/${classId}/exercise/${exercise.id}`)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ClassExercise;
