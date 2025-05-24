import { ModuleLayout } from "@/layouts";
import { timetableBreadcrumbItems } from "../constants";
import { useMetadata } from "@/hooks";
import { Autocomplete } from "@heroui/autocomplete";
import { TimeTable } from "@/components";

const TimeTablePage = () => {
  const { shifts } = useMetadata();

  return (
    <ModuleLayout breadcrumbItems={timetableBreadcrumbItems}>
      <div className="px-2 sm:px-10 grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4">
        <Autocomplete
          size="lg"
          variant="bordered"
          label="Lớp học"
          radius="sm"
          labelPlacement="outside"
          placeholder="Chọn lớp học"
        >
          {/* <Autocomplete></Autocomplete> */}
        </Autocomplete>
        <Autocomplete
          size="lg"
          variant="bordered"
          label="Giáo viên"
          radius="sm"
          labelPlacement="outside"
          placeholder="Chọn giáo viên"
        >
          {/* <Autocomplete></Autocomplete> */}
        </Autocomplete>
        <Autocomplete
          size="lg"
          variant="bordered"
          label="Học viên"
          radius="sm"
          labelPlacement="outside"
          placeholder="Chọn học viên"
        >
          {/* <Autocomplete></Autocomplete> */}
        </Autocomplete>
      </div>
      <div className="px-2 sm:px-10 mt-4">
        <TimeTable />
      </div>
    </ModuleLayout>
  );
};

export default TimeTablePage;
