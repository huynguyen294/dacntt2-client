import { DatePicker } from "@heroui/date-picker";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { AvatarInput } from "../common";
import { convertImageSrc } from "@/utils";
import { format } from "date-fns";
import { DATE_FORMAT } from "@/constants";
import { parseDate } from "@internationalized/date";
import { cn } from "@/lib/utils";
import { checkEmailAvailable } from "@/apis";
import { useState } from "react";
import { Spinner } from "@heroui/spinner";

//https://res.cloudinary.com/easybiov2/image/upload/v1742222204/ngocnhung05062000/hew2aof03eyxf3jgfpyt.jpg
const UserBasicFields = ({
  form,
  hideImage,
  defaultValues,
  img = convertImageSrc(),
  onImgChange = () => {},
  classNames = {},
  onImgDelete,
  autoFocus = true,
}) => {
  const [emailChecking, setEmailChecking] = useState(false);

  return (
    <>
      {!hideImage && (
        <div className="row-span-2 flex justify-center items-center w-full">
          <AvatarInput className="mt-4" value={img} onChange={onImgChange} variant="bordered" onDelete={onImgDelete} />
        </div>
      )}
      <Input
        autoFocus={autoFocus}
        defaultValue={defaultValues.name}
        onBlur={form.actions.checkValidity}
        isRequired
        name="name"
        size="lg"
        variant="bordered"
        label="Họ và tên"
        radius="sm"
        labelPlacement="outside"
        placeholder="Nguyễn Văn A"
      />
      <Select
        defaultSelectedKeys={defaultValues.gender && new Set([defaultValues.gender])}
        name="gender"
        size="lg"
        variant="bordered"
        label="Giới tính"
        radius="sm"
        placeholder="Chọn giới tính"
        labelPlacement="outside"
        onChange={form.actions.instantChange}
      >
        <SelectItem key="Nam">Nam</SelectItem>
        <SelectItem key="Nữ">Nữ</SelectItem>
        <SelectItem key="Khác">Khác</SelectItem>
      </Select>
      <Input
        name="email"
        type="email"
        isRequired
        size="lg"
        variant="bordered"
        label="Email"
        radius="sm"
        labelPlacement="outside"
        placeholder="example@gmail.com"
        isInvalid={Boolean(form.errors?.email)}
        errorMessage={form.errors?.email}
        defaultValue={defaultValues.email}
        endContent={emailChecking && <Spinner size="sm" />}
        onBlur={async (e) => {
          let error = null;
          error = form.actions.getFieldValidity(e);
          if (error) return form.actions.changeError("email", error);

          const value = e.target.value;
          setEmailChecking(true);
          const result = await checkEmailAvailable(value);
          if (!result.ok) error = result.message;
          form.actions.changeError("email", error);
          setEmailChecking(false);
        }}
      />
      <Input
        defaultValue={defaultValues.phoneNumber}
        name="phoneNumber"
        size="lg"
        variant="bordered"
        label="Số điện thoại"
        radius="sm"
        labelPlacement="outside"
        placeholder="097..."
      />
      <DatePicker
        onChange={form.actions.instantChange}
        defaultValue={defaultValues.dateOfBirth && parseDate(format(defaultValues.dateOfBirth, DATE_FORMAT))}
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
        defaultValue={defaultValues.address}
        name="address"
        size="lg"
        variant="bordered"
        label="Địa chỉ"
        radius="sm"
        className={cn("col-span-1 lg:col-span-2", classNames.address)}
        labelPlacement="outside"
        placeholder="Số nhà, Phường, Huyện, Tỉnh..."
      />
    </>
  );
};

export default UserBasicFields;
