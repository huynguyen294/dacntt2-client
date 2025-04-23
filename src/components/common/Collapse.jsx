import { cn } from "@/lib/utils";
import { Accordion, AccordionItem } from "@heroui/accordion";

const Collapse = ({
  defaultExpanded,
  className,
  classNames = {},
  variant,
  active,
  title,
  startContent,
  showDivider,
  children,
  indicator,
}) => {
  const activeProps = active ? { selectedKeys: new Set(["1"]) } : null;

  if (showDivider) {
    classNames.base = cn("px-0 overflow-hidden", classNames.base);
    classNames.trigger = cn("pb-2", classNames.trigger);
    classNames.content = cn("p-4", classNames.content);
    classNames.heading = cn("border-b-1.5 px-4 bg-default-50 font-semibold", classNames.heading);
  } else {
    classNames.content = cn("px-4 pt-0 pb-6", classNames.content);
  }

  return (
    <Accordion
      defaultExpandedKeys={defaultExpanded && new Set(["1"])}
      variant={variant}
      keepContentMounted
      className={cn("px-0", className)}
      {...activeProps}
    >
      <AccordionItem
        key="1"
        aria-label={title}
        title={title}
        classNames={classNames}
        startContent={startContent}
        indicator={indicator}
      >
        {children}
      </AccordionItem>
    </Accordion>
  );
};

export default Collapse;
