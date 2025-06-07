import { API, getServerErrorMessage } from "@/apis";
import { useAppStore } from "@/state";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import { Loader } from "./common";

const InformationSheet = () => {
  const user = useAppStore("user");
  const editModal = useDisclosure();
  const queryClient = useQueryClient();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const { isLoading, data } = useQuery({ queryKey: ["info-sheet"], queryFn: () => API.get("/api-v1/info-sheet/true") });

  const handleSave = async () => {
    setLoading(true);
    try {
      await API.patch("/api-v1/info-sheet/true", { content: value });
      queryClient.invalidateQueries({ queryKey: ["info-sheet"] });
    } catch (error) {
      addToast({ color: "danger", title: "Lỗi!", description: getServerErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data?.data?.item?.content) {
      setValue(data?.data?.item?.content);
    }
  }, [data]);

  return (
    <div className="p-2 sm:p-6">
      {editModal.isOpen && (
        <Modal isOpen size="5xl" onOpenChange={editModal.onOpenChange}>
          <ModalContent>
            {() => (
              <>
                <ModalHeader>Sửa bảng tin</ModalHeader>
                <ModalBody>
                  <ReactQuill
                    className="[&_.ql-toolbar]:rounded-t-medium [&_.ql-container]:rounded-b-medium [&_.ql-toolbar]:border-2 [&_.ql-container]:border-2 [&_.ql-toolbar]:border-default-200 [&_.ql-container]:border-default-200 [&_.ql-container]:shadow-sm [&_.ql-container]:min-h-40 [&_.ql-container]:text-medium"
                    theme="snow"
                    value={value}
                    onChange={setValue}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light">
                    Hủy
                  </Button>
                  <Button isLoading={loading} color="primary" onPress={handleSave}>
                    Lưu lại
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
      <div className="container mx-auto max-w-3xl">
        <Card>
          <div className="p-2 text-center font-bold bg-primary text-primary-foreground text-lg relative">
            <p>BẢNG THÔNG TIN</p>

            {user?.role === "admin" && (
              <Button
                size="sm"
                isIconOnly
                className="absolute top-1 right-2"
                variant="light"
                onPress={editModal.onOpen}
              >
                <Edit size="20px" className="text-primary-foreground" />
              </Button>
            )}
          </div>
          <Divider />
          <Loader isLoading={isLoading} />
          <div className="p-2 sm:p-6" dangerouslySetInnerHTML={{ __html: data?.data?.item?.content }}></div>
        </Card>
      </div>
    </div>
  );
};

export default InformationSheet;
