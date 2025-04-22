import { useDisclosure } from "@heroui/modal";
import { useEffect, useRef, useState } from "react";
import { compressImg, convertImageSrc } from "@/utils";
import { CropModal, ImageLoading } from "..";
import { cn } from "@/lib/utils";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { Camera, Pencil } from "lucide-react";

const AvatarInput = ({
  aspect = 1,
  value = defaultValue,
  inputProps = {},
  onChange = () => {},
  onDelete = () => {},
  className,
  classNames = defaultClassNames,
  shouldRevokeImage,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [cropData, setCropData] = useState(null);
  const inputRef = useRef();

  const { link } = value;

  const handleDelete = () => {
    if (link?.includes("blob:")) URL.revokeObjectURL(link);
    inputRef.current.value = "";
    onChange(convertImageSrc());
    onDelete();
  };

  const handleBeforeChange = (file, shouldReturnValue) => {
    if (!file) return;
    if (link?.includes("blob:")) URL.revokeObjectURL(link);
    const newLink = URL.createObjectURL(file);
    const newValue = { ...value, ...cropData, link: newLink, file };
    if (shouldReturnValue) return newValue;
    onChange(newValue);
  };

  useEffect(() => {
    return () => shouldRevokeImage && URL.revokeObjectURL(link);
  }, [shouldRevokeImage, link]);

  return (
    <div className={cn(`image-input-container relative w-fit rounded-full`, className)}>
      <Dropdown showArrow>
        <DropdownTrigger>
          <Button
            size="sm"
            variant="bordered"
            className="absolute bottom-2 left-0 z-[2] bg-background"
            startContent={<Pencil size="12px" />}
          >
            Sửa
          </Button>
        </DropdownTrigger>
        <DropdownMenu variant="flat">
          <DropdownItem onPress={() => inputRef.current.click()}>Đổi ảnh</DropdownItem>
          {link && (
            <DropdownItem color="danger" onPress={handleDelete}>
              Xóa ảnh
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
      {cropData && (
        <CropModal
          cancelable={Boolean(link)}
          aspect={aspect}
          isOpen={isOpen}
          imageSrc={cropData.link}
          onDelete={handleDelete}
          onOpenChange={onOpenChange}
          onChange={(cropped) => handleBeforeChange(cropped, false)}
        />
      )}
      {link ? (
        <ImageLoading src={link}>
          {(loadingClass) => (
            <Avatar
              isBordered
              alt="avt"
              src={link}
              className={cn("size-[9rem] rounded-full shadow", classNames.image, loadingClass)}
            />
          )}
        </ImageLoading>
      ) : (
        <Avatar
          isBordered
          alt="avt"
          fallback={<Camera size="45px" strokeWidth={1} />}
          className={cn("size-[9rem] bg-background rounded-full shadow-sm", classNames.image)}
        />
      )}
      <input
        hidden
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={async (e) => {
          const file = e.target.files[0];
          const compressed = await compressImg(file);
          const data = handleBeforeChange(compressed, true);
          setCropData(data);
          onOpen();
        }}
        className={classNames.input}
        {...inputProps}
      />
    </div>
  );
};

const defaultClassNames = {
  wrapper: "",
  input: "",
  label: "",
  image: "",
};

const defaultValue = {
  link: null,
  file: null,
};

export default AvatarInput;
