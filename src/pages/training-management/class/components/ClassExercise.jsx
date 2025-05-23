import { DropDown } from "@/components/common";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { ClipboardPen, MoveRight, Plus } from "lucide-react";

const ClassExercise = () => {
  return (
    <div>
      <Button variant="shadow" radius="full" color="primary" startContent={<Plus />}>
        Bài tập
      </Button>
      <p className="m-4 mt-8 text-2xl font-semibold">Buổi 1</p>
      <Accordion variant="splitted" className="mt-4" selectionMode="multiple">
        <AccordionItem
          classNames={{ trigger: "border-b-1" }}
          startContent={
            <div className="size-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 text-primary-foreground grid place-items-center">
              <ClipboardPen size="18px" />
            </div>
          }
          key="1"
          aria-label="Buổi 1"
          title={
            <div className="w-full flex-1 flex justify-between">
              <p className="text-base font-semibold text-foreground-700">Bài tập 1</p>
              <DropDown variant="vertical" placement={undefined} menuItems={[]} />
            </div>
          }
          indicator={<div></div>}
        >
          <div className="pb-4">
            <p>Câu hỏi 1: ..... ? </p>
            <p>Câu hỏi 2: ..... ? </p>
            <p>Câu hỏi 3: ..... ? </p>
            <p>Câu hỏi 4: ..... ? </p>
            <p>Câu hỏi 5: ..... ? </p>
            <Button endContent={<MoveRight size="14px" />} size="sm" className="text-background bg-foreground mt-4">
              Xem chi tiết
            </Button>
          </div>
        </AccordionItem>
        <AccordionItem
          key="2"
          classNames={{ trigger: "border-b-1" }}
          startContent={
            <div className="size-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 text-primary-foreground grid place-items-center">
              <ClipboardPen size="18px" />
            </div>
          }
          aria-label="Bài tập 2"
          title={
            <div className="w-full flex-1 flex justify-between">
              <p className="text-base font-semibold text-foreground-700">Bài tập 2</p>
              <DropDown variant="vertical" placement={undefined} menuItems={[]} />
            </div>
          }
          indicator={<div></div>}
        >
          <div className="pb-4">
            <p>Câu hỏi 1: ..... ? </p>
            <p>Câu hỏi 2: ..... ? </p>
            <p>Câu hỏi 3: ..... ? </p>
            <p>Câu hỏi 4: ..... ? </p>
            <p>Câu hỏi 5: ..... ? </p>
            <Button endContent={<MoveRight size="14px" />} size="sm" className="text-background bg-foreground mt-4">
              Xem chi tiết
            </Button>
          </div>
        </AccordionItem>
        <AccordionItem
          key="3"
          classNames={{ trigger: "border-b-1" }}
          startContent={
            <div className="size-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 text-primary-foreground grid place-items-center">
              <ClipboardPen size="18px" />
            </div>
          }
          aria-label="Bài tập 3"
          title={
            <div className="w-full flex-1 flex justify-between">
              <p className="text-base font-semibold text-foreground-700">Bài tập 3</p>
              <DropDown variant="vertical" placement={undefined} menuItems={[]} />
            </div>
          }
          indicator={<div></div>}
        >
          <div className="pb-4">
            <p>Câu hỏi 1: ..... ? </p>
            <p>Câu hỏi 2: ..... ? </p>
            <p>Câu hỏi 3: ..... ? </p>
            <p>Câu hỏi 4: ..... ? </p>
            <p>Câu hỏi 5: ..... ? </p>
            <Button endContent={<MoveRight size="14px" />} size="sm" className="text-background bg-foreground mt-4">
              Xem chi tiết
            </Button>
          </div>
        </AccordionItem>
      </Accordion>
      <p className="m-4 mt-8 text-2xl font-semibold">Buổi 2</p>
      <Accordion variant="splitted" className="mt-4" selectionMode="multiple">
        <AccordionItem
          classNames={{ trigger: "border-b-1" }}
          startContent={
            <div className="size-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 text-primary-foreground grid place-items-center">
              <ClipboardPen size="18px" />
            </div>
          }
          key="1"
          aria-label="Buổi 1"
          title={
            <div className="w-full flex-1 flex justify-between">
              <p className="text-base font-semibold text-foreground-700">Bài tập 1</p>
              <DropDown variant="vertical" placement={undefined} menuItems={[]} />
            </div>
          }
          indicator={<div></div>}
        >
          <div className="pb-4">
            <p>Câu hỏi 1: ..... ? </p>
            <p>Câu hỏi 2: ..... ? </p>
            <p>Câu hỏi 3: ..... ? </p>
            <p>Câu hỏi 4: ..... ? </p>
            <p>Câu hỏi 5: ..... ? </p>
            <Button endContent={<MoveRight size="14px" />} size="sm" className="text-background bg-foreground mt-4">
              Xem chi tiết
            </Button>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ClassExercise;
