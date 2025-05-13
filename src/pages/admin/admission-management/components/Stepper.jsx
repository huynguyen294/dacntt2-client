import { Button } from "@heroui/button";
import React from "react";

const Stepper = () => {
  return (
    <div className="w-full flex justify-center items-start py-8 gap-2">
      <div className="w-[100px] h-[3px] rounded-full bg-primary mt-[17px]"></div>
      <div className="flex flex-col items-center">
        <Button isIconOnly radius="full" variant="bordered" color="primary">
          1
        </Button>
        <p className="font-semibold text-foreground-700 text-sm">Đăng ký</p>
      </div>
      <div className="w-[100px] h-[3px] rounded-full bg-primary mt-[17px]"></div>
      <div className="flex flex-col items-center">
        <Button isIconOnly radius="full" variant="bordered">
          2
        </Button>
        <p className="font-semibold text-foreground-700 text-sm">Xếp lớp</p>
      </div>
      <div className="w-[100px] h-[3px] rounded-full bg-default mt-[17px]"></div>
    </div>
  );
};

export default Stepper;
