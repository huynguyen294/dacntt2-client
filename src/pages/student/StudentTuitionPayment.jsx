import { ModuleLayout } from "@/layouts";
import { tuitionPaymentBreadcrumbItems } from "./constants";
import { useParams } from "react-router";
import { useAppStore, useStudentStore } from "@/state";
import { Input } from "@heroui/input";
import { getCode, getYearCode } from "@/constants";
import { useEffect, useState } from "react";
import { CurrencyInput, ImageLoading } from "@/components/common";
import { calcTotal, getVietQrQuickLink } from "@/utils";
import { withStudentAdditionalReady } from "@/hocs";
import { Space } from "lucide-react";
import { Chip } from "@heroui/chip";
import { cn } from "@/lib/utils";

const StudentTuitionPayment = () => {
  const user = useAppStore("user");
  const { classes, tuitions, tuitionDiscounts } = useStudentStore(["classes", "tuitions", "tuitionDiscounts"]);
  const { classId } = useParams();
  const foundClass = classes.find((c) => c.id == classId);

  const [amount, setAmount] = useState();

  useEffect(() => {
    const paid = tuitions.filter((t) => t.classId == classId);
    const discounts = tuitionDiscounts.filter((t) => t.classId == classId);
    const totalPaid = calcTotal(paid, "amount");
    const totalDiscount = calcTotal(discounts, "amount");
    const total = totalPaid + totalDiscount;
    console.log(foundClass.tuitionFee - total);
    setAmount(foundClass.tuitionFee - total);
  }, [classId, classes, tuitions, tuitionDiscounts, user]);

  const content = `${getYearCode()} ${getCode("user", user.id)} ${getCode("class", foundClass.id)} ${user.email} ${
    user.phoneNumber
  }`;

  return (
    <ModuleLayout breadcrumbItems={tuitionPaymentBreadcrumbItems}>
      <div className="px-2 sm:px-10 container mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-4 overflow-y-auto">
        <div className="col-span-1 space-y-10 sm:space-y-12">
          <p className="text-xl font-bold">Thông tin học viên</p>
          <Input size="lg" label="Mã học viên" labelPlacement="outside" isReadOnly value={getCode("user", user.id)} />
          <Input size="lg" label="Tên học viên" labelPlacement="outside" isReadOnly value={user.name} />
          <Input
            size="lg"
            label="Mã lớp học"
            labelPlacement="outside"
            isReadOnly
            value={getCode("class", foundClass.id)}
          />
          <Input size="lg" label="Lớp học" labelPlacement="outside" isReadOnly value={foundClass.name} />
          <CurrencyInput
            size="lg"
            label="Số tiền"
            labelPlacement="outside"
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

export default withStudentAdditionalReady(StudentTuitionPayment, ModuleLayout);
