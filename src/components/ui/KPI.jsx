import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { HandCoins, User, Wallet2 } from "lucide-react";
import { Button } from "@heroui/button";

const data = [
  {
    title: "Người dùng",
    value: "5,400",
    change: "33%",
    changeType: "positive",
    trendChipPosition: "top",
    icon: <User size="18px" />,
  },
  {
    title: "Tổng doanh thu",
    value: "105,400,000VNĐ",
    change: "0.0%",
    changeType: "neutral",
    trendChipPosition: "top",
    icon: <Wallet2 size="18px" />,
  },
  {
    title: "Lợi nhuận thực",
    value: "50,000,000VNĐ",
    change: "3.3%",
    changeType: "negative",
    trendChipPosition: "top",
    icon: <HandCoins size="18px" />,
  },
];

export default function KPI() {
  return (
    <dl className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
      {data.map(({ title, value, change, changeType, icon, trendChipPosition }, index) => (
        <Card key={index} className="border border-transparent dark:border-default-100">
          <div className="flex p-4">
            <div
              className={cn("mt-1 flex h-8 w-8 items-center justify-center rounded-md", {
                "bg-success-50": changeType === "positive",
                "bg-warning-50": changeType === "neutral",
                "bg-danger-50": changeType === "negative",
              })}
            >
              {icon}
            </div>

            <div className="flex flex-col gap-y-2">
              <dt className="mx-4 text-small font-medium text-default-500">{title}</dt>
              <dd className="px-4 text-2xl font-semibold text-default-700">{value}</dd>
            </div>

            <Chip
              className={cn("absolute right-4", {
                "top-4": trendChipPosition === "top",
                "bottom-4": trendChipPosition === "bottom",
              })}
              classNames={{
                content: "font-semibold text-[0.65rem]",
              }}
              color={changeType === "positive" ? "success" : changeType === "neutral" ? "warning" : "danger"}
              radius="sm"
              size="sm"
              startContent={icon}
              variant="flat"
            >
              {change}
            </Chip>
          </div>

          <div className="bg-default-100">
            <Button
              fullWidth
              className="flex justify-start text-xs text-default-500 data-[pressed]:scale-100"
              radius="none"
              variant="light"
            >
              Xem tất cả
            </Button>
          </div>
        </Card>
      ))}
    </dl>
  );
}
