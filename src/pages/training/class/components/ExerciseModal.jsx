import useExerciseData from "../hooks/useExerciseData";
import ReactQuill from "react-quill-new";
import useClassData from "../hooks/useClassData";
import { DATE_FORMAT } from "@/constants";
import { FullScreenModal } from "@/layouts";
import { Button, ButtonGroup } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { parseDateTime, parseDate, now, getLocalTimeZone } from "@internationalized/date";
import { format } from "date-fns";
import { Calendar1, ChevronDown, ClipboardPen, PenOff, Plus, Send, Users } from "lucide-react";
import { Controller, Form, useForm } from "react-simple-formkit";
import { DatePicker } from "@heroui/date-picker";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { useState } from "react";
import { exerciseApi, topicApi } from "@/apis";
import { useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/modal";

const ExerciseModal = ({ editMode, defaultValues = {}, onOpenChange, onSave = () => {} }) => {
  const queryClient = useQueryClient();
  const { data, classId } = useClassData();
  const { topics, isLoading } = useExerciseData();

  const form = useForm({ numberFields });
  const { isDirty, isError, actions } = form;
  const scheduleForm = useForm();

  const [saving, setSaving] = useState(false);
  const scheduleModal = useDisclosure();

  const handleSubmit = async (data, { isDraft = null, releaseDay = null } = {}) => {
    setSaving(true);

    if (editMode) {
      const result = await exerciseApi.update(defaultValues.id, { ...defaultValues, ...data, isDraft, releaseDay });
      if (result.ok) {
        onSave();
        queryClient.invalidateQueries({ queryKey: ["class-exercises"] });
        onOpenChange(false);
      } else {
        addToast({ color: "danger", title: "Lỗi!", description: result.message });
      }
      setSaving(false);
      return;
    }

    const result = await exerciseApi.create({ ...data, isDraft, classId, releaseDay });
    if (result.ok) {
      onSave();
      queryClient.invalidateQueries({ queryKey: ["class-exercises"] });
      onOpenChange(false);
    } else {
      addToast({ color: "danger", title: "Lỗi!", description: result.message });
    }

    setSaving(false);
  };

  const TopicId = ({ name, defaultValue, value, setValue }) => {
    const [inputValue, setInputValue] = useState("");
    const [adding, setAdding] = useState(false);

    const handleAddTopic = async () => {
      setAdding(true);
      const result = await topicApi.create({ name: inputValue, classId });
      if (result.ok) {
        setValue(result.created.id);
        queryClient.invalidateQueries({ queryKey: ["class-topics"] });
      } else {
        addToast({ color: "danger", title: "Lỗi!", description: result.message });
      }
      setAdding(false);
    };

    return (
      <Autocomplete
        size="lg"
        radius="sm"
        name={name}
        selectedKey={value && value.toString()}
        variant="bordered"
        label="Chủ đề"
        labelPlacement="outside"
        placeholder="Chọn chủ đề"
        isLoading={isLoading}
        onSelectionChange={(newValue) => {
          setValue(newValue);
          actions.instantChange();
        }}
        onInputChange={setInputValue}
        defaultSelectedKey={defaultValue}
        listboxProps={{
          emptyContent: (
            <Button
              isLoading={adding}
              size="sm"
              variant="light"
              startContent={<Plus size="16px" />}
              onPress={handleAddTopic}
            >
              Tạo {inputValue}
            </Button>
          ),
        }}
      >
        {topics.map((t) => (
          <AutocompleteItem key={t.id.toString()}>{t.name}</AutocompleteItem>
        ))}
      </Autocomplete>
    );
  };

  return (
    <>
      {scheduleModal.isOpen && (
        <Modal isOpen={true} onOpenChange={scheduleModal.onOpenChange}>
          <ModalContent>
            {({ onClose }) => (
              <Form
                form={scheduleForm}
                onSubmit={({ releaseDay }) =>
                  handleSubmit(actions.getFormState(), { releaseDay: releaseDay.replace(/\[.*\]$/, "") })
                }
              >
                <ModalHeader>Lên lịch cho bài tập</ModalHeader>
                <ModalBody>
                  <DatePicker
                    isRequired
                    hideTimeZone
                    size="lg"
                    name="releaseDay"
                    label="Chọn ngày, giờ"
                    labelPlacement="outside"
                    variant="bordered"
                    defaultValue={
                      defaultValues.releaseDay
                        ? parseDateTime(defaultValues.releaseDay.replace("Z", ""))
                        : now(getLocalTimeZone())
                    }
                    aria-labelledby="date-picker"
                    minValue={parseDate(format(new Date(), DATE_FORMAT))}
                    maxValue={parseDate(format(data.item.closingDay, DATE_FORMAT))}
                    onChange={actions.instantChange}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Hủy
                  </Button>
                  <Button color="primary" type="submit">
                    Lên lịch
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </ModalContent>
        </Modal>
      )}
      <FullScreenModal
        onOpenChange={onOpenChange}
        titleText="Bài tập"
        titleIcon={
          <div className="size-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 text-primary-foreground grid place-items-center">
            <ClipboardPen size="18px" />
          </div>
        }
        rightControls={
          <ButtonGroup className="gap-0.5" isDisabled={saving}>
            <Button
              isLoading={saving}
              color="primary"
              type="summit"
              form="exercise-form"
              isDisabled={!isDirty || isError || saving}
            >
              Giao bài
            </Button>
            <Dropdown>
              <DropdownTrigger>
                <Button isDisabled={!isDirty || isError || saving} color="primary" isIconOnly>
                  <ChevronDown size="16px" strokeWidth={3} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  startContent={<Send size="14px" />}
                  itemType="submit"
                  isDisabled={!isDirty || isError || saving}
                  onPress={() => handleSubmit(actions.getFormState())}
                >
                  Giao bài
                </DropdownItem>
                <DropdownItem
                  isDisabled={!isDirty || isError || saving}
                  startContent={<Calendar1 size="14px" />}
                  onPress={scheduleModal.onOpen}
                >
                  Lên lịch
                </DropdownItem>
                <DropdownItem
                  startContent={<PenOff size="14px" />}
                  isDisabled={!isDirty || isError || saving}
                  onPress={() => handleSubmit(actions.getFormState(), { isDraft: true })}
                >
                  Lưu bản nháp
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </ButtonGroup>
        }
      >
        <Form
          form={form}
          onSubmit={handleSubmit}
          id="exercise-form"
          className="container mx-auto max-w-5xl flex flex-col sm:flex-row px-2 sm:px-10 gap-4 mt-4"
        >
          <Card className="flex-1 sm:flex-1 min-w-[18rem] min-h-[30rem]">
            <CardBody className="flex flex-col gap-4 sm:p-6">
              <Input
                isRequired
                labelPlacement="outside"
                variant="bordered"
                label="Tiêu đề"
                placeholder="Nhập tiêu đề"
                name="title"
                size="lg"
                defaultValue={defaultValues.title}
              />
              <Controller
                name="description"
                defaultValue={defaultValues.description}
                render={({ ref, value, defaultValue, setValue }) => {
                  return (
                    <ReactQuill
                      ref={ref}
                      className="[&_.ql-toolbar]:rounded-t-medium [&_.ql-container]:rounded-b-medium [&_.ql-toolbar]:border-2 [&_.ql-container]:border-2 [&_.ql-toolbar]:border-default-200 [&_.ql-container]:border-default-200 [&_.ql-container]:shadow-sm [&_.ql-container]:min-h-40 [&_.ql-container]:text-medium"
                      theme="snow"
                      value={value || defaultValue}
                      onChange={(newValue) => {
                        setValue(newValue);
                        actions.instantChange();
                      }}
                    />
                  );
                }}
              />
            </CardBody>
          </Card>
          <Card className="min-w-[20rem] w-full sm:w-auto">
            <CardBody className="flex flex-col gap-4 sm:p-6">
              <Input
                isRequired
                labelPlacement="outside"
                variant="bordered"
                label="Lớp học"
                placeholder="Chọn lớp học"
                size="lg"
                isReadOnly
                value={data.item.name}
              />
              <DatePicker
                size="lg"
                name="dueDay"
                label="Ngày đến hạn"
                labelPlacement="outside"
                variant="bordered"
                defaultValue={defaultValues.dueDay && parseDate(format(defaultValues.dueDay, DATE_FORMAT))}
                aria-labelledby="date-picker"
                minValue={parseDate(format(new Date(), DATE_FORMAT))}
                maxValue={parseDate(format(data.item.closingDay, DATE_FORMAT))}
                onChange={actions.instantChange}
              />
              <Controller
                name="topicId"
                defaultValue={defaultValues.topicId && defaultValues.topicId.toString()}
                render={({ name, defaultValue, value, setValue }) => (
                  <TopicId name={name} defaultValue={defaultValue} value={value} setValue={setValue} />
                )}
              />
            </CardBody>
          </Card>
        </Form>
      </FullScreenModal>
    </>
  );
};

const numberFields = ["topicId"];

export default ExerciseModal;
