import { cn } from "@/lib/utils";

const defaultClassNames = { base: "", title: "", content: "" };
const Section = ({ title, className, classNames = defaultClassNames, children }) => {
  return (
    <div data-slot="base" className={cn("shadow-medium rounded-medium overflow-hidden", className, classNames.base)}>
      <div
        data-slot="title"
        className={cn(
          "w-full border-b-1 bg-default-50 text-medium font-semibold uppercase py-4 pb-2 px-4",
          classNames.title
        )}
      >
        {title}
      </div>
      <div data-slot="content" className={cn("p-4", classNames.content)}>
        {children}
      </div>
    </div>
  );
};

export default Section;
