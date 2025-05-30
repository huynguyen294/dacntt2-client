import { classApi } from "@/apis";
import { Loader } from "@/components/common";
import { ORDER_BY_NAME } from "@/constants";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { Input } from "@heroui/input";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, CircleCheckBig, ListChecks, OctagonX } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";

const ExerciseCheck = () => {
  const { id } = useParams();
  const { isLoading, data } = useQuery({
    queryKey: ["classes", id, "students", "refFields=:full"],
    queryFn: () => classApi.getClassStudents(id, ORDER_BY_NAME, ["refFields=:full"]),
  });

  const [selectedList, setSelectedList] = useState([]);

  return (
    <div>
      <Loader isLoading={isLoading} />
      {data && (
        <>
          <Dropdown showArrow>
            <DropdownTrigger>
              <Button
                isDisabled={!selectedList.length}
                className="mb-4"
                variant="shadow"
                color="primary"
                endContent={<ChevronDown size="16px" strokeWidth={3} />}
              >
                Thao tác
              </Button>
            </DropdownTrigger>
            <DropdownMenu variant="flat">
              <DropdownItem startContent={<ListChecks size="14px" />}>Chấm điểm hàng loạt</DropdownItem>
              <DropdownItem color="success" startContent={<CircleCheckBig size="14px" />}>
                Đánh dấu là đã nộp
              </DropdownItem>
              <DropdownItem color="danger" startContent={<OctagonX size="14px" />}>
                Đánh dấu là chưa nộp
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <table>
            {data.students.map((student) => (
              <tr>
                <td className="pr-4">
                  <Checkbox
                    size="lg"
                    onChange={(e) =>
                      e.target.checked
                        ? setSelectedList((prev) => [...prev, student.id])
                        : setSelectedList((prev) => prev.filter((id) => id !== student.id))
                    }
                  />
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Avatar src={student.imageUrl} />{" "}
                    <div>
                      <p>{student.name}</p>
                      <p className="text-sm font-semibold text-primary">Đã nộp</p>
                    </div>
                  </div>
                </td>
                <td className="p-2 pl-6">
                  <Input></Input>
                </td>
              </tr>
            ))}
          </table>
        </>
      )}
    </div>
  );
};

export default ExerciseCheck;
