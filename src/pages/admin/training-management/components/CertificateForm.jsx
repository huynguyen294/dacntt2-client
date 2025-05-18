import { certificateApi, imageApi } from "@/apis";
import { AvatarInput, Section, StatusDot } from "@/components/common";
import { CERTIFICATE_STATUSES } from "@/constants";
import { useNavigate } from "@/hooks";
import { convertImageSrc } from "@/utils";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { addToast } from "@heroui/toast";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, RefreshCcw, Save } from "lucide-react";
import { useState } from "react";
import { Controller, Form, useForm } from "react-simple-formkit";

const CertificateForm = ({ defaultValues = {}, editMode }) => {
  // handle for date
  const form = useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isError, isDirty, actions } = form;
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(convertImageSrc(defaultValues.imageUrl));
  const [deletedImg, setDeletedImg] = useState(null);

  const handleSubmit = async (data) => {
    setLoading(true);

    let resultImg;
    if (imageUrl.file) {
      resultImg = await imageApi.save(imageUrl, "certificate");
      data.imageUrl = resultImg.url;
    } else if (deletedImg) {
      resultImg = await imageApi.update(deletedImg);
      data.imageUrl = null;
    }

    if (resultImg && !resultImg.ok) {
      addToast({
        color: "danger",
        title: "Lưu ảnh thất bại!",
        description: "Gặp sự cố khi lưu ảnh, vui lòng thử lại!",
      });
      setLoading(false);
      return;
    }

    if (editMode) {
      const { id, ...removed } = defaultValues;
      const result = await certificateApi.update(id, { ...removed, ...data });
      if (result.ok) {
        queryClient.invalidateQueries({ queryKey: ["certificates"] });
        navigate("/admin/certificates");
      } else {
        addToast({ color: "danger", title: "Lỗi khi sửa khóa học", description: result.message });
      }
      return;
    }

    const result = await certificateApi.create(data);
    if (result.ok) {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      navigate("/admin/certificates");
    } else {
      addToast({ color: "danger", title: "Lỗi khi tạo khóa học", description: result.message });
    }
    setLoading(false);
  };

  return (
    <Form form={form} onSubmit={handleSubmit} className="w-full space-y-4">
      <Section title="Thông tin chứng chỉ" className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-start gap-4 pb-4">
          <div className="row-span-1 sm:row-span-2 flex justify-center items-center w-full">
            <AvatarInput
              classNames={{ image: "rounded w-[8rem] h-[10rem]", addBtn: "-left-8 bottom-1" }}
              className="rounded"
              aspect={3 / 4}
              value={imageUrl}
              onChange={setImageUrl}
              onDelete={(id) => setDeletedImg(id)}
            />
          </div>
          <Input
            defaultValue={defaultValues.name}
            isRequired
            name="name"
            size="lg"
            variant="bordered"
            label="Tên chứng chỉ"
            radius="sm"
            labelPlacement="outside"
            placeholder="IELTS, TOEIC..."
          />
          <Input
            defaultValue={defaultValues.skill}
            name="skill"
            size="lg"
            variant="bordered"
            label="Kỹ năng"
            radius="sm"
            labelPlacement="outside"
            placeholder="Nghe, nói,..."
          />
          <Input
            defaultValue={defaultValues.level}
            name="level"
            size="lg"
            variant="bordered"
            label="Cấp độ"
            radius="sm"
            labelPlacement="outside"
            placeholder="Nhập cấp độ"
          />
          <Controller
            name="status"
            defaultValue={defaultValues.status || CERTIFICATE_STATUSES.active}
            render={({ ref, name, defaultValue, value, setValue }) => (
              <Select
                ref={ref}
                name={name}
                isRequired
                selectedKeys={new Set(value ? [value.toString()] : [])}
                onChange={actions.instantChange}
                onSelectionChange={(keys) => setValue([...keys][0])}
                defaultSelectedKeys={new Set(defaultValue ? [defaultValue.toString()] : [])}
                startContent={<StatusDot status={value || defaultValue} />}
                size="lg"
                variant="bordered"
                label="Trạng thái"
                radius="sm"
                labelPlacement="outside"
                placeholder="Đang làm, đã nghỉ..."
              >
                {Object.values(CERTIFICATE_STATUSES).map((status) => (
                  <SelectItem key={status} startContent={<StatusDot status={status} />}>
                    {status}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
        </div>
      </Section>
      <div className="space-x-4">
        <Button
          isLoading={loading}
          isDisabled={!isDirty || isError}
          type="submit"
          startContent={editMode ? <Save size="20px" /> : <Plus size="20px" />}
          className="shadow-xl"
          color="primary"
        >
          {editMode ? "Lưu thay đổi" : "Thêm chứng chỉ"}
        </Button>
        <Button
          isDisabled={!isDirty}
          onPress={() => actions.reset()}
          startContent={<RefreshCcw size="16px" />}
          className="shadow-xl"
          variant="flat"
        >
          Đặt lại
        </Button>
      </div>
    </Form>
  );
};

export default CertificateForm;
