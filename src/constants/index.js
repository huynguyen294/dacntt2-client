import { endOfWeek, format, startOfWeek } from "date-fns";

export const PAGER = { page: 1, pageSize: 20 };
export const ORDER = { order: "DESC", orderBy: "created_at" };

export const DATE_FORMAT = "yyyy-MM-dd";
export const USER_ROLES = ["admin", "teacher", "consultant", "finance-officer", "student"];
export const ROLE_LABELS = {
  admin: "Admin",
  teacher: "Giáo viên",
  consultant: "Tư vấn viên",
  "finance-officer": "Nhân viên học vụ/tài chính",
  student: "Học viên",
};
export const ROLE_PALLET = {
  admin: "#f36870",
  teacher: "#74b2d0",
  consultant: "#e1c340",
  "finance-officer": "#b7ac44",
  student: "#a8bbb0",
};

export const DEFAULT_PAGER = { total: 0, pageCount: 1, page: 1, pageSize: 20 };

export const COURSE_LEVELS = {
  1: "Sơ cấp",
  2: "Trung cấp",
  3: "Nâng cao",
};

export const CERTIFICATE_STATUSES = {
  active: "Hoạt động",
  onHold: "Tạm dừng",
  stopped: "Hết hạn",
};

export const COURSE_STATUSES = {
  active: "Đang mở",
  onHold: "Tạm đóng",
  stopped: "Không còn mở",
};

export const CLASS_STATUSES = {
  active: "Đang hoạt động",
  pending: "Chưa bắt đầu",
  stopped: "Đã kết thúc",
};

export const EMPLOYEE_STATUS = {
  active: "Đang làm việc",
  onHold: "Tạm nghỉ việc",
  stopped: "Đã nghỉ việc",
};

export const EMPLOYEE_ROLES = ["consultant", "finance-officer", "teacher"];

export const ADMISSION_STATUSES = {
  pending: "Chờ tư vấn",
  working: "Đang tư vấn",
  accepted: "Đã đồng ý",
  rejected: "Đã hủy",
  done: "Đã xếp lớp",
};

export const getAdmissionColor = (value) => {
  switch (value) {
    case ADMISSION_STATUSES.accepted:
      return "success";
    case ADMISSION_STATUSES.rejected:
      return "danger";
    case ADMISSION_STATUSES.working:
      return "warning";
    case ADMISSION_STATUSES.done:
    case ADMISSION_STATUSES.pending:
    default:
      return "default";
  }
};

export const getStatusColor = (status) => {
  const successes = [
    ADMISSION_STATUSES.accepted,
    EMPLOYEE_STATUS.active,
    COURSE_STATUSES.active,
    CERTIFICATE_STATUSES.active,
  ];
  const dangers = [ADMISSION_STATUSES.rejected, EMPLOYEE_STATUS.stopped, CERTIFICATE_STATUSES.stopped];
  const warnings = [
    ADMISSION_STATUSES.working,
    EMPLOYEE_STATUS.onHold,
    COURSE_STATUSES.onHold,
    CERTIFICATE_STATUSES.onHold,
  ];

  if (successes.includes(status)) return "success";
  if (dangers.includes(status)) return "danger";
  if (warnings.includes(status)) return "warning";

  return "default";
};

export const ATTENDANCES = {
  yes: "Có",
  no: "Không",
  late: "Đi trễ",
};

export const ORDER_BY_NAME = { orderBy: "name", order: "asc" };
export const ORDER_BY_CREATED_AT = { orderBy: "createdAt", order: "desc" };

export const EXERCISE_STATUSES = {
  submitted: "Đã nộp",
  missing: "Chưa nộp",
};
export const DEFAULT_SEARCH_PLACEHOLDER = "Tìm theo tên hoặc mã...";

export const currentDate = new Date();
export const defaultWeekCalendarValue = {
  startDate: format(startOfWeek(currentDate, { weekStartsOn: 1 }), DATE_FORMAT),
  endDate: format(endOfWeek(currentDate, { weekStartsOn: 1 }), DATE_FORMAT),
};
export const ID_CODES = {
  user: "ND",
  course: "KH",
  employee: "NV",
  class: "LH",
  enrollment: "DK",
  certificate: "CC",
  shift: "CH",
  exam: "KT",
  studentExam: "HKT",
  studentConsultation: "TV",
  classSchedule: "LH",
  classExercise: "BT",
  classTopic: "CD",
  classAttendance: "DD",
  exerciseScore: "DS",
  infoSheet: "TB",
  tuition: "HP",
  tuitionDiscount: "GG",
};

export const getCode = (key, id) => ID_CODES[key] + id;
export const getStudentCode = (id) => ID_CODES.user + id;
export const getClassCode = (id) => ID_CODES.class + id;
export const getYearCode = () => new Date().getFullYear().toString().slice(2);
