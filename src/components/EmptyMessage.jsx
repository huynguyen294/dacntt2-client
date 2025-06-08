import { Ban } from "lucide-react";

const EmptyMessage = ({ message, icon }) => {
  return (
    <div className="h-80 w-full grid place-items-center">
      <div className="flex items-center gap-2 font-semibold text-foreground-500">
        {icon || <Ban size="18px" className="text-foreground-500" />} {message}
      </div>
    </div>
  );
};

export default EmptyMessage;
