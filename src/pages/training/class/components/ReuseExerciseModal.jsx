import { classApi, exerciseApi } from "@/apis";
import { Modal } from "@/components/common";
import { ORDER_BY_NAME } from "@/constants";
import { useServerList } from "@/hooks";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Button } from "@heroui/button";
import { ModalBody, ModalFooter, ModalHeader } from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const ReuseExerciseModal = ({ isOpen, onOpenChange, onSelect }) => {
  const [selectedClass, setSelectedClass] = useState();
  const [selectedExercise, setSelectedExercise] = useState();
  const [loading, setLoading] = useState(false);

  const classList = useServerList("classes", classApi.get, { order: ORDER_BY_NAME, paging: false });
  const { isLoading, data } = useQuery({
    queryKey: ["classes", selectedClass, "class-exercises"],
    queryFn: () => (selectedClass ? exerciseApi.get(null, null, null, { classId: selectedClass }) : null),
  });

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
      <ModalHeader>Chọn lớp</ModalHeader>
      <ModalBody className="flex flex-col gap-4">
        <Select
          size="lg"
          variant="bordered"
          label="Lớp học"
          radius="sm"
          labelPlacement="outside"
          placeholder="Tìm theo tên lớp học"
          isVirtualized
          maxListboxHeight={265}
          itemHeight={40}
          items={classList.list}
          isLoading={classList.isLoading}
          listboxProps={classList.listboxProps}
          selectedKeys={selectedClass && new Set([selectedClass])}
          onSelectionChange={(keys) => {
            const classId = [...keys][0];
            setSelectedClass(classId);
          }}
        >
          {(item) => <SelectItem key={item.id?.toString()}>{item.name}</SelectItem>}
        </Select>
        <Autocomplete
          size="lg"
          variant="bordered"
          label="Lớp học"
          radius="sm"
          labelPlacement="outside"
          placeholder="Chọn bài tập"
          isLoading={isLoading}
          selectedKey={selectedExercise}
          listboxProps={{ emptyContent: !selectedClass ? "Vui lòng chọn lớp" : "No results found." }}
          onSelectionChange={setSelectedExercise}
        >
          {data &&
            data.rows.map(
              (item) => !item.isDraft && <AutocompleteItem key={item.id?.toString()}>{item.title}</AutocompleteItem>
            )}
        </Autocomplete>
      </ModalBody>
      <ModalFooter>
        <Button variant="light" color="danger" onPress={() => onOpenChange(false)}>
          Hủy
        </Button>
        <Button
          color="primary"
          isDisabled={!selectedClass || !selectedExercise}
          onPress={async () => {
            setLoading(true);
            await onSelect(selectedExercise);
            setLoading(false);
          }}
        >
          Sử dụng
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ReuseExerciseModal;
