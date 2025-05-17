import { cn } from "@/lib/utils";
import { Button } from "@heroui/button";
import { Check } from "lucide-react";
import React from "react";

const Stepper = ({ step }) => {
  return (
    <div className="w-full flex justify-center items-start gap-2 px-4 sm:px-10 pt-3 pb-7">
      <div className="flex-1 max-w-[200px] h-[3px] rounded-full bg-primary mt-[17px]"></div>
      <div className="flex flex-col items-center">
        <Button isIconOnly radius="full" variant="bordered" color="primary">
          {step > 1 ? <Check size="16px" strokeWidth={3} /> : 1}
        </Button>
        <p className="font-semibold text-foreground-700 text-sm mt-1">Đăng ký</p>
      </div>
      <div
        className={cn("flex-1 max-w-[200px] h-[3px] rounded-full mt-[17px] bg-default", step === 2 && "bg-primary")}
      />
      <div className="flex flex-col items-center">
        <Button
          isIconOnly
          radius="full"
          variant="bordered"
          className={cn("font-bold text-default-400", step === 2 && "text-primary")}
          isDisabled={step !== 2}
          color={step === 2 ? "primary" : "default"}
        >
          {step > 2 ? <Check size="16px" strokeWidth={3} /> : 2}
        </Button>
        <p className="font-semibold text-foreground-700 text-sm mt-1">Xếp lớp</p>
      </div>
      <div className="flex-1 max-w-[200px] h-[3px] rounded-full bg-default mt-[17px]" />
    </div>
  );
};

export default Stepper;
