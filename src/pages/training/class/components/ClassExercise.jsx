import React, { useState } from "react";
import useClassData from "../hooks/useClassData";
import ExerciseModal from "./ExerciseModal";
import useExerciseData from "../hooks/useExerciseData";
import TopicModal from "./TopicModal";
import { DropDown, Loader } from "@/components/common";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Button } from "@heroui/button";
import {
  Dropdown as HerouiDropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@heroui/dropdown";
import { useDisclosure } from "@heroui/modal";
import { ClipboardCheck, ClipboardPen, Edit, MoveRight, Plus, Repeat2, TableProperties, Trash2 } from "lucide-react";
import { addToast } from "@heroui/toast";
import { Divider } from "@heroui/divider";
import { ConfirmDeleteDialog, ExerciseList } from "@/components";
import { exerciseApi, topicApi } from "@/apis";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@/hooks";
import { useParams } from "react-router";

const ClassExercise = () => {
  useClassData();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { classId } = useParams();
  const { fullExercises, exercises, topics, isLoading, ready } = useExerciseData();
  const topicModal = useDisclosure();
  const exerciseModal = useDisclosure();
  const deleteTopicModal = useDisclosure();
  const deleteExerciseModal = useDisclosure();

  console.log(classId);

  const [selectedTopic, setSelectedTopic] = useState({});
  const [selectedExercise, setSelectedExercise] = useState({});

  const handleDeleteTopic = async () => {
    if (!selectedTopic.id) return;
    const result = await topicApi.delete(selectedTopic.id);
    if (result.ok) {
      deleteTopicModal.onClose();
      queryClient.invalidateQueries({ queryKey: ["class-topics"] });
      queryClient.invalidateQueries({ queryKey: ["class-exercises"] });
    } else {
      addToast({ color: "danger", title: "Lỗi!", description: result.message });
    }
    setSelectedTopic({});
  };

  const handleDeleteExercise = async () => {
    if (!selectedExercise.id) return;
    const result = await exerciseApi.delete(selectedExercise.id);
    if (result.ok) {
      deleteExerciseModal.onClose();
      queryClient.invalidateQueries({ queryKey: ["class-exercises"] });
    } else {
      addToast({ color: "danger", title: "Lỗi!", description: result.message });
    }
    setSelectedExercise({});
  };

  const renderExerciseControls = (exercise) => (
    <DropDown
      variant="vertical"
      onAction={(key) => {
        setSelectedExercise(exercise);
        if (key === "edit") exerciseModal.onOpen();
        if (key === "delete") deleteExerciseModal.onOpen();
      }}
      menuItems={[
        { key: "edit", label: "Chỉnh sửa", startContent: <Edit size="16px" /> },
        { key: "delete", label: "Xóa", startContent: <Trash2 size="16px" />, color: "danger" },
      ]}
    />
  );

  return (
    <div>
      {topicModal.isOpen && (
        <TopicModal
          editMode={Boolean(selectedTopic.id)}
          defaultValues={selectedTopic}
          onOpenChange={(open) => {
            topicModal.onOpenChange(open);
            if (!open) setSelectedTopic({});
          }}
          onSave={() => setSelectedTopic({})}
        />
      )}
      {exerciseModal.isOpen && (
        <ExerciseModal
          editMode={Boolean(selectedExercise.id)}
          defaultValues={selectedExercise}
          onOpenChange={(open) => {
            exerciseModal.onOpenChange(open);
            if (!open) setSelectedExercise({});
          }}
          onSave={() => setSelectedExercise({})}
        />
      )}
      {deleteTopicModal.isOpen && (
        <ConfirmDeleteDialog
          isOpen={true}
          title="Xóa chủ đề"
          message="Các bài tập của chủ đề này sẽ không bị xóa"
          onDelete={handleDeleteTopic}
          onClose={deleteTopicModal.onClose}
        />
      )}
      {deleteExerciseModal.isOpen && (
        <ConfirmDeleteDialog
          isOpen={true}
          title="Xóa bài"
          message="Bài tập này sẽ bị xóa khỏi hệ thống"
          onDelete={handleDeleteExercise}
          onClose={deleteExerciseModal.onClose}
        />
      )}
      <Loader isLoading={isLoading} />
      {ready && (
        <div className="space-y-8">
          <HerouiDropdown showArrow>
            <DropdownTrigger>
              <Button variant="shadow" radius="full" color="primary" startContent={<Plus />}>
                Tạo
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownSection showDivider>
                <DropdownItem startContent={<ClipboardCheck size="16px" />} onPress={exerciseModal.onOpen}>
                  Bài tập
                </DropdownItem>
                <DropdownItem
                  startContent={<Repeat2 size="16px" />}
                  onPress={() => {
                    addToast({ color: "danger", title: "Lỗi!", description: "Tính năng chưa hỗ trợ" });
                  }}
                >
                  Sử dụng lại bài tập
                </DropdownItem>
              </DropdownSection>
              <DropdownSection>
                <DropdownItem startContent={<TableProperties size="16px" />} onPress={topicModal.onOpen}>
                  Chủ đề
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </HerouiDropdown>
          <ExerciseList
            exercises={fullExercises.filter((e) => new Date(e.releaseDay) > new Date())}
            renderControls={renderExerciseControls}
            onAction={(exercise) => navigate(`/classes/${classId}/exercise/${exercise.id}`)}
          />
          <ExerciseList
            exercises={fullExercises.filter((e) => e.isDraft)}
            renderControls={renderExerciseControls}
            onAction={(exercise) => navigate(`/classes/${classId}/exercise/${exercise.id}`)}
          />
          <ExerciseList
            exercises={exercises.filter((e) => !e.topicId)}
            renderControls={renderExerciseControls}
            onAction={(exercise) => navigate(`/classes/${classId}/exercise/${exercise.id}`)}
          />
          {topics.map((topic) => {
            const filtered = exercises.filter((e) => e.topicId === topic.id);
            if (!filtered.length) return null;

            return (
              <div key={topic.id}>
                <div className="flex items-center justify-between">
                  <p className="m-4 text-2xl font-semibold">{topic.name}</p>
                  <DropDown
                    btnClass="mr-9"
                    variant="vertical"
                    onAction={(key) => {
                      setSelectedTopic(topic);
                      if (key === "edit") topicModal.onOpen();
                      if (key === "delete") deleteTopicModal.onOpen();
                    }}
                    menuItems={[
                      { key: "edit", label: "Chỉnh sửa", startContent: <Edit size="16px" /> },
                      { key: "delete", label: "Xóa", startContent: <Trash2 size="16px" />, color: "danger" },
                    ]}
                  />
                </div>
                <Divider className="m-2" />
                {
                  <ExerciseList
                    exercises={filtered}
                    renderControls={renderExerciseControls}
                    onAction={(exercise) => navigate(`/classes/${classId}/exercise/${exercise.id}`)}
                  />
                }
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClassExercise;
