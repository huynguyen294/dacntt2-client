import { cn } from "@/lib/utils";
import React from "react";

const Dot = ({ variant, className, ...other }) => {
  let variantClass = "bg-default/40";
  switch (variant) {
    case "success":
      variantClass = "bg-success";
      break;
    case "warning":
      variantClass = "bg-warning";
      break;
    case "danger":
      variantClass = "bg-danger";
      break;
    default:
      break;
  }

  return <div className={cn("size-2 rounded-full", variantClass, className)} {...other} />;
};

export default Dot;
