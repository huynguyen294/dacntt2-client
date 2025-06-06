import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { ImageLoading, Table, TableProvider } from "./common";
import { cn } from "@/lib/utils";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { alpha, displayDate, localeString } from "@/utils";
import { EMPLOYEE_ROLES, ROLE_PALLET } from "@/constants";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/apis";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Ban, Trash2 } from "lucide-react";
import { useParams } from "react-router";

const UserDetailModal = ({ user, onOpenChange }) => {
  const { role } = useParams();

  const { data } = useQuery({
    queryKey: ["users", "detail", user.id, "refs=true"],
    queryFn: () => userApi.getById(user.id, { refs: true }),
  });

  const handleDelete = () => {};

  return (
    <Modal size="5xl" isOpen={true} onOpenChange={onOpenChange}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">Thông tin chi tiết</ModalHeader>
            <ModalBody>
              <div className="h-[80dvh] sm:h-[75dvh] overflow-y-auto space-y-4 pb-10">
                <div className="rounded-large border p-3 sm:p-4 py-6 flex gap-4">
                  <ImageLoading src={user.imageUrl}>
                    {(loadingClass) => (
                      <Avatar
                        alt="avt"
                        src={user.imageUrl}
                        className={cn("size-[5rem] sm:size-[7rem] rounded-full", loadingClass)}
                      />
                    )}
                  </ImageLoading>
                  <div className="flex flex-col justify-center">
                    <p className="text-xl font-semibold">{user.name}</p>
                    <p className="text-foreground-700 pl-0.5">{user.email}</p>
                    <Chip
                      className="capitalize bg-[var(--current-color)] mt-1"
                      size="sm"
                      variant="flat"
                      style={{ "--current-color": alpha(ROLE_PALLET[user.role], 0.2) }}
                    >
                      {user.role}
                    </Chip>
                  </div>
                </div>
                <div className="rounded-large border p-3 sm:p-4 py-6 gap-4">
                  <p className="font-bold">Thông tin cá nhân</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 w-full mt-4 gap-3">
                    <div>
                      <p className="font-semibold text-foreground-500">Giới tính</p>
                      <p className="font-semibold">{user.gender || "Không có"}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground-500">Ngày sinh</p>
                      <p className="font-semibold">{displayDate(user.dateOfBirth) || "Không có"}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground-500">Số điện thoại</p>
                      <p className="font-semibold">{user.phoneNumber || "Không có"}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground-500">Địa chỉ</p>
                      <p className="font-semibold">{user.address || "Không có"}</p>
                    </div>
                  </div>
                </div>

                {EMPLOYEE_ROLES.includes(role) && (
                  <div className="rounded-large border p-3 sm:p-4 py-6 gap-4">
                    <p className="font-bold">Thông tin nhân sự</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 w-full mt-4 gap-3">
                      <div>
                        <p className="font-semibold text-foreground-500">Loại lao động</p>
                        <p className="font-semibold">{user.employmentType || "Không có"}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground-500">Lương cơ bản</p>
                        <p className="font-semibold">{localeString(user.salary)}đ</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground-500">Ngày vào làm</p>
                        <p className="font-semibold">
                          {user.startDate ? format(new Date(user.startDate), "dd/MM/yyyy") : "Không có"}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground-500">Chuyên môn</p>
                        <p className="font-semibold">{user.major || "Không có"}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground-500">Bằng cấp</p>
                        <p className="font-semibold">{user.certificates || "Không có"}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground-500">Trạng thái</p>
                        <p className="font-semibold">{user.status || "Không có"}</p>
                      </div>
                    </div>
                  </div>
                )}

                {["student", "teacher"].includes(role) && data?.refs?.classes?.length > 0 && (
                  <div className="rounded-large border p-3 sm:p-4 py-6 gap-4">
                    <p className="font-bold">Lớp học {user.role === "teacher" ? "đang dạy" : "đang học"}</p>
                    <TableProvider
                      value={{
                        columns: [
                          { uid: "index", name: "STT", disableSort: true },
                          { uid: "name", name: "Tên lớp", disableSort: true },
                          { uid: "weekDays", name: "Ngày học", disableSort: true },
                          { uid: "openingDay", name: "Ngày khai giảng", disableSort: true },
                          { uid: "closingDay", name: "Ngày kết thúc", disableSort: true },
                          user.role === "student" && { uid: "actions", name: "Thao tác", disableSort: true },
                        ],
                      }}
                    >
                      <Table
                        isHeaderSticky={false}
                        classNames={{ wrapper: "shadow-none p-0 rounded-none" }}
                        rows={data?.refs?.classes || []}
                        selectionMode="none"
                        renderCell={(rowData, columnKey, index) => {
                          let cellValue = rowData[columnKey];
                          if (columnKey === "index") cellValue = index + 1;
                          const dateFields = ["openingDay", "closingDay"];
                          if (dateFields.includes(columnKey)) {
                            cellValue = displayDate(cellValue);
                          }

                          if (columnKey === "actions") {
                            return (
                              <Tooltip color="danger" content="Xóa học sinh khỏi lớp">
                                <Button
                                  onClick={(e) => e.stopPropagation()}
                                  onPress={handleDelete}
                                  isDisabled
                                  size="sm"
                                  color="danger"
                                  isIconOnly
                                  radius="full"
                                  variant="light"
                                >
                                  <Trash2 size="18px" />
                                </Button>
                              </Tooltip>
                            );
                          }

                          return cellValue;
                        }}
                      />
                    </TableProvider>
                  </div>
                )}

                {user.role === "student" && (
                  <div className="rounded-large border p-3 sm:p-4 py-6 gap-4">
                    <p className="font-bold">Lịch sử thanh toán học phí</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 w-full mt-4 space-y-3">
                      <div className="col-span-1 sm:col-span-2 h-20 flex justify-center items-center">
                        <Ban size="12px" className="mr-1" /> Không có dữ liệu
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UserDetailModal;
