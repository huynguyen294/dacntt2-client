import { exerciseApi } from "@/apis";
import { DropDown, Loader } from "@/components/common";
import { useDisclosure } from "@heroui/modal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipboardPen, Edit, Trash2 } from "lucide-react";
import { useParams } from "react-router";
import ExerciseModal from "./ExerciseModal";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Divider } from "@heroui/divider";

const ExerciseInfo = () => {
  const queryClient = useQueryClient();
  const { classId, exerciseId } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["class-exercises", classId, exerciseId],
    queryFn: () => exerciseApi.getById(exerciseId),
  });

  const deleteExerciseModal = useDisclosure();
  const exerciseModal = useDisclosure();

  const handleDeleteExercise = async () => {
    if (!data.item.id) return;
    const result = await exerciseApi.delete(data.item.id);
    if (result.ok) {
      deleteExerciseModal.onClose();
      queryClient.invalidateQueries({ queryKey: ["class-exercises"] });
    } else {
      addToast({ color: "danger", title: "Lỗi!", description: result.message });
    }
  };

  return (
    <div>
      <Loader isLoading={isLoading} />
      {exerciseModal.isOpen && (
        <ExerciseModal editMode defaultValues={data.item} onOpenChange={exerciseModal.onOpenChange} />
      )}
      {deleteExerciseModal.isOpen && (
        <ConfirmDeleteDialog
          isOpen
          title="Xóa bài"
          message="Bài tập này sẽ bị xóa khỏi hệ thống"
          onDelete={handleDeleteExercise}
          onClose={deleteExerciseModal.onClose}
        />
      )}
      {data && (
        <div className="flex gap-2 w-full">
          <div
            className={
              "size-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 text-primary-foreground grid place-items-center"
            }
          >
            <ClipboardPen size="18px" />
          </div>
          <div className="w-full">
            <div className="flex justify-between w-full">
              <div className="flex items-center">
                <p className="text-3xl">{data.item.title}</p>
              </div>
              <div className="flex items-center gap-2">
                {data.item.dueDay && (
                  <p className="text-foreground-500 text-sm">
                    Đến hạn {format(new Date(data.item.dueDay), "dd MMM", { locale: vi })}
                  </p>
                )}
                <DropDown
                  variant="vertical"
                  onAction={(key) => {
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
            <p className="mt-2 text-foreground-500">
              Đã đăng vào {format(new Date(data.item.createdAt), "dd MMM", { locale: vi })}
            </p>
            <Divider className="my-4" />
            <div dangerouslySetInnerHTML={{ __html: data.item.description }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseInfo;
