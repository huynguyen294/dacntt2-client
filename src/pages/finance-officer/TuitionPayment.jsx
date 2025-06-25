import { ModuleLayout } from "@/layouts";
import { useParams } from "react-router";
import { useAppStore, useStudentStore } from "@/state";
import { Input } from "@heroui/input";
import { getCode, getYearCode, ORDER_BY_NAME } from "@/constants";
import { useEffect, useMemo, useState } from "react";
import { CurrencyInput, ImageLoading } from "@/components/common";
import { calcTotal, getVietQrQuickLink, shiftFormat } from "@/utils";
import { withStudentAdditionalReady } from "@/hocs";
import { Space } from "lucide-react";
import { Chip } from "@heroui/chip";
import { cn } from "@/lib/utils";
import { useMetadata, useServerList } from "@/hooks";
import { classApi, tuitionApi, tuitionDiscountApi } from "@/apis";
import { useQuery } from "@tanstack/react-query";
import { Avatar } from "@heroui/avatar";
import { Select, SelectItem } from "@heroui/select";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";

const TuitionPayment = () => {
  const [amount, setAmount] = useState();
  const [selectedClass, setSelectedClass] = useState();
  const [selectedStudent, setSelectedStudent] = useState();
  const { shiftObj } = useMetadata();

  const classList = useServerList("classes", classApi.get, {
    order: ORDER_BY_NAME,
    otherParams: ["fields=id,name,teacherId,shiftId,tuitionFee"],
    paging: false,
  });
  const mergedFilters = {};
  if (selectedClass) mergedFilters.classId = selectedClass;
  const studentResult = useQuery({
    queryKey: ["classes", selectedClass || null, "students", "refFields=:full", null],
    queryFn: () => (selectedClass ? classApi.getClassStudents(selectedClass, null, ["refFields=:full"]) : null),
  });

  const content = useMemo(() => {
    if (!selectedClass || !selectedStudent || !amount) return;

    return `${getYearCode()} ${getCode("user", selectedStudent)} ${getCode("class", selectedClass)}}`;
  }, [selectedClass, selectedStudent]);

  return (
    <ModuleLayout breadcrumbItems={[{ label: "Mã Qr thanh toán" }]}>
      <div className="px-2 sm:px-10 container mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-4 overflow-y-auto pb-12">
        <div className="col-span-1 space-y-10">
          <p className="text-xl font-bold">Thông tin học viên</p>
          <Select
            isVirtualized
            size="lg"
            label="Lớp học"
            aria-label="select"
            variant="bordered"
            className="min-w-[200px]"
            maxListboxHeight={265}
            itemHeight={50}
            items={classList.list}
            isLoading={classList.isLoading}
            listboxProps={classList.listboxProps}
            placeholder="Chọn lớp học"
            labelPlacement="outside"
            radius="sm"
            selectedKeys={selectedClass && new Set([selectedClass.toString()])}
            onSelectionChange={(keys) => {
              const classId = [...keys][0] && Number([...keys][0]);
              setSelectedStudent(null);
              setSelectedClass(classId);
            }}
          >
            {(item) => {
              return (
                <SelectItem key={item.id?.toString()} description={shiftFormat(shiftObj[item.shiftId])}>
                  {`${getCode("class", item.id)}: ${item.name}`}
                </SelectItem>
              );
            }}
          </Select>
          <Autocomplete
            selectedKey={selectedStudent && selectedStudent.toString()}
            isLoading={studentResult.isLoading}
            onSelectionChange={setSelectedStudent}
            size="lg"
            variant="bordered"
            label="Học sinh"
            radius="sm"
            labelPlacement="outside"
            placeholder="Chọn học sinh"
            listboxProps={{ emptyContent: "Vui lòng chọn lớp học" }}
            className="!mt-4"
          >
            {studentResult.data &&
              studentResult.data?.students.map((item) => (
                <AutocompleteItem
                  key={item.id.toString()}
                  startContent={
                    <div>
                      <Avatar src={item.imageUrl} />
                    </div>
                  }
                  description={item.email}
                >
                  {`${getCode("user", item.id)}: ${item.name}`}
                </AutocompleteItem>
              ))}
          </Autocomplete>
          <CurrencyInput
            variant="bordered"
            size="lg"
            label="Số tiền"
            labelPlacement="outside"
            radius="sm"
            value={amount}
            onBlur={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="col-span-1 sm:col-span-2 space-y-2">
          <div className="p-1 bg-default-50 flex justify-center rounded-lg my-4">
            <ImageLoading src={getVietQrQuickLink({ amount, content })}>
              {(loadingClass) => (
                <img
                  className={cn("w-[300px] h-[388px] rounded-lg", loadingClass)}
                  src={getVietQrQuickLink({ amount, content })}
                />
              )}
            </ImageLoading>
          </div>
          <p className="text-danger italic">
            <span className="font-semibold">Lưu ý:</span> nếu nội dung chuyển khoản không được điền tự động. Vui lòng
            nhập theo định dạng{" "}
            <Chip variant="flat" className="rounded">
              <span className="inline-flex items-end">
                [năm học 2 ký tự]
                <Space size="14px" />
                [mã học viên]
                <Space size="14px" />
                [mã lớp học]
              </span>
            </Chip>{" "}
            Ví dụ:{" "}
            <Chip variant="flat" className="rounded">
              25 HV1 LH1
            </Chip>
          </p>
          <p className="text-danger italic">
            Sau khi chuyển khoản thành công vui lòng theo dõi lịch sử thanh toán, nếu quá 48h mà hệ thống chưa cập nhật,
            vui lòng liên hệ trung tâm để được hỗ trợ
          </p>
          <p className="font-bold">
            Hỗ trợ: Phòng Tài chính kế toán (email: anhhuy2099@gmail.com - số điện thoại: 0987520403)
          </p>
        </div>
      </div>
    </ModuleLayout>
  );
};

export default TuitionPayment;
