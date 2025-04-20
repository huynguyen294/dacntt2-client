import { cn } from "@/lib/utils";
import { Accordion, AccordionItem } from "@heroui/accordion";

const Collapse = ({
  defaultExpanded,
  className,
  classNames,
  variant,
  active,
  title,
  startContent,
  children,
  indicator,
}) => {
  const activeProps = active ? { selectedKeys: new Set(["1"]) } : null;

  return (
    <Accordion
      defaultExpandedKeys={defaultExpanded && new Set(["1"])}
      variant={variant}
      className={cn("px-0", className)}
      {...activeProps}
    >
      <AccordionItem
        key="1"
        aria-label={title}
        title={title}
        classNames={{ content: "pt-0 pb-4", ...classNames }}
        startContent={startContent}
        indicator={indicator}
      >
        {children}
      </AccordionItem>
    </Accordion>
  );
};

export default Collapse;
