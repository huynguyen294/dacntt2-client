import useClassData from "../hooks/useClassData";
import { Amount, Loader } from "@/components/common";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { ChevronRight } from "lucide-react";

const ClassStudents = () => {
  const { students, loading } = useClassData();

  return (
    <div>
      <div className="font-bold px-4 sm:px-10 inline-flex items-center">
        <p className="text-2xl">Học viên</p>
        <Amount className="ml-2 font-semibold">{students?.length}</Amount>
      </div>
      <Loader isLoading={loading} />
      <Listbox variant="flat" className="p-4 sm:px-10">
        {students.map((student) => (
          <ListboxItem
            startContent={
              <div>
                <Avatar src={student.imageUrl} />
              </div>
            }
            endContent={
              <Button isIconOnly radius="full" size="sm" variant="light">
                <ChevronRight size="18px" />
              </Button>
            }
            description="Bài tập hoàn thành: 6/10"
            className="py-3"
          >
            <p className="text-base">{student.name}</p>
          </ListboxItem>
        ))}
      </Listbox>
    </div>
  );
};

export default ClassStudents;
