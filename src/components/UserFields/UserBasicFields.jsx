import { DatePicker } from "@heroui/date-picker";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";

const UserBasicFields = () => {
  return (
    <>
      <div className="row-span-2"></div>
      <Input
        isRequired
        size="lg"
        variant="bordered"
        label="Họ và tên"
        radius="sm"
        labelPlacement="outside"
        placeholder="Nguyễn Văn A"
      />
      <Select size="lg" variant="bordered" label="Giới tính" radius="sm" labelPlacement="outside">
        <SelectItem key="Nam">Nam</SelectItem>
        <SelectItem key="Nữ">Nữ</SelectItem>
        <SelectItem key="Khác">Khác</SelectItem>
      </Select>
      <Input
        isRequired
        size="lg"
        variant="bordered"
        label="Email"
        radius="sm"
        labelPlacement="outside"
        placeholder="example@gmail.com"
      />
      <Input
        size="lg"
        variant="bordered"
        label="Số điện thoại"
        radius="sm"
        labelPlacement="outside"
        placeholder="097..."
      />
      <DatePicker
        name="dateOfBirth"
        calendarProps={{ showMonthAndYearPickers: true }}
        size="lg"
        variant="bordered"
        label="Ngày sinh"
        radius="sm"
        labelPlacement="outside"
        classNames={{ label: "-mt-1" }}
      />
      <Input
        size="lg"
        variant="bordered"
        label="Địa chỉ"
        radius="sm"
        className="col-span-1 lg:col-span-2"
        labelPlacement="outside"
        placeholder="Số nhà..."
      />
    </>
  );
};

export default UserBasicFields;
