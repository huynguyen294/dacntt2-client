import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const ScrollArea = forwardRef(({ className, children, hideScrollBar, ...props }, ref) => (
  <ScrollAreaPrimitive.Root ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">{children}</ScrollAreaPrimitive.Viewport>
    <ScrollBar classNames={{ thumb: hideScrollBar ? "bg-transparent" : "" }} />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));

const ScrollBar = forwardRef(({ className, classNames = {}, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className={cn("relative flex-1 rounded-full bg-default-300", classNames.thumb)} />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));

export { ScrollArea, ScrollBar };
