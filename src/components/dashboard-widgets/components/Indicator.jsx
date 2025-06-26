import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { useNavigate } from "@/hooks";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { Skeleton } from "@heroui/skeleton";
import { shortenNumber } from "@/utils";

const Indicator = ({ isLoading, title, description, value, change, icon, path, children }) => {
  const navigate = useNavigate();
  const changeType = !change || change === 0 ? "neutral" : change < 0 ? "positive" : "negative";

  return (
    <Card key={title} className="border border-transparent dark:border-default-100 flex flex-col justify-between">
      <div className="flex p-4">
        <div
          className={cn("mt-1 flex h-8 w-8 items-center justify-center rounded-md", {
            "bg-success-50": changeType === "positive",
            "bg-warning-50": changeType === "neutral",
            "bg-danger-50": changeType === "negative",
            "bg-default-50": !change,
          })}
        >
          {icon}
        </div>

        <div className="flex flex-col gap-y-2">
          <dt className="mx-4 text-small font-medium text-default-500">{title}</dt>
          {description && <dt className="mx-4 -mt-2 text-small text-default-500">{description}</dt>}
          {children}
          {value && (
            <dd className="px-4 text-2xl font-semibold text-default-700">
              {isLoading ? <Skeleton className="size-10 rounded-lg" /> : value}
            </dd>
          )}
        </div>

        {change && (
          <Chip
            className={cn("absolute right-4 top-4")}
            classNames={{
              content: "font-semibold text-[0.65rem]",
            }}
            color={changeType === "positive" ? "success" : changeType === "neutral" ? "warning" : "danger"}
            radius="sm"
            size="sm"
            startContent={
              changeType === "positive" ? (
                <ArrowUp size="12px" />
              ) : changeType === "neutral" ? (
                <Minus />
              ) : (
                <ArrowDown size="12px" />
              )
            }
            variant="flat"
          >
            {change === 0 ? "" : shortenNumber(Math.abs(change))}
          </Chip>
        )}
      </div>
      <div className="bg-default-100">
        <Button
          fullWidth
          className="flex justify-start text-xs text-default-500 data-[pressed]:scale-100"
          radius="none"
          variant="light"
          onPress={() => navigate(path)}
        >
          Xem tất cả
        </Button>
      </div>
    </Card>
  );
};

export default Indicator;
