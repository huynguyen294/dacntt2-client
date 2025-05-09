import { AvatarInput, Form, Section } from "@/components/common";
import { useForm } from "@/hooks";
import { convertImageSrc } from "@/utils";
import { Button } from "@heroui/button";
import { Plus, RefreshCcw, Save } from "lucide-react";
import { useState } from "react";

const ClassForm = ({ defaultValues = {}, editMode }) => {
  // handle for date
  const form = useForm();
  const { isError, isDirty, actions } = form;
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setLoading(false);
  };

  return (
    <Form form={form} onSubmit={handleSubmit} className="w-full space-y-4">
      <Section title="Thông tin chứng chỉ" className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-start gap-4 pb-4"></div>
      </Section>
      <div className="space-x-4">
        <Button
          isLoading={loading}
          isDisabled={isError}
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

export default ClassForm;
