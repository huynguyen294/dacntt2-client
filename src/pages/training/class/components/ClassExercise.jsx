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
import { ConfirmDeleteDialog } from "@/components";
import { exerciseApi, topicApi } from "@/apis";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useNavigate } from "@/hooks";
import { useParams } from "react-router";

const ClassExercise = () => {
  useClassData();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { fullExercises, exercises, topics, isLoading, ready } = useExerciseData();
  const topicModal = useDisclosure();
  const exerciseModal = useDisclosure();
  const deleteTopicModal = useDisclosure();
  const deleteExerciseModal = useDisclosure();

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

  const renderExercises = (filtered) => {
    if (!filtered.length) return null;

    return (
      <Accordion variant="splitted" className="mt-4" selectionMode="multiple">
        {filtered.map((exercise) => {
          let helperText = "";
          if (new Date(exercise.releaseDay) > new Date()) {
            helperText = "Đã lên lịch vào " + format(new Date(exercise.releaseDay), "dd MMM", { locale: vi });
          } else if (exercise.isDraft) {
            helperText = "Bản nháp";
          } else if (exercise.dueDay) {
            helperText = "Đến hạn " + format(new Date(exercise.dueDay), "dd MMM", { locale: vi });
          } else {
            helperText = "Đã đăng vào " + format(new Date(exercise.createdAt), "dd MMM", { locale: vi });
          }

          const notAvailable = exercise.isDraft || exercise.releaseDay;

          return (
            <AccordionItem
              classNames={{ trigger: "border-b-1" }}
              startContent={
                <div
                  className={cn(
                    "size-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 text-primary-foreground grid place-items-center",
                    notAvailable && "from-foreground-300 to-foreground-300"
                  )}
                >
                  <ClipboardPen size="18px" />
                </div>
              }
              key={exercise.id}
              aria-label={exercise.title}
              title={
                <div className="w-full flex-1 flex justify-between">
                  <p className="text-base font-semibold text-foreground-700">{exercise.title}</p>
                  <div className="flex items-center gap-1">
                    <p className={cn("text-[12px] text-foreground-500", notAvailable && "italic font-semibold")}>
                      {helperText}
                    </p>
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
                  </div>
                </div>
              }
              indicator={<div />}
            >
              <div className="pb-4">
                <p className="mb-4 text-small text-foreground-500">
                  {!exercise.dueDay
                    ? "Không có ngày đến hạn"
                    : "Đã đăng vào " + format(new Date(exercise.createdAt), "dd MMM", { locale: vi })}
                </p>
                <div dangerouslySetInnerHTML={{ __html: exercise.description }} />
                <Button
                  endContent={<MoveRight size="14px" />}
                  size="sm"
                  className="text-background bg-foreground mt-4"
                  onPress={() => {
                    if (notAvailable) {
                      setSelectedExercise(exercise);
                      exerciseModal.onOpen();
                      return;
                    }

                    navigate(`/classes/${id}/exercise/${exercise.id}`);
                  }}
                >
                  {notAvailable ? "Chỉnh sửa bài tập" : "Xem chi tiết"}
                </Button>
              </div>
            </AccordionItem>
          );
        })}
      </Accordion>
    );
  };

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
          {renderExercises(fullExercises.filter((e) => new Date(e.releaseDay) > new Date()))}
          {renderExercises(fullExercises.filter((e) => e.isDraft))}
          {renderExercises(exercises.filter((e) => !e.topicId))}
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
                {renderExercises(filtered)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClassExercise;
