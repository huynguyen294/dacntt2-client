import { topicApi } from "@/apis";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router";
import { Controller, Form, useForm } from "react-simple-formkit";

const TopicModal = ({ defaultValues = {}, onOpenChange, onSave }) => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const form = useForm();
  const { isError, errors, actions } = form;

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);

    if (defaultValues.id) {
      const result = await topicApi.update(defaultValues.id, { ...defaultValues, ...data });
      if (result.ok) {
        onOpenChange(false);
        onSave();
        queryClient.invalidateQueries({ queryKey: ["class-topics"] });
      } else {
        addToast({ color: "danger", title: "Lỗi!", description: result.message });
      }
      setLoading(false);
      return;
    }

    const result = await topicApi.create({ ...data, classId: id });
    if (result.ok) {
      onOpenChange(false);
      onSave();
      queryClient.invalidateQueries({ queryKey: ["class-topics"] });
    } else {
      addToast({ color: "danger", title: "Lỗi!", description: result.message });
    }
    setLoading(false);
  };

  return (
    <Modal isOpen={true} onOpenChange={onOpenChange} aria-labelledby="alo">
      <ModalContent>
        {({ onClose }) => (
          <Form form={form} onSubmit={handleSubmit}>
            <ModalHeader>{defaultValues.id ? "Sửa" : "Thêm"} chủ đề</ModalHeader>
            <ModalBody>
              <Controller
                name="name"
                defaultValue={defaultValues.name || ""}
                render={({ ref, name, defaultValue, value, setValue }) => (
                  <Input
                    isRequired
                    ref={ref}
                    label="Tên chủ đề"
                    placeholder="Nhập tên chủ đề"
                    defaultValue={defaultValue}
                    name={name}
                    value={value}
                    isInvalid={Boolean(errors.name)}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={(e) => {
                      let error = actions.getFieldValidity(e);
                      const newValue = e.target.value;
                      if (newValue.length > 100) error = "Tên phải ít hơn 100 kí tự";
                      actions.changeError("name", error);
                    }}
                    errorMessage={errors.name}
                    description={value.length + "/100"}
                  />
                )}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Hủy
              </Button>
              <Button isLoading={loading} color="primary" type="submit" isDisabled={isError}>
                {defaultValues.id ? "Lưu lại" : "Thêm"}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default TopicModal;
