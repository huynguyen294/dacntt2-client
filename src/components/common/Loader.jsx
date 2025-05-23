import { cn } from "@/lib/utils";
import { Progress } from "@heroui/progress";
import { Spinner } from "@heroui/spinner";

/**
 * @property {*} form
 * @param {{
 *   variant: 'progress' | 'default',
 *   isLoading: boolean,
 *   className: string,
 *   classNames: {base: "",spinner: ""},
 *   children: React.ReactNode,
 * }} props
 */

const Loader = ({ variant, isLoading, className, classNames = {}, ...other }) => {
  switch (variant) {
    case "progress":
      return isLoading ? (
        <Progress
          isIndeterminate
          size="sm"
          variant="wave"
          className={cn(className)}
          classNames={{
            indicator: cn("bg-gradient-to-r from-secondary-100 to-primary-500", classNames.indicator),
            classNames,
          }}
          {...other}
        />
      ) : null;

    case "default":
    default:
      return isLoading ? (
        <div className={cn("h-80 grid place-items-center", className, classNames.base)}>
          <Spinner variant="wave" className={cn(classNames.spinner)} {...other} />
        </div>
      ) : null;
  }
};

export default Loader;
