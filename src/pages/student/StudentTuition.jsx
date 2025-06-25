import { Table, TableProvider } from "@/components/common";
import { ModuleLayout } from "@/layouts";
import { useStudentStore } from "@/state";
import { arrayToObject, calcTotal, displayDate, localeString, orderBy } from "@/utils";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";

const StudentTuition = () => {
  const { classes, teachers, tuitions, tuitionDiscounts } = useStudentStore([
    "classes",
    "teachers",
    "tuitions",
    "tuitionDiscounts",
  ]);

  const teachersObj = arrayToObject(teachers);
  const histories = orderBy(tuitions.concat(tuitionDiscounts), (t) => new Date(t.date || t.createdAt).getTime(), {
    sortOrder: "desc",
  });

  return (
    <ModuleLayout breadcrumbItems={[{ label: "Học phí" }]}>
      <div className="px-2 sm:px-10 container mx-auto max-w-5xl overflow-y-auto">
        <p className="sm:px-4 text-lg font-bold">Học phí của tôi</p>
        <TableProvider
          value={{
            columns: [
              { name: "STT", uid: "index", disableSort: true },
              {
                name: "Lớp học",
                uid: "name",
                disableSort: true,
                render: (row) => {
                  const teacher = teachersObj[row.teacherId];
                  return (
                    <div className="space-y-1 h-full">
                      <p className="font-medium"> {row.name}</p>
                      <p className="text-foreground-500">Giáo viên: {teacher?.name}</p>
                      <p className="text-foreground-500">Đăng ký: {displayDate(row.enrollmentAt)}</p>
                    </div>
                  );
                },
              },
              {
                name: "Học phí",
                uid: "tuition",
                disableSort: true,
                render: (row) => {
                  const paid = tuitions.filter((t) => t.classId === row.id);
                  const discounts = tuitionDiscounts.filter((t) => t.classId === row.id);
                  const totalPaid = calcTotal(paid, "amount");
                  const totalDiscount = calcTotal(discounts, "amount");
                  const total = totalPaid + totalDiscount;

                  return (
                    <div className="space-y-1">
                      <p className="font-medium">Tổng cộng: {localeString(row.tuitionFee)}đ</p>
                      <p className="text-foreground-500">
                        Đã thanh toán: <span className="text-success-500">{localeString(total)}đ</span>
                      </p>
                      <p className="text-foreground-500">
                        Còn lại: <span className="text-danger-500">{localeString(row.tuitionFee - total)}đ</span>
                      </p>
                      <Button size="sm" color="primary">
                        Thanh toán
                      </Button>
                    </div>
                  );
                },
              },
            ],
          }}
        >
          <Table
            isHeaderSticky={false}
            classNames={{ wrapper: "shadow-none p-0 sm:p-4 [&_td]:px-1 sm:[&_td]:px-3 [&_th]:px-1 sm:[&_th]:px-3" }}
            selectionMode="none"
            rows={orderBy(classes, (c) => new Date(c.closingDay).getTime())}
          />
        </TableProvider>
        <p className="sm:px-4 text-lg font-bold mt-4">Lịch sử thanh toán</p>
        <TableProvider
          value={{
            columns: [
              { name: "STT", uid: "index", disableSort: true },
              {
                name: "Ngày thanh toán",
                uid: "name",
                disableSort: true,
                render: (row) => displayDate(row.date || row.createdAt),
              },
              {
                name: "Số tiền",
                uid: "amount",
                disableSort: true,
                render: (row) => localeString(row.amount) + "đ",
              },
              {
                name: "Mã thanh toán",
                uid: "content",
                disableSort: true,
                render: (row) =>
                  row.content || (
                    <Chip size="sm" color="warning" variant="flat">
                      Miễn giảm - {row.reason}
                    </Chip>
                  ),
              },
            ],
          }}
        >
          <Table
            isHeaderSticky={false}
            classNames={{ wrapper: "shadow-none p-0 sm:p-4 [&_td]:px-1 sm:[&_td]:px-3 [&_th]:px-1 sm:[&_th]:px-3" }}
            selectionMode="none"
            rows={histories}
          />
        </TableProvider>
      </div>
    </ModuleLayout>
  );
};

export default StudentTuition;
