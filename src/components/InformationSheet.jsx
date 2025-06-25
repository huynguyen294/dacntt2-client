import { API, getServerErrorMessage } from "@/apis";
import { useAppStore } from "@/state";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { Loader } from "./common";
import ReactQuill from "react-quill-new";

const InformationSheet = () => {
  const user = useAppStore("user");
  const editModal = useDisclosure();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await API.patch("/api-v1/info-sheet/true", { content: value });
    } catch (error) {
      addToast({ color: "danger", title: "Lỗi!", description: getServerErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const getData = async () => {
        const result = await API.get("/api-v1/info-sheet/true");
        const item = result.data.item;
        localStorage.setItem("infoSheet", JSON.stringify(item));
        setValue(result.data.item.content);
      };

      try {
        const cacheValue = localStorage.getItem("infoSheet");
        if (cacheValue) {
          setValue(JSON.parse(cacheValue).content);
          getData();
        } else {
          setLoading(true);
          await getData();
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

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
                  <Button color="danger" variant="light" onPress={editModal.onClose}>
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
        <Card shadow="sm">
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
          <Loader isLoading={loading} />
          <div className="p-2 sm:p-6" dangerouslySetInnerHTML={{ __html: value }}></div>
        </Card>
      </div>
    </div>
  );
};

export default InformationSheet;
