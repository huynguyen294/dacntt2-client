import { cn } from "@/lib/utils";

const Amount = ({ className, children }) => {
  return (
    <div className={cn("px-2 py-0.5 inline-flex bg-default-100 rounded-full text-[13px] font-normal", className)}>
      {children || 0}
    </div>
  );
};

export default Amount;
