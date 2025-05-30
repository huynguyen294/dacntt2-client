import { exerciseApi, topicApi } from "@/apis";
import { ORDER_BY_NAME } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

const useExerciseData = () => {
  const { id } = useParams();
  const topicResult = useQuery({
    queryKey: ["class-topics", id],
    queryFn: () => topicApi.get(null, ORDER_BY_NAME, null, { classId: id }),
  });
  const exerciseResult = useQuery({
    queryKey: ["class-exercises", id],
    queryFn: () => exerciseApi.get(null, { orderBy: "title", order: "asc" }, null, { classId: id }),
  });

  const isLoading = topicResult.isLoading || exerciseResult.isLoading;
  const ready = Boolean(topicResult.data) && Boolean(exerciseResult.data);

  const fullExercises = exerciseResult.data?.rows || [];
  const exercises = fullExercises.filter((e) => !e.isDraft && (!e.releaseDay || new Date(e.releaseDay) < new Date()));

  return {
    isLoading,
    ready,
    topics: topicResult.data?.rows || [],
    fullExercises,
    exercises,
  };
};

export default useExerciseData;
