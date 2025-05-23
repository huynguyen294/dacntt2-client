import { COURSE_LEVELS } from "@/constants";
import { cn } from "@/lib/utils";
import { displayDate, localeString, shiftFormat } from "@/utils";
import { Chip } from "@heroui/chip";

const ClassDetail = ({ data, className, refs = {} }) => {
  const { teacher, shift, studentCount } = refs;

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 w-full gap-3", className)}>
      <div>
        <p className="font-semibold text-foreground-500">Tên</p>
        <p className="font-semibold">{data.name || "Không có"}</p>
      </div>
      <div>
        <p className="font-semibold text-foreground-500">Giáo viên</p>
        <div className="font-semibold">{teacher?.name || "Không có"}</div>
      </div>
      <div>
        <p className="font-semibold text-foreground-500">Lịch học</p>
        <p className="font-semibold">{data.weekDays || "Không có"}</p>
      </div>
      <div>
        <p className="font-semibold text-foreground-500">Ca học</p>
        <p className="font-semibold">{`${shift?.name} (${shiftFormat(shift)})`}</p>
      </div>
      <div>
        <p className="font-semibold text-foreground-500">Ngày bắt đầu</p>
        <Chip color="success" variant="flat" className="mt-1">
          {displayDate(data.openingDay) || "Không có"}
        </Chip>
      </div>
      <div>
        <p className="font-semibold text-foreground-500">Ngày kết thúc</p>
        <Chip color="danger" variant="flat" className="mt-1">
          {displayDate(data.closingDay) || "Không có"}
        </Chip>
      </div>
      <div>
        <p className="font-semibold text-foreground-500">Số buổi học</p>
        <p className="font-semibold">{data.numberOfLessons || "Không có"}</p>
      </div>
      <div>
        <p className="font-semibold text-foreground-500">Số học sinh</p>
        <p className="font-semibold">
          {data.numberOfStudents ? `${studentCount || 0}/${data.numberOfStudents}` : "Không có"}
        </p>
      </div>
      <div>
        <p className="font-semibold text-foreground-500">Học phí</p>
        <p className="font-semibold">{localeString(data.tuitionFee)}đ</p>
      </div>
      <div>
        <p className="font-semibold text-foreground-500">Cấp độ</p>
        <p className="font-semibold">{COURSE_LEVELS[data.level] || "Không có"}</p>
      </div>
    </div>
  );
};

export default ClassDetail;
